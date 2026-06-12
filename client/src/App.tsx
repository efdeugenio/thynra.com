import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pricing" component={() => <Redirect to="/pricing/ai-receptionist" />} />
      <Route path="/pricing/ai-receptionist" component={PricingPage} />
      <Route path="/checkout/sub/:id" component={CheckoutSubscriptionPage} />
      <Route path="/checkout/success" component={CheckoutSuccessPage} />
      <Route path="/onboarding/resend" component={OnboardingResendPage} />
      <Route path="/onboarding/:business_id" component={OnboardingPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/data-deletion" component={DataDeletionPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
