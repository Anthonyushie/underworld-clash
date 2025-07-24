import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route } from "wouter";
import { YakiHonneProvider } from "@/components/yakihonne/YakiHonneProvider";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Arena from "./pages/Arena";
import Marketplace from "./pages/Marketplace";
import Leaderboard from "./pages/Leaderboard";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <YakiHonneProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Route path="/" component={Index} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/arena" component={Arena} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  </YakiHonneProvider>
);

export default App;
