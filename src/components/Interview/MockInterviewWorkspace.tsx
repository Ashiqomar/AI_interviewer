import React, { useState } from 'react';
import { Play, RotateCcw, Send, Lightbulb, Sparkles, AlertCircle, Brain, Target, Shield, CheckCircle2, ArrowRight, Mic, MessageSquare } from 'lucide-react';
import TranscriptFeed, { InterviewTurn } from './TranscriptFeed';
import VoiceInterviewControl from './VoiceInterviewControl';
import { SpeechAnalyticsResult } from '../../utils/speechAnalytics';

export default function MockInterviewWorkspace() {
  const [interviewType, setInterviewType] = useState<string>('Technical');
  const [difficultyLevel, setDifficultyLevel] = useState<string>('Intermediate');
  const [targetRole, setTargetRole] = useState<string>('Senior Full-Stack Engineer');

  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');

  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const [turns, setTurns] = useState<InterviewTurn[]>([]);
  const [candidateInput, setCandidateInput] = useState<string>('');
  const [currentDifficulty, setCurrentDifficulty] = useState<string>('Intermediate');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStartSession = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewType,
          difficultyLevel,
          targetRole,
          candidateSkills: ['React', 'TypeScript', 'Node.js', 'System Design']
        })
      });

      const json = await res.json();
      const data = json.data || json;

      const initialTurn: InterviewTurn = {
        id: 'turn-1',
        role: 'interviewer',
        text: `${data.welcomeMessage}\n\n${data.initialQuestion}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: data.category,
        difficulty: data.suggestedDifficulty || difficultyLevel
      };

      setTurns([initialTurn]);
      setCurrentDifficulty(data.suggestedDifficulty || difficultyLevel);
      setIsSessionActive(true);
    } catch (err: any) {
      console.error('Error starting mock interview session:', err);
      setErrorMessage('Failed to start interview session. Please verify backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAnswer = async (
    requestHintOverride: boolean = false,
    customAnswerText?: string,
    voiceAnalytics?: SpeechAnalyticsResult
  ) => {
    const rawText = customAnswerText !== undefined ? customAnswerText : candidateInput;
    if (!rawText.trim() && !requestHintOverride) return;

    setErrorMessage(null);
    const userAnswerText = rawText.trim() || '(Candidate requested a hint)';

    // Add user turn immediately
    const userTurn: InterviewTurn = {
      id: 'turn-' + Date.now(),
      role: 'candidate',
      text: userAnswerText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedTurns = [...turns, userTurn];
    setTurns(updatedTurns);
    setCandidateInput('');
    setIsEvaluating(true);

    try {
      const conversationHistory = updatedTurns.map((t) => ({
        role: t.role,
        text: t.text
      }));

      const res = await fetch('/api/interview/next-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewType,
          currentDifficulty,
          targetRole,
          conversationHistory,
          candidateAnswer: userAnswerText,
          requestHint: requestHintOverride
        })
      });

      const json = await res.json();
      const data = json.data || json;

      // Combine Gemini response evaluation with voice analytics if present
      const combinedEval = voiceAnalytics
        ? {
            ...data.evaluation,
            feedback: `${data.evaluation.feedback} [Voice Metrics: ${voiceAnalytics.wpm} WPM, ${voiceAnalytics.fillerCount} filler words, Pace: ${voiceAnalytics.wpmCategory}]`
          }
        : data.evaluation;

      // Update the user turn with evaluation details
      const turnsWithEval = updatedTurns.map((turn) => {
        if (turn.id === userTurn.id) {
          return {
            ...turn,
            evaluation: combinedEval,
            hint: requestHintOverride ? data.hint : undefined
          };
        }
        return turn;
      });

      // Add the next interviewer turn
      const nextInterviewerTurn: InterviewTurn = {
        id: 'turn-' + (Date.now() + 1),
        role: 'interviewer',
        text: data.nextQuestion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        difficulty: data.nextDifficulty,
        hint: !requestHintOverride && data.hint ? data.hint : undefined,
        isFollowUp: data.isFollowUp
      };

      setTurns([...turnsWithEval, nextInterviewerTurn]);
      if (data.nextDifficulty) {
        setCurrentDifficulty(data.nextDifficulty);
      }
    } catch (err: any) {
      console.error('Error getting next interview turn:', err);
      setErrorMessage('Error evaluating answer with Gemini AI. Session restored.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSendAnswer(false);
    }
  };

  const handleResetSession = () => {
    setIsSessionActive(false);
    setTurns([]);
    setCandidateInput('');
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Session Configuration & Top Header */}
      <div className="glass-card p-6 rounded-3xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain size={22} className="text-indigo-400" /> Adaptive AI Mock Interview Engine
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Simulate turn-by-turn interviews with real-time Gemini evaluation, keyword follow-ups, and adaptive difficulty.
            </p>
          </div>

          {!isSessionActive ? (
            <button
              onClick={handleStartSession}
              disabled={isLoading}
              className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <RotateCcw size={16} className="animate-spin" /> : <Play size={16} />}
              <span>Start Interactive Interview</span>
            </button>
          ) : (
            <button
              onClick={handleResetSession}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2 border border-slate-700"
            >
              <RotateCcw size={14} /> End & Reset Session
            </button>
          )}
        </div>

        {/* Configuration Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono-label mb-1.5 block">
              Interview Track
            </label>
            <select
              value={interviewType}
              disabled={isSessionActive}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
            >
              <option value="Technical">Technical & Coding</option>
              <option value="System Design">System Design & Architecture</option>
              <option value="Behavioral">Behavioral & STAR Method</option>
              <option value="HR">HR & Culture Fit</option>
              <option value="Managerial">Engineering Manager & Leadership</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono-label mb-1.5 block">
              Initial Difficulty
            </label>
            <select
              value={difficultyLevel}
              disabled={isSessionActive}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
            >
              <option value="Beginner">Beginner (Foundational)</option>
              <option value="Intermediate">Intermediate (Mid/Senior)</option>
              <option value="Advanced">Advanced (Staff/Principal)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono-label mb-1.5 block">
              Target Candidate Role
            </label>
            <input
              type="text"
              value={targetRole}
              disabled={isSessionActive}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Main Workspace Feed & Input Panel */}
      {isSessionActive ? (
        <div className="space-y-6">
          {/* Status Header */}
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-bold">Session Active</span>
              <span className="text-slate-500">•</span>
              <span className="text-indigo-300">Track: {interviewType}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold">
                Difficulty: {currentDifficulty}
              </span>
              <span className="text-slate-400">Turns: {Math.floor(turns.length / 2)}</span>
            </div>
          </div>

          {/* Transcript Feed */}
          <div className="glass-card p-6 rounded-3xl">
            <TranscriptFeed turns={turns} isEvaluating={isEvaluating} />
          </div>

          {/* Mode Switcher Bar */}
          <div className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 pl-3 hidden sm:inline">
              Response Input Mode:
            </span>
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  inputMode === 'text'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare size={15} /> Text Mode
              </button>
              <button
                type="button"
                onClick={() => setInputMode('voice')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  inputMode === 'voice'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Mic size={15} /> Voice Mode & Analytics
              </button>
            </div>
          </div>

          {/* Answer Submission Box or Voice Control */}
          {inputMode === 'voice' ? (
            <VoiceInterviewControl
              latestQuestionText={
                [...turns].reverse().find((t) => t.role === 'interviewer')?.text || ''
              }
              isEvaluating={isEvaluating}
              onSubmitVoiceAnswer={(voiceText, analytics) => {
                handleSendAnswer(false, voiceText, analytics);
              }}
            />
          ) : (
            <div className="glass-card p-4 sm:p-5 rounded-3xl space-y-3 relative">
              <div className="flex items-center justify-between text-xs font-mono-label text-slate-400">
                <span className="font-bold flex items-center gap-1.5 text-slate-300">
                  <Target size={14} className="text-indigo-400" /> YOUR RESPONSE
                </span>
                <span className="text-[11px] text-slate-500">Press Cmd/Ctrl + Enter to send</span>
              </div>

              <textarea
                value={candidateInput}
                onChange={(e) => setCandidateInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isEvaluating}
                placeholder="Type your response thoroughly using technical examples, STAR framework, or architectural details..."
                className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none min-h-[110px]"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  disabled={isEvaluating}
                  onClick={() => handleSendAnswer(true)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Lightbulb size={15} /> Request Gemini Hint
                </button>

                <button
                  type="button"
                  disabled={isEvaluating || !candidateInput.trim()}
                  onClick={() => handleSendAnswer(false)}
                  className="w-full sm:w-auto gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <span>Submit Answer</span>
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State / Welcome Preview */
        <div className="glass-card p-8 rounded-3xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mx-auto">
            <Brain size={32} />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h4 className="text-lg font-bold text-white">Ready to begin your adaptive interview simulation?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select your track and initial difficulty above, then click <strong className="text-indigo-300">Start Interactive Interview</strong> to initiate the Gemini AI interviewer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5"><Sparkles size={14} /> Real-Time Scoring</span>
              <p className="text-slate-400 text-[11px]">Every turn is scored on a 1-10 scale with detected keywords.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5"><CheckCircle2 size={14} /> Technical Follow-Ups</span>
              <p className="text-slate-400 text-[11px]">Mentions of React, AWS, or Redis trigger deep technical probes.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-300 flex items-center gap-1.5"><Lightbulb size={14} /> On-Demand Hints</span>
              <p className="text-slate-400 text-[11px]">Request hints anytime if you feel stuck or need architectural guidance.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
