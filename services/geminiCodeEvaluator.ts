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

const problemSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Short title of the coding problem" },
    difficulty: { type: Type.STRING, description: "Easy, Medium, or Hard" },
    description: { type: Type.STRING, description: "Detailed markdown description of problem requirements" },
    inputFormat: { type: Type.STRING, description: "Explanation of function arguments / inputs" },
    outputFormat: { type: Type.STRING, description: "Expected return type / output format" },
    constraints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Bounds on input size and value constraints"
    },
    sampleTestCases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          input: { type: Type.STRING },
          expectedOutput: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["input", "expectedOutput"]
      }
    },
    starterCode: {
      type: Type.OBJECT,
      properties: {
        javascript: { type: Type.STRING },
        python: { type: Type.STRING },
        java: { type: Type.STRING },
        cpp: { type: Type.STRING },
        c: { type: Type.STRING }
      },
      required: ["javascript", "python", "java", "cpp", "c"]
    }
  },
  required: ["title", "difficulty", "description", "inputFormat", "outputFormat", "constraints", "sampleTestCases", "starterCode"]
};

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    status: { type: Type.STRING, description: "Accepted, Wrong Answer, Time Limit Exceeded, or Syntax Error" },
    score: { type: Type.INTEGER, description: "0 to 100 overall score based on correctness, efficiency, and code quality" },
    timeComplexity: { type: Type.STRING, description: "Big-O notation for time complexity (e.g. O(N log N))" },
    spaceComplexity: { type: Type.STRING, description: "Big-O notation for space complexity (e.g. O(1))" },
    testCaseResults: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          input: { type: Type.STRING },
          expectedOutput: { type: Type.STRING },
          actualOutput: { type: Type.STRING },
          passed: { type: Type.BOOLEAN },
          executionTimeMs: { type: Type.INTEGER }
        },
        required: ["id", "input", "expectedOutput", "actualOutput", "passed", "executionTimeMs"]
      }
    },
    bugAnalysis: { type: Type.STRING, description: "Detailed analysis of syntax bugs, logical flaws, or unhandled edge cases" },
    optimizationTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable refactoring recommendations to improve memory or speed"
    },
    refactoredCode: { type: Type.STRING, description: "Clean, production-ready, optimal solution in target language" }
  },
  required: ["status", "score", "timeComplexity", "spaceComplexity", "testCaseResults", "bugAnalysis", "optimizationTips", "refactoredCode"]
};

export async function generateCodingProblem(topic: string = "Data Structures & Algorithms", difficulty: string = "Medium", targetRole: string = "Software Engineer") {
  const ai = getGenAIClient();
  const prompt = `You are a Principal Software Engineer at a FAANG company setting up a LeetCode-style technical coding challenge.

Target Role: ${targetRole}
Topic / Domain: ${topic}
Difficulty: ${difficulty}

Generate a brand-new, realistic algorithmic or system implementation coding problem with starter code templates for JavaScript, Python, Java, C++, and C. Include 3 sample test cases. Return strictly matching JSON schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: problemSchema as any,
        temperature: 0.4
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating coding problem with Gemini API:", error);
    throw error;
  }
}

export async function evaluateCodeSubmission(
  problemTitle: string,
  problemDescription: string,
  code: string,
  language: string,
  customTestCases: Array<{ input: string; expectedOutput: string }> = []
) {
  const ai = getGenAIClient();
  const prompt = `You are an Automated Online Judge & AI Code Evaluator.

Problem Title: ${problemTitle}
Problem Description:
${problemDescription}

Target Language: ${language}
Candidate Code Submission:
\`\`\`${language}
${code}
\`\`\`

Test Cases to Validate against:
${JSON.stringify(customTestCases, null, 2)}

Your Task:
1. Perform static analysis on the submitted code. Check for syntax errors, boundary conditions, edge cases (empty inputs, nulls, negative numbers, overflow).
2. Trace execution against the test cases. Determine actual output and whether each test case passed.
3. Calculate Time Complexity (e.g. O(N), O(N^2)) and Space Complexity (e.g. O(1), O(N)).
4. Identify any bugs, performance bottlenecks, or anti-patterns.
5. Provide a score out of 100, optimization tips, and an optimal refactored version of the code.

Return strictly matching JSON schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema as any,
        temperature: 0.2
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error evaluating code submission with Gemini API:", error);
    throw error;
  }
}
