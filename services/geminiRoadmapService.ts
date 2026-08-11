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

const roadmapSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    targetRole: { type: Type.STRING },
    durationWeeks: { type: Type.INTEGER },
    summary: { type: Type.STRING },
    weeks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          weekNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          focusGoal: { type: Type.STRING },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                topic: { type: Type.STRING },
                description: { type: Type.STRING },
                estimatedHours: { type: Type.INTEGER },
                keyTakeaways: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                practiceExercise: { type: Type.STRING },
                recommendedResources: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["id", "topic", "description", "estimatedHours", "keyTakeaways", "practiceExercise"]
            }
          }
        },
        required: ["weekNumber", "title", "focusGoal", "modules"]
      }
    }
  },
  required: ["title", "targetRole", "durationWeeks", "summary", "weeks"]
};

const flashcardListSchema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          category: { type: Type.STRING },
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
          explanation: { type: Type.STRING },
          codeSnippet: { type: Type.STRING },
          difficulty: { type: Type.STRING }
        },
        required: ["id", "category", "question", "answer", "explanation", "difficulty"]
      }
    }
  },
  required: ["topic", "flashcards"]
};

const dailyChallengeSchema = {
  type: Type.OBJECT,
  properties: {
    date: { type: Type.STRING },
    xpBonusTotal: { type: Type.INTEGER },
    streakRequirement: { type: Type.INTEGER },
    challenges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING, description: "HR, Technical, Coding, or Aptitude" },
          title: { type: Type.STRING },
          question: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          xpReward: { type: Type.INTEGER },
          hint: { type: Type.STRING },
          idealAnswerPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Optional multiple choice options for aptitude/quiz format"
          },
          correctOptionIndex: { type: Type.INTEGER }
        },
        required: ["id", "category", "title", "question", "difficulty", "xpReward", "hint", "idealAnswerPoints"]
      }
    }
  },
  required: ["date", "xpBonusTotal", "challenges"]
};

export async function generate4WeekRoadmap(weakAreas: string[] = ["System Design", "Result Quantification"], targetRole: string = "Software Engineer", targetCompany: string = "Tier 1 Tech") {
  const ai = getGenAIClient();
  const prompt = `You are a Principal Tech Curriculum Architect creating a personalized 4-week intensive interview preparation roadmap.

Target Role: ${targetRole}
Target Company Tier: ${targetCompany}
User Weak Areas Identified: ${weakAreas.join(", ")}

Requirements:
- Create a 4-week milestone timeline (Week 1 to Week 4).
- Address the user's specific weak areas in depth with concrete modules, exercises, and key takeaways.
- Provide estimated hours and recommended reading/practice topics per module.
Return strictly matching JSON schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: roadmapSchema as any,
        temperature: 0.3
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating roadmap with Gemini API:", error);
    throw error;
  }
}

export async function generateFlashcards(topic: string = "Data Structures & Algorithms", count: number = 6) {
  const ai = getGenAIClient();
  const prompt = `You are a Senior Engineering Mentor creating high-yield interview study flashcards.

Topic: ${topic}
Number of Cards: ${count}

Generate detailed Q&A flashcards covering core concepts, common interview traps, time/space complexity, and code patterns for ${topic}. Return strictly matching JSON schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: flashcardListSchema as any,
        temperature: 0.3
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating flashcards with Gemini API:", error);
    throw error;
  }
}

export async function generateDailyChallenge(dateString?: string, targetRole: string = "Software Engineer") {
  const ai = getGenAIClient();
  const today = dateString || new Date().toISOString().split("T")[0];

  const prompt = `You are a Lead Technical Interviewer creating the Daily InterviewIQ Challenge for ${today}.

Target Role: ${targetRole}

Generate 4 challenges for today:
1. HR / Behavioral Challenge (using STAR framework prompt)
2. Technical Concept Challenge
3. Live Coding / Algorithmic Challenge
4. Logic / System Aptitude Challenge (with 4 multiple choice options)

Each challenge should have XP rewards (50-150 XP), actionable hints, and key solution points. Return strictly matching JSON schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dailyChallengeSchema as any,
        temperature: 0.4
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating daily challenge with Gemini API:", error);
    throw error;
  }
}
