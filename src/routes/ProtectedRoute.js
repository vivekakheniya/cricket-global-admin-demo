import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector((state) => state.user.v_user_info);

  // If no user is found, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user's role matches any allowed roles
  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "Student" ? "/view-courses" : "/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
