import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useData } from "../../context/DataContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useData();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="w-full px-6 py-2 bg-[#161b22] border-b border-[#30363d] flex justify-between items-center font-mono">
      {/* Branding: Replaced DataVision with a more technical name or kept as is with Jupyter styling */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-bold text-[#c9d1d9] flex items-center gap-2">
          <span className="text-[#764abc]">●</span>
          <span>DATA_VISION_v1</span>
        </Link>
        <span className="hidden lg:inline text-[10px] text-[#8b949e] border border-[#30363d] px-2 py-0.5 rounded">
          KERNEL: PYTHON_3
        </span>
      </div>

      {/* Navigation Links: Monospaced, uppercase, and subtle hover states */}
      <div className="hidden md:flex gap-6 text-[11px] uppercase tracking-wider font-semibold text-[#8b949e]">
        <Link to="/dashboard" className="hover:text-[#c9d1d9] transition-colors">Dashboard</Link>
        <Link to="/upload" className="hover:text-[#c9d1d9] transition-colors">Upload</Link>
        <Link to="/analyze" className="hover:text-[#c9d1d9] transition-colors">Analyze</Link>
        <Link to="/compare" className="hover:text-[#c9d1d9] transition-colors">Compare</Link>
        <Link to="/two-sample-test" className="hover:text-[#c9d1d9] transition-colors">2_Sample_Test</Link>
        <Link to="/ai" className="hover:text-[#764abc] transition-colors italic">AI_Insights</Link>
        <Link to="/reports" className="hover:text-[#c9d1d9] transition-colors">Reports</Link>
        <Link to="/settings" className="hover:text-[#c9d1d9] transition-colors">Settings</Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-[10px] text-[#8b949e] font-bold">
          {user?.user_metadata?.name || user?.email?.split('@')[0] || "GUEST"}
        </span>

        {/* Logout: Functional button style with Jupyter Purple accent */}
        <button
          onClick={logout}
          className="px-3 py-1 bg-[#764abc] hover:bg-[#8a5ad4] text-white text-[11px] font-bold uppercase rounded transition-all border border-[#8a5ad4]/20"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}