import { useState, useRef, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { useData } from "../context/DataContext";
import Papa from "papaparse";
import { preprocessTwoSampleData } from "../utils/preprocess";
import { buildAIContext } from "../utils/aiPromptBuilder";
import PDFReportView from "../components/reports/PDFReportView";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function TwoSampleTest() {
  const { addReport, twoSampleData, setTwoSampleData } = useData();
  const { datasetA, datasetB, sampleColA, sampleColB } = twoSampleData;
  const [reportStatus, setReportStatus] = useState("");
  const [generatedReport, setGeneratedReport] = useState(null);

  // AI Chat State
  const [aiLoading, setAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, aiLoading]);

  // Sync chat history to generated report
  useEffect(() => {
    if (generatedReport) {
      setGeneratedReport(prev => ({ ...prev, chatHistory }));
    }
  }, [chatHistory]);

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
    tScore = ((avgA - avgB) / Math.sqrt(varA / numsA.length + varB / numsB.length)).toFixed(3);
  }

  const sampleChart = [
    { name: "Dataset A Mean", value: Number(avgA.toFixed(2)) },
    { name: "Dataset B Mean", value: Number(avgB.toFixed(2)) },
  ];

  const handleGenerateReport = () => {
    if (!tScore) return;

    const profile = {
      avgA,
      avgB,
      tScore,
      targetA: sampleColA,
      targetB: sampleColB,
      sizeA: datasetA.length,
      sizeB: datasetB.length
    };

    const summary = preprocessTwoSampleData(datasetA, datasetB, profile);

    const report = {
      type: "TWO_SAMPLE",
      summary: summary,
      chatHistory: []
    };
    setGeneratedReport(report);
    setChatHistory([]); // Reset chat for new report
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || !generatedReport) return;

    const newUserMsg = { role: "user", text: userInput };
    setChatHistory((prev) => [...prev, newUserMsg]);
    setUserInput("");
    setAiLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      setChatHistory((prev) => [...prev, { role: "ai", text: "ERROR: VITE_GEMINI_API_KEY is missing from .env" }]);
      setAiLoading(false);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const context = buildAIContext(generatedReport.summary, "TWO_SAMPLE");

      const prompt = `
        ${context}
        
        USER_QUESTION: ${userInput}
        
        ANSWER_PROTOCOL: Be concise, technical, and data-driven. Reference the T-Test results.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text();

      setChatHistory((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setChatHistory((prev) => [...prev, { role: "ai", text: `ERROR: ${error.message || "Failed to reach AI kernel."}` }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveToHistory = async () => {
    if (!generatedReport) return;
    const reportToSave = {
      ...generatedReport,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    await addReport(reportToSave);
    setReportStatus("REPORT_SAVED");
    setTimeout(() => setReportStatus(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] font-mono text-[#c9d1d9] selection:bg-[#764abc]/30">
      <Navbar />

      <div className="p-6 space-y-12 max-w-7xl mx-auto">
        <section className="space-y-6">
          <div className="flex items-baseline gap-3 border-b border-[#30363d] pb-2">
            <h1 className="text-xl font-bold uppercase text-emerald-500">Two_Sample_Testing_Module</h1>
            <span className="text-[10px] text-[#8b949e]">External_Cross_Compare</span>
          </div>

          {/* Render the PDF Report Preview if generated */}
          {generatedReport && (
            <div className="grid lg:grid-cols-2 gap-6 animate-in slide-in-from-left-4 duration-700">
              <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-md lg:col-span-1 max-h-[800px] overflow-hidden flex flex-col no-print">
                <PDFReportView reportData={generatedReport} />
              </div>

              {/* AI CHAT INTERFACE - Replaced placeholder */}
              <div className="flex flex-col h-[800px] bg-[#161b22] border border-[#30363d] rounded-md overflow-hidden no-print">
                <div className="p-4 border-b border-[#30363d] bg-[#0d1117]/50 flex justify-between items-center">
                  <div className="flex flex-col">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">AI_T_TEST_ANALYST</h3>
                    <span className="text-[8px] text-[#8b949e] uppercase mt-0.5">Context: Statistical_Dual_Compare</span>
                  </div>
                  <span className="text-[9px] text-[#484f58] font-mono">MDL: GEMINI_FLASH</span>
                </div>

                {/* Chat Log */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#0d1117]/20">
                  {chatHistory.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-[#484f58] space-y-3 opacity-50">
                      <span className="text-3xl">🧮</span>
                      <p className="text-[10px] uppercase tracking-tighter text-center max-w-[200px]">
                        Analysis Kernel Ready. Ask about the T-Statistic or dataset correlations.
                      </p>
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded text-xs ${msg.role === 'user'
                        ? 'bg-[#30363d] text-[#c9d1d9] border border-[#484f58]'
                        : 'bg-[#0d1117] text-[#c9d1d9] border border-emerald-500/20'
                        }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#0d1117] p-3 rounded border border-emerald-500/20 text-[10px] text-emerald-500 animate-pulse uppercase font-black">
                        Processing_Hypothesis...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleAskAI} className="p-4 border-t border-[#30363d] bg-[#0d1117]/50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Enter inquiry (e.g. 'Is the difference significant?')..."
                      className="flex-1 bg-[#0d1117] border border-[#30363d] rounded p-3 text-xs outline-none focus:border-emerald-500/50 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={aiLoading}
                      className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[10px] uppercase transition-all disabled:opacity-50"
                    >
                      SEND
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-[#8b949e] font-bold uppercase">Mount_Dataset_A</label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => parseFile(e.target.files[0], setDatasetA)}
                className="w-full text-xs text-[#8b949e] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#30363d] file:text-[#c9d1d9] hover:file:bg-[#484f58]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-[#8b949e] font-bold uppercase">Mount_Dataset_B</label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => parseFile(e.target.files[0], setDatasetB)}
                className="w-full text-xs text-[#8b949e] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#30363d] file:text-[#c9d1d9] hover:file:bg-[#484f58]"
              />
            </div>
          </div>

          {(datasetA.length > 0 || datasetB.length > 0) && (
            <div className="grid md:grid-cols-2 gap-4 bg-[#161b22] p-4 border border-[#30363d] rounded-md">
              <select
                value={sampleColA}
                onChange={(e) => setSampleColA(e.target.value)}
                className="bg-[#0d1117] border border-[#30363d] p-2 text-xs rounded"
              >
                <option value="">TARGET_A_FEATURE</option>
                {colsA.map((col, i) => <option key={i} value={col}>{col}</option>)}
              </select>

              <select
                value={sampleColB}
                onChange={(e) => setSampleColB(e.target.value)}
                className="bg-[#0d1117] border border-[#30363d] p-2 text-xs rounded"
              >
                <option value="">TARGET_B_FEATURE</option>
                {colsB.map((col, i) => <option key={i} value={col}>{col}</option>)}
              </select>
            </div>
          )}

          {/* Mean Variance Comparison Cell */}
          <div className="bg-[#010409] border border-[#30363d] rounded-md divide-y divide-[#30363d]">
            <div className="p-6">
              {tScore ? (
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#8b949e] font-bold uppercase tracking-tighter">μ_Mean_Dataset_A</p>
                    <p className="text-2xl font-bold">{avgA.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#8b949e] font-bold uppercase tracking-tighter">μ_Mean_Dataset_B</p>
                    <p className="text-2xl font-bold">{avgB.toFixed(2)}</p>
                  </div>
                  <div className="bg-[#161b22] p-3 rounded border border-[#764abc]/30">
                    <p className="text-[10px] text-[#764abc] font-black uppercase tracking-widest">T_STATISTIC</p>
                    <p className="text-2xl font-black text-[#764abc]">{tScore}</p>
                  </div>
                </div>
              ) : (
                <p className="text-[#8b949e] text-xs italic text-center">Awaiting dual dataset synchronization for T-Test calculation...</p>
              )}
            </div>

            {tScore && (
              <div className="p-6 h-[300px] border-b border-[#30363d]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sampleChart}>
                    <XAxis dataKey="name" stroke="#8b949e" fontSize={10} tickLine={false} />
                    <YAxis stroke="#8b949e" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d' }} />
                    <Bar dataKey="value" fill="#764abc" barSize={60} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {tScore && (
              <div className="p-4 flex items-center justify-end gap-3 bg-[#0d1117] rounded-b-md">
                {reportStatus && <span className="text-[10px] text-emerald-500 font-bold">{reportStatus}</span>}
                <button
                  onClick={handleSaveToHistory}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded transition-all border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                >
                  COMMIT_TO_HISTORY
                </button>
                <button
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-[#764abc] hover:bg-[#8a5ad4] text-white text-[10px] font-black uppercase tracking-widest rounded transition-all border border-[#8a5ad4]/20 shadow-[0_0_10px_rgba(118,74,188,0.1)]"
                >
                  REGENERATE_PREVIEW
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
