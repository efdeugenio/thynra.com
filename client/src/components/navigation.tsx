import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Phone, Sparkles } from "lucide-react";
import thynraLogo from "@assets/Thynra logo_1760137533222.png";

export default function Navigation() {
  const [, navigate] = useLocation();
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const talkToSofia = () =>
    (window as any).thynra?.startCall?.({ context: "screening" });

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center" data-testid="logo">
            <img
              src={thynraLogo}
              alt="Thynra"
              className="h-12 w-auto object-contain"
            />
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollTo("what")}
              className="text-secondary-foreground hover:text-primary transition-colors text-sm"
              data-testid="nav-what"
            >
              What
            </button>
            <button
              onClick={() => scrollTo("solutions")}
              className="text-secondary-foreground hover:text-primary transition-colors text-sm"
              data-testid="nav-solutions"
            >
              Solutions
            </button>
            <button
              onClick={() => scrollTo("how")}
              className="text-secondary-foreground hover:text-primary transition-colors text-sm"
              data-testid="nav-how"
            >
              How
            </button>
            <button
              onClick={talkToSofia}
              className="text-secondary-foreground hover:text-primary transition-colors text-sm inline-flex items-center"
              data-testid="button-talk-to-sofia-nav"
            >
              <Phone className="w-4 h-4 mr-1.5" />
              Talk to Sofia
            </button>
            <Button
              onClick={() => navigate("/quiz")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="nav-quiz"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Readiness Check
            </Button>
          </div>
          <div className="md:hidden">
            <Button
              onClick={() => navigate("/quiz")}
              size="sm"
              className="bg-primary text-primary-foreground"
              data-testid="nav-quiz-mobile"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Readiness Check
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
