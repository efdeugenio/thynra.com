import { useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import BenefitsSection from "@/components/benefits-section";
import PainsAndFixes from "@/components/pains-and-fixes";
import HowItWorks from "@/components/how-it-works";
import Staircase from "@/components/staircase";
import FAQSection from "@/components/faq-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import { useRememberDoor } from "@/lib/door";

// The business door: /business and /es/negocios. This was the home page until
// the neutral home took "/" (Oct 2026); the sections are unchanged.
export default function BusinessPage() {
  useRememberDoor("business");
  // Footer links from other pages land here as /business#how etc.; the SPA
  // renders after the browser's own anchor jump, so scroll once it exists.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 50);
    return () => window.clearTimeout(timer);
  }, []);
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
      <Footer variant="business" />
    </div>
  );
}
