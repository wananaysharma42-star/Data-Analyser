import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d1117] font-mono text-[#c9d1d9] selection:bg-[#764abc]/30 overflow-hidden">
      <Navbar />

      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-6">
        
        {/* Subtle Background Grid - Typical of IDE startup screens */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          {/* Version/Status Tag */}
          <span className="inline-block px-3 py-1 mb-6 text-[10px] font-bold tracking-[0.3em] text-[#764abc] border border-[#764abc]/30 bg-[#764abc]/5 rounded uppercase">
            Build_v2.0.4 // Stable
          </span>

          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            Kaggle_Dataset <br />
            <span className="text-[#764abc] bg-clip-text">ANALYZER_KERNEL</span>
          </h1>

          <p className="text-[#8b949e] max-w-2xl mb-10 text-sm md:text-base leading-relaxed mx-auto">
            A specialized environment for <span className="text-[#c9d1d9]">multimodal data extraction</span>, 
            automated visualization, and <span className="text-[#c9d1d9]">generative insights</span>. 
            Optimized for research-grade processing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              className="group relative px-8 py-3 bg-[#764abc] hover:bg-[#8a5ad4] text-white text-xs font-black uppercase tracking-widest rounded transition-all border border-[#8a5ad4]/20 shadow-[0_0_20px_rgba(118,74,188,0.15)]"
            >
              Initialize_Session
            </Link>

            <Link
              to="/dashboard"
              className="px-8 py-3 border border-[#30363d] hover:bg-[#161b22] text-[#8b949e] hover:text-[#c9d1d9] text-xs font-black uppercase tracking-widest rounded transition-all"
            >
              View_System_Demo
            </Link>
          </div>
        </motion.div>

        {/* Console-style Footer Decor */}
        <div className="absolute bottom-10 left-10 hidden lg:block">
          <div className="text-[10px] text-[#30363d] space-y-1">
            <p>{">"} SYSTEM.CONNECT(REMOTE_DB)</p>
            <p>{">"} KERNEL.INITIALIZE(ML_MODULE)</p>
            <p className="animate-pulse">{">"} READY_</p>
          </div>
        </div>
      </section>
    </div>
  );
}