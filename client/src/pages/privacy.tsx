import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        </div>

        <div className="space-y-8 text-foreground">

          <section>
            <p className="text-muted-foreground leading-relaxed">
              This Privacy Policy describes how Thynra ("we," "us," or "our") collects, uses, and protects the personal information you provide when using our website and services at thynra.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We collect information you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Contact information:</strong> name, email address, phone number, and company name when you fill out our contact or booking forms.</li>
              <li><strong>Project details:</strong> descriptions, requirements, and other content you share when onboarding or communicating with us.</li>
              <li><strong>Payment information:</strong> billing details processed securely through PayPal. We do not store your payment card details on our servers.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We may also collect basic usage data (pages visited, browser type, referring URL) through standard server logs to help us improve the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Deliver and manage the AI services you subscribe to.</li>
              <li>Respond to your inquiries and schedule consultations.</li>
              <li>Process payments and send billing-related communications.</li>
              <li>Send updates about your project or changes to our service.</li>
              <li>Improve the quality and performance of our website and services.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We do not sell your personal information or use it for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We do not share your personal information with third parties except in the following limited cases:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Payment processing:</strong> PayPal processes payments on our behalf and is subject to their own privacy policy.</li>
              <li><strong>Service providers:</strong> Trusted tools we use to operate our business (e.g., scheduling, email delivery) that are bound by confidentiality obligations.</li>
              <li><strong>Legal requirements:</strong> When required by law or to protect the rights and safety of Thynra or others.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We take reasonable measures to protect your personal information from unauthorized access, loss, or misuse. All data transmitted through our website is encrypted via HTTPS. Access to client project data is restricted to authorized personnel only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as necessary to provide the services you've subscribed to and to comply with our legal obligations. You may request deletion of your data at any time by contacting us at hello@thynra.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>Opt out of non-essential communications at any time.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:hello@thynra.com" className="text-primary hover:text-accent transition-colors">
                hello@thynra.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website may use basic session cookies required for the site to function correctly. We do not use tracking or advertising cookies. You can disable cookies in your browser settings, though this may affect certain site features.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Third-Party Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website may contain links to third-party sites such as Calendly or PayPal. We are not responsible for the privacy practices of those services. We encourage you to review their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. When we do, we'll update the effective date at the top of this page. Continued use of our services after changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions or concerns about this policy? Contact us at{" "}
              <a href="mailto:hello@thynra.com" className="text-primary hover:text-accent transition-colors">
                hello@thynra.com
              </a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
