import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col" data-testid="text-footer-logo">
            <span className="text-xl font-bold text-primary leading-tight">
              Thynra
            </span>
            <span className="text-xs text-muted-foreground">
              AI that helps you get and keep more customers
            </span>
          </div>
          <div
            className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground text-sm justify-center"
            data-testid="nav-footer-links"
          >
            <a href="#what" className="hover:text-primary transition-colors">
              What
            </a>
            <a
              href="#solutions"
              className="hover:text-primary transition-colors"
            >
              Solutions
            </a>
            <a href="#how" className="hover:text-primary transition-colors">
              How
            </a>
            <Link
              href="/quiz"
              className="hover:text-primary transition-colors"
              data-testid="link-footer-quiz"
            >
              AI Readiness Check
            </Link>
            <a href="#contact" className="hover:text-primary transition-colors">
              Contact
            </a>
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
              data-testid="link-privacy"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
              data-testid="link-terms"
            >
              Terms
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Thynra · hello@thynra.com
        </div>
      </div>
    </footer>
  );
}
