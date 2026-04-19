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

  // JUPYTER DARK THEME CLASSES
  const styles = {
    // Deep charcoal background, monospaced font for a "code editor" feel
    container: "min-h-screen bg-[#0d1117] text-[#c9d1d9] font-mono antialiased",
    // Darker surface with a sharp, defined border (common in IDEs)
    card: "bg-[#161b22] border border-[#30363d] rounded-md p-6 shadow-none",
    // Purple accent color common in Jupyter branding
    button: "bg-[#764abc] hover:bg-[#8a5ad4] text-white font-bold py-2 px-4 rounded-md transition-colors border border-[#8a5ad4]/20",
    // Dimmed text for metadata and secondary labels
    secondaryText: "text-[#8b949e] text-xs uppercase tracking-tight"
  };

  return (
    <div className={styles.container}>
      {/* The 'max-w-screen-2xl' is used here to give a wide, 
        expansive workspace feel typical of data science tools. 
      */}
      <main className="mx-auto p-4 md:p-6">
        <Routes>
          <Route path="/" element={<Home styles={styles} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login styles={styles} />} />

          <Route path="/dashboard" element={protect(<Dashboard styles={styles} />)} />
          <Route path="/upload" element={protect(<Upload styles={styles} />)} />
          <Route path="/analyze" element={protect(<Analyze styles={styles} />)} />
          <Route path="/compare" element={protect(<Compare styles={styles} />)} />
          <Route path="/two-sample-test" element={protect(<TwoSampleTest styles={styles} />)} />
          <Route path="/reports" element={protect(<Reports styles={styles} />)} />
          <Route path="/settings" element={protect(<Settings styles={styles} />)} />
          <Route path="/ai" element={protect(<AIInsights styles={styles} />)} />

          <Route path="*" element={<NotFound styles={styles} />} />
        </Routes>
      </main>
    </div>
  );
}