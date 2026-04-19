import Navbar from "../components/layout/Navbar";
import { useData } from "../context/DataContext";
import { Database, Table, FileText, Trash2, Clock, Activity, BarChart2 } from "lucide-react";

export default function Dashboard() {
  const { datasets, selectedData, user, loading: authLoading, removeDataset, reports } = useData();

  const userName = user?.user_metadata?.name || user?.email || "GUEST_USER";
  const totalRows = selectedData.length.toLocaleString();
  const totalCols = selectedData[0] ? Object.keys(selectedData[0]).length : 0;

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#bbb] selection:bg-[#c5a36b]/20">
      <Navbar />

      <main className="max-w-7xl mx-auto p-8 space-y-10">

        {/* Header Section: Large & Bold */}
        <header className="flex flex-col md:flex-row md:items-end justify-between py-6 border-b-2 border-[#1a1a1a]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#777]">System Status: Operational</p>
            </div>
            <h1 className="text-4xl font-bold text-[#fcfcfc] tracking-tight">
              {authLoading ? "Authorizing Session..." : `Analyst Dashboard: ${userName}`}
            </h1>
          </div>

          <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-[#888]">
            <div className="flex items-center gap-3 border-l-2 border-[#1a1a1a] pl-8">
              <Activity size={16} className="text-[#c5a36b]" />
              <span>Network: 100% Stable</span>
            </div>
            <div className="flex items-center gap-3 border-l-2 border-[#1a1a1a] pl-8">
              <Clock size={16} />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </header>

        {/* Statistical Overview: Broad Borders */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-2 border-[#1a1a1a] divide-x-2 divide-[#1a1a1a] bg-[#080808]">
          <StatBox title="Active Datasets" value={datasets.length} subtitle="Connected Sources" />
          <StatBox title="Total Observations" value={totalRows} subtitle="Aggregated Rows" />
          <StatBox title="Data Variables" value={totalCols} subtitle="Column Count" />
          <StatBox title="Generated Reports" value={reports.length} subtitle="Saved Analysis" />
        </div>

        {/* Resource Management Section */}
        <section className="border-2 border-[#1a1a1a] bg-[#080808]">
          <div className="flex items-center justify-between px-8 py-5 border-b-2 border-[#1a1a1a] bg-[#0c0c0c]">
            <div className="flex items-center gap-3">
              <BarChart2 size={18} className="text-[#c5a36b]" />
              <h2 className="text-sm font-bold text-[#eee] uppercase tracking-[0.15em]">Registered Data Resources</h2>
            </div>
            <p className="text-xs font-bold text-[#666] uppercase tracking-widest">Environment: Local_Host</p>
          </div>

          <div className="p-2">
            {datasets.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#666]">Waiting for data input...</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] font-black uppercase tracking-[0.2em] text-[#888]">
                    <th className="px-8 py-4 border-b-2 border-[#1a1a1a]">Index</th>
                    <th className="px-8 py-4 border-b-2 border-[#1a1a1a]">Dataset Identifier</th>
                    <th className="px-8 py-4 border-b-2 border-[#1a1a1a]">Matrix Dimensions</th>
                    <th className="px-8 py-4 border-b-2 border-[#1a1a1a] text-right">Administrative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#141414]">
                  {datasets.map((item, i) => (
                    <tr key={i} className="hover:bg-[#0f0f0f] transition-all group">
                      <td className="px-8 py-6 text-sm font-mono text-[#666]">
                        {(i + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-lg font-semibold text-[#efefef] tracking-tight group-hover:text-white">
                          {item.name}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#777] uppercase tracking-tighter">
                            Rows: {item.rows.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-[#777] uppercase tracking-tighter">
                            Cols: {item.columns}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => removeDataset(i)}
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-[#555] text-[#888] hover:border-red-900 hover:text-red-500 hover:bg-red-950/10 transition-all"
                        >
                          Delete Resource
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Global Footer */}
        <footer className="pt-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.5em] text-[#555]">
          <div className="flex gap-12">
            <span>Core_Version: 2.6.4</span>
            <span>Security: AES-256</span>
          </div>
          <span>System_Update: {new Date().toLocaleTimeString()}</span>
        </footer>
      </main>
    </div>
  );
}

function StatBox({ title, value, subtitle }) {
  return (
    <div className="p-10 hover:bg-[#0d0d0d] transition-colors">
      <p className="text-[10px] font-black text-[#888] uppercase tracking-[0.25em] mb-4">{title}</p>
      <h3 className="text-4xl font-bold text-[#fcfcfc] tabular-nums mb-2">{value}</h3>
      <p className="text-[9px] font-bold text-[#666] uppercase tracking-widest">{subtitle}</p>
    </div>
  );
}