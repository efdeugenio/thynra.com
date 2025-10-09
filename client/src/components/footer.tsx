export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-primary" data-testid="text-footer-logo">
              Thynra - Thinking for the new era
            </span>
          </div>
          <div className="flex space-x-6 text-muted-foreground" data-testid="nav-footer-links">
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              data-testid="link-privacy"
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              data-testid="link-terms"
            >
              Terms
            </a>
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              data-testid="link-contact"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
