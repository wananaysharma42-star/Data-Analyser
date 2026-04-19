import { useMemo, useState, useRef, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { useData } from "../context/DataContext";
import { preprocessSingleData, preprocessTwoSampleData } from "../utils/preprocess";
import { buildAIContext } from "../utils/aiPromptBuilder";
import PDFReportView from "../components/reports/PDFReportView";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function AIInsights() {
  const { selectedData, twoSampleData, addReport } = useData();
  const [mode, setMode] = useState("SINGLE"); // "SINGLE" or "TWO_SAMPLE"
  const [saveStatus, setSaveStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, aiLoading]);

  const columns = selectedData[0] ? Object.keys(selectedData[0]) : [];

  const profile = useMemo(() => {
    if (!selectedData.length) return null;

    const rows = selectedData.length;
    const cols = columns.length;

    const missingSummary = columns.map((col) => {
      const missing = selectedData.filter((row) => {
        const value = row[col];
        return value === "" || value === null || value === undefined;
      }).length;

      return {
        column: col,
        missing,
        percent: ((missing / rows) * 100).toFixed(1),
      };
    });

    const numericColumns = columns.filter((col) =>
      selectedData.some(
        (row) => row[col] !== "" && !isNaN(Number(row[col]))
      )
    );

    const stats = numericColumns.map((col) => {
      const nums = selectedData
        .map((row) => Number(row[col]))
        .filter((val) => !isNaN(val));

      const avg =
        nums.reduce((a, b) => a + b, 0) / (nums.length || 1);

      return {
        column: col,
        avg: avg.toFixed(2),
        min: Math.min(...nums),
        max: Math.max(...nums),
      };
    });

    return {
      rows,
      cols,
      missingSummary,
      numericColumns,
      stats,
    };
  }, [selectedData, columns, mode]);

  const twoSampleProfile = useMemo(() => {
    if (mode !== "TWO_SAMPLE") return null;
    const { datasetA, datasetB, sampleColA, sampleColB } = twoSampleData;
    if (!datasetA.length || !datasetB.length || !sampleColA || !sampleColB) return null;

    const getNums = (data, col) => data.map((row) => Number(row[col])).filter((val) => !isNaN(val));
    const numsA = getNums(datasetA, sampleColA);
    const numsB = getNums(datasetB, sampleColB);

    const mean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    const variance = (arr, avg) => arr.length > 1 ? arr.reduce((sum, val) => sum + (val - avg) ** 2, 0) / (arr.length - 1) : 0;

    const avgA = mean(numsA);
    const avgB = mean(numsB);
    const varA = variance(numsA, avgA);
    const varB = variance(numsB, avgB);

    let tScore = null;
    if (numsA.length > 1 && numsB.length > 1) {
      tScore = ((avgA - avgB) / Math.sqrt(varA / numsA.length + varB / numsB.length)).toFixed(3);
    }

    return {
      avgA: avgA.toFixed(2),
      avgB: avgB.toFixed(2),
      tScore,
      targetA: sampleColA,
      targetB: sampleColB,
      sizeA: datasetA.length,
      sizeB: datasetB.length
    };
  }, [twoSampleData, mode]);

  const isReady = mode === "SINGLE" ? selectedData.length > 0 : !!twoSampleProfile;

  const generateInsights = async () => {
    if (!isReady) return;
    setLoading(true);

    // Simulate slight processing delay for UX
    setTimeout(() => {
      let summary = null;
      if (mode === "SINGLE") {
        summary = preprocessSingleData(selectedData);
      } else {
        const { datasetA, datasetB } = twoSampleData;
        summary = preprocessTwoSampleData(datasetA, datasetB, twoSampleProfile);
      }

      setReport({
        type: mode,
        summary,
        chatHistory: [] // Reset chat history for a new report
      });
      setLoading(false);
    }, 800);
  };

  // Sync chat history to report for PDF generation
  useEffect(() => {
    if (report) {
      setReport(prev => ({ ...prev, chatHistory }));
    }
  }, [chatHistory]);

  const downloadJSON = () => {
    if (!isReady) return;
    const dataToDownload = mode === "SINGLE" ? selectedData : twoSampleData;
    const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data_export_${mode.toLowerCase()}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToHistory = async () => {
    if (!report) return;
    const reportToSave = {
      ...report,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    await addReport(reportToSave);
    setSaveStatus("REPORT_SAVED");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || !report) return;

    const newUserMsg = { role: "user", text: userInput };
    setChatHistory((prev) => [...prev, newUserMsg]);
    setUserInput("");
    setAiLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log("DEBUG: Using API Key starting with:", apiKey?.slice(0, 5));

    if (!apiKey) {
      setChatHistory((prev) => [...prev, { role: "ai", text: "ERROR: VITE_GEMINI_API_KEY is missing from .env" }]);
      setAiLoading(false);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const context = buildAIContext(report.summary, mode);

      const prompt = `
        ${context}
        
        USER_QUESTION: ${userInput}
        
        ANSWER_PROTOCOL: Be concise, technical, and data-driven. Reference the schema and insights provided.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text();

      setChatHistory((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setChatHistory((prev) => [...prev, { role: "ai", text: `ERROR: ${error.message || "Accessing AI kernel failed. Please check connectivity."}` }]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] font-mono text-[#c9d1d9] selection:bg-[#764abc]/30">
      <Navbar />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-start">
          <div className="border-l-4 border-[#764abc] pl-4">
            <h1 className="text-2xl font-bold tracking-tight">EXECUTIVE_REPORTS_KERNEL</h1>
            <p className="text-[#8b949e] text-xs mt-1 uppercase tracking-widest">
              Programmatic Data Analysis & PDF Engine
            </p>
          </div>

          <div className="flex bg-[#161b22] border border-[#30363d] rounded p-1">
            <button
              onClick={() => { setMode("SINGLE"); setReport(null); }}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-colors ${mode === "SINGLE" ? "bg-[#30363d] text-[#c9d1d9]" : "text-[#8b949e] hover:text-[#c9d1d9]"}`}
            >
              SINGLE_DATASET
            </button>
            <button
              onClick={() => { setMode("TWO_SAMPLE"); setReport(null); }}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-colors ${mode === "TWO_SAMPLE" ? "bg-[#30363d] text-[#c9d1d9]" : "text-[#8b949e] hover:text-[#c9d1d9]"}`}
            >
              2_SAMPLE_TEST
            </button>
          </div>
        </div>

        {!isReady ? (
          <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-md text-center">
            <p className="text-[#8b949e] italic">
              {mode === "SINGLE" ? "No active dataset detected. [Waiting for input...]" : "No active T-Test data found. [Mount two datasets in 2_Sample_Test]"}
            </p>
          </div>
        ) : (
          <>
            {/* Top Stats Grid */}
            {mode === "SINGLE" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="ROWS" value={profile?.rows} />
                <StatCard title="COLS" value={profile?.cols} />
                <StatCard title="NUM_COL" value={profile?.numericColumns.length} />
                <StatCard
                  title="QUALITY"
                  value={report ? `${report.qualityScore}%` : "N/A"}
                  isAccent={true}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="DATASET_A_ROWS" value={twoSampleProfile?.sizeA} />
                <StatCard title="DATASET_B_ROWS" value={twoSampleProfile?.sizeB} />
                <StatCard title="T_STATISTIC" value={twoSampleProfile?.tScore} isAccent={true} />
                <StatCard title="STATUS" value="READY" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={generateInsights}
                className="px-6 py-2 bg-[#764abc] hover:bg-[#8a5ad4] text-white font-bold text-xs rounded transition-all border border-[#8a5ad4]/20 shadow-[0_0_10px_rgba(118,74,188,0.2)]"
              >
                {loading ? "COMPILING..." : "GENERATE_EXECUTIVE_REPORT"}
              </button>
              <button
                onClick={downloadJSON}
                className="px-6 py-2 bg-[#161b22] hover:bg-[#30363d] text-[#c9d1d9] font-bold text-xs rounded transition-all border border-[#30363d]"
              >
                DOWNLOAD_JSON
              </button>
              {report && (
                <button
                  onClick={handleSaveToHistory}
                  className="px-6 py-2 bg-[#059669] hover:bg-[#10b981] text-white font-bold text-xs rounded transition-all border border-[#10b981]/20 shadow-[0_0_10px_rgba(5,150,105,0.2)]"
                >
                  {saveStatus || "SAVE_TO_HISTORY"}
                </button>
              )}
            </div>
          </>
        )}

        {/* Report Output (PDF View embedded) */}
        {report && (
          <div className="grid lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-700">
            {/* LEFT: STATIC REPORT */}
            <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-md h-fit">
              <PDFReportView reportData={report} />
            </div>

            {/* RIGHT: AI CHAT INTERFACE */}
            <div className="flex flex-col h-[700px] bg-[#161b22] border border-[#30363d] rounded-md overflow-hidden">
              <div className="p-4 border-b border-[#30363d] bg-[#0d1117]/50 flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#764abc]">AI_ANALYST_REPL</h3>
                <span className="text-[9px] text-[#8b949e]">MODEL: gemini-1.5-flash</span>
              </div>

              {/* Chat Log */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-[#484f58] space-y-2">
                    <span className="text-3xl">🤖</span>
                    <p className="text-[10px] uppercase tracking-tighter">Waiting for user input... Ask about data trends or anomalies.</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded text-xs ${msg.role === 'user'
                        ? 'bg-[#30363d] text-[#c9d1d9] border border-[#484f58]'
                        : 'bg-[#0d1117] text-[#c9d1d9] border border-[#764abc]/30'
                      }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#0d1117] p-3 rounded border border-[#764abc]/30 text-[10px] text-[#764abc] animate-pulse uppercase font-black">
                      Analyzing_Context...
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
                    placeholder="CMD > type your inquiry here..."
                    className="flex-1 bg-[#0d1117] border border-[#30363d] rounded p-3 text-xs outline-none focus:border-[#764abc] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="px-4 bg-[#764abc] hover:bg-[#8a5ad4] text-white rounded font-bold text-[10px] uppercase transition-all disabled:opacity-50"
                  >
                    SEND
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, isAccent = false }) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-md">
      <p className="text-[10px] text-[#8b949e] font-black uppercase tracking-widest">{title}</p>
      <h3 className={`text-xl font-bold mt-1 ${isAccent ? 'text-[#764abc]' : 'text-[#c9d1d9]'}`}>
        {value || "0"}
      </h3>
    </div>
  );
}