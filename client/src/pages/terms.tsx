import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground">

          <section>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service ("Terms") govern your use of the Thynra website and subscription services ("Service") provided by Thynra ("we," "us," or "our"). By subscribing to or using our Service, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Thynra provides on-demand AI development services on a monthly subscription basis. Services include, but are not limited to, chatbot development, data analysis pipelines, machine learning models, workflow automation, and other AI-powered solutions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Each subscription includes one active AI build at a time. Milestones are delivered within 5–7 business days. Unlimited adjustments within the agreed scope are included at no additional charge.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Subscription and Billing</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              The Thynra Monthly plan is priced at $3,995 USD per month. Payment is processed securely via PayPal. By subscribing, you authorize us to charge your payment method each billing cycle until you cancel or pause your subscription.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Billing occurs monthly on the date of your initial subscription. All fees are non-refundable except as described in Section 4 (Satisfaction Guarantee).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Pausing and Cancellation</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You may pause or cancel your subscription at any time by contacting us at hello@thynra.com. Pausing stops future billing while preserving your account and project history. Cancellation takes effect at the end of your current billing period.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to terminate your subscription immediately if you violate these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Satisfaction Guarantee</h2>
            <p className="text-muted-foreground leading-relaxed">
              If the first milestone delivered under your subscription does not meet your expectations, we will refund your first month's payment in full — no questions asked. To request a refund under this guarantee, contact us at hello@thynra.com within 7 days of the first milestone delivery. This guarantee applies only to your first billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Upon receipt of full payment for the applicable billing period, all custom work product created specifically for you under this subscription is assigned to you. This excludes any pre-existing tools, libraries, frameworks, or proprietary methods we use in delivering the Service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You grant us a limited, non-exclusive license to use your data, systems access, and materials solely to perform the services described herein.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Confidentiality</h2>
            <p className="text-muted-foreground leading-relaxed">
              We treat all client data and project details as strictly confidential. We will not share, sell, or disclose your information to third parties except as required to deliver the Service or comply with applicable law. Your data stays yours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Client Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Provide accurate and complete information when onboarding.</li>
              <li>Grant us necessary access to systems and tools required to complete the project.</li>
              <li>Respond to requests for clarification or feedback in a timely manner.</li>
              <li>Not use the deliverables for unlawful purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, Thynra shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service. Our total liability for any claim under these Terms is limited to the amount paid by you in the 30 days preceding the event giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be error-free or that specific outcomes will be achieved. AI-generated deliverables are experimental in nature and you are responsible for reviewing and validating all output before production use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms are governed by the laws of the United States. Any disputes arising under these Terms shall be resolved through good-faith negotiation before any formal proceedings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Changes to These Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms from time to time. If we make material changes, we will notify you by email or by posting the updated Terms on this page with a new effective date. Continued use of the Service after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about these Terms? Reach us at{" "}
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
