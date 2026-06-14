import { Navigate } from 'react-router-dom';
import { useAuth } from '@/store/auth.context';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <p className="text-sm text-muted-foreground">Loading ElevateIQ...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
