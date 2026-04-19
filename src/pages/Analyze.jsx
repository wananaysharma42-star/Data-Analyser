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
      const key = row[column] || "Empty";
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
    <div className="min-h-screen bg-[#0d1117] font-mono text-[#c9d1d9] selection:bg-[#764abc]/30">
      <Navbar />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="border-b border-[#30363d] pb-4">
          <h1 className="text-xl font-bold tracking-tight uppercase">Exploratory_Data_Analysis</h1>
          <p className="text-[#8b949e] text-[10px] mt-1 tracking-widest uppercase">Kernel: Visualization_Engine_v1.0</p>
        </div>

        {columns.length === 0 ? (
          <div className="bg-[#161b22] border border-[#30363d] p-10 rounded-md text-center">
            <p className="text-[#8b949e] italic">[!] Input stream empty. Please upload a dataset to initialize analysis.</p>
          </div>
        ) : (
          <>
            {/* Control Bar */}
            <div className="flex items-center gap-4 bg-[#161b22] border border-[#30363d] p-4 rounded-md">
              <label className="text-xs font-bold text-[#764abc] uppercase">Target_Column:</label>
              <select
                value={column}
                onChange={(e) => setColumn(e.target.value)}
                className="bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-xs p-2 rounded outline-none focus:border-[#764abc] transition-colors cursor-pointer"
              >
                <option value="">-- SELECT_FEATURE --</option>
                {columns.map((col, index) => (
                  <option key={index} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 items-start">
              {/* Missing Values Table (Left Sidebar Style) */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-md overflow-hidden">
                <div className="bg-[#0d1117] px-4 py-2 border-b border-[#30363d]">
                  <h2 className="text-[10px] font-black uppercase tracking-widest">Null_Value_Audit</h2>
                </div>
                <div className="p-4 max-h-[600px] overflow-y-auto">
                  <div className="space-y-1">
                    {missingValues.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px] hover:bg-[#30363d]/30 p-1 rounded transition-colors group">
                        <span className="text-[#8b949e] group-hover:text-[#c9d1d9]">{item.col}</span>
                        <span className={`font-bold ${item.missing > 0 ? 'text-rose-400' : 'text-emerald-500'}`}>
                          {item.missing}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart Visualizations (Main Area) */}
              <div className="lg:col-span-2 space-y-6">
                {chartData.length > 0 ? (
                  <>
                    {/* Bar Chart Section */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6 h-[400px]">
                      <h3 className="text-[10px] font-bold text-[#8b949e] uppercase mb-6 tracking-widest">Frequency_Distribution_Plot</h3>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#8b949e" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={{ stroke: '#30363d' }}
                          />
                          <YAxis 
                            stroke="#8b949e" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={{ stroke: '#30363d' }}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '4px', fontSize: '12px' }}
                            itemStyle={{ color: '#764abc' }}
                          />
                          <Bar dataKey="value" fill="#764abc" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Pie Chart Section */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-md p-6 h-[400px]">
                      <h3 className="text-[10px] font-bold text-[#8b949e] uppercase mb-6 tracking-widest">Category_Composition_Map</h3>
                      <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            dataKey="value"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            stroke="#161b22"
                            strokeWidth={2}
                          >
                            {chartData.map((_, i) => (
                              <Cell
                                key={i}
                                fill={
                                  ["#764abc", "#8a5ad4", "#484f58", "#30363d", "#21262d"][i % 5]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '4px', fontSize: '12px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center bg-[#161b22]/30 border border-[#30363d] border-dashed rounded-md p-20">
                    <p className="text-[#8b949e] text-xs uppercase tracking-tighter italic">Select a column to generate visual output...</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}