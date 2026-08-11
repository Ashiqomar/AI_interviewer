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

const startInterviewSchema = {
  type: Type.OBJECT,
  properties: {
    welcomeMessage: {
      type: Type.STRING,
      description: "Encouraging opening statement from interviewer setting the stage"
    },
    initialQuestion: {
      type: Type.STRING,
      description: "First core question tailored to interview type, difficulty, and role"
    },
    category: {
      type: Type.STRING,
      description: "Topic area (e.g. Architecture, Algorithmic, STAR Leadership, Culture Fit)"
    },
    suggestedDifficulty: {
      type: Type.STRING,
      description: "Beginner, Intermediate, or Advanced"
    }
  },
  required: ["welcomeMessage", "initialQuestion", "category", "suggestedDifficulty"]
};

const nextQuestionSchema = {
  type: Type.OBJECT,
  properties: {
    evaluation: {
      type: Type.OBJECT,
      properties: {
        rating: {
          type: Type.INTEGER,
          description: "Rating out of 10 for candidate's previous response"
        },
        feedback: {
          type: Type.STRING,
          description: "Constructive feedback on candidate's answer"
        },
        detectedKeywords: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Tech keywords or domain concepts detected in candidate answer"
        },
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Noteworthy aspects of answer"
        },
        areasToImprove: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Missing details, edge cases, or clarity issues"
        }
      },
      required: ["rating", "feedback", "detectedKeywords", "strengths", "areasToImprove"]
    },
    hint: {
      type: Type.STRING,
      description: "A subtle hint or nudging question if answer was weak or hint requested"
    },
    nextDifficulty: {
      type: Type.STRING,
      description: "Adjusted difficulty: Beginner, Intermediate, Advanced, or Expert"
    },
    nextQuestion: {
      type: Type.STRING,
      description: "Targeted follow-up or next domain question based on detected keywords and difficulty"
    },
    isFollowUp: {
      type: Type.BOOLEAN,
      description: "Whether this is a deep-dive follow-up on the candidate's last answer"
    },
    isInterviewComplete: {
      type: Type.BOOLEAN,
      description: "Whether the mock interview session has reached logical conclusion"
    }
  },
  required: ["evaluation", "hint", "nextDifficulty", "nextQuestion", "isFollowUp", "isInterviewComplete"]
};

export async function generateStartInterview(
  interviewType: string,
  difficultyLevel: string,
  targetRole: string,
  candidateSkills: string[] = []
) {
  const ai = getGenAIClient();
  const prompt = `You are a Senior Principal Tech Recruiter and Technical Interviewer conducting a real-time mock interview.

Interview Configuration:
- Type: ${interviewType} (HR, Technical, Behavioral, System Design, or Managerial)
- Initial Difficulty Level: ${difficultyLevel}
- Target Candidate Role: ${targetRole}
- Known Candidate Skills: ${candidateSkills.join(", ") || "General Engineering"}

Generate a professional, realistic opening statement and a highly relevant first interview question. Return strictly matching the JSON schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: startInterviewSchema as any,
        temperature: 0.3
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText);
  } catch (error: any) {
    console.error("Error starting adaptive interview with Gemini API:", error);
    throw error;
  }
}

export async function generateNextInterviewTurn(
  interviewType: string,
  currentDifficulty: string,
  targetRole: string,
  conversationHistory: Array<{ role: 'interviewer' | 'candidate'; text: string }>,
  candidateAnswer: string,
  requestHint: boolean = false
) {
  const ai = getGenAIClient();

  const formattedHistory = conversationHistory
    .map((turn) => `${turn.role.toUpperCase()}: ${turn.text}`)
    .join("\n");

  const prompt = `You are an adaptive Senior AI Technical Interviewer leading an interactive mock session.

Interview State:
- Type: ${interviewType}
- Current Difficulty: ${currentDifficulty}
- Target Role: ${targetRole}
- Requesting Hint: ${requestHint ? "YES (Candidate requested assistance)" : "NO"}

Conversation Transcript So Far:
${formattedHistory}

Candidate's Latest Response:
"${candidateAnswer}"

Your Task:
1. Evaluate candidate's latest response (Rating 1-10, feedback, detected keywords, strengths, gaps).
2. If rating <= 5 or hint requested, provide a helpful hint without giving away the full answer.
3. Dynamically adjust difficulty:
   - If rating >= 8 twice in a row, increase difficulty.
   - If rating <= 4, decrease or maintain difficulty.
4. If candidate mentioned technical keywords (e.g., React, AWS, Redis, GraphQL, Microservices), incorporate them into a deep-dive follow-up question.
5. Provide the next targeted interview question.

Return strictly matching the JSON schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: nextQuestionSchema as any,
        temperature: 0.3
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText);
  } catch (error: any) {
    console.error("Error generating next interview turn with Gemini API:", error);
    throw error;
  }
}
