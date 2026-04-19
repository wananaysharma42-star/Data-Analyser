import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Papa from "papaparse";
import { useData } from "../context/DataContext";

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
    <div className="min-h-screen bg-[#0d1117] font-mono text-[#c9d1d9] selection:bg-[#764abc]/30">
      <Navbar />

      <div className="p-6 max-w-5xl mx-auto space-y-8">
        {/* Module Header */}
        <div className="border-b border-[#30363d] pb-4">
          <h1 className="text-xl font-bold tracking-tight uppercase">Data_Ingestion_Unit</h1>
          <p className="text-[#8b949e] text-[10px] mt-1 tracking-widest uppercase">
            Protocol: CSV_PARSER_V2 // KERNEL_MOUNT
          </p>
        </div>

        {/* Upload Terminal Card */}
        <div className="bg-[#161b22] border border-[#30363d] p-10 rounded-md flex flex-col items-center justify-center border-dashed relative">
          <div className="text-center space-y-4">
            <div className="text-[#764abc] flex justify-center">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <p className="text-xs text-[#8b949e] uppercase font-bold tracking-tighter">
              Drag and drop source file or click to browse
            </p>

            <label className="cursor-pointer inline-block">
              <span className="px-6 py-2 bg-[#764abc] hover:bg-[#8a5ad4] text-white text-[11px] font-black uppercase tracking-widest rounded transition-all border border-[#8a5ad4]/20">
                LOAD_LOCAL_FILE
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
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold text-xs">[SUCCESS]</span>
              <h2 className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Head_Preview_Output</h2>
            </div>
            
            <div className="bg-[#010409] border border-[#30363d] p-6 rounded-md overflow-x-auto shadow-inner">
              <pre className="text-[12px] text-[#c9d1d9] leading-relaxed scrollbar-thin scrollbar-thumb-[#30363d]">
                {JSON.stringify(preview, null, 2)}
              </pre>
            </div>
            
            <p className="text-[10px] text-[#484f58] italic">
              * Kernel has successfully indexed {preview.length} sample rows into local buffer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}