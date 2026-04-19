import Navbar from "../components/layout/Navbar";
import { useData } from "../context/DataContext";
import { useState } from "react";
import PDFReportView from "../components/reports/PDFReportView";

export default function Reports() {

  const { reports, clearReports, removeReport } = useData();
  const [activeReport, setActiveReport] = useState(null);

  return (
    <div className="min-h-screen bg-[#0d1117] font-mono text-[#c9d1d9] selection:bg-[#764abc]/30">
      <Navbar />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Report History Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-[#30363d] pb-2">
            <div>
              <h2 className="text-lg font-bold uppercase text-[#c9d1d9]">Report_History</h2>
              <p className="text-[10px] text-[#8b949e] tracking-widest uppercase">Saved Analysis Manifests</p>
            </div>
            {reports.length > 0 && (
              <button 
                onClick={clearReports}
                className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors"
              >
                CLEAR_HISTORY
              </button>
            )}
          </div>

          {reports.length === 0 ? (
            <div className="bg-[#161b22] border border-[#30363d] p-10 rounded-md text-center">
              <p className="text-[#8b949e] italic">[!] No local reports found in storage.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {reports.map((report) => (
                <div key={report.id} className="bg-[#161b22] border border-[#30363d] rounded-md p-5 space-y-4 hover:border-[#764abc]/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex justify-between w-full">
                      <div>
                        <h3 className="text-xs font-bold text-[#764abc] uppercase">{report.type}</h3>
                        <span className="text-[9px] text-[#8b949e] uppercase">{new Date(report.timestamp).toLocaleString()}</span>
                      </div>
                      <button 
                        onClick={() => removeReport(report.id || report.timestamp)}
                        className="text-[9px] font-black text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-2 py-1 rounded border border-rose-500/20 transition-all uppercase tracking-tighter"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-[#0d1117] border border-[#30363d] rounded p-3 text-center flex items-center justify-center">
                    {report.summary ? (
                      <button 
                        onClick={() => setActiveReport(report)}
                        className="px-6 py-2 bg-[#764abc] hover:bg-[#8a5ad4] text-white text-[10px] font-black uppercase tracking-widest rounded transition-all w-full"
                      >
                        VIEW PDF DOCUMENT
                      </button>
                    ) : (
                      <pre className="text-[10px] text-[#c9d1d9] whitespace-pre-wrap font-mono text-left w-full overflow-hidden">
                        {JSON.stringify(report.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for PDF Viewer */}
        {activeReport && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#0d1117] w-full max-w-5xl h-[95vh] rounded-md border border-[#30363d] flex flex-col shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-[#30363d] bg-[#161b22]">
                <h3 className="text-[#764abc] font-black uppercase tracking-widest text-xs">Report Viewer</h3>
                <button 
                  onClick={() => setActiveReport(null)}
                  className="text-[#8b949e] hover:text-rose-400 font-bold text-[10px] uppercase tracking-widest border border-transparent hover:border-rose-400/30 px-2 py-1 rounded transition-colors"
                >
                  [ CLOSE ]
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 relative custom-scrollbar">
                 <PDFReportView reportData={activeReport} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}