import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabase";

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
      setMsg(error.message);
    } else {
      setMsg("Account created successfully. Accessing kernel...");
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-6">
      <form
        onSubmit={handleSignup}
        className="bg-card p-8 rounded-2xl w-full max-w-md space-y-4"
      >
        <h1 className="text-3xl font-bold text-center">Sign Up</h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 bg-slate-800 rounded-lg"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-slate-800 rounded-lg"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-slate-800 rounded-lg"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full py-3 bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#0f172a] rounded-lg font-bold transition-all shadow-lg active:scale-[0.98]">
          Create Account
        </button>

        <p className="text-sm text-center text-slate-400">{msg}</p>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}