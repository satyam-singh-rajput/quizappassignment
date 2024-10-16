// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../UserContext';


const ProtectedRoute = ({ children, isAdminRoute = false }) => {
  const { user } = useUser();

  if (!user) {
    // If no user is logged in, redirect to sign-in page
    return <Navigate to="/signin" />;
  }

  if (isAdminRoute && user.role !== 'admin') {
    // If it's an admin route and user is not admin, redirect to home
    return <Navigate to="/" />;
  }

  return children; // Render the children if the user is authenticated
};

export default ProtectedRoute;
