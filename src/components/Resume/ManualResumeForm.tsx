import React, { useState } from "react";
import { FileText, Plus, Trash2, CheckCircle2, Save, GraduationCap, Briefcase, Code, Award, Sparkles } from "lucide-react";

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

interface WorkExperienceItem {
  company: string;
  role: string;
  duration: string;
  bulletPoints: string[];
}

interface ProjectItem {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
}

interface CertificationItem {
  title: string;
  issuer: string;
  year: string;
}

interface ManualResumeFormProps {
  initialCandidateName?: string;
  onSuccess?: (resumeData: any) => void;
  onCancel?: () => void;
}

export const ManualResumeForm: React.FC<ManualResumeFormProps> = ({ initialCandidateName = "Alex Rivera", onSuccess, onCancel }) => {
  const [candidateName, setCandidateName] = useState(initialCandidateName);
  const [email, setEmail] = useState("alex.rivera@example.com");
  const [phone, setPhone] = useState("+1 (555) 019-2834");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/alex-rivera-dev");
  const [githubUrl, setGithubUrl] = useState("https://github.com/alexrivera-dev");
  const [summary, setSummary] = useState(
    "Senior Full-Stack Engineer with 6+ years of experience designing scalable React web applications and high-throughput Node.js microservices."
  );

  const [educationList, setEducationList] = useState<EducationItem[]>([
    {
      degree: "B.S. in Computer Science & Engineering",
      institution: "University of California, Berkeley",
      year: "2019",
      gpa: "3.85"
    }
  ]);

  const [workList, setWorkList] = useState<WorkExperienceItem[]>([
    {
      company: "CloudScale Systems",
      role: "Senior Full-Stack Engineer",
      duration: "2022 - Present",
      bulletPoints: [
        "Architected full-stack React & TypeScript dashboard serving 450,000 active enterprise users with 99.99% uptime.",
        "Engineered Redis distributed caching layer that reduced backend API query latency by 42% under peak workloads."
      ]
    }
  ]);

  const [projectsList, setProjectsList] = useState<ProjectItem[]>([
    {
      title: "InterviewIQ AI Platform",
      description: "AI-driven technical interview preparation tool with real-time speech WPM tracking and STAR metric scoring.",
      techStack: ["React", "TypeScript", "Node.js", "Express", "Gemini API"],
      githubUrl: "https://github.com/alexrivera-dev/interview-iq-ai"
    }
  ]);

  const [certificationsList, setCertificationsList] = useState<CertificationItem[]>([
    { title: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", year: "2023" }
  ]);

  const [techSkills, setTechSkills] = useState("React.js, TypeScript, Node.js, Express, System Design, GraphQL, MongoDB, Redis, Tailwind CSS");
  const [softSkills, setSoftSkills] = useState("Technical Leadership, Agile Mentorship, Stakeholder Communication");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Education Handlers
  const handleAddEducation = () => {
    setEducationList([...educationList, { degree: "", institution: "", year: "" }]);
  };
  const handleRemoveEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };
  const handleUpdateEducation = (index: number, field: keyof EducationItem, val: string) => {
    const updated = [...educationList];
    updated[index] = { ...updated[index], [field]: val };
    setEducationList(updated);
  };

  // Work Experience Handlers
  const handleAddWork = () => {
    setWorkList([...workList, { company: "", role: "", duration: "", bulletPoints: [""] }]);
  };
  const handleRemoveWork = (index: number) => {
    setWorkList(workList.filter((_, i) => i !== index));
  };
  const handleUpdateWork = (index: number, field: keyof WorkExperienceItem, val: any) => {
    const updated = [...workList];
    updated[index] = { ...updated[index], [field]: val };
    setWorkList(updated);
  };
  const handleAddBullet = (workIndex: number) => {
    const updated = [...workList];
    updated[workIndex].bulletPoints.push("");
    setWorkList(updated);
  };
  const handleUpdateBullet = (workIndex: number, bulletIndex: number, val: string) => {
    const updated = [...workList];
    updated[workIndex].bulletPoints[bulletIndex] = val;
    setWorkList(updated);
  };
  const handleRemoveBullet = (workIndex: number, bulletIndex: number) => {
    const updated = [...workList];
    updated[workIndex].bulletPoints = updated[workIndex].bulletPoints.filter((_, b) => b !== bulletIndex);
    setWorkList(updated);
  };

  // Project Handlers
  const handleAddProject = () => {
    setProjectsList([...projectsList, { title: "", description: "", techStack: ["React", "Node.js"] }]);
  };
  const handleRemoveProject = (index: number) => {
    setProjectsList(projectsList.filter((_, i) => i !== index));
  };
  const handleUpdateProject = (index: number, field: keyof ProjectItem, val: any) => {
    const updated = [...projectsList];
    updated[index] = { ...updated[index], [field]: val };
    setProjectsList(updated);
  };

  // Certification Handlers
  const handleAddCertification = () => {
    setCertificationsList([...certificationsList, { title: "", issuer: "", year: "" }]);
  };
  const handleRemoveCertification = (index: number) => {
    setCertificationsList(certificationsList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);
    setErrorMsg(null);

    const payload = {
      candidateName,
      email,
      phone,
      linkedinUrl,
      githubUrl,
      summary,
      education: educationList,
      workExperience: workList,
      projects: projectsList,
      certifications: certificationsList,
      skills: {
        technical: techSkills.split(",").map((s) => s.trim()).filter(Boolean),
        soft: softSkills.split(",").map((s) => s.trim()).filter(Boolean)
      }
    };

    try {
      const res = await fetch("/api/resume/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success) {
        setSuccessMsg(true);
        if (onSuccess) onSuccess(json.data);
      } else {
        setErrorMsg(json.error || "Failed to save manual resume.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Network error saving resume.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 md:p-8 text-slate-100 shadow-2xl max-w-5xl mx-auto my-6">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Phase 1 • Manual Data Entry Form
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            Manual Resume & Work History Entry
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Type or paste your education, experience, skills, and projects directly as an alternative to PDF parsing.
          </p>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium transition"
          >
            Cancel
          </button>
        )}
      </div>

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Manual resume record saved successfully to backend store! ATS analysis initialized.</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Candidate Contact Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider border-b border-slate-800/80 pb-2">
            1. Candidate Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Candidate Full Name *</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">LinkedIn Profile URL</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">GitHub / Portfolio URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Executive Summary Headline *</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Section 2: Work Experience */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              2. Work Experience Positions ({workList.length})
            </h3>
            <button
              type="button"
              onClick={handleAddWork}
              className="px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800 hover:bg-indigo-900 text-indigo-200 text-xs font-medium flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Position
            </button>
          </div>

          {workList.map((work, wIdx) => (
            <div key={wIdx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Position #{wIdx + 1}</span>
                {workList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveWork(wIdx)}
                    className="text-slate-500 hover:text-rose-400 transition"
                    title="Remove position"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={work.company}
                  onChange={(e) => handleUpdateWork(wIdx, "company", e.target.value)}
                  placeholder="Company Name (e.g. Google)"
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:border-indigo-500"
                  required
                />
                <input
                  type="text"
                  value={work.role}
                  onChange={(e) => handleUpdateWork(wIdx, "role", e.target.value)}
                  placeholder="Job Title / Role"
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:border-indigo-500"
                  required
                />
                <input
                  type="text"
                  value={work.duration}
                  onChange={(e) => handleUpdateWork(wIdx, "duration", e.target.value)}
                  placeholder="Duration (e.g. 2021 - Present)"
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm focus:border-indigo-500"
                />
              </div>

              {/* Bullet Points */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs text-slate-400">Accomplishment Bullet Points:</label>
                {work.bulletPoints.map((bp, bIdx) => (
                  <div key={bIdx} className="flex gap-2">
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => handleUpdateBullet(wIdx, bIdx, e.target.value)}
                      placeholder="e.g. Architected React frontend dashboard reducing latency by 35%..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(wIdx, bIdx)}
                      className="text-slate-500 hover:text-rose-400 px-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddBullet(wIdx)}
                  className="text-xs text-indigo-400 hover:underline flex items-center gap-1 mt-1"
                >
                  <Plus className="w-3 h-3" /> Add Bullet Point
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Section 3: Education */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              3. Education History ({educationList.length})
            </h3>
            <button
              type="button"
              onClick={handleAddEducation}
              className="px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800 hover:bg-indigo-900 text-indigo-200 text-xs font-medium flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Degree
            </button>
          </div>

          {educationList.map((edu, eIdx) => (
            <div key={eIdx} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleUpdateEducation(eIdx, "degree", e.target.value)}
                placeholder="Degree (e.g. B.S. Computer Science)"
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs focus:border-indigo-500"
                required
              />
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleUpdateEducation(eIdx, "institution", e.target.value)}
                placeholder="University / Institution"
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs focus:border-indigo-500"
                required
              />
              <input
                type="text"
                value={edu.year}
                onChange={(e) => handleUpdateEducation(eIdx, "year", e.target.value)}
                placeholder="Graduation Year (e.g. 2020)"
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs focus:border-indigo-500"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={edu.gpa || ""}
                  onChange={(e) => handleUpdateEducation(eIdx, "gpa", e.target.value)}
                  placeholder="GPA (e.g. 3.8 / 4.0)"
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs focus:border-indigo-500"
                />
                {educationList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(eIdx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Section 4: Projects & Stack */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-400" />
              4. Key Engineering Projects ({projectsList.length})
            </h3>
            <button
              type="button"
              onClick={handleAddProject}
              className="px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800 hover:bg-indigo-900 text-indigo-200 text-xs font-medium flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>

          {projectsList.map((proj, pIdx) => (
            <div key={pIdx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={proj.title}
                  onChange={(e) => handleUpdateProject(pIdx, "title", e.target.value)}
                  placeholder="Project Title"
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs focus:border-indigo-500"
                />
                <input
                  type="text"
                  value={proj.githubUrl || ""}
                  onChange={(e) => handleUpdateProject(pIdx, "githubUrl", e.target.value)}
                  placeholder="GitHub / Repository Link"
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs focus:border-indigo-500"
                />
              </div>
              <textarea
                rows={2}
                value={proj.description}
                onChange={(e) => handleUpdateProject(pIdx, "description", e.target.value)}
                placeholder="Project Description & Architecture impact..."
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs focus:border-indigo-500"
              />
            </div>
          ))}
        </div>

        {/* Section 5: Skills & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
              Technical Skills (comma-separated)
            </label>
            <textarea
              rows={3}
              value={techSkills}
              onChange={(e) => setTechSkills(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs focus:border-indigo-500"
              placeholder="React, TypeScript, Node.js, MongoDB, Docker, GraphQL"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">
              Soft Skills & Leadership
            </label>
            <textarea
              rows={3}
              value={softSkills}
              onChange={(e) => setSoftSkills(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs focus:border-indigo-500"
              placeholder="Technical Leadership, System Design Storytelling, Mentorship"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
          >
            {saving ? (
              <>Saving Resume Record...</>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Manual Resume
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
