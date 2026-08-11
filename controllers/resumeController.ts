import { Request, Response } from "express";
import * as pdfParseModule from "pdf-parse";
import { analyzeResumeWithGemini, matchJdWithGemini } from "../services/geminiResumeService.js";

const pdfParse: any = (pdfParseModule as any).default || pdfParseModule;

// Sample fallback analysis when AI service is unavailable or key is missing
const fallbackAnalysis = {
  extractedSkills: ["React.js", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", "REST APIs", "Git"],
  education: [
    { degree: "B.S. in Computer Science", institution: "University of Tech", year: "2020" }
  ],
  projects: [
    { title: "InterviewIQ AI", description: "Immersive AI interview prep platform", techStack: ["React", "TypeScript", "Express", "Gemini API"] },
    { title: "E-Commerce Microservice Platform", description: "High-throughput checkout pipeline", techStack: ["Node.js", "Redis", "Docker"] }
  ],
  workExperience: [
    {
      company: "Tech Corp",
      role: "Senior Frontend Engineer",
      duration: "2021 - Present",
      bulletPoints: [
        "Architected enterprise React applications serving 500k+ monthly active users.",
        "Optimized client-side web vitals performance by 35% through code splitting and lazy loading."
      ]
    }
  ],
  strengths: [
    "Strong modern React & TypeScript expertise",
    "Clean full-stack web architecture knowledge",
    "Proven client-side web performance optimization track record"
  ],
  weaknesses: [
    "Limited explicit AWS cloud deployment metrics mentioned",
    "Could add more quantified revenue impact bullet points"
  ],
  missingATSSections: ["Certifications", "Professional Summary Headline"],
  atsCompatibilityScore: 88,
  overallResumeScore: 84,
  summary: "Comprehensive senior-level resume with strong technical stack match and clear project accomplishments."
};

const fallbackJdMatch = {
  matchPercentage: 82,
  matchedKeywords: ["React.js", "TypeScript", "Node.js", "REST APIs", "Tailwind CSS", "State Management"],
  missingKeywords: ["GraphQL", "AWS Lambda", "Micro-frontends", "CI/CD Pipeline"],
  suggestedCourses: [
    { title: "Advanced GraphQL Architecture & Subscriptions", platform: "Udemy / Frontend Masters", reasoning: "Bridge the API layer gap highlighted in the Job Description" },
    { title: "AWS Serverless Lambda & EventBridge in Depth", platform: "AWS Training & Certification", reasoning: "Job description specifically lists serverless cloud execution" }
  ],
  tailoringRecommendations: [
    "Highlight experience with GraphQL or REST microservices near the top of work history.",
    "Quantify AWS or serverless experience if applicable, or state experience with cloud infrastructure.",
    "Re-order skills section to place TypeScript and State Management upfront."
  ],
  roleFitLevel: "High"
};

export async function analyzeResumeHandler(req: Request, res: Response) {
  try {
    let textContent = "";

    if (req.file) {
      const mimeType = req.file.mimetype || "";
      const originalName = req.file.originalname || "";

      if (mimeType.includes("pdf") || originalName.toLowerCase().endsWith(".pdf")) {
        try {
          const parsedPdf = await pdfParse(req.file.buffer);
          textContent = parsedPdf.text;
        } catch (pdfErr) {
          console.warn("pdf-parse error, falling back to raw buffer string:", pdfErr);
          textContent = req.file.buffer.toString("utf-8");
        }
      } else {
        textContent = req.file.buffer.toString("utf-8");
      }
    } else if (req.body && req.body.resumeText) {
      textContent = req.body.resumeText;
    }

    if (!textContent || textContent.trim().length < 10) {
      // If empty file or text was submitted, use sample structured data with notice
      return res.json({
        success: true,
        source: "sample",
        message: "No readable resume text detected. Provided benchmark analysis sample.",
        data: fallbackAnalysis
      });
    }

    try {
      const analysisResult = await analyzeResumeWithGemini(textContent);
      return res.json({
        success: true,
        source: "gemini",
        data: analysisResult
      });
    } catch (geminiError: any) {
      console.warn("Gemini API call failed, providing fallback structure:", geminiError?.message);
      return res.json({
        success: true,
        source: "fallback",
        warning: geminiError?.message || "Gemini API unavailable, generated fallback match.",
        data: {
          ...fallbackAnalysis,
          summary: `Parsed text extracted (${textContent.slice(0, 150)}...). ${fallbackAnalysis.summary}`
        }
      });
    }
  } catch (error: any) {
    console.error("Resume analysis controller error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error analyzing resume"
    });
  }
}

export async function matchJdHandler(req: Request, res: Response) {
  try {
    const { resumeText, resumeAnalysis, jobDescription } = req.body || {};

    if (!jobDescription || jobDescription.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: "Job description is required for matching"
      });
    }

    const payloadResume = resumeAnalysis || resumeText || "Candidate is a Senior Frontend Engineer with React, TypeScript, Node.js experience.";

    try {
      const matchResult = await matchJdWithGemini(payloadResume, jobDescription);
      return res.json({
        success: true,
        source: "gemini",
        data: matchResult
      });
    } catch (geminiError: any) {
      console.warn("Gemini JD match call failed, providing fallback match:", geminiError?.message);
      return res.json({
        success: true,
        source: "fallback",
        warning: geminiError?.message || "Gemini API unavailable",
        data: fallbackJdMatch
      });
    }
  } catch (error: any) {
    console.error("Match JD controller error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error matching job description"
    });
  }
}
