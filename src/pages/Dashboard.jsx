import Navbar from "../components/layout/Navbar";
import { useData } from "../context/DataContext";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function Dashboard() {
  const { datasets, selectedData, user, loading: authLoading, removeDataset, reports } = useData();
  const userName = user?.user_metadata?.name || user?.email || "GUEST_USER";

  const totalRows = selectedData.length;
  const totalCols = selectedData[0] ? Object.keys(selectedData[0]).length : 0;

  return (
    <div className="min-h-screen bg-[#0d1117] font-mono text-[#c9d1d9] selection:bg-[#764abc]/30">
      <Navbar />

      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* WELCOME SECTION */}
        <div className="border-l-4 border-[#764abc] pl-6 py-2">
          <h1 className="text-3xl font-bold tracking-tight">
            SYSTEM_ACCESS: <span className="text-[#764abc] uppercase">{authLoading ? "AUTHORIZING..." : userName}</span>
          </h1>
          <p className="text-[#8b949e] text-xs mt-2 uppercase tracking-widest">
            STATUS: {user ? "KERNEL_READY" : "OFFLINE_MODE"} // SESSION: {user ? user.id.slice(0,8) : "ANONYMOUS"}
          </p>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card title="LOCAL_DATASETS" value={datasets.length} />
          <Card title="BUFFER_ROWS" value={totalRows} />
          <Card title="BUFFER_COLS" value={totalCols} />
          <Card title="SAVED_REPORTS" value={reports.length} />
        </div>

        {/* RECENT DATASETS SECTION */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-md overflow-hidden shadow-2xl">
          <div className="bg-[#0d1117] px-6 py-3 border-b border-[#30363d] flex justify-between items-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8b949e]">
              Mounted_File_System
            </h2>
            <span className="text-[9px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              SYNCHRONIZED
            </span>
          </div>

          <div className="p-6">
            {datasets.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-[#30363d] rounded">
                <p className="text-[#8b949e] italic text-sm">
                  [!] No data found in local directory.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {datasets.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-[#0d1117] hover:bg-[#1c2128] p-4 rounded border border-[#30363d] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#764abc] font-bold opacity-50 group-hover:opacity-100 transition-opacity">
                        {">"}
                      </span>
                      <span className="text-sm font-semibold">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-[10px] text-[#8b949e] font-bold text-right">
                        <span className="text-[#c9d1d9]">{item.rows}</span>_ROWS <br/>
                        <span className="text-[#c9d1d9]">{item.columns}</span>_COLS
                      </div>
                      <button 
                        onClick={() => removeDataset(i)}
                        className="text-[9px] font-black text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded border border-red-500/20 transition-all uppercase tracking-tighter"
                      >
                        UNMOUNT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER LOG */}
        <div className="text-[10px] text-[#30363d] font-bold uppercase flex justify-between">
          <span>Environment: PRODUCTION_ALPHA</span>
          <span>Last_Sync: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-md hover:border-[#764abc]/50 transition-colors">
      <p className="text-[10px] text-[#8b949e] font-black uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-bold mt-2 text-[#c9d1d9]">{value}</h3>
      <div className="w-full bg-[#0d1117] h-0.5 mt-4 rounded-full overflow-hidden">
        <div className="bg-[#764abc] h-full w-1/3 opacity-50"></div>
      </div>
    </div>
  );
}