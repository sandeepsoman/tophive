
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import LoadingEffect from '@/components/LoadingEffect';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import Dashboard from '@/pages/Dashboard';
import BriefingFormPage from '@/pages/briefing';
import BriefingResult from '@/pages/BriefingResult';
import IndexPage from '@/pages/Index';
import ProtectedRoute from '@/components/ProtectedRoute';

// We need to define the AppRoutes component separately from App
// because useAuth can only be used inside the AuthProvider
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<IndexPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/briefing/new" 
        element={
          <ProtectedRoute>
            <BriefingFormPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/briefing/:id" 
        element={
          <ProtectedRoute>
            <BriefingResult />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
