export interface IQuestionAnswer {
  id: string;
  questionText: string;
  category: "Behavioral STAR" | "System Design" | "Live Coding" | "Aptitude";
  candidateAnswer: string;
  starScore?: number;
  technicalScore?: number;
  communicationScore?: number;
  feedback: string;
  modelAnswer?: string;
}

export interface IInterviewReport {
  id: string;
  userId: string;
  candidateName: string;
  targetRole: string;
  targetCompany: string;
  globalIQ: number;
  starScore: number;
  technicalScore: number;
  communicationScore: number;
  codingSpeedScore: number;
  hireRecommendation: "STRONG HIRE" | "HIRE" | "LEAN HIRE" | "NEEDS WORK";
  summary: string;
  strengths: string[];
  weakAreas: string[];
  keyActionItems: string[];
  questionsAnswered: IQuestionAnswer[];
  speechMetrics?: {
    avgWpm: number;
    fillerCount: number;
    hesitationSeconds: number;
  };
  createdAt: string;
}

class InterviewReportStore {
  private reports: Map<string, IInterviewReport> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const defaultReport: IInterviewReport = {
      id: "rpt_101",
      userId: "fb_alex_rivera_101",
      candidateName: "Alex Rivera",
      targetRole: "Senior Full-Stack Engineer",
      targetCompany: "Google",
      globalIQ: 88,
      starScore: 82,
      technicalScore: 92,
      communicationScore: 84,
      codingSpeedScore: 78,
      hireRecommendation: "STRONG HIRE",
      summary: "Candidate demonstrated exceptional algorithmic reasoning and systematic design patterns. Communication is concise, though structural clarity in STAR responses could be further quantified.",
      strengths: [
        "Flawless distributed caching and database indexing explanations.",
        "Proactive clarification of edge cases before writing code.",
        "Calm, structured problem-solving approach during live coding."
      ],
      weakAreas: [
        "Need more explicit dollar/percent ROI metrics in behavioral Action responses.",
        "Speech speed briefly accelerated to 165 WPM during dynamic programming explanation."
      ],
      keyActionItems: [
        "Practice 3 STAR answers focusing purely on quantified metric outcomes.",
        "Maintain steady pacing around 135 WPM during live coding explanations."
      ],
      questionsAnswered: [
        {
          id: "qa_1",
          questionText: "Tell me about a time you handled a severe production outage under high pressure.",
          category: "Behavioral STAR",
          candidateAnswer: "A Redis cluster cache stampede brought down our primary checkout service. I immediately alerted leadership on Slack, isolated the degraded service node, and deployed a probabilistic cache expiration fix within 22 minutes.",
          starScore: 85,
          technicalScore: 90,
          communicationScore: 86,
          feedback: "Great structure and quick crisis management. To make it a 95+, mention the exact financial or customer impact saved (e.g. $120k saved in abandoned carts).",
          modelAnswer: "Situation: Redis cache stampede degraded primary checkout.\nAction: Coordinated status updates, implemented probabilistic early expiration.\nResult: Restored 99.99% SLA in 22 mins, preserving $140,000 in checkout revenue."
        },
        {
          id: "qa_2",
          questionText: "How would you design a rate-limiting middleware for an API gateway supporting 100k RPS?",
          category: "System Design",
          candidateAnswer: "I would use a Sliding Window Counter algorithm backed by Redis cluster nodes with atomic INCR and EXPIRE operations. A local in-memory Token Bucket on the API Gateway handles burst spikes before reaching Redis.",
          starScore: 90,
          technicalScore: 95,
          communicationScore: 88,
          feedback: "Outstanding multi-tiered architecture choice. Clear tradeoff analysis between accuracy and latency.",
          modelAnswer: "Use hybrid Token Bucket (local gateway) + Sliding Window Counter (Redis cluster) to balance microsecond local checks with distributed cross-region accuracy."
        }
      ],
      speechMetrics: {
        avgWpm: 138,
        fillerCount: 3,
        hesitationSeconds: 1.8
      },
      createdAt: new Date().toISOString()
    };

    this.reports.set(defaultReport.id, defaultReport);
    this.reports.set("latest", defaultReport);
  }

  public getById(id: string): IInterviewReport | undefined {
    return this.reports.get(id) || this.reports.get("latest");
  }

  public getLatest(): IInterviewReport | undefined {
    return this.reports.get("latest");
  }

  public saveReport(reportData: Omit<IInterviewReport, "id" | "createdAt"> & { id?: string }): IInterviewReport {
    const id = reportData.id || `rpt_${Date.now()}`;
    const newReport: IInterviewReport = {
      ...reportData,
      id,
      createdAt: new Date().toISOString()
    };

    this.reports.set(id, newReport);
    this.reports.set("latest", newReport);
    return newReport;
  }

  public getAll(): IInterviewReport[] {
    return Array.from(this.reports.values()).filter((r, i, self) => self.findIndex(x => x.id === r.id) === i);
  }
}

export const InterviewReportModel = new InterviewReportStore();
