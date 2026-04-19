export default function Loader() {
  return (
    /* Main container matches your #050505 industrial background */
    <div className="flex flex-col justify-center items-center h-screen bg-[#050505] font-sans">

      {/* The Loader: 
         Replaced the round spinner with a square, thick-bordered box 
         to match your 'Statistical App' grid style.
      */}
      <div className="relative w-20 h-20 border-2 border-[#1a1a1a] flex items-center justify-center bg-[#080808]">
        {/* Animated accent bar inside the box */}
        <div className="w-1 bg-[#c5a36b] h-12 animate-[bounce_1.5s_infinite_ease-in-out]"></div>
        <div className="w-1 bg-[#c5a36b] h-8 mx-1 animate-[bounce_1.5s_infinite_0.2s_ease-in-out]"></div>
        <div className="w-1 bg-[#c5a36b] h-10 animate-[bounce_1.5s_infinite_0.4s_ease-in-out]"></div>

        {/* Outer pulse ring to signify activity */}
        <div className="absolute inset-0 border-2 border-[#c5a36b]/20 animate-ping"></div>
      </div>

      {/* Standard bold typography and descriptive labels 
         as per your specific design rules.
      */}
      <div className="mt-8 text-center space-y-2">
        <h2 className="text-sm font-black text-[#fcfcfc] uppercase tracking-[0.3em]">
          System Resource Initialization
        </h2>
        <div className="flex items-center justify-center gap-3">
          <span className="h-[2px] w-8 bg-[#1a1a1a]"></span>
          <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.5em] animate-pulse">
            Processing Data Buffer
          </p>
          <span className="h-[2px] w-8 bg-[#1a1a1a]"></span>
        </div>
      </div>

      {/* Aesthetic Detail: Bottom corner status (Optional) */}
      <div className="absolute bottom-10 text-[9px] font-black text-[#222] uppercase tracking-[0.4em]">
        Status: Establishing_Secure_Link
      </div>
    </div>
  );
}