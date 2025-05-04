import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import EmployeesPage from "./pages/employees";
import Branches from "./pages/branches";
import Rooms from "./pages/rooms";
import CategoriesPage from "./pages/categories";
import Courses from "./pages/courses";
import Instructors from "./pages/instructors";
import NotFound from "./pages/NotFound";
import LoginForm from "./components/auth/LoginForm";
import Messaging from "./pages/Messaging";
import Campaigns from "./pages/Campaigns";
import Leads from "./pages/Leads";
import Students from "./pages/Students";
import Booking from "./pages/Booking";
import Groups from "./pages/groups";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";
import Roles from "./pages/Roles";
import Receipts from "./pages/Receipts";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Authentication wrapper
const AuthWrapper = () => {
  const { isAuthenticated } = useAuth();
  


  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/students" element={<Students />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/receipts" element={<Receipts />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

// مكون توجيه المستخدم المصادق إلى الصفحة الرئيسية
const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={
                <AuthRedirect>
                  <LoginForm />
                </AuthRedirect>
              } />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AuthWrapper />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
