import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";
import { UserPlus, ShieldAlert, Fingerprint, Mail, Lock } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
        },
      },
    });

    if (error) {
      setMsg("Error: " + error.message.toUpperCase());
    } else {
      setMsg("Account created. Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#bbb] flex justify-center items-center px-6">

      {/* REGISTRATION TERMINAL FRAME */}
      <div className="w-full max-w-md border-2 border-[#1a1a1a] bg-[#080808] relative overflow-hidden">

        {/* TOP STATUS BAR */}
        <div className="bg-[#0c0c0c] border-b-2 border-[#1a1a1a] px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Fingerprint size={14} className="text-[#c5a36b]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#eee]">Create Account</span>
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-[#c5a36b]/20"></div>
            <div className="w-1.5 h-1.5 bg-[#c5a36b]/40"></div>
            <div className="w-1.5 h-1.5 bg-[#c5a36b] animate-pulse"></div>
          </div>
        </div>

        <form onSubmit={handleSignup} className="p-10 space-y-8">

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[#fcfcfc] uppercase tracking-tighter italic leading-none">
              Sign Up
            </h1>
            <p className="text-[10px] font-bold text-[#777] uppercase tracking-widest border-l-2 border-[#1a1a1a] pl-4">
              Create your account to get started.
            </p>
          </div>

          <div className="space-y-5">
            {/* NAME INPUT */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#888] uppercase tracking-[0.2em] flex items-center gap-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full p-4 bg-[#050505] border-2 border-[#1a1a1a] text-[#eee] text-xs font-bold outline-none focus:border-[#c5a36b] transition-colors placeholder:text-[#555] uppercase"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            {/* EMAIL INPUT */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#888] uppercase tracking-[0.2em]">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="Email"
                className="w-full p-4 bg-[#050505] border-2 border-[#1a1a1a] text-[#eee] text-xs font-bold outline-none focus:border-[#c5a36b] transition-colors placeholder:text-[#555] uppercase"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#888] uppercase tracking-[0.2em]">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Min 8 characters"
                className="w-full p-4 bg-[#050505] border-2 border-[#1a1a1a] text-[#eee] text-xs font-bold outline-none focus:border-[#c5a36b] transition-colors placeholder:text-[#555]"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          {/* SYSTEM FEEDBACK */}
          {msg && (
            <div className={`flex items-start gap-3 p-4 border-2 ${msg.includes('Error') ? 'bg-red-950/10 border-red-900/50 text-red-500' : 'bg-emerald-950/10 border-emerald-900/50 text-emerald-500'}`}>
              <ShieldAlert size={14} className="mt-0.5" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">
                {msg}
              </p>
            </div>
          )}

          {/* ACTION CLUSTER */}
          <div className="pt-4 space-y-6">
            <button className="w-full py-5 bg-[#c5a36b] hover:bg-[#d4b582] text-[#050505] font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3">
              <UserPlus size={14} />
              Create Account
            </button>

            <div className="flex justify-between items-center border-t-2 border-[#1a1a1a] pt-6">
              <p className="text-[10px] font-black text-[#666] uppercase tracking-widest">
                Already have an account?
              </p>
              <Link
                to="/login"
                className="text-[10px] font-black text-[#c5a36b] hover:text-white uppercase tracking-widest transition-colors underline decoration-2 underline-offset-4"
              >
                Sign In
              </Link>
            </div>
          </div>
        </form>

        {/* TERMINAL FOOTER */}
        <div className="bg-[#0c0c0c] border-t-2 border-[#1a1a1a] px-8 py-3 text-right">
          <span className="text-[8px] font-black text-[#555] uppercase tracking-[0.5em]">
            System Status: Secure
          </span>
        </div>
      </div>
    </div>
  );
}