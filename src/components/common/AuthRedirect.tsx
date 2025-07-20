import React from "react";
import { Navigate } from "react-router-dom";

interface AuthRedirectProps {
  children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/board" replace />;
  }

  return <>{children}</>;
};

export default AuthRedirect;
