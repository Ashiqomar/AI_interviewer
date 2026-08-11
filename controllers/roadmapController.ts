import { Request, Response } from "express";
import { generate4WeekRoadmap, generateFlashcards } from "../services/geminiRoadmapService.js";

export async function generateRoadmapHandler(req: Request, res: Response) {
  try {
    const { weakAreas = ["System Design", "Quantifiable Metrics in STAR"], targetRole = "Senior Full-Stack Engineer", targetCompany = "Tier 1 Tech" } = req.body || {};

    try {
      const roadmap = await generate4WeekRoadmap(weakAreas, targetRole, targetCompany);
      return res.json({ success: true, source: "gemini", data: roadmap });
    } catch (geminiError: any) {
      console.warn("Gemini roadmap generation fallback triggered:", geminiError?.message);
      // Fallback structured 4-week roadmap
      return res.json({
        success: true,
        source: "fallback",
        data: {
          title: "4-Week High-Yield Interview Mastery",
          targetRole,
          durationWeeks: 4,
          summary: "Targeted accelerator focusing on system architecture, STAR response quantification, and live coding speed.",
          weeks: [
            {
              weekNumber: 1,
              title: "Week 1: STAR Behavioral & Metric Quantification",
              focusGoal: "Transform qualitative answers into quantified business metrics.",
              modules: [
                {
                  id: "w1-m1",
                  topic: "Structuring STAR Framework",
                  description: "Master concise context setting and clear personal ownership in Action steps.",
                  estimatedHours: 4,
                  keyTakeaways: ["Limit Situation to 20% of time", "Use direct 'I' statements for Action"],
                  practiceExercise: "Record 3 behavioral answers on past technical outages.",
                  recommendedResources: ["STAR Quantification Playbook", "Executive Storytelling Guide"]
                },
                {
                  id: "w1-m2",
                  topic: "Quantifying Business ROI",
                  description: "Incorporate SLA percentages, revenue impact, and latency reduction numbers.",
                  estimatedHours: 3,
                  keyTakeaways: ["Convert time saved into engineer salary dollars", "Highlight error-rate drops"],
                  practiceExercise: "Draft metric metrics for your top 2 engineering projects.",
                  recommendedResources: ["Impact Metrics Cheat Sheet"]
                }
              ]
            },
            {
              weekNumber: 2,
              title: "Week 2: Advanced System Design & Scalability",
              focusGoal: "Master distributed caching, database indexing, and queue decouplers.",
              modules: [
                {
                  id: "w2-m1",
                  topic: "Distributed Caching & Cache Stampedes",
                  description: "Deep dive into Redis strategies, TTL, and cache invalidation patterns.",
                  estimatedHours: 6,
                  keyTakeaways: ["Write-through vs write-back caching", "Probabilistic early expiration"],
                  practiceExercise: "Design an e-commerce flash sale rate-limiter.",
                  recommendedResources: ["System Design Primer", "Redis Architecture Deep Dive"]
                }
              ]
            },
            {
              weekNumber: 3,
              title: "Week 3: Algorithmic Efficiency & Concurrency",
              focusGoal: "Elevate coding speed in graph traversals and dynamic programming.",
              modules: [
                {
                  id: "w3-m1",
                  topic: "Two Pointer & Sliding Window Patterns",
                  description: "Solve linear array and substring problems in O(N) time.",
                  estimatedHours: 5,
                  keyTakeaways: ["Identify window contraction triggers", "Optimize space to O(1)"],
                  practiceExercise: "Solve 5 medium sliding window problems in under 20 mins each.",
                  recommendedResources: ["LeetCode Top 75 Patterns"]
                }
              ]
            },
            {
              weekNumber: 4,
              title: "Week 4: Mock Simulation & Final Polish",
              focusGoal: "Simulate pressure conditions with AI voice mock interviews and PDF diagnostic reviews.",
              modules: [
                {
                  id: "w4-m1",
                  topic: "End-to-End Voice Mock Session",
                  description: "Complete full 30-minute voice interview and review speech WPM & filler count.",
                  estimatedHours: 4,
                  keyTakeaways: ["Maintain steady 130-150 WPM pace", "Eliminate filler hesitation"],
                  practiceExercise: "Perform 2 voice mock runs and achieve >85 Global IQ.",
                  recommendedResources: ["InterviewIQ Diagnostic Checklist"]
                }
              ]
            }
          ]
        }
      });
    }
  } catch (error: any) {
    console.error("generateRoadmapHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error" });
  }
}

export async function generateFlashcardsHandler(req: Request, res: Response) {
  try {
    const { topic = "Data Structures & Algorithms", count = 6 } = req.body || {};

    try {
      const cards = await generateFlashcards(topic, count);
      return res.json({ success: true, source: "gemini", data: cards });
    } catch (geminiError: any) {
      console.warn("Gemini flashcards fallback triggered:", geminiError?.message);
      return res.json({
        success: true,
        source: "fallback",
        data: {
          topic,
          flashcards: [
            {
              id: 1,
              category: "System Design",
              question: "What is the CAP Theorem and how does it influence database selection?",
              answer: "CAP Theorem states a distributed data store can only simultaneously guarantee 2 of 3: Consistency, Availability, Partition Tolerance.",
              explanation: "In network partitions (P is non-negotiable), systems choose CP (e.g. MongoDB/HBase) or AP (e.g. Cassandra/DynamoDB).",
              codeSnippet: "",
              difficulty: "Medium"
            },
            {
              id: 2,
              category: "DSA & Algorithms",
              question: "How do you detect a cycle in a Linked List in O(1) space?",
              answer: "Use Floyd's Cycle-Finding Algorithm (Fast & Slow Pointers).",
              explanation: "Slow advances 1 node, Fast advances 2 nodes. If they intersect, a cycle exists.",
              codeSnippet: "let slow = head, fast = head;\nwhile (fast && fast.next) {\n  slow = slow.next;\n  fast = fast.next.next;\n  if (slow === fast) return true;\n}",
              difficulty: "Easy"
            },
            {
              id: 3,
              category: "DBMS & Databases",
              question: "What is B-Tree indexing and why is it preferred over Hash indexing for ranges?",
              answer: "B-Trees keep data sorted across balanced tree levels, allowing fast range queries (e.g. WHERE age BETWEEN 20 AND 30).",
              explanation: "Hash indexes provide O(1) exact lookups but cannot evaluate range inequality operators efficiently.",
              codeSnippet: "CREATE INDEX idx_user_age ON users(age);",
              difficulty: "Medium"
            },
            {
              id: 4,
              category: "Operating Systems",
              question: "What is a Deadlock and what are the 4 Coffman conditions?",
              answer: "Deadlock occurs when processes are blocked waiting for resources held by each other. Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
              explanation: "Breaking any 1 of the 4 conditions prevents deadlocks entirely (e.g., using resource ordering).",
              codeSnippet: "",
              difficulty: "Hard"
            }
          ]
        }
      });
    }
  } catch (error: any) {
    console.error("generateFlashcardsHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error" });
  }
}
