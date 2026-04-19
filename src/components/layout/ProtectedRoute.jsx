import { Navigate } from "react-router-dom";
import { useData } from "../../context/DataContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useData();

  if (loading) {
    return (
      /* Matches the #050505 background with 2px borders.
         This acts as a 'System Buffer' to prevent visual flicker.
      */
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-sans">
        <div className="border-2 border-[#1a1a1a] p-10 bg-[#080808] flex flex-col items-center space-y-4">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[#c5a36b] animate-pulse"></div>
            <div className="w-2 h-2 bg-[#c5a36b] animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-[#c5a36b] animate-pulse [animation-delay:0.4s]"></div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#444]">
            Validating_Credentials
          </p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}