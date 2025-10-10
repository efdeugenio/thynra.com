import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import thynraLogo from "@assets/Thynra_logo_1760134610649.png";

export default function Navigation() {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById("pricing");
    pricingSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex flex-col" data-testid="logo">
            <img 
              src={thynraLogo} 
              alt="Thynra" 
              className="h-10"
            />
            <span className="text-xs text-muted-foreground mt-1">
              Thinking for the new era
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button 
              className="flex items-center text-secondary-foreground hover:text-primary transition-colors"
              onClick={() => window.open('https://calendly.com/efdeugenio/apply-ai', '_blank')}
              data-testid="button-book-call-nav"
            >
              <Phone className="w-4 h-4 mr-2" />
              Book a call
            </button>
            <Button 
              onClick={scrollToPricing}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-see-pricing"
            >
              See pricing
            </Button>
          </div>
          <div className="md:hidden">
            <button className="text-secondary-foreground" data-testid="button-mobile-menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
