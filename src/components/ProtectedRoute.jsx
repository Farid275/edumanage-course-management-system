import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-surface gap-4">
        <span className="material-symbols-outlined animate-spin text-[32px] text-primary">refresh</span>
        <p className="font-body-md text-on-surface-variant">Checking session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    console.log(`ProtectedRoute: User role '${role}' is not in allowedRoles [${allowedRoles}]. Redirecting...`);
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'lecturer') return <Navigate to="/lecturer/dashboard" replace />;
    if (role === 'student') return <Navigate to="/student/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
