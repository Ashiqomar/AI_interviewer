import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Zap, AlertTriangle, Code, Lightbulb, Copy, Check } from 'lucide-react';

export interface TestCaseResult {
  id: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTimeMs: number;
}

export interface CodeEvaluationData {
  status: string;
  score: number;
  timeComplexity: string;
  spaceComplexity: string;
  testCaseResults: TestCaseResult[];
  bugAnalysis: string;
  optimizationTips: string[];
  refactoredCode: string;
}

interface CodeConsoleProps {
  evaluation: CodeEvaluationData | null;
  isEvaluating: boolean;
  onApplyRefactoredCode?: (code: string) => void;
}

export default function CodeConsole({ evaluation, isEvaluating, onApplyRefactoredCode }: CodeConsoleProps) {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'testcases' | 'analysis' | 'solution'>('testcases');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isEvaluating) {
    return (
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 text-center space-y-3 min-h-[220px] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400 animate-spin">
          <Zap size={20} />
        </div>
        <p className="text-xs font-bold text-white">Gemini Static Code Evaluation in Progress...</p>
        <p className="text-[11px] text-slate-400 max-w-sm">
          Analyzing boundary conditions, syntax correctness, test case execution, and Big-O efficiency.
        </p>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 text-center text-xs text-slate-500 min-h-[160px] flex flex-col items-center justify-center">
        <Code size={24} className="mb-2 text-slate-600" />
        <p>Run your code or submit for AI analysis to view test cases and Big-O evaluation.</p>
      </div>
    );
  }

  const passedCases = evaluation.testCaseResults?.filter((tc) => tc.passed).length || 0;
  const totalCases = evaluation.testCaseResults?.length || 0;
  const isAllPassed = passedCases === totalCases && totalCases > 0;

  return (
    <div className="rounded-2xl bg-slate-950/90 border border-slate-800 overflow-hidden flex flex-col">
      {/* Console Top Header & Status Metrics */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-xl text-xs font-extrabold border flex items-center gap-1.5 ${
              isAllPassed
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            {isAllPassed ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            {evaluation.status || (isAllPassed ? 'Accepted' : 'Wrong Answer')}
          </span>

          <span className="text-xs font-mono text-slate-300">
            Score: <strong className="text-indigo-300">{evaluation.score}/100</strong>
          </span>
        </div>

        {/* Big-O Complexity Badges */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold">
            Time: {evaluation.timeComplexity || 'O(N)'}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold">
            Space: {evaluation.spaceComplexity || 'O(1)'}
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950 px-4 pt-2 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveConsoleTab('testcases')}
          className={`px-3 py-1.5 rounded-t-xl border-t border-x transition-all ${
            activeConsoleTab === 'testcases'
              ? 'bg-slate-900 text-white border-slate-700'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Test Cases ({passedCases}/{totalCases})
        </button>

        <button
          onClick={() => setActiveConsoleTab('analysis')}
          className={`px-3 py-1.5 rounded-t-xl border-t border-x transition-all ${
            activeConsoleTab === 'analysis'
              ? 'bg-slate-900 text-white border-slate-700'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          AI Bug Analysis & Tips
        </button>

        <button
          onClick={() => setActiveConsoleTab('solution')}
          className={`px-3 py-1.5 rounded-t-xl border-t border-x transition-all ${
            activeConsoleTab === 'solution'
              ? 'bg-slate-900 text-white border-slate-700'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Optimal Solution
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 space-y-4 text-xs font-mono max-h-[280px] overflow-y-auto custom-scrollbar">
        {activeConsoleTab === 'testcases' && (
          <div className="space-y-3">
            {evaluation.testCaseResults?.map((tc) => (
              <div
                key={tc.id}
                className={`p-3 rounded-xl border ${
                  tc.passed
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                    : 'bg-rose-950/20 border-rose-500/30 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2 text-[11px]">
                  <span className="font-bold flex items-center gap-1.5">
                    {tc.passed ? (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    ) : (
                      <XCircle size={14} className="text-rose-400" />
                    )}
                    Test Case #{tc.id}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock size={12} /> {tc.executionTimeMs}ms
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Input:</span>
                    <span className="text-slate-300 font-semibold truncate block">{tc.input}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Expected:</span>
                    <span className="text-emerald-400 font-semibold truncate block">{tc.expectedOutput}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Actual Output:</span>
                    <span
                      className={`font-semibold truncate block ${
                        tc.passed ? 'text-emerald-400' : 'text-rose-400 font-bold'
                      }`}
                    >
                      {tc.actualOutput}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeConsoleTab === 'analysis' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5 text-xs">
                <AlertTriangle size={15} className="text-amber-400" /> Static Analysis & Bug Report
              </span>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">{evaluation.bugAnalysis}</p>
            </div>

            {evaluation.optimizationTips?.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold text-slate-300 flex items-center gap-1.5 text-xs font-sans">
                  <Lightbulb size={15} className="text-amber-400" /> Actionable Refactoring Tips:
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-400 font-sans text-xs">
                  {evaluation.optimizationTips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeConsoleTab === 'solution' && (
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Refactored Optimal Code:</span>
              <div className="flex items-center gap-2">
                {onApplyRefactoredCode && (
                  <button
                    onClick={() => onApplyRefactoredCode(evaluation.refactoredCode)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-all"
                  >
                    Apply to Editor
                  </button>
                )}
                <button
                  onClick={() => handleCopyCode(evaluation.refactoredCode)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-200 overflow-x-auto whitespace-pre-wrap">
              {evaluation.refactoredCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
