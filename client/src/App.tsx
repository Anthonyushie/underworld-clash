import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route } from "wouter";
import { GameLayout } from "@/components/game/GameLayout";
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
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Route path="/" component={() => <GameLayout><Index /></GameLayout>} />
        <Route path="/inventory" component={() => <GameLayout><Inventory /></GameLayout>} />
        <Route path="/arena" component={() => <GameLayout><Arena /></GameLayout>} />
        <Route path="/marketplace" component={() => <GameLayout><Marketplace /></GameLayout>} />
        <Route path="/leaderboard" component={() => <GameLayout><Leaderboard /></GameLayout>} />
        <Route path="/admin" component={() => <GameLayout><Admin /></GameLayout>} />
        <Route component={NotFound} />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
