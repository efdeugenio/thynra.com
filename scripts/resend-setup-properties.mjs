#!/usr/bin/env node
// Creates the contact properties the site writes to Resend.
//
// Contact properties can't be created from the Resend dashboard — the dashboard
// only sets values on an existing contact (Contacts → ⋯ → Edit Contact). They
// are created through the API, which is what this script does.
//
//   node scripts/resend-setup-properties.mjs --dry-run   # show what's missing
//   node scripts/resend-setup-properties.mjs             # create the missing ones
//
// The key is read from RESEND_API_KEY (env var or .env in this folder) and is
// never printed. It's the same key set as a Worker secret:
//   wrangler secret list   →   RESEND_API_KEY
//
// Safe to re-run: existing properties are left untouched.

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DRY_RUN = process.argv.includes('--dry-run');

// Written by worker.js: attributionProperties() + the quiz/resource handlers.
const PROPERTIES = [
  { key: 'locale', type: 'string', why: 'en | es — which language the lead used' },
  { key: 'utm_source', type: 'string', why: 'last touch, e.g. youtube' },
  { key: 'utm_medium', type: 'string', why: 'last touch, e.g. description' },
  { key: 'utm_campaign', type: 'string', why: 'last touch, the video slug' },
  { key: 'first_utm_source', type: 'string', why: 'first touch: what introduced them' },
  { key: 'first_utm_campaign', type: 'string', why: 'first touch campaign' },
  { key: 'referrer', type: 'string', why: 'external referrer host' },
  { key: 'resource', type: 'string', why: 'lead-magnet slug from /es/recursos/<slug>' },
  // Already in use before this change; created here too if missing.
  { key: 'source', type: 'string', why: 'quiz | contact | resource' },
  { key: 'company', type: 'string', why: 'business name from the form' },
  { key: 'readiness_level', type: 'string', why: 'quiz level (English name)' },
  { key: 'weakest_stage', type: 'string', why: 'quiz weakest stage (English name)' },
];

function apiKey() {
  if (process.env.RESEND_API_KEY) return process.env.RESEND_API_KEY.trim();
  try {
    const line = readFileSync(resolve(ROOT, '.env'), 'utf8')
      .split('\n')
      .find((l) => l.startsWith('RESEND_API_KEY='));
    if (line) return line.slice('RESEND_API_KEY='.length).trim().replace(/^["']|["']$/g, '');
  } catch {
    /* no .env */
  }
  console.error(
    'RESEND_API_KEY not set.\n' +
      'Run it as:  RESEND_API_KEY=re_xxx node scripts/resend-setup-properties.mjs\n' +
      '(the same key as the Worker secret; the script never prints it)',
  );
  process.exit(1);
}

const KEY = apiKey();
const headers = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

const list = await fetch('https://api.resend.com/contact-properties', { headers });
if (!list.ok) {
  console.error(`Could not list contact properties: HTTP ${list.status} ${await list.text()}`);
  process.exit(1);
}
const existing = new Set(((await list.json()).data || []).map((p) => p.key));
console.log(`Existing properties: ${existing.size ? [...existing].join(', ') : '(none)'}\n`);

const missing = PROPERTIES.filter((p) => !existing.has(p.key));
if (!missing.length) {
  console.log('Nothing to do — every property the site writes already exists.');
  process.exit(0);
}

if (DRY_RUN) {
  console.log(`Would create ${missing.length}:`);
  for (const p of missing) console.log(`  ${p.key.padEnd(20)} ${p.type}   ${p.why}`);
  process.exit(0);
}

let created = 0;
for (const p of missing) {
  const res = await fetch('https://api.resend.com/contact-properties', {
    method: 'POST',
    headers,
    body: JSON.stringify({ key: p.key, type: p.type }),
  });
  if (res.ok) {
    created++;
    console.log(`created  ${p.key}`);
  } else {
    console.error(`FAILED   ${p.key}  HTTP ${res.status} ${await res.text()}`);
  }
}
console.log(`\nDone: ${created} of ${missing.length} created.`);
