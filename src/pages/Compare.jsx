import { useMemo, useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { useData } from "../context/DataContext";
import { correlation } from "../utils/correlation";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export default function Compare() {
  const { selectedData, user } = useData();

  const [col1, setCol1] = useState("");
  const [col2, setCol2] = useState("");

  useEffect(() => {
    if (user) {
      setCol1(localStorage.getItem(`app_${user.id}_compare_col1`) || "");
      setCol2(localStorage.getItem(`app_${user.id}_compare_col2`) || "");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`app_${user.id}_compare_col1`, col1);
    }
  }, [col1, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`app_${user.id}_compare_col2`, col2);
    }
  }, [col2, user]);

  const columns = selectedData[0] ? Object.keys(selectedData[0]) : [];

  /* ---------- SECTION 1: COLUMN COMPARISON ---------- */
  const numericPairs = useMemo(() => {
    if (!col1 || !col2) return [];
    return selectedData
      .map((row) => ({
        x: Number(row[col1]),
        y: Number(row[col2]),
      }))
      .filter((item) => !isNaN(item.x) && !isNaN(item.y));
  }, [selectedData, col1, col2]);

  const values1 = numericPairs.map((item) => item.x);
  const values2 = numericPairs.map((item) => item.y);
  const score = values1.length > 1 ? correlation(values1, values2) : null;

  const summaryData = [
    { name: col1 || "Col 1", value: values1.length },
    { name: col2 || "Col 2", value: values2.length },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] font-mono text-[#c9d1d9] selection:bg-[#764abc]/30">
      <Navbar />

      <div className="p-6 space-y-12 max-w-7xl mx-auto">
        
        {/* SECTION 1: COLUMN CORRELATION LAB */}
        <section className="space-y-6">
          <div className="flex items-baseline gap-3 border-b border-[#30363d] pb-2">
            <h1 className="text-xl font-bold uppercase">Column_Correlation_Lab</h1>
            <span className="text-[10px] text-[#8b949e]">Internal_Dataset_Analyzer</span>
          </div>

          {columns.length === 0 ? (
            <p className="text-[#8b949e] italic text-sm">[!] Initial dataset missing. Please mount CSV in 'Upload'.</p>
          ) : (
            <div className="space-y-6">
              {/* Input Group */}
              <div className="grid md:grid-cols-2 gap-4 bg-[#161b22] p-4 border border-[#30363d] rounded-md">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-[#8b949e] font-bold">X_AXIS_VARIABLE</label>
                  <select
                    value={col1}
                    onChange={(e) => setCol1(e.target.value)}
                    className="bg-[#0d1117] border border-[#30363d] p-2 text-xs rounded outline-none focus:border-[#764abc]"
                  >
                    <option value="">-- SELECT_FEATURE_1 --</option>
                    {columns.map((col, i) => <option key={i} value={col}>{col}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-[#8b949e] font-bold">Y_AXIS_VARIABLE</label>
                  <select
                    value={col2}
                    onChange={(e) => setCol2(e.target.value)}
                    className="bg-[#0d1117] border border-[#30363d] p-2 text-xs rounded outline-none focus:border-[#764abc]"
                  >
                    <option value="">-- SELECT_FEATURE_2 --</option>
                    {columns.map((col, i) => <option key={i} value={col}>{col}</option>)}
                  </select>
                </div>
              </div>

              {/* Statistics Output Cell */}
              <div className="bg-[#010409] border border-[#30363d] p-6 rounded-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-[8px] text-[#30363d] font-bold">CALC_ENGINE_v2</div>
                {numericPairs.length > 1 ? (
                  <div className="flex flex-col md:flex-row md:items-center gap-8">
                    <div>
                      <p className="text-[10px] text-[#8b949e] font-bold mb-1 uppercase tracking-widest">Pearson_Correlation</p>
                      <span className="text-3xl font-black text-[#764abc]">{score}</span>
                    </div>
                    <div className="text-xs text-[#8b949e] max-w-xs italic leading-tight border-l border-[#30363d] pl-4">
                      Linear relationship strength where 1.0 is absolute positive and 0.0 is stochastic noise.
                    </div>
                  </div>
                ) : (
                  <p className="text-[#8b949e] text-xs italic">Waiting for valid numeric feature pair...</p>
                )}
              </div>

              {/* Charts Grid */}
              {numericPairs.length > 1 && (
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-md h-[400px]">
                    <h3 className="text-[10px] font-bold text-[#8b949e] uppercase mb-4 tracking-widest">Scatter_Distribution_Plot</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="2 2" stroke="#30363d" />
                        <XAxis dataKey="x" stroke="#8b949e" fontSize={10} tickLine={false} />
                        <YAxis dataKey="y" stroke="#8b949e" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{backgroundColor: '#161b22', border: '1px solid #30363d'}} />
                        <Scatter data={numericPairs} fill="#764abc" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] p-5 rounded-md h-[400px]">
                    <h3 className="text-[10px] font-bold text-[#8b949e] uppercase mb-4 tracking-widest">Observation_Count_Audit</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <BarChart data={summaryData}>
                        <CartesianGrid strokeDasharray="2 2" stroke="#30363d" vertical={false} />
                        <XAxis dataKey="name" stroke="#8b949e" fontSize={10} tickLine={false} />
                        <YAxis stroke="#8b949e" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{backgroundColor: '#161b22', border: '1px solid #30363d'}} />
                        <Bar dataKey="value" fill="#484f58" barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}