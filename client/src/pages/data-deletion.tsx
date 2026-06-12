import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-primary hover:text-accent transition-colors text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-2">Data Deletion Instructions</h1>
          <p className="text-muted-foreground text-sm">Last updated: March 2026</p>
        </div>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3">How to Request Data Deletion</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have connected your social media accounts (Instagram, TikTok, or Facebook) to Thynra and would like your data deleted, you can request deletion by emailing us at:
            </p>
            <p className="mt-4 font-medium text-primary">privacy@thynra.com</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">What Data We Store</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you connect a social account, Thynra stores:
            </p>
            <ul className="mt-3 space-y-2 text-muted-foreground list-disc list-inside">
              <li>OAuth access tokens for your connected accounts</li>
              <li>Platform user IDs (Instagram, TikTok, Facebook Page)</li>
              <li>Post history (titles, publication status, platform URLs)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">What Happens After Your Request</h2>
            <p className="text-muted-foreground leading-relaxed">
              We will delete all tokens and associated data for your account within 30 days of receiving your request. You will receive a confirmation email when deletion is complete.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Revoking Access Directly</h2>
            <p className="text-muted-foreground leading-relaxed">
              You can also revoke Thynra's access to your accounts directly from each platform:
            </p>
            <ul className="mt-3 space-y-2 text-muted-foreground list-disc list-inside">
              <li><strong>Facebook / Instagram:</strong> Settings → Security → Apps and Websites → Remove Thynra</li>
              <li><strong>TikTok:</strong> Profile → Settings → Apps → Manage app permissions → Remove Thynra</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For any questions about your data, contact us at <span className="text-primary">privacy@thynra.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
