import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import HowItWorks from "@/components/how-it-works";
import BenefitsSection from "@/components/benefits-section";
import PricingSection from "@/components/pricing-section";
import FAQSection from "@/components/faq-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <HowItWorks />
      <BenefitsSection />
      <PricingSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
