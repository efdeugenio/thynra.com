import { useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/i18n";
import { resolveMeta } from "@shared/siteMeta";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
import DataDeletionPage from "@/pages/data-deletion";
import CheckoutSubscriptionPage from "@/pages/checkout-subscription";
import CheckoutSuccessPage from "@/pages/checkout-success";
import PricingPage from "@/pages/pricing";
import OnboardingPage from "@/pages/onboarding";
import OnboardingResendPage from "@/pages/onboarding-resend";
import QuizPage from "@/pages/quiz";
import ResourcePage from "@/pages/resource";

// Pages that exist in both languages. Inside the "/es" nest these paths are
// relative, so the same components serve /quiz and /es/quiz. Returned as a
// Fragment (not rendered as a component) because <Switch> only looks through
// Fragments when picking the first matching <Route>.
function sharedRoutes() {
  return (
    <>
      <Route path="/" component={Home} />
      <Route path="/quiz" component={QuizPage} />
      <Route path="/assessment" component={() => <Redirect to="/quiz" />} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/data-deletion" component={DataDeletionPage} />
    </>
  );
}

function SpanishRouter() {
  return (
    <LocaleProvider locale="es">
      <Switch>
        {sharedRoutes()}
        <Route path="/recursos/:slug" component={ResourcePage} />
        {/* English-only flows: send Spanish URLs to the English page instead of a 404. */}
        <Route path="/pricing/*?" component={() => <Redirect to="~/pricing/ai-receptionist" />} />
        <Route component={NotFound} />
      </Switch>
    </LocaleProvider>
  );
}

function EnglishRouter() {
  return (
    <LocaleProvider locale="en">
      <Switch>
        {sharedRoutes()}
        <Route path="/pricing" component={() => <Redirect to="/pricing/ai-receptionist" />} />
        <Route path="/pricing/ai-receptionist" component={PricingPage} />
        <Route path="/checkout/sub/:id" component={CheckoutSubscriptionPage} />
        <Route path="/checkout/success" component={CheckoutSuccessPage} />
        <Route path="/onboarding/resend" component={OnboardingResendPage} />
        <Route path="/onboarding/:business_id" component={OnboardingPage} />
        <Route path="/recursos/:slug" component={() => <Redirect to={`/es${window.location.pathname}`} />} />
        <Route component={NotFound} />
      </Switch>
    </LocaleProvider>
  );
}

// The Worker sets <title>, lang and meta on first load; this keeps the tab
// title and <html lang> right when navigating inside the app without a reload.
function DocumentMeta() {
  const [location] = useLocation();
  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).has("preview");
    const meta = resolveMeta(window.location.pathname, { preview });
    document.title = meta.title;
    document.documentElement.lang = meta.locale;
  }, [location]);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <DocumentMeta />
        <Switch>
          <Route path="/es" nest component={SpanishRouter} />
          <Route component={EnglishRouter} />
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
