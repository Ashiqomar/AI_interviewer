import React, { useState } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  Code,
  Layers,
  Award,
  Brain,
  RefreshCw
} from 'lucide-react';

interface Flashcard {
  id: number;
  category: string;
  question: string;
  answer: string;
  explanation: string;
  codeSnippet?: string;
  difficulty: string;
}

const defaultFlashcards: Flashcard[] = [
  {
    id: 1,
    category: 'System Design',
    question: 'What is the CAP Theorem and how does it affect distributed database selection?',
    answer: 'CAP Theorem states a distributed data store can only simultaneously guarantee 2 out of 3 properties: Consistency, Availability, and Partition Tolerance.',
    explanation: 'Since network partitions (P) are inevitable in distributed systems, architects must choose between Consistency (CP, e.g. MongoDB, HBase) or Availability (AP, e.g. Cassandra, DynamoDB).',
    codeSnippet: '',
    difficulty: 'Medium'
  },
  {
    id: 2,
    category: 'DSA & Algorithms',
    question: 'How do you detect a cycle in a Linked List in O(1) auxiliary space?',
    answer: "Use Floyd's Cycle-Finding Algorithm (Fast & Slow Pointers).",
    explanation: 'Initialize slow and fast pointers at head. Advance slow by 1 step and fast by 2 steps. If fast equals slow at any point, a cycle exists.',
    codeSnippet: 'let slow = head, fast = head;\nwhile (fast && fast.next) {\n  slow = slow.next;\n  fast = fast.next.next;\n  if (slow === fast) return true;\n}\nreturn false;',
    difficulty: 'Easy'
  },
  {
    id: 3,
    category: 'DBMS & Indexing',
    question: 'Why are B-Trees preferred over Hash Indexes for database range queries?',
    answer: 'B-Trees maintain key ordering across balanced node levels, allowing efficient range scans (e.g. WHERE age BETWEEN 25 AND 35).',
    explanation: 'Hash indexes provide O(1) exact match lookup but cannot evaluate range inequality operators efficiently without scanning every bucket.',
    codeSnippet: 'CREATE INDEX idx_user_created ON users(created_at);',
    difficulty: 'Medium'
  },
  {
    id: 4,
    category: 'Operating Systems',
    question: 'What is a Deadlock and what are the 4 Coffman conditions required for it to occur?',
    answer: 'A deadlock is a situation where set of processes are blocked because each holds a resource and waits for another held by another process. Conditions: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait.',
    explanation: 'Breaking any single Coffman condition (e.g. strict resource acquisition ordering to prevent circular wait) prevents deadlocks.',
    codeSnippet: '',
    difficulty: 'Hard'
  },
  {
    id: 5,
    category: 'Behavioral STAR',
    question: 'How should you structure the Result section of a STAR behavioral response?',
    answer: 'Quantify outcomes using business metrics (e.g., % latency drop, $ revenue saved, team time saved) and share key lessons learned.',
    explanation: 'Avoid ending with vague statements like "it went well". Always state the before vs after metric.',
    codeSnippet: '',
    difficulty: 'Easy'
  }
];

export default function FlashcardDeck() {
  const [selectedTopic, setSelectedTopic] = useState<string>('System Design');
  const [cards, setCards] = useState<Flashcard[]>(defaultFlashcards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());
  const [reviewIds, setReviewIds] = useState<Set<number>>(new Set());
  const [isLoadingCards, setIsLoadingCards] = useState<boolean>(false);

  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const markMastered = () => {
    if (!currentCard) return;
    setMasteredIds((prev) => new Set(prev).add(currentCard.id));
    setReviewIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNext();
  };

  const markReview = () => {
    if (!currentCard) return;
    setReviewIds((prev) => new Set(prev).add(currentCard.id));
    setMasteredIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNext();
  };

  const handleFetchTopicCards = async (topicName: string) => {
    setSelectedTopic(topicName);
    setIsLoadingCards(true);
    setIsFlipped(false);
    setCurrentIndex(0);

    try {
      const res = await fetch('/api/roadmap/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicName, count: 6 })
      });

      const json = await res.json();
      if (json.data && json.data.flashcards) {
        setCards(json.data.flashcards);
      }
    } catch (err) {
      console.error('Error fetching flashcards:', err);
    } finally {
      setIsLoadingCards(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner & Topic Tabs */}
      <div className="glass-card p-6 rounded-3xl space-y-5 border-indigo-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold font-mono">
              HIGH-YIELD RECALL ENGINE
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
              <Brain size={24} className="text-purple-400" /> Topic Practice & Interactive Flashcards
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Reinforce architectural patterns, algorithmic traps, and technical definitions with active recall cards.
            </p>
          </div>

          {/* Mastered Counter Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono flex items-center gap-1.5">
              <CheckCircle2 size={15} /> Mastered: {masteredIds.size}
            </span>
            <span className="px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono flex items-center gap-1.5">
              <RefreshCw size={14} /> Review: {reviewIds.size}
            </span>
          </div>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            'System Design',
            'Data Structures & Algorithms',
            'DBMS & SQL',
            'Operating Systems & Networks',
            'Behavioral STAR'
          ].map((topic) => (
            <button
              key={topic}
              onClick={() => handleFetchTopicCards(topic)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                selectedTopic === topic
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard Container with Flip Animation */}
      {isLoadingCards ? (
        <div className="glass-card p-12 text-center space-y-3 rounded-3xl">
          <RefreshCw size={28} className="animate-spin text-purple-400 mx-auto" />
          <p className="text-xs text-slate-300 font-mono">Generating Gemini high-yield flashcards for {selectedTopic}...</p>
        </div>
      ) : currentCard ? (
        <div className="space-y-6">
          {/* Deck Counter Header */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2">
            <span>
              Card <strong>{currentIndex + 1}</strong> of <strong>{cards.length}</strong>
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300 font-bold uppercase">
              {currentCard.difficulty || 'Medium'}
            </span>
          </div>

          {/* Interactive Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[300px] sm:min-h-[340px] glass-card p-8 rounded-3xl border-purple-500/30 flex flex-col justify-between cursor-pointer hover:border-purple-500/60 transition-all duration-300 shadow-2xl relative overflow-hidden group select-none"
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={14} /> {currentCard.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono group-hover:text-purple-300 transition-colors">
                <RotateCw size={13} /> Click card to flip ({isFlipped ? 'Answer View' : 'Question View'})
              </span>
            </div>

            {/* Card Main Body */}
            <div className="my-auto py-6">
              {!isFlipped ? (
                /* Question Side */
                <div className="space-y-4 text-center sm:text-left">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-widest block">
                    QUESTION PROMPT:
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-relaxed">
                    {currentCard.question}
                  </h3>
                </div>
              ) : (
                /* Answer Side */
                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-widest block">
                    SOLUTION & EXPLANATION:
                  </span>
                  <p className="text-base sm:text-lg font-bold text-white leading-relaxed">{currentCard.answer}</p>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    {currentCard.explanation}
                  </p>

                  {currentCard.codeSnippet && (
                    <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto">
                      <code>{currentCard.codeSnippet}</code>
                    </pre>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Status */}
            <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Status: {masteredIds.has(currentCard.id) ? '✓ Mastered' : reviewIds.has(currentCard.id) ? '↺ Review Queue' : 'Unseen'}</span>
              <span className="text-purple-400 font-bold">Tap to flip</span>
            </div>
          </div>

          {/* Action Controls Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 active:scale-95"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 active:scale-95"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={markReview}
                className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1.5 active:scale-95"
              >
                <XCircle size={15} /> Needs Review
              </button>
              <button
                onClick={markMastered}
                className="px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold flex items-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 size={15} /> Mark Mastered
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
