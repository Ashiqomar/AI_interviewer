import { GoogleGenAI, Type } from "@google/genai";

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}

const resumeAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    extractedSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of technical and soft skills extracted from the resume"
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          institution: { type: Type.STRING },
          year: { type: Type.STRING }
        }
      },
      description: "Education history"
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          techStack: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      },
      description: "Key projects listed on the resume"
    },
    workExperience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          duration: { type: Type.STRING },
          bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      },
      description: "Work history with key accomplishments"
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key strengths identified in the candidate profile"
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Areas needing improvement or quantifiable metrics"
    },
    missingATSSections: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Standard ATS sections missing or poorly formatted"
    },
    atsCompatibilityScore: {
      type: Type.INTEGER,
      description: "ATS parseability & structure score from 0 to 100"
    },
    overallResumeScore: {
      type: Type.INTEGER,
      description: "Overall resume impact & clarity score from 0 to 100"
    },
    summary: {
      type: Type.STRING,
      description: "Executive evaluation summary of the resume"
    }
  },
  required: [
    "extractedSkills",
    "education",
    "projects",
    "workExperience",
    "strengths",
    "weaknesses",
    "missingATSSections",
    "atsCompatibilityScore",
    "overallResumeScore",
    "summary"
  ]
};

const jdMatchSchema = {
  type: Type.OBJECT,
  properties: {
    matchPercentage: {
      type: Type.INTEGER,
      description: "Overall compatibility match percentage from 0 to 100"
    },
    matchedKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key skills and keywords present in both resume and job description"
    },
    missingKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Required or highly desirable keywords from job description missing in resume"
    },
    suggestedCourses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          platform: { type: Type.STRING },
          reasoning: { type: Type.STRING }
        }
      },
      description: "Recommended courses or skills to bridge identified gaps"
    },
    tailoringRecommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable bullet point recommendations to tailor resume for this specific job description"
    },
    roleFitLevel: {
      type: Type.STRING,
      description: "High, Medium, or Low"
    }
  },
  required: [
    "matchPercentage",
    "matchedKeywords",
    "missingKeywords",
    "suggestedCourses",
    "tailoringRecommendations",
    "roleFitLevel"
  ]
};

export async function analyzeResumeWithGemini(resumeText: string) {
  const ai = getGenAIClient();
  const prompt = `You are a world-class ATS (Applicant Tracking System) parser and Senior Engineering Recruiter.
Analyze the provided candidate resume text thoroughly.

Resume Content:
"""
${resumeText}
"""

Extract structured data, identify strengths, weaknesses, missing ATS sections, and calculate ATS compatibility and overall quality scores. Return the result strictly matching the JSON schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeAnalysisSchema as any,
        temperature: 0.2
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText);
  } catch (error: any) {
    console.error("Error analyzing resume with Gemini API:", error);
    throw new Error(error?.message || "Failed to analyze resume with Gemini API");
  }
}

export async function matchJdWithGemini(resumeTextOrAnalysis: string | object, jobDescription: string) {
  const ai = getGenAIClient();
  const resumeStr = typeof resumeTextOrAnalysis === "string" 
    ? resumeTextOrAnalysis 
    : JSON.stringify(resumeTextOrAnalysis, null, 2);

  const prompt = `You are an expert Talent Acquisition Strategist and Resume Optimization AI.
Compare the candidate's resume/profile against the target Job Description.

Candidate Resume / Profile:
"""
${resumeStr}
"""

Target Job Description:
"""
${jobDescription}
"""

Calculate the match percentage, identify matched & missing keywords, suggest specific courses to close skill gaps, and provide actionable tailoring bullet points. Return the result strictly matching the JSON schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: jdMatchSchema as any,
        temperature: 0.2
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText);
  } catch (error: any) {
    console.error("Error matching JD with Gemini API:", error);
    throw new Error(error?.message || "Failed to match job description with Gemini API");
  }
}
