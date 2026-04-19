import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import { ShieldCheck, Lock, User, AlertTriangle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsg(error.message.toUpperCase());
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#bbb] flex justify-center items-center px-6">

      {/* AUTHENTICATION TERMINAL FRAME */}
      <div className="w-full max-w-md border-2 border-[#1a1a1a] bg-[#080808] relative overflow-hidden">

        {/* TOP STATUS BAR */}
        <div className="bg-[#0c0c0c] border-b-2 border-[#1a1a1a] px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldCheck size={14} className="text-[#c5a36b]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#eee]">Secure Login</span>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
        </div>

        <form onSubmit={handleLogin} className="p-10 space-y-8">

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[#fcfcfc] uppercase tracking-tighter italic">
              Login
            </h1>
            <p className="text-[10px] font-bold text-[#777] uppercase tracking-widest border-l-2 border-[#1a1a1a] pl-4">
              Enter your credentials to continue.
            </p>
          </div>

          <div className="space-y-5">
            {/* EMAIL INPUT */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-black text-[#888] uppercase tracking-widest">
                <User size={12} /> Email Address
              </label>
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full p-4 bg-[#050505] border-2 border-[#1a1a1a] text-[#eee] text-xs font-bold outline-none focus:border-[#c5a36b] transition-colors placeholder:text-[#555] uppercase tracking-widest"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[9px] font-black text-[#888] uppercase tracking-widest">
                <Lock size={12} /> Password
              </label>
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full p-4 bg-[#050505] border-2 border-[#1a1a1a] text-[#eee] text-xs font-bold outline-none focus:border-[#c5a36b] transition-colors placeholder:text-[#555] tracking-widest"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* SYSTEM MESSAGES */}
          {msg && (
            <div className="flex items-start gap-3 bg-red-950/10 border-2 border-red-900/50 p-4 animate-in fade-in zoom-in-95 duration-200">
              <AlertTriangle size={14} className="text-red-600 mt-0.5" />
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-relaxed">
                Error: {msg}
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="pt-4 space-y-6">
            <button className="w-full py-5 bg-[#c5a36b] hover:bg-[#d4b582] text-[#050505] font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3">
              Sign In
            </button>

            <div className="flex justify-between items-center border-t-2 border-[#1a1a1a] pt-6">
              <p className="text-[10px] font-black text-[#666] uppercase tracking-widest">
                New here?
              </p>
              <Link
                to="/signup"
                className="text-[10px] font-black text-[#c5a36b] hover:text-white uppercase tracking-widest transition-colors underline decoration-2 underline-offset-4"
              >
                Create Account
              </Link>
            </div>
          </div>
        </form>

        {/* TERMINAL FOOTER DECOR */}
        <div className="bg-[#0c0c0c] border-t-2 border-[#1a1a1a] px-8 py-3 text-right">
          <span className="text-[8px] font-black text-[#555] uppercase tracking-[0.5em]">
            Secure Connection
          </span>
        </div>
      </div>
    </div>
  );
}