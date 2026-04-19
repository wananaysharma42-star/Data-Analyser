import React, { useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Printer, ShieldAlert, Cpu, FileText, Database } from 'lucide-react';

export default function PDFReportView({ reportData }) {
  const printRef = useRef();

  if (!reportData || !reportData.summary) return null;

  const handlePrint = () => {
    window.print();
  };

  const isSingle = reportData.type === 'SINGLE' || reportData.type === 'Exploratory Data Analysis';
  const summary = reportData.summary || reportData.details;
  const insights = summary?.insights || [];

  // Generate chart data
  let chartData = [];
  if (isSingle && summary?.columnSummary) {
    const missingData = Object.entries(summary.columnSummary)
      .map(([name, stats]) => ({ name, missing: stats.missing }))
      .filter(d => d.missing > 0);

    if (missingData.length > 0) {
      chartData = missingData;
    } else {
      chartData = Object.entries(summary.columnSummary)
        .filter(([_, stats]) => stats.type === 'numeric')
        .map(([name, stats]) => ({ name, value: stats.mean }))
        .slice(0, 5);
    }
  } else if (!isSingle && summary?.testMetrics) {
    chartData = [
      { name: "DATA A", value: Number(summary.testMetrics.meanA) },
      { name: "DATA B", value: Number(summary.testMetrics.meanB) },
    ];
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#050505] text-[#999] font-sans">
      {/* Print Controls - Industrial UI */}
      <div className="flex justify-between items-center mb-8 no-print p-6 border-2 border-[#1a1a1a] bg-[#0c0c0c] report-controls">
        <div className="flex items-center gap-3">
          <Cpu size={14} className="text-[#c5a36b]" />
          <h2 className="text-[10px] font-black text-[#eee] uppercase tracking-[0.4em]">Report Export</h2>
        </div>
        <button
          onClick={handlePrint}
          className="px-8 py-4 bg-[#c5a36b] hover:bg-[#d4b582] text-[#050505] text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(197,163,107,0.1)]"
        >
          <Printer size={14} />
          Print Report
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          /* Universal reset for print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide all page content by default */
          body * {
            visibility: hidden !important;
          }

          /* Show only the print area and its contents */
          .print-area, .print-area * {
            visibility: visible !important;
          }

          /* CRITICAL: Force all parents to be visible and unconstrained */
          html, body, #root, main, .min-h-screen, div, section, article {
            visibility: visible !important;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
            background: white !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            display: block !important;
          }

          /* Position the report at the top of the print output */
          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
            z-index: 99999 !important;
          }

          /* Hide UI-specific elements */
          nav, header, footer, .no-print, .report-controls, button, [class*="Navbar"], [class*="sidebar"] {
            display: none !important;
            height: 0 !important;
            width: 0 !important;
          }

          @page {
            size: A4;
            margin: 10mm;
          }

          .page-break { 
            page-break-before: always !important; 
            break-before: page !important;
          }

          h1, h2, h3, .mb-24, table, .border-4, .insight-block, .chat-message {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}} />

      {/* The Printable Area Wrapper */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-4 md:p-8">
        <div
          className="bg-white text-[#000] p-6 sm:p-10 md:p-16 shadow-2xl mx-auto print-area border-2 border-[#eee] w-full"
          style={{
            maxWidth: '900px',
            fontFamily: 'system-ui, sans-serif',
            lineHeight: '1.4'
          }}
        >
          {/* Header - Minimalist Industrial */}
          <div className="border-b-4 border-[#000] pb-10 mb-20 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-[#000] m-0 italic uppercase">
                DataVision <span className="text-[#c5a36b] not-italic">Analytics</span>
              </h1>
              <p className="text-[9px] text-[#555] font-black uppercase tracking-[0.6em] mt-3">Statistical Analysis Manifest</p>
            </div>
            <div className="text-right text-[9px] text-[#000] font-black leading-relaxed uppercase tracking-widest border-l-2 border-[#eee] pl-6">
              <p>SEC ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
              <p>COMMITTED: {new Date().toLocaleString().toUpperCase()}</p>
            </div>
          </div>

          {/* Section 01: Insights */}
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-10 border-b-2 border-[#f0f0f0] pb-4">
              <span className="text-[10px] font-black bg-[#000] text-white px-3 py-1">01</span>
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#000]">Executive Summary</h2>
            </div>

            {insights.length > 0 ? (
              <div className="grid gap-6">
                {insights.map((insight, idx) => (
                  <div key={idx} className="flex gap-8 items-start p-8 bg-[#fcfcfc] border-2 border-[#f0f0f0] insight-block">
                    <ShieldAlert size={18} className="text-[#c5a36b] shrink-0 mt-1" />
                    <div>
                      {insight.includes(':') ? (
                        <>
                          <strong className="text-[#000] block mb-2 text-sm tracking-tight font-black uppercase italic">{insight.split(':')[0]}</strong>
                          <p className="text-[13px] text-[#444] leading-relaxed font-medium">{insight.substring(insight.indexOf(':') + 1)}</p>
                        </>
                      ) : (
                        <p className="text-[13px] text-[#444] font-medium">{insight}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#999] italic uppercase tracking-widest">No local insights indexed.</p>
            )}
          </div>

          {/* Section 02: Visualization */}
          {chartData.length > 0 && (
            <div className="mb-24 page-break">
              <div className="flex items-center gap-4 mb-10 border-b-2 border-[#f0f0f0] pb-4">
                <span className="text-[10px] font-black bg-[#000] text-white px-3 py-1">02</span>
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#000]">Visual Distribution</h2>
              </div>
              <div className="h-[350px] w-full border-2 border-[#f0f0f0] p-10 bg-white">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" stroke="#000" fontSize={10} fontWeight="900" tickLine={false} axisLine={{ stroke: '#000', strokeWidth: 2 }} dy={10} />
                    <YAxis stroke="#000" fontSize={10} fontWeight="900" tickLine={false} axisLine={{ stroke: '#000', strokeWidth: 2 }} dx={-10} />
                    <Tooltip cursor={{ fill: '#fcfcfc' }} contentStyle={{ backgroundColor: '#fff', border: '2px solid #000', borderRadius: '0', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }} />
                    <Bar dataKey={chartData[0]?.missing !== undefined ? "missing" : "value"} fill="#000" barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-[9px] font-black text-[#999] uppercase tracking-[0.4em] mt-6 italic">
                {chartData[0]?.missing !== undefined ? "Missing Value Density Map" : "Mean Value Comparative Analysis"}
              </p>
            </div>
          )}

          {/* Section 03: Statistical Schema */}
          <div className="mb-24 page-break">
            <div className="flex items-center gap-4 mb-10 border-b-2 border-[#f0f0f0] pb-4">
              <span className="text-[10px] font-black bg-[#000] text-white px-3 py-1">03</span>
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#000]">Statistical Schema</h2>
            </div>

            {isSingle && summary?.columnSummary ? (
              <div className="space-y-10">
                <div className="bg-[#000] text-white p-4 inline-block text-[10px] font-black tracking-[0.3em]">
                  Total Entries: {summary.totalRows}
                </div>
                <table className="w-full text-left border-collapse border-2 border-[#000]">
                  <thead>
                    <tr className="bg-[#000] text-white">
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest border-r border-white">Feature</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest border-r border-white">Type</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest border-r border-white">Nulls</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-right">Core Metrics</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(summary.columnSummary).map(([col, stats], i) => (
                      <tr key={i} className="border-b-2 border-[#eee]">
                        <td className="p-4 font-black text-[#000] border-r-2 border-[#eee] text-sm italic">{col}</td>
                        <td className="p-4 text-[#555] font-black uppercase tracking-widest text-[9px] border-r-2 border-[#eee]">{stats.type}</td>
                        <td className={`p-4 font-black border-r-2 border-[#eee] text-xs ${stats.missing > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{stats.missing}</td>
                        <td className="p-4 text-[#000] text-right font-black text-[10px] tabular-nums">
                          {stats.type === 'numeric' ? `AVG: ${stats.mean} | RG: ${stats.min}-${stats.max}` : `UNIQ: ${stats.distinctCount}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {!isSingle && summary?.testMetrics ? (
              <div className="border-4 border-[#000] p-10 bg-[#fcfcfc]">
                <h3 className="text-[10px] font-black mb-10 uppercase tracking-[0.4em] text-[#000] border-b-2 border-[#000] pb-4 inline-block">Hypothesis Test Result</h3>
                <div className="grid grid-cols-2 gap-10">
                  <div className="border-2 border-[#eee] p-6 bg-white">
                    <p className="text-[9px] text-[#999] font-black uppercase mb-2">Target A</p>
                    <p className="text-xl font-black italic">{summary.testMetrics.targetFeatureA}</p>
                    <p className="text-sm font-bold text-emerald-600 mt-2">μ: {summary.testMetrics.meanA}</p>
                  </div>
                  <div className="border-2 border-[#eee] p-6 bg-white">
                    <p className="text-[9px] text-[#999] font-black uppercase mb-2">Target B</p>
                    <p className="text-xl font-black italic">{summary.testMetrics.targetFeatureB}</p>
                    <p className="text-sm font-bold text-emerald-600 mt-2">μ: {summary.testMetrics.meanB}</p>
                  </div>
                </div>
                <div className="mt-12 flex justify-between items-end">
                  <div>
                    <span className="font-black text-[#000] uppercase tracking-[0.3em] text-[10px]">Computed T-Statistic</span>
                    <p className="text-6xl font-black tracking-tighter text-[#c5a36b]">{summary.testMetrics.tStatistic}</p>
                  </div>
                  <FileText size={48} className="opacity-10" />
                </div>
              </div>
            ) : null}
          </div>

          {/* Section 04: Chat Log */}
          {reportData.chatHistory && reportData.chatHistory.length > 0 && (
            <div className="mt-32 pt-16 border-t-4 border-[#000] page-break">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#000] mb-16">04. AI Inquiry Archive</h2>
              <div className="space-y-12">
                {reportData.chatHistory.map((msg, i) => (
                  <div key={i} className="border-l-4 border-[#eee] pl-8 py-2 chat-message">
                    <div className="mb-4">
                      <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${msg.role === 'user' ? 'text-[#999]' : 'text-[#c5a36b]'
                        }`}>
                        {msg.role === 'user' ? 'User Question' : 'Analysis Result'}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#111] leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-24 text-center text-[9px] font-black text-[#bbb] border-t-2 border-[#eee] pt-8 uppercase tracking-[0.5em]">
            Confidential System Report - DataVision Analytics
          </div>
        </div>
      </div>
    </div>
  );
}