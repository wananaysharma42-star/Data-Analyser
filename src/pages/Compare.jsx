import { useMemo, useEffect } from "react";
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
import { Activity, Target, Layers, BarChart3, Binary } from "lucide-react";

export default function Compare() {
  const { selectedData, compareSettings, setCompareSettings } = useData();
  const { col1, col2 } = compareSettings;

  const setCol1 = (val) => setCompareSettings(prev => ({ ...prev, col1: val }));
  const setCol2 = (val) => setCompareSettings(prev => ({ ...prev, col2: val }));

  const columns = selectedData[0] ? Object.keys(selectedData[0]) : [];

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
  const correlationValue = values1.length > 1 ? correlation(values1, values2) : null;
  const score = typeof correlationValue === 'number' ? correlationValue.toFixed(4) : null;

  const summaryData = [
    { name: col1 || "Variable A", value: values1.length },
    { name: col2 || "Variable B", value: values2.length },
  ];

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#bbb] selection:bg-[#c5a36b]/20">
      <Navbar />

      <main className="max-w-7xl mx-auto p-8 space-y-10">

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between py-6 border-b-2 border-[#1a1a1a]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Activity size={14} className="text-[#c5a36b]" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#777]">Bivariate Analysis</p>
            </div>
            <h1 className="text-4xl font-bold text-[#fcfcfc] tracking-tight">Correlation Analysis</h1>
          </div>
          <div className="text-[10px] font-black text-[#666] uppercase tracking-[0.4em]">
            Mode: Linear Regression
          </div>
        </header>

        {columns.length === 0 ? (
          <div className="border-2 border-dashed border-[#1a1a1a] p-24 text-center bg-[#080808]/50">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#666] italic">
              Missing primary dataset. Mount resources to begin comparison.
            </p>
          </div>
        ) : (
          <div className="space-y-10">

            {/* Variable Selection Grid */}
            <div className="grid md:grid-cols-2 gap-0 border-2 border-[#1a1a1a] bg-[#0c0c0c] divide-x-2 divide-[#1a1a1a]">
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Target size={14} className="text-[#c5a36b]" />
                  <label className="text-[11px] font-black text-[#888] uppercase tracking-widest text-white">X Axis Variable</label>
                </div>
                <select
                  value={col1}
                  onChange={(e) => setCol1(e.target.value)}
                  className="w-full bg-[#050505] border-2 border-[#1a1a1a] text-[#eee] text-[11px] font-bold px-4 py-3 outline-none focus:border-[#c5a36b] transition-colors uppercase"
                >
                  <option value="">Select Feature A</option>
                  {columns.map((col, i) => <option key={i} value={col}>{col}</option>)}
                </select>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Layers size={14} className="text-[#c5a36b]" />
                  <label className="text-[11px] font-black text-[#888] uppercase tracking-widest text-white">Y Axis Variable</label>
                </div>
                <select
                  value={col2}
                  onChange={(e) => setCol2(e.target.value)}
                  className="w-full bg-[#050505] border-2 border-[#1a1a1a] text-[#eee] text-[11px] font-bold px-4 py-3 outline-none focus:border-[#c5a36b] transition-colors uppercase"
                >
                  <option value="">Select Feature B</option>
                  {columns.map((col, i) => <option key={i} value={col}>{col}</option>)}
                </select>
              </div>
            </div>

            {/* Pearson Coefficient Output */}
            <div className="bg-[#080808] border-2 border-[#1a1a1a] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Binary size={18} className="text-[#c5a36b]" />
                  <h2 className="text-[10px] font-black text-[#777] uppercase tracking-[0.3em]">Pearson Correlation Coefficient</h2>
                </div>
                {numericPairs.length > 1 ? (
                  <div className="flex items-baseline gap-6">
                    <span className="text-6xl font-black text-[#fcfcfc] tabular-nums tracking-tighter">{score}</span>
                    <div className="px-3 py-1 bg-emerald-900/10 border border-emerald-900 text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                      Valid Calculation
                    </div>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-[#555] uppercase tracking-widest italic">Awaiting Sufficient Data</span>
                )}
              </div>

              <div className="max-w-sm p-6 border-l-2 border-[#1a1a1a]">
                <p className="text-[11px] font-bold text-[#777] leading-relaxed uppercase tracking-wider">
                  Linear relationship strength where <span className="text-[#bbb]">1.0000</span> indicates absolute positive correlation and <span className="text-[#bbb]">0.0000</span> indicates stochastic variance.
                </p>
              </div>
            </div>

            {/* Visualization Grid */}
            {numericPairs.length > 1 && (
              <div className="grid lg:grid-cols-2 gap-0 border-2 border-[#1a1a1a] bg-[#080808] divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-[#1a1a1a]">
                <div className="p-10 h-[450px]">
                  <div className="flex items-center gap-3 mb-8">
                    <Activity size={16} className="text-[#c5a36b]" />
                    <h3 className="text-[10px] font-black text-[#888] uppercase tracking-[0.3em]">Scatter Distribution</h3>
                  </div>
                  <ResponsiveContainer width="100%" height="80%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="0" stroke="#1a1a1a" />
                      <XAxis
                        dataKey="x"
                        stroke="#666"
                        fontSize={9}
                        fontWeight="bold"
                        tickLine={false}
                        axisLine={{ stroke: '#1a1a1a', strokeWidth: 2 }}
                      />
                      <YAxis
                        dataKey="y"
                        stroke="#666"
                        fontSize={9}
                        fontWeight="bold"
                        tickLine={false}
                        axisLine={{ stroke: '#1a1a1a', strokeWidth: 2 }}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0c0c0c', border: '2px solid #1a1a1a', borderRadius: '0', fontSize: '10px', fontWeight: 'bold' }}
                      />
                      <Scatter data={numericPairs} fill="#c5a36b" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-10 h-[450px]">
                  <div className="flex items-center gap-3 mb-8">
                    <BarChart3 size={16} className="text-[#c5a36b]" />
                    <h3 className="text-[10px] font-black text-[#888] uppercase tracking-[0.3em]">Observation Volume</h3>
                  </div>
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={summaryData}>
                      <CartesianGrid strokeDasharray="0" stroke="#1a1a1a" vertical={false} />
                      <XAxis
                        dataKey="name"
                        stroke="#666"
                        fontSize={9}
                        fontWeight="bold"
                        tickLine={false}
                        axisLine={{ stroke: '#1a1a1a', strokeWidth: 2 }}
                      />
                      <YAxis
                        stroke="#666"
                        fontSize={9}
                        fontWeight="bold"
                        tickLine={false}
                        axisLine={{ stroke: '#1a1a1a', strokeWidth: 2 }}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0c0c0c', border: '2px solid #1a1a1a', borderRadius: '0', fontSize: '10px', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="value" fill="#1a1a1a" stroke="#333" strokeWidth={2} barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        <footer className="pt-8 border-t-2 border-[#1a1a1a] flex justify-between items-center text-[10px] font-black uppercase tracking-[0.5em] text-[#777]">
          <p>Analytical System - Comparison Module</p>
          <p>Local Buffer Verified</p>
        </footer>
      </main>
    </div>
  );
}