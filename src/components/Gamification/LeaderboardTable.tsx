import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Zap,
  Flame,
  Code,
  Cpu,
  Shield,
  Star,
  CheckCircle2,
  Lock,
  User,
  Users
} from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  targetRole: string;
  xp: number;
  streakDays: number;
  badges: string[];
  isCurrentUser?: boolean;
}

interface BadgeItem {
  id: string;
  name: string;
  iconName: string;
  description: string;
  unlocked: boolean;
}

const mockLeaderboard: LeaderboardUser[] = [
  {
    rank: 1,
    name: "Alex Rivera",
    targetRole: "Staff Software Engineer",
    xp: 4250,
    streakDays: 18,
    badges: ["Code Ninja", "STAR Master", "System Architect", "Streak Titan"]
  },
  {
    rank: 2,
    name: "Priya Sharma",
    targetRole: "Lead Frontend Engineer",
    xp: 3890,
    streakDays: 14,
    badges: ["STAR Master", "Code Ninja", "Speed Demon"]
  },
  {
    rank: 3,
    name: "Marcus Chen",
    targetRole: "Senior Backend Architect",
    xp: 3450,
    streakDays: 12,
    badges: ["System Architect", "Database Guru"]
  },
  {
    rank: 4,
    name: "Candidate (You)",
    targetRole: "Senior Full-Stack Engineer",
    xp: 2850,
    streakDays: 7,
    badges: ["STAR Master", "Code Ninja"],
    isCurrentUser: true
  },
  {
    rank: 5,
    name: "Sophia Martinez",
    targetRole: "Engineering Manager",
    xp: 2600,
    streakDays: 5,
    badges: ["STAR Master"]
  }
];

const mockBadges: BadgeItem[] = [
  { id: 'b1', name: 'Code Ninja', iconName: 'Code', description: 'Solved 10+ live coding challenges under 15 minutes.', unlocked: true },
  { id: 'b2', name: 'STAR Master', iconName: 'Award', description: 'Achieved >85 score in behavioral response evaluations.', unlocked: true },
  { id: 'b3', name: 'System Architect', iconName: 'Cpu', description: 'Completed full distributed system design mock loop.', unlocked: false },
  { id: 'b4', name: 'Streak Titan', iconName: 'Flame', description: 'Maintained a 7-day consecutive interview practice streak.', unlocked: true },
  { id: 'b5', name: 'Speed Demon', iconName: 'Zap', description: 'Maintained 130-150 WPM voice pace without fillers.', unlocked: false },
  { id: 'b6', name: 'Database Guru', iconName: 'Shield', description: 'Mastered database indexing and query optimization.', unlocked: false }
];

interface LeaderboardTableProps {
  currentUserName?: string;
}

export default function LeaderboardTable({ currentUserName = "Alex Rivera" }: LeaderboardTableProps) {
  const [users, setUsers] = useState<LeaderboardUser[]>(mockLeaderboard);
  const [badges, setBadges] = useState<BadgeItem[]>(mockBadges);

  useEffect(() => {
    fetch('/api/gamification/leaderboard')
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.leaderboard) {
          setUsers(json.data.leaderboard);
        }
      })
      .catch((err) => console.error('Error fetching leaderboard:', err));
  }, []);

  return (
    <div className="space-y-8">
      {/* Badge Showcase Grid */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border-indigo-500/30">
        <div className="border-b border-slate-800 pb-3">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
            ACHIEVEMENTS & TROPHIES
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2 flex items-center gap-2">
            <Trophy size={24} className="text-amber-400" /> InterviewIQ Badge Showcase
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Earn badges by passing mock interviews, maintaining daily practice streaks, and optimizing STAR metric depth.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between space-y-2 transition-all ${
                b.unlocked
                  ? 'bg-indigo-950/40 border-indigo-500/50 text-white shadow-lg shadow-indigo-600/10'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                  b.unlocked ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-900 text-slate-600 border-slate-800'
                }`}
              >
                {b.unlocked ? <Award size={20} /> : <Lock size={18} />}
              </div>

              <div>
                <span className="text-xs font-bold block">{b.name}</span>
                <p className="text-[10px] text-slate-400 leading-tight mt-1 line-clamp-2">{b.description}</p>
              </div>

              <span className={`text-[9px] font-mono font-bold uppercase ${b.unlocked ? 'text-emerald-400' : 'text-slate-600'}`}>
                {b.unlocked ? '✓ Unlocked' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Global Leaderboard Table */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Users size={22} className="text-indigo-400" /> Global Candidate Readiness Leaderboard
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Updated live based on total accumulated XP & consecutive streak days</p>
          </div>

          <span className="px-3 py-1.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono">
            Season #4 Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono font-bold text-slate-400 uppercase">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Target Role</th>
                <th className="py-3 px-4">Streak</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr
                  key={u.rank}
                  className={`transition-colors ${
                    u.isCurrentUser ? 'bg-indigo-950/60 font-bold border-l-4 border-l-indigo-500' : 'hover:bg-slate-900/40'
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono">
                    {u.rank === 1 ? (
                      <span className="text-amber-400 font-black">🥇 #1</span>
                    ) : u.rank === 2 ? (
                      <span className="text-slate-300 font-black">🥈 #2</span>
                    ) : u.rank === 3 ? (
                      <span className="text-amber-600 font-black">🥉 #3</span>
                    ) : (
                      <span>#{u.rank}</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    {u.isCurrentUser ? currentUserName : u.name}
                    {u.isCurrentUser && (
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-mono">YOU</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">{u.targetRole}</td>

                  <td className="py-3.5 px-4 font-mono text-amber-400 font-bold flex items-center gap-1">
                    <Flame size={14} /> {u.streakDays}d
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {u.badges.map((badgeName, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-indigo-300 font-mono"
                        >
                          {badgeName}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-300">{u.xp} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
