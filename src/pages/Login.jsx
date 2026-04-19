import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";

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
      setMsg(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-6">
      <form
        onSubmit={handleLogin}
        className="bg-card p-8 rounded-2xl w-full max-w-md space-y-4"
      >
        <h1 className="text-3xl font-bold text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-slate-800 rounded-lg"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-slate-800 rounded-lg text-sm"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full py-3 bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#0f172a] rounded-lg font-bold transition-all shadow-lg active:scale-[0.98]">
          Login
        </button>

        <p className="text-sm text-center text-red-400">{msg}</p>

        <p className="text-center text-sm">
          New user?{" "}
          <Link to="/signup" className="text-primary">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}