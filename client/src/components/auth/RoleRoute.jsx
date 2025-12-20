import { Navigate } from "react-router-dom";
import { getUser } from "../../hooks/useAuth";

const RoleRoute = ({ children, allowed }) => {
  const user = getUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;
