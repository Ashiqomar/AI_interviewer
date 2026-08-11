import { UserModel, IUser } from "./models/User.js";
import { ResumeModel, IResume } from "./models/Resume.js";
import { InterviewReportModel, IInterviewReport } from "./models/InterviewReport.js";

export const seedUsers: IUser[] = [
  {
    id: "usr_101",
    firebaseUid: "fb_alex_rivera_101",
    email: "alex.rivera@example.com",
    displayName: "Alex Rivera",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    targetRole: "Senior Full-Stack Engineer",
    experienceLevel: "Senior",
    skills: ["React.js", "TypeScript", "Node.js", "System Design", "GraphQL", "Tailwind CSS", "MongoDB", "Redis"],
    preferredCompanies: ["Google", "Meta", "Stripe", "OpenAI"],
    bio: "Senior Full-Stack Engineer with 6+ years specializing in distributed React applications and serverless microservices.",
    totalXp: 4250,
    streakDays: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "usr_102",
    firebaseUid: "fb_priya_sharma_102",
    email: "priya.sharma@example.com",
    displayName: "Priya Sharma",
    photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    targetRole: "Lead Frontend Engineer",
    experienceLevel: "Lead",
    skills: ["React", "TypeScript", "Next.js", "Web Vitals", "Design Systems", "Micro-frontends", "Jest"],
    preferredCompanies: ["Stripe", "Figma", "Airbnb"],
    bio: "Lead Frontend Architect passionate about web performance optimization and component design systems.",
    totalXp: 3890,
    streakDays: 14,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "usr_103",
    firebaseUid: "fb_marcus_chen_103",
    email: "marcus.chen@example.com",
    displayName: "Marcus Chen",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    targetRole: "Senior Backend Architect",
    experienceLevel: "Senior",
    skills: ["Go", "Node.js", "PostgreSQL", "Kafka", "Kubernetes", "gRPC", "Redis", "Distributed Systems"],
    preferredCompanies: ["Uber", "Datadog", "Snowflake"],
    bio: "Backend Architect focused on distributed systems resiliency, high-concurrency event streams, and database indexing.",
    totalXp: 3450,
    streakDays: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const seedResumes: IResume[] = [
  {
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
      }
    ],
    certifications: [
      { title: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", year: "2023" }
    ],
    skills: {
      technical: ["React.js", "TypeScript", "Node.js", "Express", "System Design", "GraphQL", "MongoDB", "Redis", "Tailwind CSS"],
      soft: ["Technical Leadership", "Agile Mentorship", "Stakeholder Communication"]
    },
    atsCompatibilityScore: 92,
    overallScore: 89,
    strengths: [
      "Strong metric quantification in bullet points ($ saved, % speedups).",
      "Modern technical stack alignment with Tier-1 role expectations."
    ],
    weaknesses: [
      "Could include explicit cloud deployment cost reduction figures."
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "res_102",
    userId: "fb_priya_sharma_102",
    candidateName: "Priya Sharma",
    email: "priya.sharma@example.com",
    linkedinUrl: "https://linkedin.com/in/priyasharma-fe",
    summary: "Lead Frontend Engineer specializing in Next.js, web performance, and micro-frontend design systems.",
    education: [
      {
        degree: "M.S. in Software Engineering",
        institution: "Carnegie Mellon University",
        year: "2018"
      }
    ],
    workExperience: [
      {
        company: "Stripe",
        role: "Senior Frontend Engineer",
        duration: "2021 - Present",
        bulletPoints: [
          "Led development of global checkout UI component library used across 12 product surface areas.",
          "Reduced First Contentful Paint (FCP) from 1.8s to 0.7s across mobile web checkout routes."
        ]
      }
    ],
    projects: [
      {
        title: "Accessible UI Component Kit",
        description: "Zero-dependency WCAG AA accessible React headless component library.",
        techStack: ["React", "TypeScript", "Tailwind CSS", "Storybook"]
      }
    ],
    skills: {
      technical: ["React", "TypeScript", "Next.js", "Web Vitals", "Design Systems", "Jest"],
      soft: ["UX Architectural Vision", "Cross-functional Collaboration"]
    },
    atsCompatibilityScore: 94,
    overallScore: 91,
    strengths: [
      "Outstanding FCP and Web Vitals metric focus.",
      "Clear lead-level scope and component architecture ownership."
    ],
    weaknesses: [
      "Could add backend REST or GraphQL API experience."
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const seedJobDescriptions = [
  {
    id: "jd_101",
    title: "Senior Full-Stack Engineer",
    company: "Google Cloud",
    requirements: [
      "5+ years experience building production web applications in React and TypeScript.",
      "In-depth experience with REST/GraphQL APIs, microservices, and distributed caching (Redis).",
      "Strong algorithmic problem-solving skills and experience with SQL/NoSQL databases.",
      "Experience quantifying performance optimizations and mentoring junior engineers."
    ]
  },
  {
    id: "jd_102",
    title: "Lead Frontend Engineer",
    company: "Stripe",
    requirements: [
      "7+ years experience with modern JavaScript/TypeScript, React, and browser performance.",
      "Deep understanding of Core Web Vitals, accessibility standards (WCAG AA), and component design systems.",
      "Track record of technical mentorship and driving engineering quality standards across teams."
    ]
  }
];

export const seedInterviewReports: IInterviewReport[] = [
  {
    id: "rpt_101",
    userId: "fb_alex_rivera_101",
    candidateName: "Alex Rivera",
    targetRole: "Senior Full-Stack Engineer",
    targetCompany: "Google Cloud",
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
  }
];

export function seedDatabase() {
  console.log("Seeding InterviewIQ AI Phase 1 Database mock store...");
  seedUsers.forEach(u => UserModel.saveUser(u));
  seedResumes.forEach(r => ResumeModel.saveResume(r));
  seedInterviewReports.forEach(rpt => InterviewReportModel.saveReport(rpt));
  console.log("Database seeded successfully with 3 users, 2 resumes, 2 job descriptions, and 1 mock interview report.");

  return {
    usersCount: seedUsers.length,
    resumesCount: seedResumes.length,
    jobDescriptionsCount: seedJobDescriptions.length,
    interviewReportsCount: seedInterviewReports.length
  };
}
