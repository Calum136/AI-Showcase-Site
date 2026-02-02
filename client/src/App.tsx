import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/Home";
import Resume from "@/pages/Resume";
import Portfolio from "@/pages/Portfolio";
import References from "@/pages/References";
import FitLanding from "@/pages/FitLanding";
import FitChat from "@/pages/FitChat";
import FitAssessment from "@/pages/FitAssessment";
import CaseStudy from "@/pages/CaseStudy";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/resume" component={Resume} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/references" component={References} />
      <Route path="/fit" component={FitLanding} />
      <Route path="/fit/chat" component={FitChat} />
      <Route path="/fit-assessment" component={FitAssessment} />
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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
