import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoutesGuard = () => {
  const isAuthenticated = useAuth();

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoutesGuard;
