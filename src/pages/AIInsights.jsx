import { useMemo, useState, useRef, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { useData } from "../context/DataContext";
import { preprocessSingleData } from "../utils/preprocess";
import { buildAIContext } from "../utils/aiPromptBuilder";
import PDFReportView from "../components/reports/PDFReportView";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BarChart2, FileText, Send, Save, Download, Cpu, ShieldCheck } from "lucide-react";

export default function AIInsights() {
  const { 
    selectedData, 
    addReport,
    aiInsightReport,
    setAiInsightReport,
    aiInsightChat,
    setAiInsightChat
  } = useData();

  const [saveStatus, setSaveStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const chatEndRef = useRef(null);

  const report = aiInsightReport;
  const setReport = setAiInsightReport;
  const chatHistory = aiInsightChat;
  const setChatHistory = setAiInsightChat;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, aiLoading]);

  useEffect(() => {
    if (report) {
      setReport((prev) => ({ ...prev, chatHistory }));
    }
  }, [chatHistory]);

  const columns = selectedData[0] ? Object.keys(selectedData[0]) : [];

  const profile = useMemo(() => {
    if (!selectedData.length) return null;
    const rows = selectedData.length;
    const cols = columns.length;
    const missingSummary = columns.map((col) => {
      const missing = selectedData.filter((row) => !row[col] && row[col] !== 0).length;
      return { column: col, missing, percent: ((missing / rows) * 100).toFixed(1) };
    });
    const numericColumns = columns.filter((col) => selectedData.some((row) => !isNaN(Number(row[col]))));
    const stats = numericColumns.map((col) => {
      const nums = selectedData.map((row) => Number(row[col])).filter((val) => !isNaN(val));
      return { column: col, avg: (nums.reduce((a, b) => a + b, 0) / (nums.length || 1)).toFixed(2) };
    });
    return { rows, cols, missingSummary, numericColumns, stats };
  }, [selectedData, columns]);

  const isReady = selectedData.length > 0;

  const generateInsights = async () => {
    if (!isReady) return;
    setLoading(true);
    setTimeout(() => {
      let summary = preprocessSingleData(selectedData);
      setReport({ type: "SINGLE", summary, chatHistory: [], qualityScore: 94 });
      setChatHistory([]);
      setLoading(false);
    }, 800);
  };

  const handleSaveToHistory = async () => {
    if (!report) return;
    await addReport({ ...report, id: crypto.randomUUID(), timestamp: new Date().toISOString() });
    setSaveStatus("Report Saved");
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
    if (!apiKey) {
      setChatHistory((prev) => [...prev, { role: "ai", text: "Error: API Key Missing" }]);
      setAiLoading(false);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const context = buildAIContext(report.summary, report.type);
      const prompt = `${context}\nUSER_QUESTION: ${userInput}\nANSWER_PROTOCOL: Technical, data-driven, concise.`;
      const result = await model.generateContent(prompt);
      const aiText = result.response.text();
      setChatHistory((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: "ai", text: `Error: ${error.message.toUpperCase()}` }]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#bbb] selection:bg-[#c5a36b]/20">
      <Navbar />

      <main className="max-w-7xl mx-auto p-8 space-y-10">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between py-6 border-b-2 border-[#1a1a1a]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Cpu size={14} className="text-[#c5a36b]" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#777]">Advanced Analytics System</p>
            </div>
            <h1 className="text-4xl font-bold text-[#fcfcfc] tracking-tight italic">Executive Insights Engine</h1>
          </div>
        </header>

        {!isReady ? (
          <div className="border-2 border-dashed border-[#1a1a1a] p-20 text-center bg-[#080808]/50">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#666]">Waiting for data mount in environment</p>
          </div>
        ) : (
          <>
            {/* Statistical Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-2 border-[#1a1a1a] divide-x-2 divide-[#1a1a1a] bg-[#080808]">
              <StatBox title="Observations" value={profile?.rows} />
              <StatBox title="Features" value={profile?.cols} />
              <StatBox title="Numerical Set" value={profile?.numericColumns.length} />
              <StatBox title="Quality Index" value={report ? `${report.qualityScore}%` : "N/A"} accent />
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-4 pt-4">
              <ActionButton
                onClick={generateInsights}
                loading={loading}
                icon={<FileText size={16} />}
                label="Execute Full Analysis"
                primary
              />
              <ActionButton
                onClick={() => { }}
                icon={<Download size={16} />}
                label="Export Raw JSON"
              />
              {report && (
                <ActionButton
                  onClick={handleSaveToHistory}
                  icon={<Save size={16} />}
                  label={saveStatus || "Archive Report"}
                  success
                />
              )}
            </div>
          </>
        )}

        {/* Report Output Area */}
        {report && (
          <div className="grid lg:grid-cols-2 gap-0 border-2 border-[#1a1a1a] bg-[#080808] divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-[#1a1a1a] animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* LEFT: Static Document */}
            <div className="p-8 space-y-6 overflow-y-auto max-h-[800px]">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={18} className="text-[#c5a36b]" />
                <h3 className="text-sm font-bold text-[#fcfcfc] uppercase tracking-widest">Document Output Preview</h3>
              </div>
              <div className="bg-[#050505] border-2 border-[#141414] p-2">
                <PDFReportView reportData={report} />
              </div>
            </div>

            {/* RIGHT: AI Contextual Interface */}
            <div className="flex flex-col h-[800px] bg-[#0c0c0c]">
              <div className="p-6 border-b-2 border-[#1a1a1a] flex justify-between items-center bg-[#080808]">
                <div className="flex items-center gap-3">
                  <Cpu size={16} className="text-[#c5a36b]" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#eee]">Contextual AI Terminal</h3>
                </div>
                <span className="text-[9px] font-black text-[#666] uppercase tracking-widest">Model: Gemini 3 Flash</span>
              </div>

              {/* Message Log */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#050505]">
                {chatHistory.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center opacity-20">
                    <BarChart2 size={48} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Ready for inquiry</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] p-5 border-2 ${msg.role === 'user' ? 'bg-[#080808] border-[#1a1a1a]' : 'bg-[#0c0c0c] border-[#c5a36b]/30 text-[#ccc]'}`}>
                      <p className="text-xs font-medium leading-relaxed tracking-wide">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="bg-[#080808] border-2 border-[#c5a36b]/20 p-4 w-fit">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#c5a36b] animate-pulse">Running Inference</p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Command */}
              <form onSubmit={handleAskAI} className="p-6 border-t-2 border-[#1a1a1a] bg-[#080808]">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter Command or Query"
                    className="flex-1 bg-[#050505] border-2 border-[#1a1a1a] p-4 text-xs font-bold text-[#fcfcfc] outline-none focus:border-[#c5a36b] transition-colors uppercase placeholder:text-[#555]"
                  />
                  <button type="submit" className="px-8 bg-[#c5a36b] hover:bg-[#d4b582] text-[#050505] font-black text-[11px] uppercase tracking-widest transition-all">
                    Execute
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatBox({ title, value, accent = false }) {
  return (
    <div className="p-8 hover:bg-[#0c0c0c] transition-colors">
      <p className="text-[9px] font-black text-[#777] uppercase tracking-[0.25em] mb-4">{title}</p>
      <h3 className={`text-3xl font-bold tabular-nums ${accent ? 'text-[#c5a36b]' : 'text-[#eee]'}`}>
        {value || "0.00"}
      </h3>
    </div>
  );
}

function ActionButton({ onClick, loading, icon, label, primary, success }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-3 px-8 py-4 border-2 text-[11px] font-black uppercase tracking-widest transition-all
        ${primary ? "bg-[#c5a36b] border-[#c5a36b] text-[#050505] hover:bg-[#d4b582]" :
          success ? "bg-emerald-900/10 border-emerald-900 text-emerald-500 hover:bg-emerald-900/20" :
            "border-[#1a1a1a] text-[#888] hover:border-[#333] hover:text-[#aaa]"
        }`}
    >
      {loading ? <div className="animate-spin h-3 w-3 border-2 border-[#050505] border-t-transparent" /> : icon}
      {loading ? "Processing" : label}
    </button>
  );
}