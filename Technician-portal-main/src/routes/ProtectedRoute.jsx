import { Navigate } from "react-router-dom";
import { useTechnicianAuth } from "../context/TechnicianAuthContext";

export default function ProtectedRoute({
  children
}) {
  const {
    technician,
    loading
  } = useTechnicianAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!technician) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}