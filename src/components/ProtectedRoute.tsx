
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingEffect from './LoadingEffect';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingEffect text="Loading..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
