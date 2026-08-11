import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { UserModel } from "../models/User.js";
import { ResumeModel } from "../models/Resume.js";
import { InterviewReportModel } from "../models/InterviewReport.js";
import { seedDatabase, seedJobDescriptions } from "../seedData.js";

export async function getUserProfileHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = req.user?.uid || "fb_alex_rivera_101";
    const user = UserModel.getByUid(uid);

    return res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error("getUserProfileHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Error getting profile" });
  }
}

export async function saveUserProfileHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = req.user?.uid || "fb_alex_rivera_101";
    const { targetRole, experienceLevel, skills = [], preferredCompanies = [], displayName, bio } = req.body || {};

    const updatedUser = UserModel.saveUser({
      firebaseUid: uid,
      email: req.user?.email || "alex.rivera@example.com",
      displayName: displayName || req.user?.displayName || "Alex Rivera",
      targetRole: targetRole || "Senior Full-Stack Engineer",
      experienceLevel: experienceLevel || "Senior",
      skills,
      preferredCompanies,
      bio
    });

    return res.json({
      success: true,
      message: "Profile updated successfully!",
      data: updatedUser
    });
  } catch (error: any) {
    console.error("saveUserProfileHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Error saving profile" });
  }
}

export async function saveManualResumeHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = req.user?.uid || "fb_alex_rivera_101";
    const { candidateName, email, phone, linkedinUrl, githubUrl, summary, education = [], workExperience = [], projects = [], certifications = [], skills = { technical: [], soft: [] } } = req.body || {};

    if (!candidateName || !summary) {
      return res.status(400).json({
        success: false,
        error: "Candidate Name and Summary are required fields."
      });
    }

    const savedResume = ResumeModel.saveResume({
      userId: uid,
      candidateName,
      email: email || "alex.rivera@example.com",
      phone,
      linkedinUrl,
      githubUrl,
      summary,
      education,
      workExperience,
      projects,
      certifications,
      skills,
      atsCompatibilityScore: 88,
      overallScore: 86,
      strengths: ["Clean manual entry format", "Structured work history and key deliverables"],
      weaknesses: ["Consider adding more quantified impact metrics"]
    });

    return res.json({
      success: true,
      message: "Manual resume saved successfully!",
      data: savedResume
    });
  } catch (error: any) {
    console.error("saveManualResumeHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Error saving manual resume" });
  }
}

export async function saveManualInterviewHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const uid = req.user?.uid || "fb_alex_rivera_101";
    const { targetRole = "Senior Full-Stack Engineer", targetCompany = "Google", questions = [] } = req.body || {};

    const formattedQuestions = questions.map((q: any, idx: number) => ({
      id: `manual_qa_${idx + 1}`,
      questionText: q.questionText || "Practice Question",
      category: q.category || "Behavioral STAR",
      candidateAnswer: q.candidateAnswer || "My response...",
      starScore: q.starScore || 85,
      technicalScore: q.technicalScore || 88,
      communicationScore: q.communicationScore || 85,
      feedback: q.feedback || "Good structure. Emphasize quantifiable ROI numbers.",
      modelAnswer: q.modelAnswer || "Model response incorporating STAR metrics."
    }));

    const report = InterviewReportModel.saveReport({
      userId: uid,
      candidateName: req.user?.displayName || "Alex Rivera",
      targetRole,
      targetCompany,
      globalIQ: 86,
      starScore: 84,
      technicalScore: 88,
      communicationScore: 85,
      codingSpeedScore: 80,
      hireRecommendation: "STRONG HIRE",
      summary: "Manual practice interview entry evaluated with solid technical alignment.",
      strengths: ["Thorough problem analysis", "Clear solution steps"],
      weakAreas: ["Quantify impact in business metrics"],
      keyActionItems: ["Practice STAR metric framework"],
      questionsAnswered: formattedQuestions
    });

    return res.json({
      success: true,
      message: "Manual interview report saved successfully!",
      data: report
    });
  } catch (error: any) {
    console.error("saveManualInterviewHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Error saving manual interview" });
  }
}

export async function seedDatabaseHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const counts = seedDatabase();
    return res.json({
      success: true,
      message: "Database seeded successfully!",
      data: {
        counts,
        users: UserModel.getAll(),
        resumes: ResumeModel.getAll(),
        jobDescriptions: seedJobDescriptions,
        latestReport: InterviewReportModel.getLatest()
      }
    });
  } catch (error: any) {
    console.error("seedDatabaseHandler error:", error);
    return res.status(500).json({ success: false, error: error?.message || "Error seeding database" });
  }
}
