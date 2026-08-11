import React, { useState, useEffect } from 'react';
import {
  Flame,
  Award,
  Zap,
  CheckCircle2,
  HelpCircle,
  Code,
  Brain,
  Sparkles,
  ChevronRight,
  Send,
  RefreshCw,
  Gift,
  Lock,
  MessageSquare
} from 'lucide-react';

interface ChallengeItem {
  id: string;
  category: string;
  title: string;
  question: string;
  difficulty: string;
  xpReward: number;
  hint: string;
  idealAnswerPoints: string[];
  options?: string[];
  correctOptionIndex?: number;
}

interface DailyChallengeData {
  date: string;
  xpBonusTotal: number;
  streakRequirement: number;
  challenges: ChallengeItem[];
}

const defaultChallengeData: DailyChallengeData = {
  date: new Date().toISOString().split('T')[0],
  xpBonusTotal: 300,
  streakRequirement: 7,
  challenges: [
    {
      id: 'c-hr-1',
      category: 'HR & Behavioral',
      title: 'Handling High-Pressure Outages',
      question: 'Describe a situation where a major bug reached production. How did you communicate with stakeholders while resolving the issue under pressure?',
      difficulty: 'Medium',
      xpReward: 75,
      hint: 'Frame using STAR. Highlight transparent status updates sent to leadership.',
      idealAnswerPoints: [
        'Immediate notification to affected teams.',
        'Clear root cause isolation methodology.',
        'Quantified resolution timeline and preventative safeguards.'
      ]
    },
    {
      id: 'c-tech-1',
      category: 'Technical System Design',
      title: 'Designing an Idempotent Payment API',
      question: 'How do you guarantee that a retry on a POST /api/v1/payments endpoint never double-charges a customer during network timeouts?',
      difficulty: 'Hard',
      xpReward: 100,
      hint: 'Use Idempotency Keys stored in Redis/DB with atomic transactions.',
      idealAnswerPoints: [
        'Require client-generated Idempotency-Key header.',
        'Atomically check and record payload in distributed lock storage.',
        'Return cached response on duplicate retry attempts.'
      ]
    },
    {
      id: 'c-code-1',
      category: 'Live Coding',
      title: 'Reverse Substring Between Parentheses',
      question: 'Given a string s with nested parentheses, reverse the strings in each pair of matching parentheses starting from the innermost pair.',
      difficulty: 'Medium',
      xpReward: 85,
      hint: 'Use a Stack to keep track of open parenthesis indices.',
      idealAnswerPoints: [
        'Iterate through string pushing characters to Stack.',
        'On ")" pop until "(" and reverse the collected array.',
        'Time Complexity: O(N^2) or O(N) using portal technique.'
      ]
    },
    {
      id: 'c-aptitude-1',
      category: 'Aptitude & Logic',
      title: 'Concurrency Deadlock Detection',
      question: 'If Process A holds Resource 1 and requests Resource 2, while Process B holds Resource 2 and requests Resource 1, which condition is occurring?',
      difficulty: 'Easy',
      xpReward: 50,
      hint: 'Think about mutual dependency in circular waiting.',
      options: ['Livelock', 'Circular Wait Deadlock', 'Starvation', 'Race Condition'],
      correctOptionIndex: 1,
      idealAnswerPoints: ['Circular Wait is one of the 4 Coffman conditions for deadlocks.']
    }
  ]
};

export default function DailyChallengeWidget() {
  const [data, setData] = useState<DailyChallengeData>(defaultChallengeData);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [selectedMcqOption, setSelectedMcqOption] = useState<Record<string, number>>({});
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());
  const [currentStreak, setCurrentStreak] = useState<number>(7);
  const [totalXp, setTotalXp] = useState<number>(2850);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const activeChallenge = data.challenges[activeIdx] || data.challenges[0];

  const handleClaimXp = async (challenge: ChallengeItem) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/gamification/claim-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          xpAmount: challenge.xpReward,
          streakBonus: 10
        })
      });

      const json = await res.json();
      if (json.data) {
        setClaimedIds((prev) => new Set(prev).add(challenge.id));
        setTotalXp(json.data.newTotalXp);
        setCurrentStreak(json.data.currentStreak);
        setFeedbackMsg(json.data.message);
      }
    } catch (err) {
      console.error('Error claiming XP:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Streak & XP Header Card */}
      <div className="glass-card p-6 rounded-3xl space-y-4 border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-indigo-950/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Flame size={28} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                DAILY INTERVIEW STREAK
              </span>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                {currentStreak} Day Streak Active! 🔥
              </h2>
              <p className="text-xs text-slate-300">Complete 1 challenge daily to keep your multiplier active.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Your Total XP</span>
              <span className="text-lg font-black text-amber-400 font-mono">{totalXp} XP</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Level</span>
              <span className="text-lg font-black text-indigo-400 font-mono">Rank #4</span>
            </div>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
          <Sparkles size={16} />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Challenge Carousel Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {data.challenges.map((c, idx) => {
          const isDone = claimedIds.has(c.id);
          const isActive = activeIdx === idx;

          return (
            <button
              key={c.id}
              onClick={() => setActiveIdx(idx)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {isDone ? <CheckCircle2 size={14} className="text-emerald-950" /> : <Zap size={14} />}
              <span>{c.category}</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900/60 text-[10px] font-mono">+{c.xpReward} XP</span>
            </button>
          );
        })}
      </div>

      {/* Active Challenge Card */}
      {activeChallenge && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border-indigo-500/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                {activeChallenge.category} • {activeChallenge.difficulty}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">{activeChallenge.title}</h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
              +{activeChallenge.xpReward} XP Reward
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-white leading-relaxed">{activeChallenge.question}</p>

            {/* If MCQ Options exist */}
            {activeChallenge.options && activeChallenge.options.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeChallenge.options.map((opt, optIdx) => {
                  const isSelected = selectedMcqOption[activeChallenge.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() =>
                        setSelectedMcqOption((prev) => ({
                          ...prev,
                          [activeChallenge.id]: optIdx
                        }))
                      }
                      className={`p-3.5 rounded-2xl text-xs font-semibold text-left transition-all border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-mono text-slate-400 mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Text Response Box */
              <textarea
                value={userAnswers[activeChallenge.id] || ''}
                onChange={(e) =>
                  setUserAnswers((prev) => ({
                    ...prev,
                    [activeChallenge.id]: e.target.value
                  }))
                }
                placeholder="Type your response or key solution steps..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none min-h-[110px]"
              />
            )}
          </div>

          {/* Hint & Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400 italic">💡 Hint: {activeChallenge.hint}</span>

            <button
              onClick={() => handleClaimXp(activeChallenge)}
              disabled={claimedIds.has(activeChallenge.id) || isSubmitting}
              className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 active:scale-95 disabled:opacity-50 shrink-0"
            >
              {claimedIds.has(activeChallenge.id) ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>Completed & Claimed</span>
                </>
              ) : (
                <>
                  <Gift size={15} />
                  <span>Submit & Claim +{activeChallenge.xpReward} XP</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
