import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-slate-400 mb-6">Page not found</p>

      <Link
        to="/"
        className="px-6 py-3 bg-primary text-black rounded-xl font-bold"
      >
        Go Home
      </Link>
    </div>
  );
}