import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import ContentAnalyzer from "./pages/ContentAnalyzer";
import ContentAnalyzerBedrock from "./pages/ContentAnalyzerBedrock";
import ContentAnalyzerComparison from "./pages/ContentAnalyzerComparison";
import ContentStudio from "./pages/ContentStudio";
import TrendsCalendar from "./pages/TrendsCalendar";
import SafetyCopyright from "./pages/SafetyCopyright";
import MonetizationEngagement from "./pages/MonetizationEngagement";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ChatbotRobot from "./components/ChatbotRobot";

const queryClient = new QueryClient();

function ChatbotWrapper() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  return !isLandingPage ? <ChatbotRobot /> : null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ChatbotWrapper />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="analyzer" element={<ContentAnalyzer />} />
              <Route path="analyzer-bedrock" element={<ContentAnalyzerBedrock />} />
              <Route path="analyzer-comparison" element={<ContentAnalyzerComparison />} />
              <Route path="studio" element={<ContentStudio />} />
              <Route path="trends" element={<TrendsCalendar />} />
              <Route path="safety" element={<SafetyCopyright />} />
              <Route path="monetization" element={<MonetizationEngagement />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
