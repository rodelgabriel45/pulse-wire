import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "./common/LoadingSpinner";

const PublicRoute = ({ redirectPath = "/" }) => {
  const { data: authUser, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (authUser) {
    return <Navigate to={redirectPath} />;
  }

  return <Outlet />;
};

export default PublicRoute;
