import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../Firebase/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.email) {
        try {
          const res = await fetch(
            `http://localhost:5000/user/${user.email}`,{
              credentials:"include",
            }
          );
          const data = await res.json();

          if (data.success) {
            setUserData(data.data);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setRoleLoading(false);
        }
      } else {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  // ⏳ loading
  if (loading || roleLoading) {
    return <div>Loading...</div>;
  }

  // ❌ not logged in → send to login WITH current page info
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // ❌ role mismatch
  if (
    allowedRoles &&
    userData?.role &&
    !allowedRoles.includes(userData.role)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;