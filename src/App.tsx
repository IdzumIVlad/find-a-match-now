import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import VacancyDetail from "./pages/VacancyDetail";
import JobDetail from "./pages/JobDetail";
import ResumeDetail from "./pages/ResumeDetail";
import Employer from "./pages/Employer";
import Candidate from "./pages/Candidate";
import Resumes from "./pages/Resumes";
import TermsOfUse from "./pages/TermsOfUse";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/vacancies/:id" element={<VacancyDetail />} />
            <Route path="/resumes" element={<Resumes />} />
            <Route path="/resumes/:id" element={<ResumeDetail />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employer" 
              element={
                <ProtectedRoute requiredRole="employer">
                  <Employer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/candidate" 
              element={
                <ProtectedRoute requiredRole="candidate">
                  <Candidate />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </HelmetProvider>
</QueryClientProvider>
);

export default App;
