import React from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};

const NotFoundRedirect: React.FC = () => {
  return isAuthenticated() ? (
    <Navigate to="/board" replace />
  ) : (
    <Navigate to="/" replace />
  );
};

export default NotFoundRedirect;
