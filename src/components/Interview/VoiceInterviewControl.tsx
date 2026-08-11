import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Activity, AlertCircle, Sparkles, Send, RefreshCw, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { evaluateSpeechMetrics, speakText, stopSpeaking, SpeechAnalyticsResult } from '../../utils/speechAnalytics';
import WaveformVisualizer from './WaveformVisualizer';

interface VoiceInterviewControlProps {
  latestQuestionText?: string;
  onSubmitVoiceAnswer: (answerText: string, analytics: SpeechAnalyticsResult) => void;
  isEvaluating: boolean;
}

export default function VoiceInterviewControl({
  latestQuestionText = '',
  onSubmitVoiceAnswer,
  isEvaluating
}: VoiceInterviewControlProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<SpeechAnalyticsResult>({
    wordCount: 0,
    wpm: 0,
    wpmCategory: 'Optimal',
    fillerCount: 0,
    fillerBreakdown: {},
    confidenceScore: 90,
    clarityGrade: 'Excellent'
  });

  const {
    isListening,
    transcript,
    interimTranscript,
    durationSeconds,
    error,
    hasSupport,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript
  } = useVoiceRecognition();

  // Evaluate speech metrics whenever transcript or duration updates
  useEffect(() => {
    const fullText = (transcript + ' ' + interimTranscript).trim();
    if (fullText) {
      const metrics = evaluateSpeechMetrics(fullText, durationSeconds);
      setAnalytics(metrics);
    }
  }, [transcript, interimTranscript, durationSeconds]);

  const handleToggleSpeakQuestion = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else if (latestQuestionText) {
      setIsPlayingAudio(true);
      speakText(latestQuestionText, () => setIsPlayingAudio(false));
    }
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSubmit = () => {
    const finalText = (transcript + ' ' + interimTranscript).trim();
    if (!finalText) return;

    if (isListening) {
      stopListening();
    }

    const finalAnalytics = evaluateSpeechMetrics(finalText, Math.max(durationSeconds, 2));
    onSubmitVoiceAnswer(finalText, finalAnalytics);
    resetTranscript();
  };

  return (
    <div className="glass-card p-6 rounded-3xl space-y-5 border-indigo-500/30">
      {/* Top Header & AI Voice Question Player */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Activity size={18} className="text-indigo-400" /> Voice Mode & Real-time Communication Analytics
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Speak directly to your interviewer. Evaluates speaking pace (WPM), filler words, and vocal confidence in real-time.
          </p>
        </div>

        {/* Read Question Aloud Button */}
        {latestQuestionText && (
          <button
            type="button"
            onClick={handleToggleSpeakQuestion}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all shrink-0 ${
              isPlayingAudio
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-600/30'
            }`}
          >
            {isPlayingAudio ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span>{isPlayingAudio ? 'Stop Reading' : 'Read Question Aloud'}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-amber-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Voice Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Mic Trigger & Waveform Visualizer */}
        <div className="lg:col-span-5 space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
          <button
            type="button"
            onClick={handleToggleListening}
            disabled={!hasSupport || isEvaluating}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all transform active:scale-95 shadow-xl ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30 animate-pulse'
                : 'gradient-btn shadow-indigo-600/30 hover:scale-105'
            }`}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>

          <div>
            <span className="text-xs font-bold text-white block">
              {isListening ? 'Listening... Speak now' : 'Click Mic to Start Speaking'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Duration: {durationSeconds}s • Words: {analytics.wordCount}
            </span>
          </div>

          <WaveformVisualizer isListening={isListening} barCount={20} />
        </div>

        {/* Right Column: Live Analytics Badges */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* WPM Gauge */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono-label">Pace (WPM)</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {analytics.wpm} <span className="text-[11px] font-normal text-slate-400">wpm</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-2 self-start border ${
                analytics.wpmCategory === 'Optimal'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              {analytics.wpmCategory} Pace
            </span>
          </div>

          {/* Filler Word Counter */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono-label">Filler Words</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-1">
              {analytics.fillerCount}
            </div>
            <span className="text-[10px] text-slate-400 mt-2 truncate">
              {Object.keys(analytics.fillerBreakdown).length > 0
                ? Object.entries(analytics.fillerBreakdown)
                    .map(([w, c]) => `${w} (${c})`)
                    .join(', ')
                : 'No filler words'}
            </span>
          </div>

          {/* Estimated Confidence */}
          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono-label">Clarity & Confidence</span>
            <div className="text-2xl font-extrabold text-indigo-300 mt-1">
              {analytics.confidenceScore}%
            </div>
            <span className="text-[10px] font-bold text-emerald-400 mt-2 flex items-center gap-1">
              <CheckCircle2 size={12} /> {analytics.clarityGrade}
            </span>
          </div>
        </div>
      </div>

      {/* Live Transcript Box & Submit */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>Live Speech Transcript:</span>
          {transcript && (
            <button
              type="button"
              onClick={resetTranscript}
              className="text-rose-400 hover:text-rose-300 text-[11px] underline"
            >
              Clear Speech
            </button>
          )}
        </div>

        <textarea
          value={(transcript + ' ' + interimTranscript).trim()}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Speech transcript will stream live here as you talk..."
          className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none min-h-[90px]"
        />

        <div className="flex justify-end pt-1">
          <button
            type="button"
            disabled={isEvaluating || !(transcript || interimTranscript).trim()}
            onClick={handleSubmit}
            className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Evaluating Audio Response...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>Submit Voice Answer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
