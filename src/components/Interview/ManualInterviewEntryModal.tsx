import React, { useState } from "react";
import { X, Plus, Trash2, CheckCircle2, MessageSquare, Sparkles, Award, Building2, Briefcase } from "lucide-react";

interface ManualQuestionEntry {
  questionText: string;
  category: "Behavioral STAR" | "System Design" | "Live Coding" | "Aptitude";
  candidateAnswer: string;
  starScore: number;
  technicalScore: number;
  communicationScore: number;
  feedback: string;
  modelAnswer: string;
}

interface ManualInterviewEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (reportData: any) => void;
}

export const ManualInterviewEntryModal: React.FC<ManualInterviewEntryModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [targetRole, setTargetRole] = useState("Senior Full-Stack Engineer");
  const [targetCompany, setTargetCompany] = useState("Google");
  const [questions, setQuestions] = useState<ManualQuestionEntry[]>([
    {
      questionText: "Tell me about a time you handled a severe production outage under high pressure.",
      category: "Behavioral STAR",
      candidateAnswer:
        "A Redis cluster cache stampede brought down our primary checkout service. I immediately alerted leadership on Slack, isolated the degraded service node, and deployed a probabilistic cache expiration fix within 22 minutes.",
      starScore: 85,
      technicalScore: 90,
      communicationScore: 86,
      feedback:
        "Great structure and quick crisis management. To make it a 95+, mention the exact financial or customer impact saved (e.g. $120k saved in abandoned carts).",
      modelAnswer:
        "Situation: Redis cache stampede degraded primary checkout.\nAction: Coordinated status updates, implemented probabilistic early expiration.\nResult: Restored 99.99% SLA in 22 mins, preserving $140,000 in checkout revenue."
    }
  ]);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        category: "System Design",
        candidateAnswer: "",
        starScore: 80,
        technicalScore: 85,
        communicationScore: 80,
        feedback: "",
        modelAnswer: ""
      }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleUpdateQuestion = (index: number, field: keyof ManualQuestionEntry, val: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: val };
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);
    setErrorMsg(null);

    const payload = {
      targetRole,
      targetCompany,
      questions
    };

    try {
      const res = await fetch("/api/interview/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success) {
        setSuccessMsg(true);
        if (onSaved) onSaved(json.data);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMsg(json.error || "Failed to save manual interview report.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Network error submitting manual interview.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 text-slate-800 shadow-2xl relative my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Phase 1 • Manual Interview Entry Modal
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Manual Practice Interview Submission
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Directly record practice Q&A pairs, STAR scores, and candidate answers for offline mock evaluation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Manual practice interview saved! Mock report created in system.</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Role & Target Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
                Target Role
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-800 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
                Target Company
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-800 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Question List Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-semibold text-indigo-700 uppercase tracking-wider">
              Submitted Questions ({questions.length})
            </h3>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Question
            </button>
          </div>

          {/* Questions */}
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-700">Question #{qIdx + 1}</span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-600 mb-1">Question Prompt</label>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => handleUpdateQuestion(qIdx, "questionText", e.target.value)}
                    placeholder="e.g. Tell me about a time you handled a severe production outage."
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">Category</label>
                  <select
                    value={q.category}
                    onChange={(e) => handleUpdateQuestion(qIdx, "category", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 focus:border-indigo-500"
                  >
                    <option value="Behavioral STAR">Behavioral STAR</option>
                    <option value="System Design">System Design</option>
                    <option value="Live Coding">Live Coding</option>
                    <option value="Aptitude">Aptitude</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Candidate Answer Text</label>
                <textarea
                  rows={3}
                  value={q.candidateAnswer}
                  onChange={(e) => handleUpdateQuestion(qIdx, "candidateAnswer", e.target.value)}
                  placeholder="Type candidate's exact answer or notes..."
                  className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-white border border-slate-200">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">
                    STAR Score: <span className="font-semibold text-indigo-600">{q.starScore}</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={q.starScore}
                    onChange={(e) => handleUpdateQuestion(qIdx, "starScore", Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">
                    Technical Score: <span className="font-semibold text-emerald-600">{q.technicalScore}</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={q.technicalScore}
                    onChange={(e) => handleUpdateQuestion(qIdx, "technicalScore", Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">
                    Communication: <span className="font-semibold text-amber-600">{q.communicationScore}</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={q.communicationScore}
                    onChange={(e) => handleUpdateQuestion(qIdx, "communicationScore", Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                </div>
              </div>

              {/* Feedback & Model Answer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Evaluation Feedback Notes</label>
                  <textarea
                    rows={2}
                    value={q.feedback}
                    onChange={(e) => handleUpdateQuestion(qIdx, "feedback", e.target.value)}
                    placeholder="Notes on strengths or missing details..."
                    className="w-full p-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">Model / Benchmark Answer</label>
                  <textarea
                    rows={2}
                    value={q.modelAnswer}
                    onChange={(e) => handleUpdateQuestion(qIdx, "modelAnswer", e.target.value)}
                    placeholder="Ideal STAR response structure..."
                    className="w-full p-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              {saving ? "Saving Report..." : "Submit Manual Practice Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
