import { Navigate } from "react-router-dom";
import { getToken } from "../../hooks/useAuth";
import AyurBot from "../AyurBot";

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      {children}
      <AyurBot />
    </>
  );
};

export default ProtectedRoute;
