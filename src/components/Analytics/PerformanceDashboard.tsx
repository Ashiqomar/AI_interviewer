import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar
} from 'recharts';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Brain,
  Zap,
  Target,
  CheckCircle2,
  Clock,
  Mic,
  Code,
  Sparkles,
  Filter,
  BarChart3,
  Calendar
} from 'lucide-react';

interface TrendDataPoint {
  date: string;
  technical: number;
  communication: number;
  coding: number;
  behavioral: number;
  overall: number;
}

interface SkillRadarDataPoint {
  subject: string;
  score: number;
  target: number;
  fullMark: number;
}

const mockTrendData7Days: TrendDataPoint[] = [
  { date: 'Jul 24', technical: 68, communication: 72, coding: 65, behavioral: 70, overall: 69 },
  { date: 'Jul 25', technical: 72, communication: 75, coding: 70, behavioral: 76, overall: 73 },
  { date: 'Jul 26', technical: 78, communication: 79, coding: 74, behavioral: 80, overall: 78 },
  { date: 'Jul 27', technical: 82, communication: 81, coding: 80, behavioral: 84, overall: 82 },
  { date: 'Jul 28', technical: 80, communication: 85, coding: 85, behavioral: 86, overall: 84 },
  { date: 'Jul 29', technical: 88, communication: 88, coding: 90, behavioral: 89, overall: 89 },
  { date: 'Jul 30', technical: 92, communication: 90, coding: 92, behavioral: 93, overall: 92 }
];

const mockTrendData30Days: TrendDataPoint[] = [
  { date: 'W1', technical: 60, communication: 65, coding: 58, behavioral: 62, overall: 61 },
  { date: 'W2', technical: 70, communication: 72, coding: 68, behavioral: 74, overall: 71 },
  { date: 'W3', technical: 80, communication: 82, coding: 81, behavioral: 83, overall: 81 },
  { date: 'W4', technical: 91, communication: 89, coding: 92, behavioral: 91, overall: 91 }
];

const mockRadarData: SkillRadarDataPoint[] = [
  { subject: 'System Design', score: 88, target: 90, fullMark: 100 },
  { subject: 'Algorithms & DS', score: 92, target: 85, fullMark: 100 },
  { subject: 'Communication & WPM', score: 85, target: 90, fullMark: 100 },
  { subject: 'STAR Framework', score: 90, target: 85, fullMark: 100 },
  { subject: 'Concurrency & OS', score: 74, target: 85, fullMark: 100 },
  { subject: 'Database & Caching', score: 86, target: 85, fullMark: 100 }
];

const mockStarBreakdownData = [
  { phase: 'Situation (Context)', score: 88 },
  { phase: 'Task (Ownership)', score: 82 },
  { phase: 'Action (Specific Steps)', score: 94 },
  { phase: 'Result (Metrics & Impact)', score: 76 }
];

export default function PerformanceDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [selectedRole, setSelectedRole] = useState<string>('Senior Full-Stack Engineer');

  const currentTrendData = timeRange === '7d' ? mockTrendData7Days : mockTrendData30Days;

  return (
    <div className="space-y-6">
      {/* Top Banner & Readiness Overview */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border-indigo-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
              LONGITUDINAL INTERVIEW READINESS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 flex items-center gap-2">
              Performance Analytics & Skill Radar
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Track your interview mastery across Technical Depth, Voice Communication, Coding Efficiency, and STAR Behavioral alignment over time.
            </p>
          </div>

          {/* Time & Role Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeRange === '7d' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeRange === '30d' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Last 30 Days
              </button>
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2 text-xs text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="Senior Full-Stack Engineer">Senior Full-Stack Engineer</option>
              <option value="Lead Backend Architect">Lead Backend Architect</option>
              <option value="Engineering Manager">Engineering Manager</option>
            </select>
          </div>
        </div>

        {/* Readiness Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {/* Readiness Gauge */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono-label">Overall Readiness</span>
            <div className="text-3xl font-black text-indigo-400 mt-1 flex items-baseline gap-1">
              89%
              <span className="text-xs font-normal text-emerald-400 font-sans">+14% vs last week</span>
            </div>
            <span className="text-[11px] text-emerald-300 font-semibold mt-2 flex items-center gap-1">
              <CheckCircle2 size={13} /> Highly Prepared
            </span>
          </div>

          {/* Average WPM & Pace */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono-label">Speaking Speed & Pace</span>
            <div className="text-3xl font-black text-white mt-1">
              138 <span className="text-xs font-normal text-slate-400">WPM</span>
            </div>
            <span className="text-[11px] text-indigo-300 font-semibold mt-2 flex items-center gap-1">
              <Mic size={13} /> Optimal Flow (130-150 WPM)
            </span>
          </div>

          {/* Coding Problem Score */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono-label">Algorithmic Efficiency</span>
            <div className="text-3xl font-black text-emerald-400 mt-1">
              92/100
            </div>
            <span className="text-[11px] text-slate-400 font-semibold mt-2 flex items-center gap-1">
              <Code size={13} /> Avg Time: O(N log N)
            </span>
          </div>

          {/* STAR Alignment */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono-label">STAR Behavioral Score</span>
            <div className="text-3xl font-black text-purple-400 mt-1">
              86%
            </div>
            <span className="text-[11px] text-amber-300 font-semibold mt-2 flex items-center gap-1">
              <AlertTriangle size={13} /> Needs Result Metrics
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Historical Trend Line Chart */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-400" /> Multi-Domain Score Trajectory
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Historical progress across Technical, Speech, Coding, & Behavioral categories</p>
            </div>
          </div>

          <div className="h-[320px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[40, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '1rem', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="overall" name="Overall Readiness" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="technical" name="Technical Depth" stroke="#38bdf8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="coding" name="Coding Arena" stroke="#34d399" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="behavioral" name="STAR Behavioral" stroke="#c084fc" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Skill Radar Chart */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target size={18} className="text-indigo-400" /> Skill Domain Mastery Radar
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Current performance vs benchmark for {selectedRole}</p>
            </div>
          </div>

          <div className="h-[320px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={mockRadarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar name="Candidate Score" dataKey="score" stroke="#818cf8" fill="#6366f1" fillOpacity={0.4} />
                <Radar name="Role Target Benchmark" dataKey="target" stroke="#34d399" fill="#10b981" fillOpacity={0.15} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* STAR Breakdown & AI Preparation Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: STAR Framework Alignment Breakdown */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <BarChart3 size={18} className="text-indigo-400" /> STAR Framework Component Scores
          </h3>

          <div className="space-y-3">
            {mockStarBreakdownData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">{item.phase}</span>
                  <span className="font-mono font-bold text-indigo-300">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 border border-slate-800 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      item.score >= 85 ? 'bg-gradient-to-r from-indigo-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-indigo-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI-Identified Weak Areas & Recommended Focus */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles size={18} className="text-amber-400" /> High-Priority AI Focus Recommendations
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle size={14} /> Quantify Result Metrics in Behavioral Answers
              </span>
              <p className="text-slate-300 leading-relaxed">
                Your STAR Action scores are high (94%), but your Result section averages 76%. Always quantify outcomes using metrics like % latency reduction or revenue saved.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs space-y-1">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                <Brain size={14} /> Deepen Concurrency & Memory Management
              </span>
              <p className="text-slate-300 leading-relaxed">
                In system design mock questions, practice explaining mutexes, atomic operations, and cache invalidation strategies under distributed load.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
