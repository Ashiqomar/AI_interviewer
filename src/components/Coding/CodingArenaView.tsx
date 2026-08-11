import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, RefreshCw, Code, Sparkles, AlertCircle, BookOpen, Layers, CheckCircle2, Copy } from 'lucide-react';
import CodeConsole, { CodeEvaluationData } from './CodeConsole';

interface ProblemData {
  title: string;
  difficulty: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  sampleTestCases: Array<{ input: string; expectedOutput: string; explanation?: string }>;
  starterCode: Record<string, string>;
}

export default function CodingArenaView() {
  const [topic, setTopic] = useState<string>('Data Structures');
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [language, setLanguage] = useState<string>('javascript');
  const [editorTheme, setEditorTheme] = useState<string>('vs-dark');

  const [problem, setProblem] = useState<ProblemData | null>({
    title: 'LRU Cache Implementation',
    difficulty: 'Medium',
    description:
      'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.\n- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the key if it exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds capacity, evict the least recently used key.',
    inputFormat: 'Capacity N, followed by sequences of get(key) and put(key, value) calls.',
    outputFormat: 'Values returned by get operations.',
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put'
    ],
    sampleTestCases: [
      {
        input: 'LRUCache(2), put(1, 1), put(2, 2), get(1), put(3, 3), get(2)',
        expectedOutput: '[null, null, null, 1, null, -1]',
        explanation: 'get(2) returns -1 because key 2 was evicted when key 3 was inserted.'
      }
    ],
    starterCode: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    this.map.set(key, value);\n    if (this.map.size > this.capacity) {\n      const oldestKey = this.map.keys().next().value;\n      this.map.delete(oldestKey);\n    }\n  }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        from collections import OrderedDict\n        self.capacity = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)`,
      java: `import java.util.LinkedHashMap;\nimport java.util.Map;\n\nclass LRUCache extends LinkedHashMap<Integer, Integer> {\n    private int capacity;\n    public LRUCache(int capacity) {\n        super(capacity, 0.75f, true);\n        this.capacity = capacity;\n    }\n    public int get(int key) {\n        return super.getOrDefault(key, -1);\n    }\n    public void put(int key, int value) {\n        super.put(key, value);\n    }\n}`,
      cpp: `#include <unordered_map>\n#include <list>\nusing namespace std;\n\nclass LRUCache {\n    int cap;\n    list<pair<int, int>> l;\n    unordered_map<int, list<pair<int, int>>::iterator> m;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        if (m.find(key) == m.end()) return -1;\n        l.splice(l.begin(), l, m[key]);\n        return m[key]->second;\n    }\n};`,
      c: `// C Hash Map implementation\ntypedef struct Node {\n    int key, value;\n    struct Node *prev, *next;\n} Node;`
    }
  });

  const [code, setCode] = useState<string>(problem?.starterCode[language] || '');
  const [isGeneratingProblem, setIsGeneratingProblem] = useState<boolean>(false);
  const [isEvaluatingCode, setIsEvaluatingCode] = useState<boolean>(false);
  const [evaluationData, setEvaluationData] = useState<CodeEvaluationData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update starter code when language changes
  useEffect(() => {
    if (problem && problem.starterCode && problem.starterCode[language]) {
      setCode(problem.starterCode[language]);
    }
  }, [language, problem]);

  const handleGenerateProblem = async () => {
    setIsGeneratingProblem(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/coding/generate-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty })
      });

      const json = await res.json();
      if (json.data) {
        setProblem(json.data);
        if (json.data.starterCode && json.data.starterCode[language]) {
          setCode(json.data.starterCode[language]);
        }
        setEvaluationData(null);
      }
    } catch (err: any) {
      console.error('Error generating coding problem:', err);
      setErrorMessage('Failed to generate problem. Please verify backend service.');
    } finally {
      setIsGeneratingProblem(false);
    }
  };

  const handleRunAndEvaluateCode = async () => {
    if (!code.trim() || !problem) return;

    setIsEvaluatingCode(true);
    setErrorMessage(null);

    try {
      const testCasesToEvaluate = problem.sampleTestCases.map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput
      }));

      const res = await fetch('/api/coding/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem.title,
          problemDescription: problem.description,
          code,
          language,
          testCases: testCasesToEvaluate
        })
      });

      const json = await res.json();
      if (json.data) {
        setEvaluationData(json.data);
      }
    } catch (err: any) {
      console.error('Error evaluating code:', err);
      setErrorMessage('Failed to evaluate code with Gemini static analyzer.');
    } finally {
      setIsEvaluatingCode(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Generator Controls */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Code size={22} className="text-indigo-400" /> Online Coding Arena & AI Code Evaluator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Practice LeetCode-style technical challenges with Gemini-powered static analysis, Big-O calculation, and test case feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
            >
              <option value="Data Structures">Data Structures & Hash Maps</option>
              <option value="Algorithms">Dynamic Programming & Greedy</option>
              <option value="Trees & Graphs">Trees, Graphs & BFS/DFS</option>
              <option value="System Design">Concurrency & State Engines</option>
            </select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <button
              onClick={handleGenerateProblem}
              disabled={isGeneratingProblem}
              className="gradient-btn px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
            >
              {isGeneratingProblem ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <Sparkles size={15} />
              )}
              <span>Generate New Challenge</span>
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Dual-Pane Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Problem Statement & Test Cases */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl space-y-5 max-h-[720px] overflow-y-auto custom-scrollbar">
          {problem ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-lg font-bold text-white">{problem.title}</h4>
                <span
                  className={`px-3 py-0.5 rounded-full text-[11px] font-bold border ${
                    problem.difficulty === 'Easy'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : problem.difficulty === 'Hard'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                <span className="font-bold text-indigo-300 uppercase tracking-wider font-mono-label block text-[10px]">
                  Problem Description
                </span>
                <p className="whitespace-pre-wrap">{problem.description}</p>
              </div>

              {/* Constraints */}
              {problem.constraints?.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="font-bold text-slate-400 uppercase tracking-wider font-mono-label text-[10px]">
                    Constraints
                  </span>
                  <ul className="list-disc list-inside text-[11px] font-mono text-slate-400 space-y-1">
                    {problem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample Test Cases */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <span className="font-bold text-slate-400 uppercase tracking-wider font-mono-label text-[10px] block">
                  Sample Test Cases
                </span>
                {problem.sampleTestCases?.map((tc, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1.5">
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase">Input:</span>
                      <span className="text-slate-200">{tc.input}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase">Expected Output:</span>
                      <span className="text-emerald-400 font-bold">{tc.expectedOutput}</span>
                    </div>
                    {tc.explanation && (
                      <p className="text-[11px] text-slate-400 font-sans italic pt-1">{tc.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">Generating coding problem...</div>
          )}
        </div>

        {/* Right Pane: Editor & Output Console */}
        <div className="lg:col-span-7 space-y-4">
          {/* Editor Header Bar */}
          <div className="p-4 rounded-3xl glass-card flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-indigo-300 font-mono font-bold focus:outline-none focus:border-indigo-500"
              >
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="python">Python 3</option>
                <option value="java">Java 17</option>
                <option value="cpp">C++ 20</option>
                <option value="c">C Language</option>
              </select>

              <select
                value={editorTheme}
                onChange={(e) => setEditorTheme(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400 focus:outline-none focus:border-indigo-500"
              >
                <option value="vs-dark">VS Dark Theme</option>
                <option value="light">Light Theme</option>
              </select>
            </div>

            <button
              onClick={handleRunAndEvaluateCode}
              disabled={isEvaluatingCode}
              className="gradient-btn px-6 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
            >
              {isEvaluatingCode ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <Play size={15} />
              )}
              <span>Run & Submit Solution</span>
            </button>
          </div>

          {/* Monaco Code Editor */}
          <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
            <Editor
              height="360px"
              language={language === 'cpp' || language === 'c' ? 'cpp' : language}
              theme={editorTheme}
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                fontFamily: "'Fira Code', 'Cascadia Code', monospace"
              }}
            />
          </div>

          {/* Execution Output & AI CodeConsole */}
          <CodeConsole
            evaluation={evaluationData}
            isEvaluating={isEvaluatingCode}
            onApplyRefactoredCode={(newCode) => setCode(newCode)}
          />
        </div>
      </div>
    </div>
  );
}
