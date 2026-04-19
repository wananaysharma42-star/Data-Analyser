import { Link } from "react-router-dom";
import { AlertOctagon, Terminal, Home, ChevronLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#999] flex flex-col items-center justify-center px-6">

      {/* EXCEPTION TERMINAL FRAME */}
      <div className="w-full max-w-2xl border-2 border-[#1a1a1a] bg-[#080808] relative overflow-hidden">

        {/* TOP STATUS BAR */}
        <div className="bg-[#0c0c0c] border-b-2 border-[#1a1a1a] px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <AlertOctagon size={14} className="text-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#eee]">System_Exception // Error_404</span>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-red-600/20"></div>
            <div className="w-2 h-2 bg-red-600 animate-pulse"></div>
          </div>
        </div>

        <div className="p-12 flex flex-col items-center text-center space-y-8">

          {/* LARGE STATUS CODE */}
          <div className="relative">
            <h1 className="text-[120px] font-black text-[#141414] leading-none tracking-tighter italic">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm font-black text-[#fcfcfc] uppercase tracking-[0.5em] bg-[#080808] px-4">
                Routing_Failure
              </p>
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <div className="flex items-center justify-center gap-3 text-[#c5a36b]">
              <Terminal size={16} />
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">Resource_Not_Found</h2>
            </div>
            <p className="text-[11px] font-bold text-[#444] leading-relaxed uppercase tracking-wider border-y-2 border-[#1a1a1a] py-4">
              The requested URI does not map to an active kernel module or data resource.
              The connection has been terminated to prevent memory leakage.
            </p>
          </div>

          {/* RECOVERY ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-0 border-2 border-[#1a1a1a] bg-[#050505] w-full sm:w-auto">
            <Link
              to="/"
              className="group flex items-center justify-center gap-4 px-10 py-5 bg-[#c5a36b] text-[#050505] text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:bg-[#d4b582]"
            >
              <Home size={14} />
              Return_to_Mainframe
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-4 px-10 py-5 text-[#555] hover:text-[#fcfcfc] hover:bg-[#1a1a1a] text-[11px] font-black uppercase tracking-[0.3em] transition-all border-l-0 sm:border-l-2 border-t-2 sm:border-t-0 border-[#1a1a1a]"
            >
              <ChevronLeft size={14} />
              Previous_State
            </button>
          </div>
        </div>

        {/* DIAGNOSTIC FOOTER */}
        <div className="bg-[#0c0c0c] border-t-2 border-[#1a1a1a] px-8 py-4 flex justify-between items-center text-[9px] font-black text-[#222] uppercase tracking-[0.3em]">
          <span>Trace_ID: {Math.random().toString(36).toUpperCase().substring(2, 12)}</span>
          <span className="animate-pulse">Waiting_for_Instruction...</span>
        </div>
      </div>

      {/* AESTHETIC BACKGROUND ELEMENT */}
      <div className="mt-12 opacity-10 pointer-events-none">
        <p className="text-[10px] font-black uppercase tracking-[1em] text-[#1a1a1a]">
          Industrial_Data_Systems_Corp
        </p>
      </div>
    </div>
  );
}