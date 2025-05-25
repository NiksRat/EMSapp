import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const RootRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin-dashboard" />;
    case "leader":
      return <Navigate to="/leader-dashboard" />;
    case "accountant":
      return <Navigate to="/accountant-dashboard" />;
    default:
      return <Navigate to="/employee-dashboard" />;
  }
};

export default RootRedirect;