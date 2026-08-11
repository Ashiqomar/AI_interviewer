import { Request, Response } from "express";
import { generateStartInterview, generateNextInterviewTurn } from "../services/adaptiveInterviewEngine.js";
import { evaluateSTARResponse } from "../services/starEvaluatorService.js";

const fallbackStartSession = {
  sessionId: "session-" + Date.now(),
  welcomeMessage: "Welcome to your InterviewIQ AI adaptive technical mock interview. I will evaluate your depth of experience, problem-solving structure, and communication.",
  initialQuestion: "Could you walk me through an end-to-end architecture you recently designed or led, focusing on scalability bottlenecks and key state management trade-offs?",
  category: "System Design & Architecture",
  suggestedDifficulty: "Intermediate"
};

const fallbackTurnSession = {
  evaluation: {
    rating: 8,
    feedback: "Solid structure and clear mention of state management tradeoffs.",
    detectedKeywords: ["React", "TypeScript", "Redux", "REST API", "Caching"],
    strengths: ["Clear technical articulation", "Logical separation of concerns"],
    areasToImprove: ["Could delve deeper into cache invalidation strategies under high concurrency"]
  },
  hint: "Consider how cache invalidation strategies (e.g. write-through vs write-behind) affect consistency during high concurrency spikes.",
  nextDifficulty: "Advanced",
  nextQuestion: "You mentioned caching and REST API endpoints. How do you handle cache invalidation and race conditions when multiple clients mutate shared state simultaneously?",
  isFollowUp: true,
  isInterviewComplete: false
};

export async function startInterviewHandler(req: Request, res: Response) {
  try {
    const { interviewType = "Technical", difficultyLevel = "Intermediate", targetRole = "Senior Full-Stack Engineer", candidateSkills = [] } = req.body || {};

    try {
      const result = await generateStartInterview(interviewType, difficultyLevel, targetRole, candidateSkills);
      return res.json({
        success: true,
        source: "gemini",
        data: {
          sessionId: "session-" + Date.now(),
          ...result
        }
      });
    } catch (geminiError: any) {
      console.warn("Gemini start interview error, returning fallback start:", geminiError?.message);
      return res.json({
        success: true,
        source: "fallback",
        warning: geminiError?.message,
        data: {
          ...fallbackStartSession,
          initialQuestion: `[${interviewType} - ${difficultyLevel}] ${fallbackStartSession.initialQuestion}`
        }
      });
    }
  } catch (error: any) {
    console.error("startInterviewHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error starting interview" });
  }
}

export async function nextQuestionHandler(req: Request, res: Response) {
  try {
    const {
      interviewType = "Technical",
      currentDifficulty = "Intermediate",
      targetRole = "Senior Full-Stack Engineer",
      conversationHistory = [],
      candidateAnswer = "",
      requestHint = false
    } = req.body || {};

    if (!candidateAnswer && !requestHint) {
      return res.status(400).json({ success: false, error: "Candidate answer or hint request is required" });
    }

    try {
      const result = await generateNextInterviewTurn(
        interviewType,
        currentDifficulty,
        targetRole,
        conversationHistory,
        candidateAnswer,
        requestHint
      );

      return res.json({
        success: true,
        source: "gemini",
        data: result
      });
    } catch (geminiError: any) {
      console.warn("Gemini next question error, returning fallback turn:", geminiError?.message);
      return res.json({
        success: true,
        source: "fallback",
        warning: geminiError?.message,
        data: fallbackTurnSession
      });
    }
  } catch (error: any) {
    console.error("nextQuestionHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error generating next turn" });
  }
}

export async function evaluateStarHandler(req: Request, res: Response) {
  try {
    const { question = "", candidateAnswer = "", targetRole = "Software Engineer" } = req.body || {};

    if (!question || !candidateAnswer) {
      return res.status(400).json({ success: false, error: "Question and candidate answer are required" });
    }

    try {
      const evaluation = await evaluateSTARResponse(question, candidateAnswer, targetRole);
      return res.json({ success: true, source: "gemini", data: evaluation });
    } catch (geminiError: any) {
      console.warn("Gemini STAR evaluation error, returning fallback:", geminiError?.message);
      return res.json({
        success: true,
        source: "fallback",
        data: {
          overallScore: 82,
          situation: { score: 85, feedback: "Good situational framing." },
          task: { score: 80, feedback: "Task defined clearly." },
          action: { score: 88, feedback: "Concrete individual actions taken." },
          result: { score: 75, feedback: "Solid results delivered." },
          keyStrengths: ["Clear communication", "Structured approach"],
          areasToImprove: ["Add quantifiable ROI metrics"],
          rewrittenSample: candidateAnswer
        }
      });
    }
  } catch (error: any) {
    console.error("evaluateStarHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error evaluating STAR response" });
  }
}

