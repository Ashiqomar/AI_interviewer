export interface IEducation {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface IWorkExperience {
  company: string;
  role: string;
  duration: string;
  bulletPoints: string[];
}

export interface IProject {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface ICertification {
  title: string;
  issuer: string;
  year: string;
}

export interface IResume {
  id: string;
  userId: string;
  candidateName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  summary: string;
  education: IEducation[];
  workExperience: IWorkExperience[];
  projects: IProject[];
  certifications?: ICertification[];
  skills: {
    technical: string[];
    soft: string[];
  };
  atsCompatibilityScore: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  missingATSSections?: string[];
  rawText?: string;
  createdAt: string;
  updatedAt: string;
}

class ResumeStore {
  private resumes: Map<string, IResume> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const defaultResume: IResume = {
      id: "res_101",
      userId: "fb_alex_rivera_101",
      candidateName: "Alex Rivera",
      email: "alex.rivera@example.com",
      phone: "+1 (555) 019-2834",
      linkedinUrl: "https://linkedin.com/in/alex-rivera-dev",
      githubUrl: "https://github.com/alexrivera-dev",
      summary: "Senior Full-Stack Engineer with 6+ years of experience designing scalable React web applications and high-throughput Node.js microservices.",
      education: [
        {
          degree: "B.S. in Computer Science & Engineering",
          institution: "University of California, Berkeley",
          year: "2019",
          gpa: "3.85 / 4.0"
        }
      ],
      workExperience: [
        {
          company: "CloudScale Systems",
          role: "Senior Full-Stack Engineer",
          duration: "2022 - Present",
          bulletPoints: [
            "Architected full-stack React & TypeScript dashboard serving 450,000 active enterprise users with 99.99% uptime.",
            "Engineered Redis distributed caching layer that reduced backend API query latency by 42% under peak workloads.",
            "Mentored team of 6 junior engineers and established CI/CD automated linting and unit test coverage standards."
          ]
        },
        {
          company: "Apex Tech Innovations",
          role: "Frontend Engineer",
          duration: "2019 - 2022",
          bulletPoints: [
            "Developed real-time collaborative workspace tools using WebSocket connections and React canvas engines.",
            "Improved client-side bundle size and Core Web Vitals performance score from 62 to 94 on Google Lighthouse."
          ]
        }
      ],
      projects: [
        {
          title: "InterviewIQ AI Platform",
          description: "AI-driven technical interview preparation tool with real-time speech WPM tracking and STAR metric scoring.",
          techStack: ["React", "TypeScript", "Node.js", "Express", "Gemini API", "Tailwind CSS"],
          githubUrl: "https://github.com/alexrivera-dev/interview-iq-ai"
        },
        {
          title: "Distributed Rate-Limiter Middleware",
          description: "High-performance sliding-window rate limiter utilizing Redis atomic operations.",
          techStack: ["Node.js", "Redis", "Docker", "Jest"]
        }
      ],
      certifications: [
        { title: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", year: "2023" },
        { title: "Meta Certified Senior Front-End Developer", issuer: "Coursera / Meta", year: "2022" }
      ],
      skills: {
        technical: ["React.js", "TypeScript", "Node.js", "Express", "System Design", "GraphQL", "MongoDB", "Redis", "Tailwind CSS"],
        soft: ["Technical Leadership", "Agile Mentorship", "Stakeholder Communication", "System Architecture Storytelling"]
      },
      atsCompatibilityScore: 92,
      overallScore: 89,
      strengths: [
        "Strong metric quantification in bullet points ($ saved, % speedups).",
        "Modern technical stack alignment with Tier-1 role expectations.",
        "Clear structural organization with clean contact links."
      ],
      weaknesses: [
        "Could include explicit cloud deployment cost reduction figures.",
        "Add more details regarding database indexing methodologies."
      ],
      missingATSSections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.resumes.set(defaultResume.id, defaultResume);
    this.resumes.set("latest", defaultResume);
  }

  public getById(id: string): IResume | undefined {
    return this.resumes.get(id) || this.resumes.get("latest");
  }

  public getLatest(): IResume | undefined {
    return this.resumes.get("latest");
  }

  public saveResume(resumeData: Omit<IResume, "id" | "createdAt" | "updatedAt"> & { id?: string }): IResume {
    const id = resumeData.id || `res_${Date.now()}`;
    const newResume: IResume = {
      ...resumeData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.resumes.set(id, newResume);
    this.resumes.set("latest", newResume);
    return newResume;
  }

  public getAll(): IResume[] {
    return Array.from(this.resumes.values()).filter((r, i, self) => self.findIndex(x => x.id === r.id) === i);
  }
}

export const ResumeModel = new ResumeStore();
