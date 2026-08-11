import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, RefreshCw, AlertCircle, CheckCircle2, FileCode, ArrowRight, X } from 'lucide-react';

interface ResumeUploaderProps {
  onAnalysisComplete: (analysisData: any, matchData: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function ResumeUploader({ onAnalysisComplete, isLoading, setIsLoading }: ResumeUploaderProps) {
  const [activeInputMode, setActiveInputMode] = useState<'upload' | 'text'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>(
    'We are seeking a Senior React/Frontend Engineer with expertise in state management, TypeScript, micro-frontends, GraphQL, and AWS Lambda performance optimization.'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const isExtensionValid = file.name.match(/\.(pdf|docx|txt)$/i);

    if (!validTypes.includes(file.type) && !isExtensionValid) {
      setErrorMessage('Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit.');
      return;
    }
    setSelectedFile(file);
  };

  const handleRunAnalysis = async () => {
    setErrorMessage(null);
    if (activeInputMode === 'upload' && !selectedFile) {
      setErrorMessage('Please upload a resume file or switch to Paste Text mode.');
      return;
    }
    if (activeInputMode === 'text' && !resumeText.trim()) {
      setErrorMessage('Please paste your resume text to continue.');
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMessage('Please enter a target Job Description for ATS matching.');
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Analyze Resume via Express API
      let analysisData = null;
      if (activeInputMode === 'upload' && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const analyzeRes = await fetch('/api/resume/analyze', {
          method: 'POST',
          body: formData
        });
        const analyzeJson = await analyzeRes.json();
        analysisData = analyzeJson.data || analyzeJson;
      } else {
        const analyzeRes = await fetch('/api/resume/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText })
        });
        const analyzeJson = await analyzeRes.json();
        analysisData = analyzeJson.data || analyzeJson;
      }

      // Step 2: Match Job Description via Express API
      const matchRes = await fetch('/api/resume/match-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeAnalysis: analysisData,
          resumeText: activeInputMode === 'text' ? resumeText : selectedFile?.name,
          jobDescription
        })
      });
      const matchJson = await matchRes.json();
      const matchData = matchJson.data || matchJson;

      onAnalysisComplete(analysisData, matchData);
    } catch (err: any) {
      console.error('Error during resume processing:', err);
      setErrorMessage('Service error during AI parsing. Please check connection or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
      {/* Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles size={22} className="text-indigo-400 animate-pulse" />
            Resume Upload & Job Matching Engine
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Powered by Gemini AI. Upload your standard resume file or paste raw text to run deep ATS parsing.
          </p>
        </div>

        {/* Input Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveInputMode('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeInputMode === 'upload' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload size={14} /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveInputMode('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeInputMode === 'text' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode size={14} /> Paste Text
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-300 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Upload / Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Box: Resume Source */}
        {activeInputMode === 'upload' ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-2 transition-all cursor-pointer min-h-[220px] group relative overflow-hidden ${
              dragActive ? 'border-indigo-400 bg-indigo-950/30' : selectedFile ? 'border-emerald-500/50 bg-slate-900/40' : 'border-indigo-500/30 hover:border-indigo-400 bg-slate-900/20'
            }`}
          >
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} className="hidden" />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-2 z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1">
                  <CheckCircle2 size={32} />
                </div>
                <p className="font-bold text-white text-sm">{selectedFile.name}</p>
                <p className="text-xs text-slate-400 font-mono">{(selectedFile.size / 1024).toFixed(1)} KB • Ready for analysis</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="mt-2 text-xs text-rose-400 hover:text-rose-300 underline"
                >
                  Change File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 z-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <h4 className="font-bold text-white text-sm">Drag & Drop Resume File</h4>
                <p className="text-xs text-slate-400 max-w-xs">Supports PDF, DOCX, or TXT formats (Up to 10MB)</p>
                <span className="mt-2 px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200">
                  Browse Computer
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card p-4 rounded-2xl flex flex-col space-y-2">
            <div className="flex justify-between items-center text-xs font-mono-label text-slate-400">
              <span className="flex items-center gap-1.5 font-bold"><FileText size={14} className="text-indigo-400" /> RAW RESUME TEXT</span>
              <span>{resumeText.length} characters</span>
            </div>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your plain text resume here (Work experience, skills, projects, education)..."
              className="w-full flex-1 bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none min-h-[170px]"
            />
          </div>
        )}

        {/* Right Box: Target Job Description */}
        <div className="glass-card p-4 rounded-2xl flex flex-col space-y-2">
          <div className="flex justify-between items-center text-xs font-mono-label text-slate-400">
            <span className="flex items-center gap-1.5 font-bold"><FileText size={14} className="text-emerald-400" /> TARGET JOB DESCRIPTION</span>
            <span className="text-indigo-400 font-medium">ATS Match Focus</span>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the Job Description (Requirements, responsibilities, tech stack)..."
            className="w-full flex-1 bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none min-h-[170px]"
          />
        </div>
      </div>

      {/* Action Button Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Server-Side Gemini 3.6 Flash Active</span>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={handleRunAnalysis}
          className="w-full sm:w-auto gradient-btn px-8 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <RefreshCw size={18} className="animate-spin text-indigo-200" />
              <span>Analyzing Resume & Matching JD...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Run AI Resume Analysis & Match</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
