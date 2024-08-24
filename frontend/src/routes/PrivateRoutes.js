import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useSnackbar } from "../providers/SnackProvider";

const PrivateRoutes = () => {
  const user = useAuth();
  const showSnackBar = useSnackbar()
  if (!user.access) {
    showSnackBar("Login first!")
    return <Navigate to="/auth/login" />
};
  return (
    <div>
  <Outlet />
  </div>
);
};

export default PrivateRoutes