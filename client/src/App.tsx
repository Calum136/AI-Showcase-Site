import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Scroll to top on route change
function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

import Home from "@/pages/Home";
import About from "@/pages/About";
import Resume from "@/pages/Resume";
import Portfolio from "@/pages/Portfolio";
import References from "@/pages/References";
import FitLanding from "@/pages/FitLanding";
import FitChat from "@/pages/FitChat";
import CaseStudy from "@/pages/CaseStudy";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/resume" component={Resume} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/references" component={References} />
      <Route path="/fit" component={FitLanding} />
      <Route path="/fit/chat" component={FitChat} />
      <Route path="/case-study" component={CaseStudy} />
      <Route path="/case-study/jollytails" component={CaseStudy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
