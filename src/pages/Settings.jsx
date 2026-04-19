import Navbar from "../components/layout/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { Settings as SettingsIcon, Save, Cpu, UserCheck } from "lucide-react";

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

    const { error } = await supabase.auth.updateUser({
      data: { name: name }
    });

    setLoading(false);
    if (error) {
      setMsg("Error: " + error.message.toUpperCase());
    } else {
      setMsg("Settings Saved Successfully");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#999] selection:bg-[#c5a36b]/20">
      <Navbar />

      <main className="max-w-3xl mx-auto p-8 space-y-10">

        {/* Header Module */}
        <header className="flex flex-col md:flex-row md:items-end justify-between py-6 border-b-2 border-[#1a1a1a]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <SettingsIcon size={14} className="text-[#c5a36b]" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#444]">System Configuration</p>
            </div>
            <h1 className="text-4xl font-bold text-[#fcfcfc] tracking-tight">System Settings</h1>
          </div>
          <div className="text-[10px] font-black text-[#333] uppercase tracking-[0.4em]">
            Path: System Configuration
          </div>
        </header>

        {/* Configuration Panel */}
        <section className="bg-[#080808] border-2 border-[#1a1a1a] p-10 relative overflow-hidden">
          {/* Corner Accent */}
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Cpu size={40} className="text-[#c5a36b]" />
          </div>

          <div className="space-y-8">
            {/* Identity Field */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <UserCheck size={14} className="text-[#c5a36b]" />
                <label className="text-[11px] font-black text-[#555] uppercase tracking-widest">
                  User Profile Name
                </label>
              </div>
              <input
                className="w-full p-4 bg-[#050505] border-2 border-[#1a1a1a] text-[#eee] text-xs font-bold focus:border-[#c5a36b] outline-none transition-colors uppercase tracking-widest placeholder:text-[#1a1a1a]"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Action Cluster */}
            <div className="pt-6 flex flex-col md:flex-row items-center gap-6 border-t-2 border-[#141414]">
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full md:w-auto px-10 py-4 bg-[#c5a36b] hover:bg-[#d4b582] text-[#050505] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale"
              >
                <Save size={14} />
                {loading ? "Saving" : "Save Changes"}
              </button>

              {msg && (
                <div className="px-4 py-2 border-l-2 border-[#c5a36b]/30">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${msg.includes('Error') ? 'text-red-800' : 'text-[#c5a36b]'}`}>
                    {msg}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* System Metadata Decor */}
        <footer className="bg-[#0c0c0c] border-2 border-[#1a1a1a] p-6 text-[10px] text-[#333] font-black uppercase tracking-[0.2em] space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[#222]">System Version:</span>
            <span className="text-[#444]">3.2.0 Stable</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#222]">Locale:</span>
            <span className="text-[#444]">UTF-8</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#222]">Encryption Status:</span>
            <span className="text-emerald-900">Active</span>
          </div>
        </footer>
      </main>
    </div>
  );
}