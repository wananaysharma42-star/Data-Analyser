export default function Loader() {
  return (
    /* Main container matches the Jupyter background */
    <div className="flex flex-col justify-center items-center h-screen bg-[#0d1117] font-mono">
      {/* The spinner uses the Jupyter purple with a transparent track for a clean look */}
      <div className="w-12 h-12 border-4 border-[#764abc] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(118,74,188,0.2)]"></div>
      
      {/* Optional: Added a technical status label below the spinner */}
      <p className="mt-4 text-[#8b949e] text-xs uppercase tracking-widest animate-pulse">
        Initializing_Kernel...
      </p>
    </div>
  );
}