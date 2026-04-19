import { useState, useRef, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { useData } from "../context/DataContext";
import Papa from "papaparse";
import { preprocessTwoSampleData } from "../utils/preprocess";
import { buildAIContext } from "../utils/aiPromptBuilder";
import PDFReportView from "../components/reports/PDFReportView";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Activity, Database, Cpu, Send, Save, RefreshCcw } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function TwoSampleTest() {
  const { 
    addReport, 
    twoSampleData, 
    setTwoSampleData,
    twoSampleReport,
    setTwoSampleReport,
    twoSampleChat,
    setTwoSampleChat
  } = useData();
  
  const { datasetA, datasetB, sampleColA, sampleColB } = twoSampleData;
  const [reportStatus, setReportStatus] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Use context states for persistence
  const chatHistory = twoSampleChat;
  const setChatHistory = setTwoSampleChat;
  const generatedReport = twoSampleReport;
  const setGeneratedReport = setTwoSampleReport;

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, aiLoading]);

  const setDatasetA = (data) => setTwoSampleData((prev) => ({ ...prev, datasetA: data }));
  const setDatasetB = (data) => setTwoSampleData((prev) => ({ ...prev, datasetB: data }));
  const setSampleColA = (col) => setTwoSampleData((prev) => ({ ...prev, sampleColA: col }));
  const setSampleColB = (col) => setTwoSampleData((prev) => ({ ...prev, sampleColB: col }));

  const parseFile = (file, setter) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => setter(results.data),
    });
  };

  const colsA = datasetA[0] ? Object.keys(datasetA[0]) : [];
  const colsB = datasetB[0] ? Object.keys(datasetB[0]) : [];

  const getNums = (data, col) =>
    data.map((row) => Number(row[col])).filter((val) => !isNaN(val));

  const numsA = sampleColA ? getNums(datasetA, sampleColA) : [];
  const numsB = sampleColB ? getNums(datasetB, sampleColB) : [];

  const mean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const variance = (arr, avg) =>
    arr.length > 1 ? arr.reduce((sum, val) => sum + (val - avg) ** 2, 0) / (arr.length - 1) : 0;

  const avgA = mean(numsA);
  const avgB = mean(numsB);
  const varA = variance(numsA, avgA);
  const varB = variance(numsB, avgB);

  let tScore = null;
  if (numsA.length > 1 && numsB.length > 1) {
    tScore = ((avgA - avgB) / Math.sqrt(varA / numsA.length + varB / numsB.length)).toFixed(4);
  }

  const sampleChart = [
    { name: "Mean A", value: Number(avgA.toFixed(2)) },
    { name: "Mean B", value: Number(avgB.toFixed(2)) },
  ];

  const handleGenerateReport = () => {
    if (!tScore) return;
    const profile = { avgA, avgB, tScore, targetA: sampleColA, targetB: sampleColB, sizeA: datasetA.length, sizeB: datasetB.length };
    const summary = preprocessTwoSampleData(datasetA, datasetB, profile);
    setGeneratedReport({ type: "TWO_SAMPLE", summary, chatHistory: [] });
    setChatHistory([]);
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    const inputField = e.target.elements[0];
    const input = inputField.value.trim();
    if (!input || !generatedReport) return;
    
    const newUserMsg = { role: "user", text: input };
    setChatHistory((prev) => [...prev, newUserMsg]);
    inputField.value = "";
    setAiLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setChatHistory((prev) => [...prev, { role: "ai", text: "Error: API Key Missing" }]);
      setAiLoading(false);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const context = buildAIContext(generatedReport.summary, "TWO_SAMPLE");
      const prompt = `${context}\nUSER_QUESTION: ${input}\nANSWER_PROTOCOL: Technical, data-driven, concise.`;
      const result = await model.generateContent(prompt);
      const aiText = result.response.text();
      setChatHistory((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: "ai", text: `Error: ${error.message.toUpperCase()}` }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveToHistory = async () => {
    if (!generatedReport) return;
    const reportToSave = { ...generatedReport, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
    await addReport(reportToSave);
    setReportStatus("Report Saved Successfully");
    setTimeout(() => setReportStatus(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#bbb] selection:bg-[#c5a36b]/20">
      <Navbar />

      <div className="p-8 max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between py-6 border-b-2 border-[#1a1a1a]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Activity size={14} className="text-emerald-500" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#777]">Statistical Analysis System</p>
            </div>
            <h1 className="text-4xl font-bold text-[#fcfcfc] tracking-tight">Two Sample Testing</h1>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-[10px] font-black text-[#666] uppercase tracking-[0.4em]">
              System Status: Verified
            </div>
            <div className="text-[8px] font-black text-emerald-900 uppercase tracking-[0.3em]">
              Storage Integrity: 100% Persisted
            </div>
          </div>
        </header>

        {generatedReport && (
          <div className="grid lg:grid-cols-2 gap-0 border-2 border-[#1a1a1a] bg-[#080808] divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-[#1a1a1a]">
            {/* Report Preview */}
            <div className="p-8 h-[800px] overflow-hidden flex flex-col bg-[#050505]">
              <div className="flex items-center gap-3 mb-6">
                <Database size={16} className="text-[#c5a36b]" />
                <h3 className="text-[10px] font-black text-[#888] uppercase tracking-[0.3em]">Document Preview</h3>
              </div>
              <div className="flex-1 overflow-y-auto border-2 border-[#1a1a1a] p-1 bg-[#0c0c0c]">
                <PDFReportView reportData={{...generatedReport, chatHistory}} />
              </div>
            </div>

            {/* AI Terminal */}
            <div className="flex flex-col h-[800px] bg-[#080808]">
              <div className="p-6 border-b-2 border-[#1a1a1a] flex justify-between items-center bg-[#0c0c0c]">
                <div className="flex items-center gap-3">
                  <Cpu size={16} className="text-emerald-500" />
                  <h3 className="text-[10px] font-black text-[#eee] uppercase tracking-[0.4em]">AI Statistical Analysis</h3>
                </div>
                <span className="text-[9px] font-black text-[#666] tracking-[0.2em]">Model: Gemini 2.0</span>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#050505]">
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                    <Database size={40} className="mb-4" />
                    <p className="text-[10px] uppercase font-black tracking-[0.4em]">Standby for Inquiry</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] p-4 text-[11px] font-bold uppercase tracking-tight leading-relaxed border-2 ${msg.role === 'user' ? 'bg-[#0c0c0c] border-[#1a1a1a] text-[#fcfcfc]' : 'bg-[#080808] border-[#c5a36b]/30 text-[#c5a36b]'
                      }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {aiLoading && <div className="text-[10px] font-black text-emerald-500 animate-pulse uppercase tracking-[0.4em] p-4">Processing Hypothesis</div>}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleAskAI} className="p-6 border-t-2 border-[#1a1a1a] bg-[#0c0c0c]">
                <div className="flex gap-0 border-2 border-[#1a1a1a]">
                  <input
                    type="text"
                    placeholder="Enter Inquiry"
                    className="flex-1 bg-transparent p-4 text-[11px] font-bold uppercase outline-none focus:text-emerald-500 transition-colors placeholder:text-[#555]"
                  />
                  <button type="submit" disabled={aiLoading} className="px-8 bg-emerald-600 hover:bg-emerald-500 text-[#050505] font-black text-[11px] uppercase tracking-widest transition-all">
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Data Mounting Controls */}
        <div className="grid md:grid-cols-2 gap-0 border-2 border-[#1a1a1a] bg-[#0c0c0c] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#1a1a1a]">
          <div className="p-8 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black text-[#888] uppercase tracking-widest block">Mount Dataset A</label>
              {datasetA.length > 0 && <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">Data Loaded from Memory</span>}
            </div>
            <input type="file" accept=".csv" onChange={(e) => parseFile(e.target.files[0], setDatasetA)}
              className="w-full text-[10px] text-[#777] file:mr-4 file:py-3 file:px-6 file:border-2 file:border-[#1a1a1a] file:bg-[#050505] file:text-[#eee] file:font-black file:uppercase file:cursor-pointer hover:file:border-[#c5a36b] transition-all"
            />
          </div>
          <div className="p-8 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black text-[#888] uppercase tracking-widest block">Mount Dataset B</label>
              {datasetB.length > 0 && <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">Data Loaded from Memory</span>}
            </div>
            <input type="file" accept=".csv" onChange={(e) => parseFile(e.target.files[0], setDatasetB)}
              className="w-full text-[10px] text-[#777] file:mr-4 file:py-3 file:px-6 file:border-2 file:border-[#1a1a1a] file:bg-[#050505] file:text-[#eee] file:font-black file:uppercase file:cursor-pointer hover:file:border-[#c5a36b] transition-all"
            />
          </div>
        </div>

        {/* Feature Selection */}
        {(datasetA.length > 0 || datasetB.length > 0) && (
          <div className="grid md:grid-cols-2 gap-0 border-2 border-[#1a1a1a] bg-[#0c0c0c] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#1a1a1a]">
            <div className="p-6">
              <select value={sampleColA} onChange={(e) => setSampleColA(e.target.value)} className="w-full bg-[#050505] border-2 border-[#1a1a1a] p-4 text-[11px] font-black text-[#eee] outline-none focus:border-emerald-500 uppercase">
                <option value="">Feature Selection A</option>
                {colsA.map((col, i) => <option key={i} value={col}>{col}</option>)}
              </select>
            </div>
            <div className="p-6">
              <select value={sampleColB} onChange={(e) => setSampleColB(e.target.value)} className="w-full bg-[#050505] border-2 border-[#1a1a1a] p-4 text-[11px] font-black text-[#eee] outline-none focus:border-emerald-500 uppercase">
                <option value="">Feature Selection B</option>
                {colsB.map((col, i) => <option key={i} value={col}>{col}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Statistical Summary Panel */}
        <section className="bg-[#080808] border-2 border-[#1a1a1a] divide-y-2 divide-[#1a1a1a]">
          <div className="p-10">
            {tScore ? (
              <div className="grid md:grid-cols-3 gap-12 items-center">
                <div className="space-y-1">
                  <p className="text-[10px] text-[#777] font-black uppercase tracking-[0.3em]">Mean Group A</p>
                  <p className="text-4xl font-black text-[#fcfcfc] tabular-nums tracking-tighter italic">{avgA.toFixed(4)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-[#777] font-black uppercase tracking-[0.3em]">Mean Group B</p>
                  <p className="text-4xl font-black text-[#fcfcfc] tabular-nums tracking-tighter italic">{avgB.toFixed(4)}</p>
                </div>
                <div className="p-6 border-2 border-[#c5a36b]/20 bg-[#c5a36b]/5 relative overflow-hidden">
                  <p className="text-[10px] text-[#c5a36b] font-black uppercase tracking-[0.4em]">T-Statistic Result</p>
                  <p className="text-5xl font-black text-[#c5a36b] tabular-nums tracking-tighter">{tScore}</p>
                  <div className="absolute top-0 right-0 p-2"><Activity size={24} className="opacity-10 text-[#c5a36b]" /></div>
                </div>
              </div>
            ) : (
              <p className="text-xs font-bold text-[#555] uppercase tracking-[0.3em] text-center italic">Waiting for Dataset Synchronization</p>
            )}
          </div>

          {tScore && (
            <div className="p-10 h-[400px] bg-[#0c0c0c]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleChart}>
                  <CartesianGrid strokeDasharray="0" stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} fontWeight="900" tickLine={false} axisLine={{ stroke: '#1a1a1a', strokeWidth: 2 }} />
                  <YAxis stroke="#666" fontSize={10} fontWeight="900" tickLine={false} axisLine={{ stroke: '#1a1a1a', strokeWidth: 2 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0c0c0c', border: '2px solid #1a1a1a', borderRadius: 0, fontSize: '10px', fontWeight: 'bold' }} />
                  <Bar dataKey="value" fill="#c5a36b" barSize={80} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {tScore && (
            <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#050505]">
              <div className="text-[10px] font-black tracking-[0.3em] text-emerald-600 uppercase">
                {reportStatus || "Analysis Active"}
              </div>
              <div className="flex flex-col sm:flex-row gap-0 border-2 border-[#1a1a1a]">
                <button onClick={handleSaveToHistory} className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-[#050505] text-[11px] font-black uppercase tracking-widest transition-all">
                  <Save size={14} className="inline mr-2 mb-0.5" /> Commit Archive
                </button>
                <button onClick={handleGenerateReport} className="px-10 py-4 text-[#888] hover:text-[#fcfcfc] hover:bg-[#1a1a1a] text-[11px] font-black uppercase tracking-widest transition-all border-l-2 border-[#1a1a1a]">
                  <RefreshCcw size={14} className="inline mr-2 mb-0.5" /> Regenerate Report
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}