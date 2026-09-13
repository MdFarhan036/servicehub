import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function PrivateRoute({
  children
}) {
  const {
    user,
    loading
  } = useAuth();

  // wait until auth check finishes
  if (loading) {
    return (
      <div className="loader">
        Loading...
      </div>
    );
  }

  // if not logged in → login page
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // logged in → allow access
  return children;
}