import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useData } from "../../context/DataContext";
import { LogOut, Activity, Database } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useData();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="w-full flex flex-col font-sans">
      {/* TOP HEADER: Branding + User/Logout */}
      <div className="w-full bg-[#050505] border-b-2 border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center px-8 py-5 gap-6 md:gap-0">
        <Link to="/" className="flex items-center gap-4 group">
          <Database size={24} className="text-[#c5a36b]" />
          <div className="flex flex-col">
            <span className="text-xl font-black text-[#fcfcfc] uppercase tracking-[0.2em] group-hover:text-[#c5a36b] transition-colors leading-none">
              Data Analyzer
            </span>
            <span className="text-[9px] font-black text-[#555] uppercase tracking-[0.5em] mt-1.5">Advanced Analysis System</span>
          </div>
        </Link>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="flex flex-col items-end border-r-2 border-[#1a1a1a] pr-8 hidden sm:flex">
            <span className="text-[9px] font-black text-[#666] uppercase tracking-widest leading-none mb-1">Authenticated User</span>
            <span className="text-sm font-black text-[#c5a36b] uppercase tracking-tight">
              {user?.user_metadata?.name || user?.email?.split('@')[0] || "Guest"}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-8 py-3 bg-[#0c0c0c] hover:bg-red-950/20 text-[#888] hover:text-red-500 border-2 border-[#1a1a1a] hover:border-red-900/30 transition-all group"
          >
            <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Logout</span>
          </button>
        </div>
      </div>

      {/* BOTTOM NAV: Navigation Links */}
      <nav className="w-full bg-[#080808] border-b-2 border-[#1a1a1a] flex overflow-x-auto custom-scrollbar no-scrollbar divide-x-2 divide-[#1a1a1a]">
        <NavButton to="/dashboard" label="Dashboard" active={location.pathname === "/dashboard"} />
        <NavButton to="/upload" label="Upload" active={location.pathname === "/upload"} />
        <NavButton to="/analyze" label="Analyze" active={location.pathname === "/analyze"} />
        <NavButton to="/compare" label="Compare" active={location.pathname === "/compare"} />
        <NavButton to="/two-sample-test" label="T-Test" active={location.pathname === "/two-sample-test"} />
        <NavButton to="/ai" label="AI Insights" accent active={location.pathname === "/ai"} />
        <NavButton to="/reports" label="Reports" active={location.pathname === "/reports"} />
        <NavButton to="/settings" label="Settings" active={location.pathname === "/settings"} />
      </nav>
    </div>
  );
}

/* Internal Nav Component for consistent styling */
function NavButton({ to, label, accent = false, active = false }) {
  return (
    <Link
      to={to}
      className={`flex-1 px-4 py-5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center min-w-fit h-full relative
        ${accent
          ? (active ? 'text-[#fcfcfc] bg-[#c5a36b]/20' : 'text-[#c5a36b] bg-[#c5a36b]/5 hover:bg-[#c5a36b]/10')
          : (active ? 'text-[#fcfcfc] bg-[#1a1a1a]' : 'text-[#999] hover:text-[#fcfcfc] hover:bg-[#0c0c0c]')
        }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#c5a36b]"></span>
      )}
    </Link>
  );
}