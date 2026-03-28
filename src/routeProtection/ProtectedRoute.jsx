// components/ProtectedRoute.jsx (For regular users)
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const userStr =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Must have token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user exists but is admin trying to access user dashboard
  if (user && user.role === "admin") {
    // Optional: Redirect admins to admin dashboard when trying to access user dashboard
    // return <Navigate to="/admindashboard" replace />;

    // Or allow admin to access user dashboard too (if you want that)
    return children;
  }

  return children;
};

export default ProtectedRoute;
