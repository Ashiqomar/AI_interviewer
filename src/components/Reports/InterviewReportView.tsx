import React, { useState } from 'react';
import {
  Download,
  CheckCircle2,
  XCircle,
  Award,
  Mic,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Brain,
  AlertCircle,
  Lightbulb,
  Send,
  RefreshCw,
  FileText,
  Target
} from 'lucide-react';
import { generateInterviewPDFReport, PerformanceReportData } from '../../../services/pdfReportGenerator';

interface InterviewReportViewProps {
  reportData?: PerformanceReportData;
}

const defaultReportData: PerformanceReportData = {
  candidateName: 'Candidate',
  targetRole: 'Senior Full-Stack Engineer',
  interviewType: 'System Design & Technical',
  overallScore: 88,
  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  summary:
    'Demonstrated strong technical depth in distributed systems, clean state management, and clear architectural articulation. Minor areas for growth include quantifying business metrics in STAR behavioral questions and managing cache invalidation edge cases.',
  categoryBreakdown: {
    technicalAccuracy: 90,
    communicationClarity: 88,
    problemSolving: 92,
    starAlignment: 82
  },
  speechStats: {
    wpm: 138,
    fillerCount: 3,
    confidenceScore: 92
  },
  strengths: [
    'Excellent architectural trade-off analysis between SQL vs NoSQL.',
    'Clear, articulate speaking pace with minimal filler words.',
    'Strong proactive problem-solving approach.'
  ],
  recommendations: [
    'Always include quantifiable metrics (e.g. % latency reduction, $ cost saved) in behavioral results.',
    'Elaborate on distributed lock timeouts and idempotency keys during concurrency questions.'
  ],
  questionsAndAnswers: [
    {
      question:
        'Could you walk me through an end-to-end architecture you recently designed or led, focusing on scalability bottlenecks and key state management trade-offs?',
      answer:
        'In my recent project, I designed a real-time event streaming pipeline processing 50,000 requests per second. We used Kafka as the event broker and Redis for read-through caching. A major bottleneck was cache stampedes during flash sales, which we mitigated using probabilistic early expiration.',
      score: 92,
      feedback:
        'Outstanding architectural depth! Clear mention of throughput numbers (50k rps) and specific stampede mitigation techniques.',
      keyImprovement: 'Mention how cache invalidation was handled across multi-region deployments.'
    },
    {
      question:
        'Tell me about a time you had to deal with a severe production outage or conflict within your engineering team.',
      answer:
        'During our Q3 launch, our primary database CPU spiked to 100%. I stepped in to lead the post-mortem, identified unindexed query patterns, and deployed database indexes within 15 minutes, restoring service without data loss.',
      score: 84,
      feedback:
        'Good STAR structure (Situation & Action). To raise this score above 90%, add specific business ROI metrics in your Result section.',
      keyImprovement: 'State the exact revenue saved or SLA recovery time.'
    }
  ]
};

export default function InterviewReportView({ reportData = defaultReportData }: InterviewReportViewProps) {
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(0);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Live STAR Evaluation Interactive Playground State
  const [starQuestion, setStarQuestion] = useState<string>(
    'Tell me about a project where you took ownership under tight deadlines.'
  );
  const [starAnswer, setStarAnswer] = useState<string>('');
  const [isEvaluatingSTAR, setIsEvaluatingSTAR] = useState<boolean>(false);
  const [starResult, setStarResult] = useState<any | null>(null);

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    setExportError(null);
    try {
      await generateInterviewPDFReport('interview-report-container', `InterviewIQ_Diagnostic_Report_${Date.now()}.pdf`);
    } catch (err: any) {
      console.error('Error exporting PDF:', err);
      setExportError('Failed to generate PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleRunSTAREvaluator = async () => {
    if (!starAnswer.trim()) return;
    setIsEvaluatingSTAR(true);

    try {
      const res = await fetch('/api/interview/evaluate-star', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: starQuestion,
          candidateAnswer: starAnswer,
          targetRole: reportData.targetRole
        })
      });

      const json = await res.json();
      if (json.data) {
        setStarResult(json.data);
      }
    } catch (err: any) {
      console.error('Error evaluating STAR answer:', err);
    } finally {
      setIsEvaluatingSTAR(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Action */}
      <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
            POST-INTERVIEW DIAGNOSTIC REPORT
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-2 flex items-center gap-2">
            <FileText size={24} className="text-indigo-400" /> Complete Performance Assessment
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Role: <strong>{reportData.targetRole}</strong> • Date: {reportData.date}
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={isExportingPDF}
          className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-indigo-600/30 shrink-0 active:scale-95 disabled:opacity-50"
        >
          {isExportingPDF ? <RefreshCw size={15} className="animate-spin" /> : <Download size={15} />}
          <span>{isExportingPDF ? 'Generating PDF...' : 'Download PDF Report'}</span>
        </button>
      </div>

      {exportError && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{exportError}</span>
        </div>
      )}

      {/* Main printable report container target for html2canvas */}
      <div id="interview-report-container" className="space-y-6 p-2 rounded-3xl">
        {/* Score & Category Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Overall Score Gauge */}
          <div className="lg:col-span-4 glass-card p-6 rounded-3xl border-indigo-500/30 flex flex-col justify-between text-center space-y-4">
            <span className="text-xs font-bold text-slate-400 font-mono-label uppercase tracking-wider">
              Overall Interview Score
            </span>

            <div className="relative inline-flex items-center justify-center self-center my-2">
              <div className="w-32 h-32 rounded-full border-4 border-indigo-500/30 flex flex-col items-center justify-center bg-indigo-950/40">
                <span className="text-4xl font-black text-white">{reportData.overallScore}</span>
                <span className="text-[10px] text-indigo-300 font-bold uppercase font-mono">/ 100 PASS</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans px-2">{reportData.summary}</p>
          </div>

          {/* Sub-Category Ratings & Speech Stats */}
          <div className="lg:col-span-8 glass-card p-6 rounded-3xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award size={18} className="text-indigo-400" /> Category & Speech Breakdown
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono-label uppercase block">Technical Depth</span>
                <span className="text-2xl font-black text-indigo-300 mt-1 block">
                  {reportData.categoryBreakdown.technicalAccuracy}%
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono-label uppercase block">Clarity & WPM</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                  {reportData.categoryBreakdown.communicationClarity}%
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono-label uppercase block">Problem Solving</span>
                <span className="text-2xl font-black text-sky-400 mt-1 block">
                  {reportData.categoryBreakdown.problemSolving}%
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono-label uppercase block">STAR Alignment</span>
                <span className="text-2xl font-black text-purple-400 mt-1 block">
                  {reportData.categoryBreakdown.starAlignment}%
                </span>
              </div>
            </div>

            {/* Speech Stats Banner */}
            {reportData.speechStats && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-mono">
                  <Mic size={16} className="text-indigo-400" />
                  <span>
                    Pace: <strong>{reportData.speechStats.wpm} WPM</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-mono">
                  <Clock size={16} className="text-amber-400" />
                  <span>
                    Fillers: <strong>{reportData.speechStats.fillerCount} detected</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                  <CheckCircle2 size={16} />
                  <span>Vocal Confidence: {reportData.speechStats.confidenceScore}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Question-by-Question Diagnostic Accordion */}
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Brain size={18} className="text-indigo-400" /> Question-by-Question Evaluation Accordion
          </h3>

          <div className="space-y-3">
            {reportData.questionsAndAnswers.map((qa, idx) => {
              const isExpanded = expandedQuestionIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-950/90 border border-slate-800 overflow-hidden transition-all"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-900/60 transition-all"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase">
                        Question #{idx + 1}
                      </span>
                      <p className="text-xs font-bold text-white">{qa.question}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold font-mono">
                        {qa.score}/100
                      </span>
                      {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-4 pt-2 border-t border-slate-800/80 space-y-4 text-xs font-sans">
                      <div className="space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                          Candidate Answer:
                        </span>
                        <p className="text-slate-300 italic">"{qa.answer}"</p>
                      </div>

                      <div className="space-y-1 bg-indigo-950/20 p-3 rounded-xl border border-indigo-500/20">
                        <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase flex items-center gap-1">
                          <Sparkles size={12} /> Gemini Feedback & Analysis:
                        </span>
                        <p className="text-slate-200">{qa.feedback}</p>
                      </div>

                      {qa.keyImprovement && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                          <Lightbulb size={15} className="shrink-0" />
                          <span>
                            <strong>Key Improvement Tip:</strong> {qa.keyImprovement}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive STAR Evaluator Live Tool */}
      <div className="glass-card p-6 rounded-3xl space-y-5 border-purple-500/30">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Target size={18} className="text-purple-400" /> Live STAR Framework Decomposition Tool
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Test any behavioral response against Gemini's STAR evaluator to view Situation, Task, Action, and Result score breakdowns.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Behavioral Question:</label>
            <input
              type="text"
              value={starQuestion}
              onChange={(e) => setStarQuestion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Your Behavioral Answer:</label>
            <textarea
              value={starAnswer}
              onChange={(e) => setStarAnswer(e.target.value)}
              placeholder="Structure your answer using Situation, Task, Action, and Result..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 resize-none min-h-[90px]"
            />
          </div>

          <button
            onClick={handleRunSTAREvaluator}
            disabled={isEvaluatingSTAR || !starAnswer.trim()}
            className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isEvaluatingSTAR ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Decomposing STAR Framework...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Evaluate with STAR Engine</span>
              </>
            )}
          </button>
        </div>

        {/* STAR Evaluation Output Card */}
        {starResult && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white">STAR Assessment Result</span>
              <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-mono font-extrabold text-xs">
                Score: {starResult.overallScore}/100
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Situation</span>
                <span className="text-lg font-bold text-indigo-300">{starResult.situation?.score}%</span>
                <p className="text-[11px] text-slate-400 mt-1">{starResult.situation?.feedback}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Task</span>
                <span className="text-lg font-bold text-emerald-300">{starResult.task?.score}%</span>
                <p className="text-[11px] text-slate-400 mt-1">{starResult.task?.feedback}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Action</span>
                <span className="text-lg font-bold text-sky-300">{starResult.action?.score}%</span>
                <p className="text-[11px] text-slate-400 mt-1">{starResult.action?.feedback}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Result</span>
                <span className="text-lg font-bold text-purple-300">{starResult.result?.score}%</span>
                <p className="text-[11px] text-slate-400 mt-1">{starResult.result?.feedback}</p>
              </div>
            </div>

            {starResult.rewrittenSample && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-indigo-300 flex items-center gap-1">
                  <Lightbulb size={13} /> High-Impact Rewritten Sample Response:
                </span>
                <p className="text-slate-300 leading-relaxed font-sans italic">{starResult.rewrittenSample}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
