import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import { Cpu, ChevronRight, Database, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#999] selection:bg-[#c5a36b]/20 overflow-hidden">
      <Navbar />

      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-6">

        {/* Hard Grid Background - More 'Blueprint' than 'Website' */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)]" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="z-10 w-full max-w-5xl"
        >
          {/* Main Frame: 2px Bordered Container */}
          <div className="border-2 border-[#1a1a1a] bg-[#080808]/80 backdrop-blur-sm p-12 md:p-20 relative overflow-hidden">

            {/* Aesthetic Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#c5a36b]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#c5a36b]" />

            <div className="space-y-8">
              {/* Version/Status Tag */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#c5a36b]/5 border-2 border-[#c5a36b]/20">
                  <Cpu size={12} className="text-[#c5a36b]" />
                  <span className="text-[10px] font-black tracking-[0.4em] text-[#c5a36b] uppercase">
                    Build_v3.2.0 // Terminal_Active
                  </span>
                </div>
                <div className="h-[2px] flex-1 bg-[#1a1a1a]" />
              </div>

              <h1 className="text-5xl md:text-8xl font-black text-[#fcfcfc] tracking-tighter leading-[0.85] uppercase italic">
                Data_Analysis <br />
                <span className="text-[#c5a36b]">Kernel_System</span>
              </h1>

              <div className="max-w-xl border-l-2 border-[#1a1a1a] pl-8 space-y-4">
                <p className="text-[#666] text-sm md:text-lg font-bold leading-relaxed uppercase tracking-tight">
                  High-fidelity environment for <span className="text-[#eee]">Automated Extraction</span>,
                  Statistical Visualization, and <span className="text-[#eee]">Inference-Grade Processing</span>.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black text-[#333] tracking-[0.3em]">
                  <Database size={12} />
                  LATENCY: 14MS // BUFFER: OPTIMIZED
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-0 border-2 border-[#1a1a1a] w-fit bg-[#050505]">
                <Link
                  to="/login"
                  className="group flex items-center gap-4 px-10 py-5 bg-[#c5a36b] text-[#050505] text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:bg-[#d4b582]"
                >
                  Initialize_Session
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/dashboard"
                  className="px-10 py-5 text-[#555] hover:text-[#fcfcfc] hover:bg-[#1a1a1a] text-[11px] font-black uppercase tracking-[0.3em] transition-all border-l-2 border-[#1a1a1a]"
                >
                  System_Demo
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Console Logs Footer */}
        <div className="absolute bottom-12 left-12 hidden xl:block border-l-2 border-[#1a1a1a] pl-6 py-2">
          <div className="text-[10px] font-bold text-[#222] space-y-2 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <Terminal size={10} />
              <p>Network.Secure_Handshake: OK</p>
            </div>
            <p className="text-[#333] animate-pulse">{">"} Root_Kernel_Loaded_</p>
          </div>
        </div>

        {/* Right Side Meta Info */}
        <div className="absolute bottom-12 right-12 hidden xl:block text-right">
          <p className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-[0.8em]">
            Analytical_Unit_09
          </p>
        </div>
      </section>
    </div>
  );
}