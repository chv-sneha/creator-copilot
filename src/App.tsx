import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import ContentAnalyzer from "./pages/ContentAnalyzer";
import ContentStudio from "./pages/ContentStudio";
import TrendsCalendar from "./pages/TrendsCalendar";
import SafetyCopyright from "./pages/SafetyCopyright";
import MonetizationEngagement from "./pages/MonetizationEngagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="analyzer" element={<ContentAnalyzer />} />
            <Route path="studio" element={<ContentStudio />} />
            <Route path="trends" element={<TrendsCalendar />} />
            <Route path="safety" element={<SafetyCopyright />} />
            <Route path="monetization" element={<MonetizationEngagement />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
