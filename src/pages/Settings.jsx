import Navbar from "../components/layout/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Settings() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setName(data.user.user_metadata?.name || "");
      }
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    
    // Update name in Supabase
    const { error } = await supabase.auth.updateUser({
      data: { name: name }
    });

    setLoading(false);
    if (error) {
      setMsg("Error updating profile: " + error.message);
    } else {
      setMsg("Settings successfully committed.");
    }
  };
  return (
    <div className="min-h-screen bg-[#0d1117] font-mono text-[#c9d1d9] selection:bg-[#764abc]/30">
      <Navbar />

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        {/* Header Module */}
        <div className="border-l-4 border-[#764abc] pl-6 py-2">
          <h1 className="text-2xl font-bold tracking-tight uppercase">Kernel_Settings</h1>
          <p className="text-[#8b949e] text-[10px] mt-1 tracking-widest uppercase">
            Configuration_Path: /etc/datavision/user.conf
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-md shadow-2xl space-y-6">
          
          {/* Input Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#764abc] uppercase tracking-widest">
              Identity_Label
            </label>
            <input
              className="w-full p-3 rounded bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-sm focus:border-[#764abc] outline-none transition-colors"
              placeholder="Enter system alias..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Action Button */}

          {/* Action Button */}
          <div className="pt-4 flex items-center gap-4">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-3 bg-[#764abc] hover:bg-[#8a5ad4] text-white text-xs font-black uppercase tracking-widest rounded transition-all border border-[#8a5ad4]/20 shadow-[0_0_15px_rgba(118,74,188,0.1)] disabled:opacity-50"
            >
              {loading ? "COMMITTING..." : "COMMIT_CHANGES"}
            </button>
            {msg && <span className="text-xs text-[#8b949e] font-bold">{msg}</span>}
          </div>
        </div>

        {/* System Metadata Decor */}
        <div className="bg-[#010409] border border-[#30363d] rounded p-4 text-[10px] text-[#484f58] font-bold">
          <p className="flex justify-between">
            <span>UI_VERSION:</span>
            <span>2.0.4-STABLE</span>
          </p>
          <p className="flex justify-between mt-1">
            <span>LOCALE:</span>
            <span>UTF-8 / EN_US</span>
          </p>
        </div>
      </div>
    </div>
  );
}