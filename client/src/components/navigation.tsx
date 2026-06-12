import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import thynraLogo from "@assets/Thynra logo_1760137533222.png";

export default function Navigation() {
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
            <Button
              onClick={talkToSofia}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-talk-to-sofia-nav"
            >
              <Phone className="w-4 h-4 mr-2" />
              Talk to Sofia
            </Button>
          </div>
          <div className="md:hidden">
            <Button
              onClick={talkToSofia}
              size="sm"
              className="bg-primary text-primary-foreground"
              data-testid="button-talk-to-sofia-mobile"
            >
              <Phone className="w-4 h-4 mr-2" />
              Sofia
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
