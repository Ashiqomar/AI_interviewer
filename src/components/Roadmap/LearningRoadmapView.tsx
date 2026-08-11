import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  BookOpen,
  Code,
  Target,
  ChevronRight,
  RefreshCw,
  Award,
  BarChart2,
  Lightbulb,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface Module {
  id: string;
  topic: string;
  description: string;
  estimatedHours: number;
  keyTakeaways: string[];
  practiceExercise: string;
  recommendedResources?: string[];
}

interface WeekPlan {
  weekNumber: number;
  title: string;
  focusGoal: string;
  modules: Module[];
}

interface RoadmapData {
  title: string;
  targetRole: string;
  durationWeeks: number;
  summary: string;
  weeks: WeekPlan[];
}

const defaultRoadmap: RoadmapData = {
  title: "4-Week Personalized Interview Mastery Plan",
  targetRole: "Senior Full-Stack Engineer",
  durationWeeks: 4,
  summary: "Tailored 4-week accelerator addressing system design bottlenecks, STAR metric quantification, and live coding speed.",
  weeks: [
    {
      weekNumber: 1,
      title: "Week 1: STAR Behavioral Framework & Result Metrics",
      focusGoal: "Transform qualitative narrative into high-impact metric statements ($ ROI, SLA recovery, % latency drops).",
      modules: [
        {
          id: "w1-m1",
          topic: "Structuring Action vs Task",
          description: "Eliminate vague 'we' statements. Establish direct leadership ownership using strong action verbs.",
          estimatedHours: 3,
          keyTakeaways: ["Limit Situation to 20% of time", "Use precise technical verbs like 'profiled', 'refactored', 'orchestrated'"],
          practiceExercise: "Record a 2-minute response for a production outage scenario.",
          recommendedResources: ["STAR Response Cheat Sheet", "High-Impact Verbs Playbook"]
        },
        {
          id: "w1-m2",
          topic: "Quantifying Business Outcomes",
          description: "Incorporate concrete metrics into every result statement.",
          estimatedHours: 4,
          keyTakeaways: ["Calculate engineering time saved", "Include SLA uptime percentages"],
          practiceExercise: "Draft metric metrics for your last 3 major engineering deliverables.",
          recommendedResources: ["Engineering Metrics Playbook"]
        }
      ]
    },
    {
      weekNumber: 2,
      title: "Week 2: Advanced System Design & Scalability",
      focusGoal: "Master distributed caching, database sharding, and message queue decouplers.",
      modules: [
        {
          id: "w2-m1",
          topic: "Distributed Caching & Stampede Prevention",
          description: "Deep dive into Redis/Memcached patterns, TTL strategies, and locks.",
          estimatedHours: 6,
          keyTakeaways: ["Probabilistic early expiration", "Write-through vs write-back caching"],
          practiceExercise: "Design a high-throughput rate limiter for flash-sale spikes.",
          recommendedResources: ["System Design Primer", "Redis Invalidation Guide"]
        }
      ]
    },
    {
      weekNumber: 3,
      title: "Week 3: Algorithmic Efficiency & Live Coding Speed",
      focusGoal: "Elevate problem-solving speed in graph traversals and dynamic programming.",
      modules: [
        {
          id: "w3-m1",
          topic: "Sliding Window & Two-Pointer Patterns",
          description: "Solve linear array and substring problems efficiently in O(N) time.",
          estimatedHours: 5,
          keyTakeaways: ["Identify window contraction triggers", "Optimize auxiliary space to O(1)"],
          practiceExercise: "Solve 5 medium sliding window problems in under 15 minutes each.",
          recommendedResources: ["LeetCode Top 75 Patterns"]
        }
      ]
    },
    {
      weekNumber: 4,
      title: "Week 4: Mock Simulation & Executive Polish",
      focusGoal: "Simulate pressure conditions with AI voice mock interviews and diagnostic PDF reports.",
      modules: [
        {
          id: "w4-m1",
          topic: "Full-Loop AI Voice Interview",
          description: "Complete 30-minute voice mock and target zero filler word hesitation.",
          estimatedHours: 4,
          keyTakeaways: ["Maintain steady 130-150 WPM cadence", "Speak with decisive tone"],
          practiceExercise: "Achieve >85 Global IQ score in Voice Mock workspace.",
          recommendedResources: ["InterviewIQ Final Readiness Checklist"]
        }
      ]
    }
  ]
};

export default function LearningRoadmapView() {
  const [roadmap, setRoadmap] = useState<RoadmapData>(defaultRoadmap);
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({
    'w1-m1': true
  });
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [selectedModule, setSelectedModule] = useState<Module | null>(defaultRoadmap.weeks[0].modules[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [targetRoleInput, setTargetRoleInput] = useState<string>("Senior Full-Stack Engineer");
  const [weakAreasInput, setWeakAreasInput] = useState<string>("System Design, STAR Result Quantification, Dynamic Programming");

  // Calculate completion percentage
  const totalModules = roadmap.weeks.reduce((acc, w) => acc + w.modules.length, 0);
  const completedCount = Object.values(completedModules).filter(Boolean).length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const toggleModuleCompletion = (id: string) => {
    setCompletedModules((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleRegenerateRoadmap = async () => {
    setIsLoading(true);
    try {
      const weakAreasList = weakAreasInput.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: targetRoleInput,
          weakAreas: weakAreasList,
          targetCompany: "Tier 1 Tech"
        })
      });

      const json = await res.json();
      if (json.data && json.data.weeks) {
        setRoadmap(json.data);
        setActiveWeek(1);
        if (json.data.weeks[0]?.modules[0]) {
          setSelectedModule(json.data.weeks[0].modules[0]);
        }
      }
    } catch (err) {
      console.error('Error generating roadmap:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Progress Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border-indigo-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
              AI-CURATED STUDY ACCELERATOR
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
              <Calendar size={28} className="text-indigo-400" /> 4-Week Personal Learning Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Dynamically synthesized by Gemini based on your diagnostic mock performance and identified technical gaps.
            </p>
          </div>

          {/* Overall Progress Gauge */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shrink-0 flex items-center gap-5 min-w-[220px]">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="26" fill="transparent" stroke="#1e293b" strokeWidth="6" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="transparent"
                  stroke="#6366f1"
                  strokeWidth="6"
                  strokeDasharray="163"
                  strokeDashoffset={163 - (163 * progressPercent) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-sm font-black text-white">{progressPercent}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Roadmap Progress</span>
              <span className="text-sm font-bold text-white mt-0.5 block">
                {completedCount} / {totalModules} Modules
              </span>
              <span className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle2 size={13} /> {completedCount === totalModules ? 'Roadmap Complete!' : 'In Progress'}
              </span>
            </div>
          </div>
        </div>

        {/* Custom Input Controls to Regenerate Roadmap */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Customize Curriculum Parameters:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-4">
              <label className="text-[11px] text-slate-400 block mb-1">Target Role:</label>
              <input
                type="text"
                value={targetRoleInput}
                onChange={(e) => setTargetRoleInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-5">
              <label className="text-[11px] text-slate-400 block mb-1">Weak Focus Topics:</label>
              <input
                type="text"
                value={weakAreasInput}
                onChange={(e) => setWeakAreasInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-3 flex items-end">
              <button
                onClick={handleRegenerateRoadmap}
                disabled={isLoading}
                className="w-full gradient-btn px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                <span>{isLoading ? 'Synthesizing...' : 'Re-generate Plan'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {roadmap.weeks.map((week) => {
          const isActive = activeWeek === week.weekNumber;
          const weekCompleted = week.modules.every((m) => completedModules[m.id]);

          return (
            <button
              key={week.weekNumber}
              onClick={() => {
                setActiveWeek(week.weekNumber);
                if (week.modules[0]) setSelectedModule(week.modules[0]);
              }}
              className={`px-5 py-3 rounded-2xl text-xs font-bold font-mono transition-all flex items-center gap-2 shrink-0 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {weekCompleted ? <CheckCircle2 size={15} className="text-emerald-300" /> : <Circle size={15} />}
              <span>Week {week.weekNumber}</span>
            </button>
          );
        })}
      </div>

      {/* Main Roadmap Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timeline Modules for Selected Week */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl space-y-4">
          {roadmap.weeks
            .filter((w) => w.weekNumber === activeWeek)
            .map((week) => (
              <div key={week.weekNumber} className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">
                    WEEK {week.weekNumber} FOCUS GOAL
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{week.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 italic leading-relaxed">{week.focusGoal}</p>
                </div>

                {/* Vertical Module Checklist Timeline */}
                <div className="space-y-3 pt-1">
                  {week.modules.map((module, idx) => {
                    const isDone = Boolean(completedModules[module.id]);
                    const isSelected = selectedModule?.id === module.id;

                    return (
                      <div
                        key={module.id}
                        onClick={() => setSelectedModule(module)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleModuleCompletion(module.id);
                              }}
                              className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors"
                            >
                              {isDone ? (
                                <CheckCircle2 size={20} className="text-emerald-400" />
                              ) : (
                                <Circle size={20} />
                              )}
                            </button>

                            <div className="space-y-1">
                              <span
                                className={`text-xs font-bold block ${
                                  isDone ? 'text-slate-400 line-through' : 'text-white'
                                }`}
                              >
                                {module.topic}
                              </span>
                              <p className="text-xs text-slate-400 line-clamp-2">{module.description}</p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                              <Clock size={11} /> {module.estimatedHours}h
                            </span>
                            <ChevronRight size={16} className="text-slate-500 mt-1" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

        {/* Right Column: Active Module Deep-Dive Inspector */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl space-y-5 border-indigo-500/20 sticky top-6">
          {selectedModule ? (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">MODULE DETAILS</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedModule.topic}</h3>
                </div>
                <button
                  onClick={() => toggleModuleCompletion(selectedModule.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    completedModules[selectedModule.id]
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-500'
                  }`}
                >
                  {completedModules[selectedModule.id] ? '✓ Marked Done' : 'Mark Complete'}
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-300 block">Overview:</span>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedModule.description}</p>
              </div>

              {/* Key Takeaways */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Lightbulb size={14} /> Key Architectural Concepts:
                </span>
                <ul className="space-y-1.5 pl-2">
                  {selectedModule.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practical Exercise */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Code size={14} /> Recommended Action Item:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedModule.practiceExercise}</p>
              </div>

              {/* Resources */}
              {selectedModule.recommendedResources && selectedModule.recommendedResources.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <BookOpen size={14} className="text-purple-400" /> Study Resources:
                  </span>
                  <div className="space-y-1.5">
                    {selectedModule.recommendedResources.map((res, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between hover:border-slate-700"
                      >
                        <span className="truncate">{res}</span>
                        <ArrowUpRight size={14} className="text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">Select a module from the roadmap to inspect details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
