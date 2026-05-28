import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Firebase/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, dbUser, loading, roleLoading ,tokenLoading } = useContext(AuthContext);
  const location = useLocation();

  // 🔥 global loading
  if (loading || roleLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  // not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // account setup fallback
  if (!dbUser?._id && !tokenLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Setting up account...
      </div>
    );
  }

  // role check
  if (
    allowedRoles &&
    dbUser?.role &&
    !allowedRoles.includes(dbUser.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;