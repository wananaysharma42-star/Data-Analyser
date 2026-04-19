import Navbar from "../components/layout/Navbar";
import { useData } from "../context/DataContext";
import { useState } from "react";
import PDFReportView from "../components/reports/PDFReportView";
import { Archive, FileText, Trash2, X, AlertCircle, Clock } from "lucide-react";

export default function Reports() {
  const { reports, clearReports, removeReport } = useData();
  const [activeReport, setActiveReport] = useState(null);

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#bbb] selection:bg-[#c5a36b]/20">
      <Navbar />

      <main className="max-w-7xl mx-auto p-8 space-y-10">

        {/* Section Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between py-6 border-b-2 border-[#1a1a1a]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Archive size={14} className="text-[#c5a36b]" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#777]">Report Archive</p>
            </div>
            <h1 className="text-4xl font-bold text-[#fcfcfc] tracking-tight">Report History</h1>
          </div>

          {reports.length > 0 && (
            <button
              onClick={clearReports}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-red-900 hover:text-red-500 transition-colors py-2 px-4 border-2 border-transparent hover:border-red-900/30"
            >
              <AlertCircle size={12} />
              Purge All Records
            </button>
          )}
        </header>

        {reports.length === 0 ? (
          <div className="border-2 border-dashed border-[#1a1a1a] p-24 text-center bg-[#080808]/50">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#666] italic">
              No reports found: Your history is currently empty.
            </p>
          </div>
        ) : (
          <div className="grid gap-0 md:grid-cols-2 border-2 border-[#1a1a1a] divide-x-2 divide-y-2 divide-[#1a1a1a] bg-[#080808]">
            {reports.map((report) => (
              <div key={report.id} className="p-8 space-y-6 hover:bg-[#0c0c0c] transition-colors group">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-[#c5a36b]" />
                      <h3 className="text-sm font-black text-[#fcfcfc] uppercase tracking-widest italic">
                        {report.type.replace('_', ' ')} Analysis
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-[#666] uppercase tracking-widest">
                      <Clock size={10} />
                      Generated: {new Date(report.timestamp).toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => removeReport(report.id || report.timestamp)}
                    className="p-2 text-[#555] hover:text-red-600 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="bg-[#050505] border-2 border-[#141414] p-2">
                  {report.summary ? (
                    <button
                      onClick={() => setActiveReport(report)}
                      className="w-full py-4 bg-[#c5a36b] hover:bg-[#d4b582] text-[#050505] text-[11px] font-black uppercase tracking-[0.3em] transition-all"
                    >
                      View Report
                    </button>
                  ) : (
                    <div className="p-4 overflow-hidden">
                      <pre className="text-[9px] text-[#555] font-mono leading-tight truncate">
                        {JSON.stringify(report.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for PDF Viewer - Industrial Overlay */}
        {activeReport && (
          <div className="fixed inset-0 z-50 bg-[#050505]/95 flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-[#080808] w-full max-w-6xl h-[90vh] border-2 border-[#1a1a1a] flex flex-col shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden">

              {/* Modal Header */}
              <div className="flex justify-between items-center px-8 py-4 border-b-2 border-[#1a1a1a] bg-[#0c0c0c]">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-[#c5a36b] animate-pulse" />
                  <h3 className="text-[#c5a36b] font-black uppercase tracking-[0.4em] text-[10px]">Report Viewer</h3>
                </div>
                <button
                  onClick={() => setActiveReport(null)}
                  className="flex items-center gap-2 text-[#777] hover:text-[#fcfcfc] font-black text-[10px] uppercase tracking-widest transition-colors group"
                >
                  <X size={14} className="group-hover:rotate-90 transition-transform" />
                  Close
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-10 bg-[#050505]">
                <div className="border-2 border-[#141414] p-1 bg-[#0c0c0c]">
                  <PDFReportView reportData={activeReport} />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-3 border-t-2 border-[#1a1a1a] bg-[#0c0c0c] text-[8px] font-black text-[#555] uppercase tracking-[0.5em]">
                Report Archive Viewer
              </div>
            </div>
          </div>
        )}

        <footer className="pt-8 border-t-2 border-[#1a1a1a] flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-[#555]">
          <p>Storage Integrity: 100%</p>
          <p>Archived Reports: {reports.length}</p>
        </footer>
      </main>
    </div>
  );
}