import { Navigate, Outlet } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import LoadingSpinner from "./common/LoadingSpinner";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { data: authUser, isLoading, isError } = useAuthUser();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !authUser) {
    return <Navigate to={redirectPath} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
