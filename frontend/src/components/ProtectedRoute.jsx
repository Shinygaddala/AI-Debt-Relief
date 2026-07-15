import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");

  // User is not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // User doesn't have permission
  if (allowedRoles && !allowedRoles.includes(role)) {

    // If Admin tries to open user pages
    if (role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // If User tries to open admin pages
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;