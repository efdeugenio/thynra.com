import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import BenefitsSection from "@/components/benefits-section";
import PainSection from "@/components/pain-section";
import Solutions from "@/components/solutions";
import HowItWorks from "@/components/how-it-works";
import FAQSection from "@/components/faq-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <BenefitsSection />
      <PainSection />
      <Solutions />
      <HowItWorks />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
