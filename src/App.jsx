import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Analyze from "./pages/Analyze";
import Compare from "./pages/Compare";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AIInsights from "./pages/AIInsights";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Signup from "./pages/Signup";
import TwoSampleTest from "./pages/TwoSampleTest";

export default function App() {
  const protect = (page) => <ProtectedRoute>{page}</ProtectedRoute>;

  /**
   * INDUSTRIAL STATISTICAL SYSTEM STYLE SCHEMATIC
   * Language: Brutalist / High-Contrast / Analytical
   */
  const styles = {
    // Pure Black Background - High visibility for data viz
    container: "min-h-screen bg-[#050505] text-[#999] font-sans antialiased selection:bg-[#c5a36b]/20",

    // Rigid 2px Dark Borders - No rounding (Industrial Standard)
    card: "bg-[#080808] border-2 border-[#1a1a1a] p-8 shadow-none",

    // Champagne Gold Accent - High contrast against dark surfaces
    button: "bg-[#c5a36b] hover:bg-[#d4b582] text-[#050505] font-black py-4 px-8 uppercase tracking-[0.3em] transition-all text-[11px]",

    // Technical Labeling - Heavy tracking, dimmed for hierarchy
    secondaryText: "text-[#444] text-[10px] font-black uppercase tracking-[0.4em]"
  };

  return (
    <div className={styles.container}>
      {/* EXPANSIVE WORKSPACE ARCHITECTURE:
        Removed default global padding to allow Navbar and high-density 
        modules to utilize the full display width.
      */}
      <main className="relative">
        <Routes>
          {/* Public Authentication Gateways */}
          <Route path="/" element={<Home styles={styles} />} />
          <Route path="/signup" element={<Signup styles={styles} />} />
          <Route path="/login" element={<Login styles={styles} />} />

          {/* Secure Kernel Modules */}
          <Route path="/dashboard" element={protect(<Dashboard styles={styles} />)} />
          <Route path="/upload" element={protect(<Upload styles={styles} />)} />
          <Route path="/analyze" element={protect(<Analyze styles={styles} />)} />
          <Route path="/compare" element={protect(<Compare styles={styles} />)} />
          <Route path="/two-sample-test" element={protect(<TwoSampleTest styles={styles} />)} />
          <Route path="/reports" element={protect(<Reports styles={styles} />)} />
          <Route path="/settings" element={protect(<Settings styles={styles} />)} />
          <Route path="/ai" element={protect(<AIInsights styles={styles} />)} />

          {/* Fallback Protocol */}
          <Route path="*" element={<NotFound styles={styles} />} />
        </Routes>
      </main>
    </div>
  );
}