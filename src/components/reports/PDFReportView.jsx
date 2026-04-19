import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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
      { name: "Dataset A Mean", value: Number(summary.testMetrics.meanA) },
      { name: "Dataset B Mean", value: Number(summary.testMetrics.meanB) },
    ];
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Print Controls - Hidden during print */}
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-xs font-black text-[#764abc] uppercase tracking-[0.2em]">Print_Ready_Report_Kernel</h2>
        <button 
          onClick={handlePrint}
          className="px-6 py-3 bg-[#764abc] hover:bg-[#8a5ad4] text-white text-xs font-black uppercase tracking-widest rounded shadow-[0_0_20px_rgba(118,74,188,0.3)] transition-all flex items-center gap-2"
        >
          <span>OPEN_PRINT_DIALOG</span>
          <kbd className="bg-white/20 px-1 rounded text-[10px]">⌘P</kbd>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide known UI elements */
          nav, button, .no-print {
            display: none !important;
          }
          
          /* Reset body and hide overflow */
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Force the report to the top and make it the only thing visible */
          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 15mm !important;
            z-index: 99999 !important;
            background: white !important;
            display: block !important;
          }

          @page {
            size: A4;
            margin: 0;
          }

          .page-break { page-break-before: always !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}} />

      {/* The Printable Area Wrapper */}
      <div className="flex-1 overflow-y-auto bg-[#0d1117] border border-[#30363d] rounded p-8 custom-scrollbar">
        <div 
          className="bg-white text-[#1f2937] p-12 lg:p-24 shadow-2xl mx-auto print-area"
          style={{ 
            width: '100%',
            maxWidth: '1000px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: '1.6' 
          }}
        >
          {/* Header */}
          <div className="border-b-4 border-[#111827] pb-8 mb-16 flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-black tracking-tighter text-[#111827] m-0">DataVision <span className="text-[#764abc]">KRNL</span></h1>
              <p className="text-sm text-[#6b7280] font-black uppercase tracking-[0.4em] mt-2">Intelligence_Report_v1.0</p>
            </div>
            <div className="text-right text-[10px] text-[#9ca3af] font-mono leading-relaxed">
              <p>ID_SEC: {Math.random().toString(36).substring(7).toUpperCase()}</p>
              <p>TS_GEN: {new Date().toLocaleString().toUpperCase()}</p>
            </div>
          </div>

          {/* Programmatic Insights */}
          <div className="mb-20 section-break">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#764abc] mb-8 border-b border-[#f3f4f6] pb-4">01. EXECUTIVE_SUMMARY</h2>
            {insights.length > 0 ? (
              <div className="space-y-6">
                {insights.map((insight, idx) => (
                  <div key={idx} className="flex gap-6 items-start p-8 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg">
                    <div className="h-6 w-6 bg-[#111827] text-white flex items-center justify-center rounded text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-[15px] text-[#374151] leading-relaxed m-0 font-medium">
                      {insight.includes(':') ? (
                        <>
                          <strong className="text-[#111827] block mb-2 text-lg tracking-tight font-black uppercase">{insight.split(':')[0]}</strong>
                          <span className="text-[#4b5563]">{insight.substring(insight.indexOf(':') + 1)}</span>
                        </>
                      ) : insight}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6b7280] italic">No specific insights generated.</p>
            )}
          </div>

          {/* Graphs */}
          {chartData.length > 0 && (
            <div className="mb-20 section-break">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#764abc] mb-8 border-b border-[#f3f4f6] pb-4">02. VISUAL_PROFILING</h2>
              <div className="h-[400px] w-full bg-white border border-[#e5e7eb] p-10 rounded-2xl flex justify-center items-center shadow-sm">
                <BarChart data={chartData} width={700} height={300}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} dy={15} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} dx={-15} />
                  <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', fontSize: '12px', padding: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey={chartData[0]?.missing !== undefined ? "missing" : "value"} fill="#111827" barSize={44} radius={[8, 8, 0, 0]} />
                </BarChart>
              </div>
              <p className="text-center text-xs text-[#6b7280] mt-2 italic">
                {chartData[0]?.missing !== undefined ? "Missing Values by Column" : "Mean Distribution"}
              </p>
            </div>
          )}

          {/* Statistical Schema */}
          <div className="mb-20 section-break page-break">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#764abc] mb-12 border-b border-[#f3f4f6] pb-4">03. STATISTICAL_SCHEMA</h2>
            
            {isSingle && summary?.columnSummary ? (
              <div className="space-y-12">
                <div className="flex items-center gap-3 mb-8">
                   <p className="text-[12px] text-[#111827] font-black tracking-widest uppercase bg-[#f3f4f6] border border-[#e5e7eb] px-5 py-3 rounded-md">DATALAYER_DEPTH: {summary.totalRows} UNITS</p>
                </div>
                <table className="w-full text-left text-[14px] border-collapse">
                  <thead>
                    <tr className="bg-[#111827] text-white">
                      <th className="p-8 font-black uppercase tracking-[0.2em] border-r border-[#374151]">VARIABLE</th>
                      <th className="p-8 font-black uppercase tracking-[0.2em] border-r border-[#374151]">CLASS</th>
                      <th className="p-8 font-black uppercase tracking-[0.2em] border-r border-[#374151]">NULLS</th>
                      <th className="p-8 font-black uppercase tracking-[0.2em] text-right">METRICS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(summary.columnSummary).map(([col, stats], i) => (
                      <tr key={i} className={`border-b border-[#e5e7eb] ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                        <td className="p-8 font-black text-[#111827] border-r border-[#e5e7eb] text-xl tracking-tighter">{col}</td>
                        <td className="p-8 text-[#4b5563] font-bold uppercase tracking-wider border-r border-[#e5e7eb] text-xs">{stats.type}</td>
                        <td className={`p-8 font-black border-r border-[#e5e7eb] text-lg ${stats.missing > 0 ? 'text-[#ef4444]' : 'text-[#059669]'}`}>{stats.missing}</td>
                        <td className="p-8 text-[#1f2937] text-right font-bold text-xs">
                          {stats.type === 'numeric' ? (
                            <div className="flex flex-col gap-2 items-end">
                              <span className="bg-white border border-[#e5e7eb] px-3 py-1 rounded">MEAN: {stats.mean}</span>
                              <span className="bg-white border border-[#e5e7eb] px-3 py-1 rounded">RANGE: {stats.min} - {stats.max}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2 items-end">
                              <span className="bg-white border border-[#e5e7eb] px-3 py-1 rounded">DISTINCT: {stats.distinctCount}</span>
                              {stats.topValues && (
                                <span className="text-[9px] text-[#9ca3af] tracking-tight">{stats.topValues.slice(0, 1).join(', ')}</span>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {!isSingle && summary?.testMetrics ? (
              <div className="space-y-12">
                <div className="bg-[#f9fafb] p-12 border border-[#e5e7eb] rounded-3xl">
                  <h3 className="text-sm font-black mb-8 uppercase tracking-[0.4em] text-[#6b7280]">T-TEST_PROFILE</h3>
                  <div className="grid grid-cols-2 gap-10 text-sm">
                    <div className="bg-white p-8 border border-[#e5e7eb] rounded-2xl shadow-sm">
                      <p className="text-[10px] text-[#9ca3af] font-black uppercase tracking-widest mb-4">TARGET_A</p>
                      <p className="text-2xl font-black text-[#111827] tracking-tighter mb-4">{summary.testMetrics.targetFeatureA}</p>
                      <p className="text-[#4b5563] text-lg">μ: <strong className="text-[#059669]">{summary.testMetrics.meanA}</strong></p>
                    </div>
                    <div className="bg-white p-8 border border-[#e5e7eb] rounded-2xl shadow-sm">
                      <p className="text-[10px] text-[#9ca3af] font-black uppercase tracking-widest mb-4">TARGET_B</p>
                      <p className="text-2xl font-black text-[#111827] tracking-tighter mb-4">{summary.testMetrics.targetFeatureB}</p>
                      <p className="text-[#4b5563] text-lg">μ: <strong className="text-[#059669]">{summary.testMetrics.meanB}</strong></p>
                    </div>
                  </div>
                  <div className="mt-12 pt-10 border-t border-[#e5e7eb] flex justify-between items-center">
                    <span className="font-black text-[#374151] uppercase tracking-[0.2em] text-xs">CALCULATED_T_STAT</span>
                    <span className="text-5xl font-black text-[#111827] tracking-tighter">{summary.testMetrics.tStatistic}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* AI Chat Log Section */}
          {reportData.chatHistory && reportData.chatHistory.length > 0 && (
            <div className="mt-32 pt-20 border-t-8 border-[#111827] page-break section-break">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#764abc] mb-16 border-b border-[#f3f4f6] pb-4">04. AI_ANALYST_REPL</h2>
              <div className="space-y-16">
                {reportData.chatHistory.map((msg, i) => (
                  <div key={i} className="relative pl-16">
                    <div className={`absolute left-0 top-0 bottom-0 w-[6px] rounded-full ${
                      msg.role === 'user' ? 'bg-[#9ca3af]' : 'bg-[#764abc]'
                    }`}></div>
                    
                    <div className="mb-8 flex justify-between items-center">
                      <span className={`text-[12px] font-black uppercase tracking-[0.3em] ${
                        msg.role === 'user' ? 'text-[#6b7280]' : 'text-[#764abc]'
                      }`}>
                        {msg.role === 'user' ? '► QUERY_IN' : '▼ KERNEL_OUT'}
                      </span>
                    </div>
                    <div className="text-[18px] text-[#111827] leading-[1.8] whitespace-pre-wrap font-medium tracking-tight">
                      {msg.text.split('\n').map((line, lineIdx) => (
                        <p key={lineIdx} className={line.trim() === '' ? 'h-8' : 'mb-6'}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-16 text-center text-xs text-[#9ca3af] border-t border-[#e5e7eb] pt-6 font-mono">
            CONFIDENTIAL - GENERATED BY DATAVISION_V1 ANALYTICS KERNEL
          </div>
        </div>
      </div>
    </div>
  );
}
