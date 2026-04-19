import { Navigate } from "react-router-dom";
import { useData } from "../../context/DataContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useData();

  if (loading) return null;

  return user ? children : <Navigate to="/login" />;
}