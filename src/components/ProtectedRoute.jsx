import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("token"); // Check if user is logged in

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
