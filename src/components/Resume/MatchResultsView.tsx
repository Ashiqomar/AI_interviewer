import React, { useState } from 'react';
import { Target, Award, CheckCircle2, AlertTriangle, BookOpen, Layers, Zap, ArrowUpRight, PlusCircle, Check, Briefcase, GraduationCap, Code } from 'lucide-react';

interface MatchResultsViewProps {
  analysisData: any;
  matchData: any;
}

export default function MatchResultsView({ analysisData, matchData }: MatchResultsViewProps) {
  const [addedKeywords, setAddedKeywords] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'match' | 'resume' | 'courses'>('match');

  if (!analysisData && !matchData) return null;

  const atsScore = analysisData?.atsCompatibilityScore ?? 85;
  const overallScore = analysisData?.overallResumeScore ?? 82;
  const matchPct = matchData?.matchPercentage ?? 78;

  const strengths = analysisData?.strengths || [];
  const weaknesses = analysisData?.weaknesses || [];
  const missingATSSections = analysisData?.missingATSSections || [];
  const extractedSkills = analysisData?.extractedSkills || [];

  const matchedKeywords = matchData?.matchedKeywords || [];
  const missingKeywords = matchData?.missingKeywords || [];
  const suggestedCourses = matchData?.suggestedCourses || [];
  const tailoringRecs = matchData?.tailoringRecommendations || [];

  const handleToggleKeyword = (keyword: string) => {
    if (addedKeywords.includes(keyword)) {
      setAddedKeywords(addedKeywords.filter(k => k !== keyword));
    } else {
      setAddedKeywords([...addedKeywords, keyword]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6">
      {/* Top Scores Gauge Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gauge 1: ATS Score */}
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between relative overflow-hidden">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono-label">ATS Parse Score</span>
            <div className="text-3xl font-extrabold text-white mt-1 flex items-baseline gap-1">
              {atsScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Structure, headings & readable text</p>
          </div>
          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center font-extrabold text-xl ${getScoreColor(atsScore)}`}>
            {atsScore}%
          </div>
        </div>

        {/* Gauge 2: Overall Resume Score */}
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between relative overflow-hidden">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono-label">Resume Impact</span>
            <div className="text-3xl font-extrabold text-white mt-1 flex items-baseline gap-1">
              {overallScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Quantified impact & language</p>
          </div>
          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center font-extrabold text-xl ${getScoreColor(overallScore)}`}>
            {overallScore}%
          </div>
        </div>

        {/* Gauge 3: Target Job Match % */}
        <div className="glass-card p-6 rounded-2xl flex items-center justify-between relative overflow-hidden border-indigo-500/40 bg-indigo-950/20">
          <div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono-label flex items-center gap-1">
              <Target size={14} /> JD Compatibility
            </span>
            <div className="text-3xl font-extrabold text-white mt-1 flex items-baseline gap-1">
              {matchPct}%
            </div>
            <p className="text-xs text-indigo-300/80 mt-1">
              Fit level: <span className="font-bold text-indigo-200">{matchData?.roleFitLevel || 'High'}</span>
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-extrabold text-xl">
            {matchPct}%
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('match')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'match' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target size={16} /> Job Match & Tailoring
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'resume' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award size={16} /> Resume Strengths & ATS
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'courses' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen size={16} /> Skill Gaps & Courses ({suggestedCourses.length})
        </button>
      </div>

      {/* TAB 1: JOB MATCH & TAILORING */}
      {activeTab === 'match' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Missing Keywords Box */}
          <div className="lg:col-span-7 glass-card p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono-label flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-400" /> Missing ATS Keywords
              </h4>
              <span className="text-xs text-slate-400 font-mono">{missingKeywords.length} keywords identified</span>
            </div>
            <p className="text-xs text-slate-400">
              Incorporate these terms into your bullet points or skills summary to bypass ATS filtering:
            </p>

            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((kw: string, i: number) => {
                const isAdded = addedKeywords.includes(kw);
                return (
                  <button
                    key={i}
                    onClick={() => handleToggleKeyword(kw)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                      isAdded
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:border-rose-400'
                    }`}
                  >
                    {isAdded ? <Check size={12} /> : <PlusCircle size={12} />}
                    <span>{kw}</span>
                  </button>
                );
              })}
            </div>

            {/* Matched Keywords */}
            <div className="pt-4 border-t border-slate-800">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono-label mb-2">
                Matched Strong Keywords ({matchedKeywords.length})
              </h5>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((kw: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} /> {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tailoring Recommendations */}
          <div className="lg:col-span-5 glass-card p-6 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono-label flex items-center gap-2">
              <Zap size={16} className="text-indigo-400" /> Actionable Tailoring Steps
            </h4>
            <div className="space-y-3">
              {tailoringRecs.map((rec: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center font-bold text-[10px] text-indigo-300">
                    {i + 1}
                  </span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESUME STRENGTHS & ATS SECTIONS */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider font-mono-label flex items-center gap-2">
              <CheckCircle2 size={16} /> Profile Strengths
            </h4>
            <div className="space-y-2.5">
              {strengths.map((str: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-200">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses & Missing ATS Sections */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-mono-label flex items-center gap-2">
              <AlertTriangle size={16} /> Areas for Improvement
            </h4>
            <div className="space-y-2.5">
              {weaknesses.map((wk: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-200">
                  <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>{wk}</span>
                </div>
              ))}
            </div>

            {missingATSSections.length > 0 && (
              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs font-bold text-rose-400 uppercase font-mono-label">Missing ATS Formatting Sections:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {missingATSSections.map((sec: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-medium">
                      Missing {sec}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SUGGESTED COURSES & SKILL GAPS */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="glass-card p-6 rounded-2xl">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono-label flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-indigo-400" /> Recommended Mastery Courses
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedCourses.map((course: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                      {course.platform || 'Online Mastery'}
                    </span>
                    <h5 className="text-sm font-bold text-white mt-2">{course.title}</h5>
                    <p className="text-xs text-slate-400 mt-1">{course.reasoning}</p>
                  </div>
                  <button className="text-xs text-indigo-300 font-semibold hover:text-white flex items-center gap-1 self-start pt-2">
                    Explore Curriculum <ArrowUpRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Parsed Resume Overview (Skills, Experience, Education) */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono-label flex items-center gap-2">
          <Layers size={16} className="text-indigo-400" /> Parsed Resume Data Overview
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          {/* Extracted Skills */}
          <div className="space-y-2">
            <span className="font-bold text-white flex items-center gap-1.5"><Code size={14} className="text-indigo-400" /> Extracted Skills ({extractedSkills.length})</span>
            <div className="flex flex-wrap gap-1.5">
              {extractedSkills.map((sk: string, i: number) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Work History */}
          <div className="space-y-2">
            <span className="font-bold text-white flex items-center gap-1.5"><Briefcase size={14} className="text-emerald-400" /> Work History</span>
            <div className="space-y-2">
              {analysisData?.workExperience?.map((exp: any, i: number) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="font-bold text-white">{exp.role}</p>
                  <p className="text-[11px] text-slate-400">{exp.company} • {exp.duration}</p>
                </div>
              )) || <p className="text-slate-500">No work history extracted.</p>}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <span className="font-bold text-white flex items-center gap-1.5"><GraduationCap size={14} className="text-indigo-400" /> Education</span>
            <div className="space-y-2">
              {analysisData?.education?.map((edu: any, i: number) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="font-bold text-white">{edu.degree}</p>
                  <p className="text-[11px] text-slate-400">{edu.institution} ({edu.year})</p>
                </div>
              )) || <p className="text-slate-500">No education extracted.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
