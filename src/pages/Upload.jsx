import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Papa from "papaparse";
import { useData } from "../context/DataContext";
import { UploadCloud, Database, FileSpreadsheet, CheckCircle2, Terminal } from "lucide-react";

export default function Upload() {
  const { addDataset, setSelectedData, user } = useData();
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`app_${user.id}_upload_preview`);
      if (saved) setPreview(JSON.parse(saved));
    }
  }, [user]);

  useEffect(() => {
    if (user && preview.length > 0) {
      localStorage.setItem(`app_${user.id}_upload_preview`, JSON.stringify(preview));
    }
  }, [preview, user]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setPreview(results.data.slice(0, 5));
        setSelectedData(results.data);
        addDataset({
          name: file.name,
          rows: results.data.length,
          columns: Object.keys(results.data[0] || {}).length,
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#bbb] selection:bg-[#c5a36b]/20">
      <Navbar />

      <main className="max-w-6xl mx-auto p-8 space-y-10">

        {/* Module Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between py-6 border-b-2 border-[#1a1a1a]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Database size={14} className="text-[#c5a36b]" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#777]">Resource Acquisition</p>
            </div>
            <h1 className="text-4xl font-bold text-[#fcfcfc] tracking-tight">Data Upload</h1>
          </div>
          <div className="text-[10px] font-black text-[#666] uppercase tracking-[0.4em]">
            Protocol: CSV Parser
          </div>
        </header>

        {/* Upload Terminal Card */}
        <div className="bg-[#080808] border-2 border-[#1a1a1a] p-16 relative overflow-hidden group">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileSpreadsheet size={120} className="text-[#c5a36b]" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8">
            <div className="w-20 h-20 bg-[#0c0c0c] border-2 border-[#1a1a1a] flex items-center justify-center rounded-sm">
              <UploadCloud size={32} className="text-[#c5a36b]" />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-black text-[#fcfcfc] uppercase tracking-widest italic">
                Awaiting Data Upload
              </p>
              <p className="text-[10px] text-[#777] uppercase tracking-[0.2em] font-bold">
                Drag source file here or browse manually to initialize
              </p>
            </div>

            <label className="cursor-pointer">
              <span className="inline-block px-10 py-4 bg-[#c5a36b] hover:bg-[#d4b582] text-[#050505] text-[11px] font-black uppercase tracking-[0.4em] transition-all border-2 border-transparent hover:border-[#fcfcfc]/20">
                Select Local File
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Preview Output */}
        {preview.length > 0 && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4">
              <div className="flex items-center gap-4">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <h2 className="text-[10px] font-black text-[#eee] uppercase tracking-[0.4em]">Data Preview</h2>
              </div>
              <div className="flex items-center gap-2 text-[9px] font-black text-[#666] uppercase tracking-[0.2em]">
                <Terminal size={12} />
                Encoding: UTF-8
              </div>
            </div>

            <div className="bg-[#0c0c0c] border-2 border-[#1a1a1a] relative group">
              {/* Table Style Decor */}
              <div className="absolute top-0 left-0 w-full h-1 bg-[#c5a36b]/20" />

              <div className="p-8 overflow-x-auto custom-scrollbar">
                <pre className="text-[11px] text-[#999] font-mono leading-relaxed bg-[#050505] p-6 border-2 border-[#141414]">
                  <span className="text-[#c5a36b]">{"{"}</span>
                  <br />
                  {JSON.stringify(preview, null, 2).slice(2, -2)}
                  <br />
                  <span className="text-[#c5a36b]">{"}"}</span>
                </pre>
              </div>
            </div>

            <footer className="flex justify-between items-center text-[10px] font-black text-[#555] uppercase tracking-[0.4em]">
              <p>System Status: Synchronized</p>
              <p>Rows: {preview.length} (Sample Set)</p>
            </footer>
          </section>
        )}
      </main>
    </div>
  );
}