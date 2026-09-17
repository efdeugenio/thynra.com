#!/usr/bin/env node
/**
 * Sync Onvo Price IDs to Cloudflare Worker secrets.
 *
 * Why this exists:
 *   Onvo Prices are immutable — to change a price you create a new Price and
 *   archive the old one. Each change means new cuid IDs that the Worker needs
 *   for self-serve checkout to work. Doing this by hand is error-prone (the
 *   "Product ID vs Price ID" confusion is exactly how we hit price_not_found
 *   the first time). This script:
 *
 *     1. Calls Onvo /v1/prices with your secret key.
 *     2. Matches each ACTIVE price by its Product NAME (stable across price
 *        changes) + variant (base vs CR) to a wrangler secret name.
 *     3. Pushes the cuid into the matching Cloudflare Worker secret.
 *
 * CR variants:
 *   Onvo has no tax engine — it charges a Price as-is. CR-consumed services
 *   carry 13% IVA (included in the charged amount); exports of services are
 *   tasa 0% (Ley 9635). Subscriptions charge an immutable Price, so the
 *   IVA-inclusive CR amounts need their own catalog Prices. We distinguish
 *   them by NICKNAME on the same Product: a price nicknamed "CR IVA 13%
 *   incl." is the CR variant; any other active price is the base (net /
 *   export) price. The one-time setup fee needs no CR variant — the
 *   receptionist grosses it up at charge time (PaymentIntents take
 *   arbitrary amounts).
 *
 *   Pass --ensure-cr to CREATE missing CR variants automatically: for each
 *   recurring product below, if no active CR-nicknamed price exists, one is
 *   created at round(base × 1.13) with the same currency/interval.
 *
 * Usage:
 *
 *   # Sync test-mode prices (default safety: refuses live without --live)
 *   ONVO_SECRET_KEY=onvo_test_secret_... node scripts/sync-onvo-prices.mjs
 *
 *   # Create missing CR IVA-inclusive variants, then sync
 *   ONVO_SECRET_KEY=onvo_test_secret_... node scripts/sync-onvo-prices.mjs --ensure-cr
 *
 *   # Preview without writing
 *   ONVO_SECRET_KEY=onvo_test_secret_... node scripts/sync-onvo-prices.mjs --dry-run
 *
 *   # Production push (requires --live to prevent accidents)
 *   ONVO_SECRET_KEY=onvo_live_secret_... node scripts/sync-onvo-prices.mjs --live --ensure-cr
 *
 * Run from this project root:  cd /Users/.../thynra.com && node scripts/...
 */

import { spawn } from "node:child_process";

// Nickname that marks a Price as the CR (IVA-inclusive) variant of its
// Product. EDIT WITH CARE — existing catalog prices are matched against it.
const CR_NICKNAME = "CR IVA 13% incl.";
const IVA_BPS = 1300;

// Product name (in Onvo) + variant → wrangler secret name (in Cloudflare).
// The product NAME is the join key, not the ID, because IDs change every
// time you recreate a price but the name stays stable. `ensureCr: true`
// marks recurring products that must have a CR variant (created by
// --ensure-cr when missing).
const ENTRIES = [
  { product: "AI Receptionist monthly", variant: "base", secret: "ONVO_PRICE_RECEPTIONIST_MONTHLY" },
  { product: "AI Receptionist monthly", variant: "cr",   secret: "ONVO_PRICE_RECEPTIONIST_MONTHLY_CR", ensureCr: true },
  { product: "AI Receptionist yearly",  variant: "base", secret: "ONVO_PRICE_RECEPTIONIST_ANNUAL" },
  { product: "AI Receptionist yearly",  variant: "cr",   secret: "ONVO_PRICE_RECEPTIONIST_ANNUAL_CR", ensureCr: true },
  // Setup fee stays NET-only: it's charged via PaymentIntent and grossed up
  // in code for CR customers.
  { product: "AI Receptionist setup",   variant: "base", secret: "ONVO_PRICE_SETUP_FEE" },
];

const DRY_RUN = process.argv.includes("--dry-run");
const EXPECT_LIVE = process.argv.includes("--live");
const ENSURE_CR = process.argv.includes("--ensure-cr");

const key = process.env.ONVO_SECRET_KEY;
if (!key) {
  console.error(
    "ERROR: set ONVO_SECRET_KEY in your environment.\n" +
      "       e.g. ONVO_SECRET_KEY=onvo_test_secret_... node scripts/sync-onvo-prices.mjs",
  );
  process.exit(1);
}

const mode = key.startsWith("onvo_live_")
  ? "live"
  : key.startsWith("onvo_test_")
    ? "test"
    : null;

if (!mode) {
  console.error(
    "ERROR: ONVO_SECRET_KEY doesn't have the expected onvo_test_/onvo_live_ prefix.",
  );
  process.exit(1);
}

if (mode === "live" && !EXPECT_LIVE) {
  console.error(
    "Refusing to push LIVE Onvo Price IDs without explicit --live flag.\n" +
      "If this is what you want: re-run with --live appended.",
  );
  process.exit(1);
}
if (mode === "test" && EXPECT_LIVE) {
  console.error(
    "ERROR: --live flag set but key is a test key (onvo_test_*). Refusing.",
  );
  process.exit(1);
}

async function fetchPrices() {
  const res = await fetch("https://api.onvopay.com/v1/prices", {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`ERROR: Onvo /v1/prices returned ${res.status}\n${text}`);
    process.exit(1);
  }
  const raw = await res.json();
  return Array.isArray(raw) ? raw : (raw?.data ?? []);
}

console.log(`Fetching prices from Onvo (mode=${mode})…`);
let prices = await fetchPrices();
if (prices.length === 0) {
  console.error("ERROR: Onvo returned zero prices. Did you switch test/live modes?");
  process.exit(1);
}

const isCrVariant = (p) => p.nickname === CR_NICKNAME;
const activeFor = (productName, variant) =>
  prices
    .filter(
      (p) =>
        p.isActive &&
        p.product?.name === productName &&
        (variant === "cr" ? isCrVariant(p) : !isCrVariant(p)),
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

// ---------------------------------------------------------------------------
// --ensure-cr: create missing IVA-inclusive variants from the active base.
// ---------------------------------------------------------------------------
if (ENSURE_CR) {
  let created = 0;
  for (const entry of ENTRIES.filter((e) => e.ensureCr)) {
    const existing = activeFor(entry.product, "cr");
    if (existing.length > 0) continue;
    const base = activeFor(entry.product, "base")[0];
    if (!base) {
      console.error(
        `ERROR: cannot create CR variant for "${entry.product}" — no active base price found.`,
      );
      process.exit(1);
    }
    if (!base.recurring) {
      console.error(
        `ERROR: base price for "${entry.product}" is not recurring; CR variants only apply to subscriptions.`,
      );
      process.exit(1);
    }
    const unitAmount = Math.round((base.unitAmount * (10000 + IVA_BPS)) / 10000);
    if (DRY_RUN) {
      console.log(
        `  DRY   would create CR price for "${entry.product}": ${unitAmount} ${base.currency} / ${base.recurring.interval}`,
      );
      continue;
    }
    console.log(
      `  NEW   creating CR price for "${entry.product}": ${unitAmount} ${base.currency} / ${base.recurring.interval}`,
    );
    const res = await fetch("https://api.onvopay.com/v1/prices", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: base.productId ?? base.product?.id,
        unitAmount,
        currency: base.currency,
        type: "recurring",
        recurring: {
          interval: base.recurring.interval,
          intervalCount: base.recurring.intervalCount ?? 1,
        },
        nickname: CR_NICKNAME,
        isActive: true,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`ERROR: creating CR price failed (${res.status})\n${text}`);
      process.exit(1);
    }
    created++;
  }
  if (created > 0) {
    console.log(`Created ${created} CR variant price(s); re-fetching catalog…`);
    prices = await fetchPrices();
  }
}

function setWranglerSecret(name, value) {
  return new Promise((resolve, reject) => {
    const proc = spawn("wrangler", ["secret", "put", name], {
      stdio: ["pipe", "inherit", "inherit"],
    });
    proc.stdin.write(value);
    proc.stdin.end();
    proc.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`wrangler exit ${code}`)),
    );
    proc.on("error", reject);
  });
}

let pushed = 0;
let skipped = 0;
let warnings = 0;

for (const entry of ENTRIES) {
  const matches = activeFor(entry.product, entry.variant);

  if (matches.length === 0) {
    console.log(
      `  SKIP  ${entry.secret.padEnd(36)}  no active ${entry.variant} Price for product "${entry.product}"` +
        (entry.ensureCr ? " (run with --ensure-cr to create it)" : ""),
    );
    skipped++;
    continue;
  }
  if (matches.length > 1) {
    console.log(
      `  WARN  ${entry.secret.padEnd(36)}  ${matches.length} active ${entry.variant} Prices for "${entry.product}" — using most recent`,
    );
    warnings++;
  }
  const priceId = matches[0].id;

  if (DRY_RUN) {
    console.log(`  DRY   ${entry.secret.padEnd(36)}  ${priceId}  (${matches[0].unitAmount} ${matches[0].currency})`);
    continue;
  }
  console.log(`  SET   ${entry.secret.padEnd(36)}  ${priceId}  (${matches[0].unitAmount} ${matches[0].currency})`);
  try {
    await setWranglerSecret(entry.secret, priceId);
    pushed++;
  } catch (err) {
    console.error(`ERROR: wrangler secret put failed for ${entry.secret}: ${err.message}`);
    process.exit(1);
  }
}

console.log("");
if (DRY_RUN) {
  console.log("Dry run — no changes made. Re-run without --dry-run to apply.");
} else {
  console.log(
    `Done. Pushed=${pushed}, skipped=${skipped}, warnings=${warnings}.`,
  );
  if (pushed > 0) {
    console.log(
      "Worker reads secrets at request time; no redeploy needed.",
    );
  }
}
