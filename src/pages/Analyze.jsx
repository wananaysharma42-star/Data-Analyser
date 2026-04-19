import { useMemo, useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { useData } from "../context/DataContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";
import { Activity, LayoutGrid, PieChart as PieIcon, BarChart3, ShieldCheck } from "lucide-react";

export default function Analyze() {
  const { selectedData, user } = useData();
  const [column, setColumn] = useState("");

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`app_${user.id}_analyze_column`);
      if (saved) setColumn(saved);
    }
  }, [user]);

  useEffect(() => {
    if (user && column) {
      localStorage.setItem(`app_${user.id}_analyze_column`, column);
    }
  }, [column, user]);

  const columns = selectedData[0] ? Object.keys(selectedData[0]) : [];

  const chartData = useMemo(() => {
    if (!column) return [];
    const counts = {};
    selectedData.forEach((row) => {
      const key = row[column] || "Empty Value";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, [column, selectedData]);

  const missingValues = useMemo(() => {
    return columns.map((col) => {
      const missing = selectedData.filter((row) => {
        const value = row[col];
        return value === undefined || value === null || value === "";
      }).length;
      return { col, missing };
    });
  }, [columns, selectedData]);

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#bbb] selection:bg-[#c5a36b]/20">
      <Navbar />

      <main className="max-w-7xl mx-auto p-8 space-y-10">

        {/* Section Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between py-6 border-b-2 border-[#1a1a1a]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Activity size={14} className="text-[#c5a36b]" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#777]">Analytical System</p>
            </div>
            <h1 className="text-4xl font-bold text-[#fcfcfc] tracking-tight italic">Exploratory Data Analysis</h1>
          </div>
          <div className="text-[10px] font-black text-[#666] uppercase tracking-[0.4em]">
            Status: Ready
          </div>
        </header>

        {columns.length === 0 ? (
          <div className="border-2 border-dashed border-[#1a1a1a] p-24 text-center bg-[#080808]/50">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#666] italic">
              Missing input data. Dataset required for visualization.
            </p>
          </div>
        ) : (
          <>
            {/* Control Bar: Industrial Style */}
            <div className="flex items-center gap-6 bg-[#0c0c0c] border-2 border-[#1a1a1a] p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-[#c5a36b]" />
                <label className="text-[11px] font-black text-[#888] uppercase tracking-widest">Select Target Feature</label>
              </div>
              <select
                value={column}
                onChange={(e) => setColumn(e.target.value)}
                className="bg-[#050505] border-2 border-[#1a1a1a] text-[#eee] text-[11px] font-bold px-4 py-2 outline-none focus:border-[#c5a36b] transition-colors cursor-pointer uppercase tracking-tighter"
              >
                <option value="">Select Column</option>
                {columns.map((col, index) => (
                  <option key={index} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div className="grid lg:grid-cols-3 gap-0 border-2 border-[#1a1a1a] bg-[#080808] divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-[#1a1a1a]">

              {/* Audit Sidebar */}
              <aside className="flex flex-col h-[800px]">
                <div className="bg-[#0c0c0c] px-6 py-4 border-b-2 border-[#1a1a1a]">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#eee]">Null Value Audit</h2>
                </div>
                <div className="p-6 overflow-y-auto space-y-1 divide-y-2 divide-[#141414]">
                  {missingValues.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 group hover:bg-[#0c0c0c] px-2 transition-colors">
                      <span className="text-xs font-bold text-[#888] group-hover:text-[#aaa]">{item.col}</span>
                      <span className={`text-xs font-mono font-bold ${item.missing > 0 ? 'text-red-900' : 'text-emerald-900'}`}>
                        {item.missing.toString().padStart(4, '0')}
                      </span>
                    </div>
                  ))}
                </div>
              </aside>

              {/* Visualization Mainframe */}
              <div className="lg:col-span-2 divide-y-2 divide-[#1a1a1a]">
                {chartData.length > 0 ? (
                  <>
                    {/* Bar Chart Unit */}
                    <div className="p-10 h-[400px]">
                      <div className="flex items-center gap-3 mb-8">
                        <BarChart3 size={16} className="text-[#c5a36b]" />
                        <h3 className="text-[10px] font-black text-[#888] uppercase tracking-[0.3em]">Frequency Distribution</h3>
                      </div>
                      <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={chartData}>
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
                            cursor={{ fill: '#1a1a1a' }}
                            contentStyle={{ backgroundColor: '#0c0c0c', border: '2px solid #1a1a1a', borderRadius: '0', fontSize: '10px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#c5a36b' }}
                          />
                          <Bar dataKey="value" fill="#c5a36b" shape={<Rectangle />} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Pie Chart Unit */}
                    <div className="p-10 h-[400px]">
                      <div className="flex items-center gap-3 mb-8">
                        <PieIcon size={16} className="text-[#c5a36b]" />
                        <h3 className="text-[10px] font-black text-[#888] uppercase tracking-[0.3em]">Category Composition</h3>
                      </div>
                      <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            dataKey="value"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={0}
                            stroke="#080808"
                            strokeWidth={4}
                          >
                            {chartData.map((_, i) => (
                              <Cell
                                key={i}
                                fill={["#c5a36b", "#8e754d", "#555555", "#333333", "#1a1a1a"][i % 5]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0c0c0c', border: '2px solid #1a1a1a', borderRadius: '0', fontSize: '10px', fontWeight: 'bold' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20">
                    <LayoutGrid size={48} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting input parameters</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <footer className="pt-8 border-t-2 border-[#1a1a1a] flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-[#555]">
          <p>Visualization System</p>
          <p>System Active</p>
        </footer>
      </main>
    </div>
  );
}

/* Custom bar shape to keep it sharp and square */
const Rectangle = (props) => {
  const { fill, x, y, width, height } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} />;
};