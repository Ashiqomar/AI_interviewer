import React, { useEffect, useRef } from 'react';
import { Bot, User, Sparkles, Lightbulb, CheckCircle2, AlertTriangle, Tag, Clock } from 'lucide-react';

export interface InterviewTurn {
  id: string;
  role: 'interviewer' | 'candidate';
  text: string;
  timestamp: string;
  category?: string;
  difficulty?: string;
  evaluation?: {
    rating: number;
    feedback: string;
    detectedKeywords: string[];
    strengths: string[];
    areasToImprove: string[];
  };
  hint?: string;
  isFollowUp?: boolean;
}

interface TranscriptFeedProps {
  turns: InterviewTurn[];
  isEvaluating: boolean;
}

export default function TranscriptFeed({ turns, isEvaluating }: TranscriptFeedProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, isEvaluating]);

  return (
    <div className="space-y-6 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
      {turns.map((turn, index) => {
        const isInterviewer = turn.role === 'interviewer';

        return (
          <div
            key={turn.id || index}
            className={`flex flex-col gap-3 ${
              isInterviewer ? 'items-start' : 'items-end'
            }`}
          >
            <div
              className={`flex items-start gap-3 max-w-[88%] sm:max-w-[80%] ${
                isInterviewer ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center font-bold text-xs shadow-md ${
                  isInterviewer
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border border-indigo-400/40'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border border-emerald-400/40'
                }`}
              >
                {isInterviewer ? <Bot size={18} /> : <User size={18} />}
              </div>

              {/* Message Content Box */}
              <div
                className={`p-4 sm:p-5 rounded-3xl space-y-3 relative ${
                  isInterviewer
                    ? 'glass-card bg-slate-900/90 text-slate-100 border-indigo-500/30 rounded-tl-none'
                    : 'bg-indigo-600/90 text-white border border-indigo-400/40 shadow-lg rounded-tr-none'
                }`}
              >
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-3 text-[11px] font-mono-label opacity-80 border-b border-slate-700/50 pb-2">
                  <span className="font-bold flex items-center gap-1.5">
                    {isInterviewer ? 'Gemini AI Recruiter' : 'Candidate (You)'}
                    {turn.difficulty && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-indigo-500/30 text-[10px]">
                        {turn.difficulty}
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock size={11} /> {turn.timestamp}
                  </span>
                </div>

                {/* Main Message Text */}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{turn.text}</p>

                {/* Evaluation Card (if candidate turn has evaluation) */}
                {turn.evaluation && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs text-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                        <Sparkles size={14} /> AI Turn Rating
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-lg font-bold text-xs border ${
                          turn.evaluation.rating >= 8
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : turn.evaluation.rating >= 5
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {turn.evaluation.rating} / 10
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 italic">{turn.evaluation.feedback}</p>

                    {/* Detected Tech Keywords */}
                    {turn.evaluation.detectedKeywords?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mr-1">
                          <Tag size={11} /> Keywords:
                        </span>
                        {turn.evaluation.detectedKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-semibold"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Hint Card */}
                {turn.hint && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                    <Lightbulb size={16} className="shrink-0 text-amber-400 mt-0.5" />
                    <div>
                      <span className="font-bold block text-amber-300 text-[11px] uppercase tracking-wider font-mono-label">
                        Interviewer Hint
                      </span>
                      <span>{turn.hint}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Evaluating Typing Indicator */}
      {isEvaluating && (
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md animate-pulse">
            <Bot size={18} />
          </div>
          <div className="p-4 rounded-3xl glass-card bg-slate-900/90 border border-indigo-500/30 flex items-center gap-3 text-xs text-indigo-300">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span className="font-mono">Gemini AI evaluating response & adjusting question depth...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
