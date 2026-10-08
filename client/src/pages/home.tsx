import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import BenefitsSection from "@/components/benefits-section";
import PainsAndFixes from "@/components/pains-and-fixes";
import HowItWorks from "@/components/how-it-works";
import Staircase from "@/components/staircase";
import FAQSection from "@/components/faq-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <BenefitsSection />
      <PainsAndFixes />
      <HowItWorks />
      <Staircase />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
