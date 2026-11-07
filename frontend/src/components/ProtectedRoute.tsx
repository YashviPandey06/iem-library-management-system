import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EAE5D8] dark:bg-[#192A23] flex flex-col items-center justify-center p-4">
        <div className="bg-[#F6F3EA] dark:bg-[#263D32] border border-[#DDD6C6] dark:border-[#334D40] rounded-2xl p-8 flex flex-col items-center justify-center gap-3 shadow-card">
          <RefreshCw className="w-8 h-8 text-[#B96F50] animate-spin" />
          <span className="text-xs font-semibold text-[#77776D] dark:text-[#EAE5D8]">Verifying library session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : null;
};
