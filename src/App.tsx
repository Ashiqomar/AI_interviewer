import React, { useState, useEffect, useRef } from 'react';
import { ProfileSetupForm } from './components/Profile/ProfileSetupForm';
import { ManualResumeForm } from './components/Resume/ManualResumeForm';
import { ManualInterviewEntryModal } from './components/Interview/ManualInterviewEntryModal';
import ResumeUploader from './components/Resume/ResumeUploader';
import MatchResultsView from './components/Resume/MatchResultsView';
import MockInterviewWorkspace from './components/Interview/MockInterviewWorkspace';
import CodingArenaView from './components/Coding/CodingArenaView';
import PerformanceDashboard from './components/Analytics/PerformanceDashboard';
import InterviewReportView from './components/Reports/InterviewReportView';
import LearningRoadmapView from './components/Roadmap/LearningRoadmapView';
import FlashcardDeck from './components/Practice/FlashcardDeck';
import DailyChallengeWidget from './components/Gamification/DailyChallengeWidget';
import LeaderboardTable from './components/Gamification/LeaderboardTable';
import {
  Brain,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trophy,
  Flame,
  TrendingUp,
  Video,
  BarChart3,
  Compass,
  ShieldCheck,
  User,
  Search,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Zap,
  Award,
  FileText,
  Play,
  Send,
  RefreshCw,
  Eye,
  Star,
  Check,
  Lock,
  Settings,
  MessageSquare,
  Clock,
  Layers,
  LayoutDashboard,
  Mic,
  Code,
  Database,
  ArrowRight,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Download,
  Share2,
  Activity,
  Calendar
} from 'lucide-react';

// --- TYPES & DATA MODELS ---
interface UserProfile {
  name: string;
  title: string;
  experienceLevel: string;
  targetRole: string;
  skills: string[];
  xp: number;
  level: number;
  streak: number;
  globalRank: number;
  readinessScore: number;
}

interface SkillGap {
  name: string;
  status: 'matched' | 'missing';
  category: 'frontend' | 'backend' | 'devops' | 'architecture';
}

interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  usageCount: number;
}

interface MatchHistory {
  id: string;
  company: string;
  role: string;
  score: number;
  date: string;
}

const getInitials = (name: string) => {
  if (!name) return 'IQ';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'IQ';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'resume' | 'analyzer' | 'reports' | 'roadmap' | 'gamify' | 'admin'>('dashboard');
  const [resumeTabMode, setResumeTabMode] = useState<'upload' | 'manual'>('upload');
  const [showManualInterviewModal, setShowManualInterviewModal] = useState<boolean>(false);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Jordan Doe',
    title: 'Senior Frontend Engineer',
    experienceLevel: 'Senior (5-8 yrs)',
    targetRole: 'Staff / Tech Lead',
    skills: ['React.js', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS', 'System Design'],
    xp: 1240,
    level: 12,
    streak: 7,
    globalRank: 124,
    readinessScore: 84
  });

  // Modal States
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showMockInterviewModal, setShowMockInterviewModal] = useState<boolean>(false);
  const [showFlashcardsModal, setShowFlashcardsModal] = useState<boolean>(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState<boolean>(false);

  // Resume Lab State
  const [resumeText, setResumeText] = useState<string>('');
  const [targetJobDesc, setTargetJobDesc] = useState<string>(
    'We are seeking a Senior React/Frontend Engineer with expertise in state management, TypeScript, micro-frontends, GraphQL, and AWS Lambda performance optimization.'
  );
  const [isAnalyzingResume, setIsAnalyzingResume] = useState<boolean>(false);
  const [resumeAnalysisData, setResumeAnalysisData] = useState<any>({
    extractedSkills: ['React.js', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS', 'REST APIs', 'Git'],
    education: [{ degree: 'B.S. in Computer Science', institution: 'Tech University', year: '2020' }],
    projects: [
      { title: 'InterviewIQ AI Platform', description: 'Real-time AI interview preparation app with Gemini integration', techStack: ['React', 'TypeScript', 'Express', 'Gemini API'] }
    ],
    workExperience: [
      {
        company: 'Tech Corp',
        role: 'Senior Frontend Engineer',
        duration: '2021 - Present',
        bulletPoints: ['Architected enterprise React applications serving 500k+ MAU.', 'Optimized client performance by 35% using code splitting.']
      }
    ],
    strengths: ['Strong React & TypeScript core foundation', 'Proven web vitals performance optimization', 'Full-stack Express/Node.js experience'],
    weaknesses: ['Limited explicit AWS cloud deployment metrics', 'Could add more quantified revenue impact metrics'],
    missingATSSections: ['Certifications'],
    atsCompatibilityScore: 88,
    overallResumeScore: 84,
    summary: 'Strong senior frontend engineering profile with clear technical stack match.'
  });
  const [jdMatchData, setJdMatchData] = useState<any>({
    matchPercentage: 82,
    matchedKeywords: ['React.js', 'TypeScript', 'Node.js', 'REST APIs', 'Tailwind CSS'],
    missingKeywords: ['GraphQL', 'AWS Lambda', 'Micro-frontends', 'CI/CD Pipeline'],
    suggestedCourses: [
      { title: 'Advanced GraphQL Architecture & Subscriptions', platform: 'Frontend Masters', reasoning: 'Bridge the API layer gap highlighted in the Job Description' },
      { title: 'AWS Serverless Lambda & EventBridge in Depth', platform: 'AWS Training', reasoning: 'Job description specifically lists serverless cloud execution' }
    ],
    tailoringRecommendations: [
      'Highlight experience with GraphQL or REST microservices near the top of work history.',
      'Quantify AWS or serverless experience if applicable, or state experience with cloud infrastructure.',
      'Re-order skills section to place TypeScript and State Management upfront.'
    ],
    roleFitLevel: 'High'
  });

  // Behavioral & Communication State
  const [activeStarTab, setActiveStarTab] = useState<'situation' | 'task' | 'action' | 'result'>('situation');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  // Mock Interview Interactive AI State
  const [mockMessages, setMockMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: "Hello Jordan! Welcome to your technical deep dive session. Let's start with a core architectural question: How would you design a resilient caching layer for a high-throughput React & Node.js application?",
      time: '10:00 AM'
    }
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Admin Question Inventory State
  const [questionPool, setQuestionPool] = useState<Question[]>([
    { id: '1', title: 'Micro-frontend State Sync across isolated iFrames', difficulty: 'Hard', category: 'System Design', usageCount: 1420 },
    { id: '2', title: 'Asynchronous Event Loop starvation in Node.js', difficulty: 'Medium', category: 'JavaScript Core', usageCount: 4210 },
    { id: '3', title: 'Binary Search Tree Balancing Algorithm', difficulty: 'Easy', category: 'Data Structures', usageCount: 9150 },
    { id: '4', title: 'OAuth2 Refresh Token Rotation with Redis', difficulty: 'Hard', category: 'Security & Auth', usageCount: 880 }
  ]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New Skill Input state in Profile Modal
  const [newSkillInput, setNewSkillInput] = useState<string>('');

  // AI Practice Lab Flash Questions State
  const [labLoadingState, setLabLoadingState] = useState<Record<string, boolean>>({});
  const [generatedQuestions, setGeneratedQuestions] = useState<Record<string, string[]>>({});

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const sampleFlashcards = [
    { q: "What is the primary difference between Virtual DOM and Shadow DOM?", a: "Virtual DOM is a React reconciliation concept that syncs a JS-represented tree with real DOM for batch updates. Shadow DOM is a browser-native standard for scoped CSS & encapsulated HTML in Web Components." },
    { q: "How do you enforce STAR structure in behavioral answers?", a: "S (Situation - 15%): Set the context & metrics. T (Task - 10%): Explain your role. A (Action - 60%): Detail technical decisions & your explicit ownership. R (Result - 15%): Quantify the outcome (e.g., 40% latency reduction)." },
    { q: "What is CAP Theorem in Distributed Systems?", a: "CAP Theorem states that a distributed data store can only simultaneously guarantee 2 out of 3 properties: Consistency, Availability, and Partition Tolerance." },
    { q: "Explain the Token Bucket algorithm for Rate Limiting.", a: "Tokens are added to a bucket at a fixed rate r up to capacity b. Each request consumes 1 token. If the bucket is empty, requests are rejected (429 Too Many Requests)." }
  ];

  const triggerPracticeLab = (key: string) => {
    setLabLoadingState(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setLabLoadingState(prev => ({ ...prev, [key]: false }));
      if (key === 'java') {
        setGeneratedQuestions(prev => ({
          ...prev,
          java: [
            "Explain thread lifecycle and deadlocks in Java Concurrency.",
            "Difference between Synchronized blocks and ReentrantLock?",
            "How does Java ExecutorService manage worker threads under load?",
            "What is the Java Memory Model volatile keyword guarantee?",
            "How does ConcurrentHashMap achieve lock striping?"
          ]
        }));
      } else if (key === 'sql') {
        setGeneratedQuestions(prev => ({
          ...prev,
          sql: [
            "Difference between B-Tree and Hash Indexing in PostgreSQL?",
            "Explain EXPLAIN ANALYZE output and execution plan bottlenecks.",
            "How do Covering Indexes prevent table heap lookup overhead?",
            "When should you prefer Partitioning over Indexing?",
            "How to optimize multi-table INNER JOIN vs LEFT JOIN queries?"
          ]
        }));
      } else if (key === 'aws') {
        setGeneratedQuestions(prev => ({
          ...prev,
          aws: [
            "How to prevent Lambda cold starts in production environments?",
            "Difference between SQS FIFO queues and EventBridge routing?",
            "Design an idempotent serverless processing pipeline.",
            "How does DynamoDB single-table design optimize query latency?",
            "Explain API Gateway throttling vs Lambda concurrency limits."
          ]
        }));
      }
    }, 1200);
  };

  const handleSendMockMessage = () => {
    if (!userInput.trim()) return;
    const newMsg = { sender: 'user' as const, text: userInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMockMessages(prev => [...prev, newMsg]);
    setUserInput('');
    setIsAiThinking(true);

    setTimeout(() => {
      setIsAiThinking(false);
      const aiReply = {
        sender: 'ai' as const,
        text: `Solid explanation! You highlighted key considerations. To push this to a Senior level response, consider mentioning cache invalidation strategies (e.g. Write-Through vs Cache-Aside) and how you'd handle Redis cluster failovers under a 100k req/sec peak.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMockMessages(prev => [...prev, aiReply]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col relative overflow-x-hidden selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Background Atmosphere Blur Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* --- HEADER NAVIGATION --- */}
      <header className="h-20 flex items-center justify-between px-4 sm:px-8 border-b border-slate-200/80 backdrop-blur-xl bg-white/90 sticky top-0 z-40 shrink-0 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 border border-indigo-500/30">
            <span className="font-extrabold text-xl text-white tracking-tight">IQ</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              InterviewIQ <span className="text-indigo-600 font-extrabold">AI</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase hidden sm:inline-block">Phase 1 • Immersive Engine</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/90 shadow-inner">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <LayoutDashboard size={15} /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'interview' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Brain size={15} /> AI Mock Session
          </button>
          <button
            onClick={() => setActiveTab('coding')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'coding' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Code size={15} /> Coding Arena
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <User size={15} /> Profile Setup
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'resume' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText size={15} /> Resume Lab
          </button>
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'analyzer' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Mic size={15} /> Analyzer
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'reports' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BarChart3 size={15} /> Reports
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'roadmap' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Compass size={15} /> Roadmap
          </button>
          <button
            onClick={() => setActiveTab('gamify')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'gamify' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Trophy size={15} /> Ranks
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck size={15} /> Admin
          </button>
        </nav>

        {/* User Stats Pill & Profile Launcher */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5">
              <Flame size={15} className="text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-amber-700">{userProfile.streak} Day Streak</span>
            </div>
            <div className="w-[1px] h-4 bg-slate-200"></div>
            <div className="flex items-center gap-1.5">
              <Zap size={15} className="text-indigo-600 fill-indigo-600" />
              <span className="text-xs font-bold text-indigo-700">{userProfile.xp} XP</span>
            </div>
          </div>

          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 transition-all active:scale-95 group shadow-xs"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-400/30 flex items-center justify-center font-bold text-xs text-white shadow-md">
              {getInitials(userProfile.name)}
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 hidden md:inline-block">Profile</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <nav className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 py-2 flex items-center justify-between overflow-x-auto text-xs sticky top-20 z-30 space-x-1 custom-scrollbar shadow-xs">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'resume', label: 'Resume', icon: FileText },
          { id: 'analyzer', label: 'Analyzer', icon: Mic },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'roadmap', label: 'Roadmap', icon: Compass },
          { id: 'gamify', label: 'Ranks', icon: Trophy },
          { id: 'admin', label: 'Admin', icon: ShieldCheck }
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 flex items-center gap-1.5 ${
                activeTab === item.id ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon size={14} /> {item.label}
            </button>
          );
        })}
      </nav>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 z-10">
        {/* ========================================================= */}
        {/* TAB 1: DASHBOARD                                          */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <PerformanceDashboard />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Profile Quick Stats */}
            <section className="lg:col-span-3 flex flex-col gap-6">
              <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
                <div
                  onClick={() => setShowProfileModal(true)}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 mb-3 border-4 border-white shadow-lg overflow-hidden relative group cursor-pointer flex items-center justify-center font-black text-2xl text-white tracking-wider"
                >
                  <span>{getInitials(userProfile.name)}</span>
                  <div className="absolute inset-0 bg-indigo-600/85 backdrop-blur-xs flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit Name
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900">{userProfile.name}</h2>
                <p className="text-xs text-indigo-600 font-semibold">{userProfile.title}</p>

                <div className="mt-5 w-full space-y-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between text-[11px] font-mono-label text-slate-500 mb-1 font-bold">
                      <span>LEVEL {userProfile.level}</span>
                      <span className="text-indigo-600">{userProfile.xp} / 2000 XP</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${(userProfile.xp / 2000) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-slate-600 font-medium">Readiness Index</span>
                    <span className="font-bold text-emerald-600 text-sm">{userProfile.readinessScore}%</span>
                  </div>
                </div>
              </div>

              {/* Verified Skills Card */}
              <div className="glass-card glass-card-hover p-6 rounded-2xl flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono-label">Verified Skills</h3>
                  <button onClick={() => setShowProfileModal(true)} className="text-indigo-600 hover:text-indigo-700 p-1">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                        idx % 3 === 0
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : idx % 3 === 1
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Center Column: Active Roadmap & Mission */}
            <section className="lg:col-span-6 flex flex-col gap-6">
              {/* Active Mission Hero */}
              <div className="relative bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/80 backdrop-blur-md border border-indigo-200 p-6 sm:p-8 rounded-3xl min-h-[240px] flex flex-col justify-end overflow-hidden shadow-lg">
                <div className="absolute top-6 right-8 opacity-10 pointer-events-none">
                  <Brain size={120} className="text-indigo-600" />
                </div>
                <div className="z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-mono-label font-bold uppercase tracking-widest mb-3">
                    <Sparkles size={13} /> Current Mission
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 leading-tight">System Design Mastery</h3>
                  <p className="text-slate-600 text-sm max-w-md leading-relaxed">
                    Master scalable architecture patterns for high-traffic applications. Preparation for Tier-1 Tech interviews.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowMockInterviewModal(true)}
                      className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 active:scale-95"
                    >
                      <Play size={16} fill="white" /> Resume Practice
                    </button>
                    <button
                      onClick={() => setActiveTab('roadmap')}
                      className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium transition-all shadow-xs"
                    >
                      View Full Path
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Launch Sessions Grid */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-700 tracking-wide font-mono-label uppercase">Quick Launch Session</h3>
                  <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline" onClick={() => setShowMockInterviewModal(true)}>
                    See all paths
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'HR & Culture Fit', desc: 'Behavioral questions & alignment', level: 'BEGINNER', time: '15M', tag: 'STAR Method', border: 'border-l-indigo-500' },
                    { title: 'Technical Deep Dive', desc: 'System design & architecture', level: 'ADVANCED', time: '45M', tag: 'Microservices Focus', border: 'border-l-emerald-500' },
                    { title: 'Live Coding Challenge', desc: 'Algorithms, data structures & DP', level: 'EXPERT', time: '60M', tag: 'DP & Optimization', border: 'border-l-amber-500' },
                    { title: 'Behavioral Analysis', desc: 'Scenario leadership & resolution', level: 'INTERMEDIATE', time: '30M', tag: 'Leadership Skills', border: 'border-l-purple-500' }
                  ].map((session, idx) => (
                    <div
                      key={idx}
                      onClick={() => setShowMockInterviewModal(true)}
                      className={`glass-card glass-card-hover p-5 rounded-2xl border-l-4 ${session.border} cursor-pointer group flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-label bg-slate-100 text-slate-700 border border-slate-200">
                            {session.level}
                          </span>
                          <span className="text-xs text-slate-500 font-mono-label">{session.time}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base">{session.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{session.desc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                        <span className="font-mono-label text-[11px] text-indigo-600 font-semibold">{session.tag}</span>
                        <ChevronRight size={16} className="text-indigo-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Summary Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold text-lg shadow-xs">
                    84
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono-label">Last Session</p>
                    <p className="text-sm font-bold text-slate-900">Behavioral Mock</p>
                    <p className="text-xs text-slate-500">Oct 24 • 15 mins</p>
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold text-lg shadow-xs">
                    <Zap size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono-label">Suggested Focus</p>
                    <p className="text-sm font-bold text-slate-900">Graph Algorithms</p>
                    <p className="text-xs text-slate-500">Low confidence score</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Right Column: Upcoming & Sidebar */}
            <section className="lg:col-span-3 flex flex-col gap-6">
              {/* Upcoming Events */}
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono-label mb-4">Upcoming Schedule</h3>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="shrink-0 w-1 h-10 bg-indigo-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Mock with AI Mentor</p>
                      <p className="text-xs text-slate-500">Today, 4:30 PM</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="shrink-0 w-1 h-10 bg-emerald-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Resume Review Phase</p>
                      <p className="text-xs text-slate-500">Tomorrow, 10:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Interview CTA */}
              <div
                onClick={() => setShowMockInterviewModal(true)}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-indigo-600/10 rounded-2xl blur-md group-hover:bg-indigo-600/20 transition-all"></div>
                <div className="relative bg-white border border-indigo-200 p-5 rounded-2xl flex items-center justify-between shadow-md group-hover:border-indigo-300 transition-all">
                  <div>
                    <p className="text-sm font-bold text-slate-900">New Mock Interview</p>
                    <p className="text-xs text-slate-500">Start an AI simulated round</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                    <Plus size={20} />
                  </div>
                </div>
              </div>

              {/* Completion Checklist */}
              <div className="glass-card p-5 rounded-2xl">
                <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider font-mono-label">Onboarding Status</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="w-4 h-4 rounded border border-emerald-500/50 bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-slate-800 font-medium">Profile Configured</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="w-4 h-4 rounded border border-emerald-500/50 bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="text-slate-800 font-medium">Target Role Selected</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="w-4 h-4 rounded border border-slate-300 bg-slate-100 flex items-center justify-center"></div>
                    <span>Resume Upload & ATS Analysis</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1.5: ADAPTIVE AI MOCK INTERVIEW                       */}
        {/* ========================================================= */}
        {activeTab === 'interview' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Adaptive AI Mock Interview Session</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Real-time, context-aware interview simulator with dynamic difficulty adjustment and keyword follow-ups powered by Gemini API.
                </p>
              </div>

              <button
                onClick={() => setShowManualInterviewModal(true)}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-indigo-700 font-semibold text-xs flex items-center gap-2 shrink-0 transition shadow-xs"
              >
                <Plus size={15} /> Manual Interview Entry
              </button>
            </div>

            <MockInterviewWorkspace />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1.8: ONLINE CODING ARENA                              */}
        {/* ========================================================= */}
        {activeTab === 'coding' && (
          <div className="space-y-8">
            <CodingArenaView />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1.9: PROFILE SETUP                                    */}
        {/* ========================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <ProfileSetupForm
              onSaved={(p) => {
                setUserProfile((prev) => ({
                  ...prev,
                  name: p.displayName,
                  targetRole: p.targetRole,
                  experienceLevel: p.experienceLevel,
                  skills: p.skills
                }));
              }}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: RESUME LAB                                         */}
        {/* ========================================================= */}
        {activeTab === 'resume' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Resume Lab & ATS Optimizer</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Upload PDF or type work experience manually for ATS scoring, structured parsing, and Job Description matching.
                </p>
              </div>

              {/* Mode Toggle Switch */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                <button
                  onClick={() => setResumeTabMode('upload')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    resumeTabMode === 'upload' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5 inline-block mr-1.5" /> PDF / Text Auto-Parse
                </button>
                <button
                  onClick={() => setResumeTabMode('manual')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    resumeTabMode === 'manual' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 inline-block mr-1.5" /> Manual Resume Form
                </button>
              </div>
            </div>

            {resumeTabMode === 'manual' ? (
              <ManualResumeForm
                initialCandidateName={userProfile.name}
                onSuccess={(newResume) => {
                  setResumeAnalysisData({
                    extractedSkills: newResume.skills?.technical || [],
                    education: newResume.education || [],
                    workExperience: newResume.workExperience || [],
                    projects: newResume.projects || [],
                    strengths: newResume.strengths || [],
                    weaknesses: newResume.weaknesses || [],
                    atsCompatibilityScore: newResume.atsCompatibilityScore || 88,
                    overallResumeScore: newResume.overallScore || 86,
                    summary: newResume.summary
                  });
                  setResumeTabMode('upload');
                }}
              />
            ) : (
              <>
                {/* Resume Upload & Match Controller */}
                <ResumeUploader
                  isLoading={isAnalyzingResume}
                  setIsLoading={setIsAnalyzingResume}
                  onAnalysisComplete={(analysis, match) => {
                    setResumeAnalysisData(analysis);
                    setJdMatchData(match);
                  }}
                />

                {/* Analysis & Match Output View */}
                <MatchResultsView
                  analysisData={resumeAnalysisData}
                  matchData={jdMatchData}
                />
              </>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: BEHAVIORAL & COMMUNICATION ANALYZER                */}
        {/* ========================================================= */}
        {activeTab === 'analyzer' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Behavioral & Communication Analyzer</h2>
              <p className="text-sm text-slate-600 mt-1">Real-time analysis of your non-verbal cues and structured response effectiveness using AI tracking.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Live Webcam Simulation & Communication Radar */}
              <div className="lg:col-span-5 space-y-6">
                {/* Live Analyzer Video Box */}
                <div className="glass-card rounded-2xl overflow-hidden relative shadow-md">
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-bold font-mono-label flex items-center gap-1.5 uppercase">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                      {isCameraActive ? 'LIVE VIDEO ANALYZER' : 'SIMULATION MODE'}
                    </span>
                  </div>

                  <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                      alt="Candidate Webcam Feed"
                      className="w-full h-full object-cover grayscale-[0.1]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                    {/* Facial tracking grid overlay */}
                    <div className="absolute inset-0 border-2 border-indigo-400/40 m-6 rounded-xl pointer-events-none flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border border-dashed border-indigo-300 animate-pulse"></div>
                    </div>

                    {/* Bottom Tracking Meters Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 grid grid-cols-2 gap-3">
                      <div className="bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 text-slate-900 shadow-xs">
                        <p className="text-[10px] font-mono-label text-slate-500 uppercase">Eye Contact</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-base font-bold text-indigo-700">94%</span>
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '94%' }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 text-slate-900 shadow-xs">
                        <p className="text-[10px] font-mono-label text-slate-500 uppercase">Confidence</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-base font-bold text-emerald-600">88%</span>
                          <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
                    <p className="text-xs text-slate-700 font-medium">Eye contact is exceptionally stable. Maintain during high-stakes explanations.</p>
                    <button
                      onClick={() => setIsCameraActive(!isCameraActive)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-indigo-700 hover:bg-indigo-50 font-semibold shrink-0 ml-2 shadow-xs"
                    >
                      {isCameraActive ? 'Stop Feed' : 'Start Feed'}
                    </button>
                  </div>
                </div>

                {/* Communication Radar Card */}
                <div className="glass-card p-6 rounded-2xl text-center space-y-4">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider font-mono-label">Communication Metrics</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[10px] font-mono-label text-slate-500 uppercase">Clarity</p>
                      <p className="text-xl font-bold text-indigo-600 mt-1">9.2</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[10px] font-mono-label text-slate-500 uppercase">Vocab</p>
                      <p className="text-xl font-bold text-amber-600 mt-1">7.8</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[10px] font-mono-label text-slate-500 uppercase">Fluency</p>
                      <p className="text-xl font-bold text-emerald-600 mt-1">8.5</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: STAR Evaluation Framework */}
              <div className="lg:col-span-7 space-y-6">
                <div className="glass-card rounded-2xl overflow-hidden">
                  {/* STAR Tabs */}
                  <div className="flex border-b border-slate-200 text-xs font-mono-label font-bold">
                    {(['situation', 'task', 'action', 'result'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveStarTab(tab)}
                        className={`flex-1 py-3.5 tracking-widest uppercase transition-all border-b-2 ${
                          activeStarTab === tab ? 'border-indigo-600 text-indigo-700 bg-indigo-50/80' : 'border-transparent text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="p-6 space-y-6">
                    {activeStarTab === 'situation' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-slate-900">Contextual Foundation (Situation)</h3>
                          <span className="px-2.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-mono-label font-bold">
                            STRENGTH: HIGH
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 italic leading-relaxed bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-600">
                          "In my previous role at Meta, we were facing a massive surge in API latency—roughly 40% increase—during the Q4 peak shopping season. The legacy caching layer was failing under the distributed load."
                        </p>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <p className="text-xs font-bold text-indigo-700 font-mono-label uppercase tracking-widest">AI Analysis Highlights</p>
                          <div className="flex items-center gap-2 text-xs text-slate-700">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> Clear quantitative metrics (40% increase) used to establish urgency.
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-700">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> Concise framing of technological bottleneck.
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStarTab === 'task' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">The Assigned Task</h3>
                        <p className="text-sm text-slate-700 italic leading-relaxed bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-600">
                          "My specific objective was to design and lead the migration to a Redis-based architecture without causing any downtime for live checkout sessions."
                        </p>
                      </div>
                    )}

                    {activeStarTab === 'action' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Execution & Technical Actions</h3>
                        <p className="text-sm text-slate-700 italic leading-relaxed bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-600">
                          "I implemented a blue-green deployment strategy and wrote custom middleware in TypeScript to handle dual-write operations during the Redis sync phase."
                        </p>
                      </div>
                    )}

                    {activeStarTab === 'result' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Measurable Outcomes</h3>
                        <p className="text-sm text-slate-700 italic leading-relaxed bg-slate-50 p-4 rounded-xl border-l-4 border-indigo-600">
                          "Resulted in a 65% reduction in latency and saved approximately $400k in annual infrastructure overhead."
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border border-indigo-200 bg-indigo-50 flex items-center justify-center font-bold text-indigo-700">
                          8.8
                        </div>
                        <div>
                          <p className="text-xs font-mono-label text-slate-500 uppercase">STAR Framework Score</p>
                          <p className="text-xs text-slate-700 font-medium">Targeting Senior Engineering Standard</p>
                        </div>
                      </div>

                      <button className="gradient-btn text-white px-5 py-2.5 rounded-xl text-xs font-semibold active:scale-95">
                        Re-Record Response Section
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Insights Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-card p-5 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-amber-600">
                      <Clock size={18} />
                      <h4 className="text-sm font-bold text-slate-900">Pacing Insight</h4>
                    </div>
                    <p className="text-xs text-slate-600">Speaking rate averaged 145 WPM. Ideal target range is 130-160 WPM. Excellent composure under pressure.</p>
                  </div>

                  <div className="glass-card p-5 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <TrendingUp size={18} />
                      <h4 className="text-sm font-bold text-slate-900">Tone Variance</h4>
                    </div>
                    <p className="text-xs text-slate-600">High emotional resonance detected during Action phase. Shows authentic technical ownership.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: DIAGNOSTIC REPORTS                                 */}
        {/* ========================================================= */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <InterviewReportView />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: LEARNING ROADMAP & FLASHCARD PRACTICE               */}
        {/* ========================================================= */}
        {activeTab === 'roadmap' && (
          <div className="space-y-12">
            <LearningRoadmapView />
            <div className="border-t border-slate-200 pt-8">
              <FlashcardDeck />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: GAMIFICATION, DAILY CHALLENGES & LEADERBOARD       */}
        {/* ========================================================= */}
        {activeTab === 'gamify' && (
          <div className="space-y-10">
            <DailyChallengeWidget />
            <div className="border-t border-slate-200 pt-8">
              <LeaderboardTable currentUserName={userProfile.name} />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: ADMIN OVERVIEW                                     */}
        {/* ========================================================= */}
        {activeTab === 'admin' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Executive Platform Overview</h2>
                <p className="text-sm text-slate-600 mt-1">Real-time system health and question bank inventory management.</p>
              </div>
              <button
                onClick={() => setShowAddQuestionModal(true)}
                className="gradient-btn text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus size={16} /> Add New Question
              </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-5 rounded-2xl">
                <p className="text-[10px] font-mono-label text-slate-500 uppercase">Active Candidates</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">24,892</p>
                <p className="text-xs text-emerald-600 mt-1 font-semibold">+12.5% this month</p>
              </div>
              <div className="glass-card p-5 rounded-2xl">
                <p className="text-[10px] font-mono-label text-slate-500 uppercase">API Throughput</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">1.2M <span className="text-xs font-normal text-slate-500">reqs</span></p>
                <p className="text-xs text-indigo-600 mt-1 font-semibold">82ms avg latency</p>
              </div>
              <div className="glass-card p-5 rounded-2xl">
                <p className="text-[10px] font-mono-label text-slate-500 uppercase">Active Question Pool</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{questionPool.length + 4116}</p>
                <p className="text-xs text-slate-500 mt-1">Across 8 categories</p>
              </div>
              <div className="glass-card p-5 rounded-2xl">
                <p className="text-[10px] font-mono-label text-slate-500 uppercase">Engine Status</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1">v4.2-Pro</p>
                <p className="text-xs text-slate-500 mt-1">Uptime: 99.998%</p>
              </div>
            </div>

            {/* Question Inventory Table */}
            <div className="glass-card rounded-2xl overflow-hidden space-y-4 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-slate-900 text-base">Question Inventory Pool</h3>
                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search pool..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-mono-label border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">DIFFICULTY</th>
                      <th className="px-4 py-3">TITLE</th>
                      <th className="px-4 py-3">CATEGORY</th>
                      <th className="px-4 py-3 text-right">USAGE (7D)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {questionPool
                      .filter(q => q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.category.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono-label ${
                                q.difficulty === 'Hard'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : q.difficulty === 'Medium'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {q.difficulty}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">{q.title}</td>
                          <td className="px-4 py-3 text-slate-600">{q.category}</td>
                          <td className="px-4 py-3 text-right font-mono-label text-slate-700">{q.usageCount}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL 1: PROFILE SETUP / ONBOARDING MODAL                 */}
      {/* ========================================================= */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl space-y-6 relative border-slate-200 shadow-2xl bg-white">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-1"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Profile & Preferences</h3>
              <p className="text-xs text-slate-500 mt-1">Configure your target roles, experience level, and verified skill tags.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5">Target Role Title</label>
                <input
                  type="text"
                  value={userProfile.title}
                  onChange={(e) => setUserProfile({ ...userProfile, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5">Experience Level</label>
                <select
                  value={userProfile.experienceLevel}
                  onChange={(e) => setUserProfile({ ...userProfile, experienceLevel: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option>Junior (0-2 yrs)</option>
                  <option>Mid-Level (3-5 yrs)</option>
                  <option>Senior (5-8 yrs)</option>
                  <option>Staff / Principal (8+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5">Skill Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {userProfile.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs flex items-center gap-1.5 font-medium">
                      {skill}
                      <X
                        size={12}
                        className="cursor-pointer hover:text-indigo-900"
                        onClick={() => setUserProfile({ ...userProfile, skills: userProfile.skills.filter((_, i) => i !== idx) })}
                      />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. Docker, GraphQL)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSkillInput.trim()) {
                        setUserProfile({ ...userProfile, skills: [...userProfile.skills, newSkillInput.trim()] });
                        setNewSkillInput('');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-xs"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="gradient-btn text-white px-6 py-2.5 rounded-xl font-bold text-xs active:scale-95 shadow-md"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: INTERACTIVE AI MOCK INTERVIEW SIMULATOR           */}
      {/* ========================================================= */}
      {showMockInterviewModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full p-6 sm:p-8 rounded-3xl space-y-5 relative border-slate-200 shadow-2xl flex flex-col max-h-[85vh] bg-white">
            <button
              onClick={() => setShowMockInterviewModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-1"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <Brain size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Interactive AI Mock Session</h3>
                <p className="text-xs text-slate-500">Technical Deep Dive & Architectural Problem Solving</p>
              </div>
            </div>

            {/* Chat Transcript Area */}
            <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-4 overflow-y-auto max-h-[380px] custom-scrollbar">
              {mockMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono-label mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-indigo-600 text-xs italic p-2 font-mono-label">
                  <RefreshCw size={14} className="animate-spin" /> AI Mentor evaluating response...
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMockMessage()}
                placeholder="Type your response or architectural approach..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSendMockMessage}
                className="gradient-btn text-white px-5 rounded-xl font-bold active:scale-95 flex items-center justify-center shadow-md"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: FLASHCARDS DECK GENERATOR MODAL                  */}
      {/* ========================================================= */}
      {showFlashcardsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl space-y-6 relative border-slate-200 shadow-2xl text-center bg-white">
            <button
              onClick={() => setShowFlashcardsModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-1"
            >
              <X size={20} />
            </button>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-mono-label font-bold uppercase">
                CARD {flashcardIndex + 1} OF {sampleFlashcards.length}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">AI Generated Skill Flashcards</h3>
            </div>

            {/* Flip Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="glass-card p-6 rounded-2xl min-h-[180px] flex flex-col items-center justify-center cursor-pointer border-indigo-200 hover:border-indigo-400 transition-all select-none relative group bg-indigo-50/30"
            >
              <p className="text-[10px] text-slate-400 font-mono-label uppercase mb-2">Click to flip card</p>
              {!isFlipped ? (
                <p className="text-sm font-bold text-slate-900 leading-relaxed">{sampleFlashcards[flashcardIndex].q}</p>
              ) : (
                <p className="text-xs text-indigo-900 leading-relaxed font-medium">{sampleFlashcards[flashcardIndex].a}</p>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                disabled={flashcardIndex === 0}
                onClick={() => {
                  setIsFlipped(false);
                  setFlashcardIndex(prev => Math.max(0, prev - 1));
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-200"
              >
                Previous
              </button>

              <button
                disabled={flashcardIndex === sampleFlashcards.length - 1}
                onClick={() => {
                  setIsFlipped(false);
                  setFlashcardIndex(prev => Math.min(sampleFlashcards.length - 1, prev + 1));
                }}
                className="gradient-btn text-white px-5 py-2 rounded-xl text-xs font-bold disabled:opacity-40"
              >
                Next Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: ADMIN ADD QUESTION MODAL                          */}
      {/* ========================================================= */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl space-y-4 relative border-slate-200 shadow-2xl bg-white">
            <button
              onClick={() => setShowAddQuestionModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Add Question to Inventory</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const title = (form.elements.namedItem('qTitle') as HTMLInputElement).value;
                const category = (form.elements.namedItem('qCategory') as HTMLInputElement).value;
                const difficulty = (form.elements.namedItem('qDifficulty') as HTMLSelectElement).value as any;

                if (title && category) {
                  setQuestionPool([
                    ...questionPool,
                    { id: Date.now().toString(), title, category, difficulty, usageCount: 0 }
                  ]);
                  setShowAddQuestionModal(false);
                }
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-medium mb-1">Question Title</label>
                <input
                  name="qTitle"
                  required
                  type="text"
                  placeholder="e.g., Explain Redis Cluster Partitioning"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Category</label>
                <input
                  name="qCategory"
                  required
                  type="text"
                  placeholder="e.g., System Design, React, Security"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Difficulty</label>
                <select
                  name="qDifficulty"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="gradient-btn text-white px-5 py-2 rounded-xl font-bold">
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: MANUAL INTERVIEW ENTRY MODAL                      */}
      {/* ========================================================= */}
      <ManualInterviewEntryModal
        isOpen={showManualInterviewModal}
        onClose={() => setShowManualInterviewModal(false)}
      />

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-200 py-6 px-8 text-center text-[11px] text-slate-500 font-mono-label z-10 bg-slate-50/50">
        INTERVIEWIQ AI ENGINE • IMMERSIVE PHASE 1 DEPLOYMENT • DEEPMIND GEMINI ARCHITECTURE
      </footer>
    </div>
  );
}
