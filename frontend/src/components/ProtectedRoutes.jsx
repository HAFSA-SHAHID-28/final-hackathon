import { Navigate } from "react-router-dom";
import { isAuthorized, getUser } from "../utils/auth";

const ProtectedRoutes = ({ children, role }) => {

  const loggedIn = isAuthorized();
  const user = getUser();

  const hasRequiredRole = role
    ? user?.role === role
    : true;

  if (!loggedIn) {
    return <Navigate to="/auth" replace />;
  }

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoutes;