import { Request, Response } from "express";
import { generateDailyChallenge } from "../services/geminiRoadmapService.js";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatarUrl?: string;
  targetRole: string;
  xp: number;
  streakDays: number;
  badges: string[];
  isCurrentUser?: boolean;
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

export async function getDailyChallengeHandler(req: Request, res: Response) {
  try {
    const { targetRole = "Senior Full-Stack Engineer" } = req.query || {};

    try {
      const challenge = await generateDailyChallenge(undefined, targetRole as string);
      return res.json({ success: true, source: "gemini", data: challenge });
    } catch (geminiError: any) {
      console.warn("Gemini daily challenge fallback triggered:", geminiError?.message);
      return res.json({
        success: true,
        source: "fallback",
        data: {
          date: new Date().toISOString().split("T")[0],
          xpBonusTotal: 300,
          streakRequirement: 7,
          challenges: [
            {
              id: "c-hr-1",
              category: "HR & Behavioral",
              title: "Handling High-Pressure Outages",
              question: "Describe a situation where a major bug reached production. How did you communicate with stakeholders while resolving the issue under pressure?",
              difficulty: "Medium",
              xpReward: 75,
              hint: "Frame using STAR. Highlight transparent communication cadence to leadership.",
              idealAnswerPoints: [
                "Mention immediate status update to stakeholders.",
                "Detail root-cause analysis steps.",
                "Quantify time-to-resolution and post-mortem safeguards."
              ]
            },
            {
              id: "c-tech-1",
              category: "Technical System Design",
              title: "Designing an Idempotent Payment API",
              question: "How do you guarantee that a retry on a POST /api/v1/payments endpoint never double-charges a customer during network timeouts?",
              difficulty: "Hard",
              xpReward: 100,
              hint: "Use Idempotency Keys stored in Redis/DB with atomic lock transactions.",
              idealAnswerPoints: [
                "Require client-generated Idempotency-Key header.",
                "Atomically check and record payload in distributed storage.",
                "Return cached response on duplicate requests."
              ]
            },
            {
              id: "c-code-1",
              category: "Live Coding",
              title: "Reverse Substring Between Parentheses",
              question: "Given a string s with nested parentheses, reverse the strings in each pair of matching parentheses starting from the innermost pair.",
              difficulty: "Medium",
              xpReward: 85,
              hint: "Use a Stack to keep track of open parenthesis indices.",
              idealAnswerPoints: [
                "Iterate through string pushing characters to Stack.",
                "On ')' pop until '(' and reverse the collected array.",
                "Time Complexity: O(N^2) or O(N) using wormhole portal technique."
              ]
            },
            {
              id: "c-aptitude-1",
              category: "Aptitude & Logic",
              title: "Concurrency Deadlock Detection",
              question: "If Process A holds Resource 1 and requests Resource 2, while Process B holds Resource 2 and requests Resource 1, which condition is occurring?",
              difficulty: "Easy",
              xpReward: 50,
              hint: "Think about mutual dependency in circular waiting.",
              options: [
                "Livelock",
                "Circular Wait Deadlock",
                "Starvation",
                "Race Condition"
              ],
              correctOptionIndex: 1,
              idealAnswerPoints: [
                "Circular Wait is one of the 4 Coffman conditions for deadlocks."
              ]
            }
          ]
        }
      });
    }
  } catch (error: any) {
    console.error("getDailyChallengeHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error" });
  }
}

export async function getLeaderboardHandler(req: Request, res: Response) {
  try {
    return res.json({
      success: true,
      data: {
        leaderboard: mockLeaderboard,
        availableBadges: [
          { id: "b1", name: "Code Ninja", icon: "Code", description: "Solved 10+ live coding challenges under 15 minutes." },
          { id: "b2", name: "STAR Master", icon: "Award", description: "Achieved >85 score in behavioral response evaluations." },
          { id: "b3", name: "System Architect", icon: "Cpu", description: "Completed full distributed system design mock loop." },
          { id: "b4", name: "Streak Titan", icon: "Zap", description: "Maintained a 7-day consecutive interview practice streak." }
        ]
      }
    });
  } catch (error: any) {
    console.error("getLeaderboardHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error" });
  }
}

export async function claimXpHandler(req: Request, res: Response) {
  try {
    const { challengeId, xpAmount = 75, streakBonus = 10 } = req.body || {};
    const totalGained = Number(xpAmount) + Number(streakBonus);

    return res.json({
      success: true,
      data: {
        challengeId,
        xpGained: totalGained,
        newTotalXp: 2850 + totalGained,
        currentStreak: 8,
        badgeUnlocked: totalGained >= 100 ? "Streak Titan" : null,
        message: `Awesome job! Earned +${totalGained} XP (${xpAmount} XP + ${streakBonus} Streak Bonus)`
      }
    });
  } catch (error: any) {
    console.error("claimXpHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error" });
  }
}
