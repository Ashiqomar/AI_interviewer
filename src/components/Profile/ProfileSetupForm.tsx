import React, { useState, useEffect } from "react";
import { User, Briefcase, Award, Building, Plus, X, Save, Sparkles, CheckCircle2 } from "lucide-react";

interface ProfileData {
  displayName: string;
  email: string;
  targetRole: string;
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead" | "Principal";
  skills: string[];
  preferredCompanies: string[];
  bio: string;
}

interface ProfileSetupFormProps {
  onSaved?: (profile: ProfileData) => void;
}

export const ProfileSetupForm: React.FC<ProfileSetupFormProps> = ({ onSaved }) => {
  const [profile, setProfile] = useState<ProfileData>({
    displayName: "Alex Rivera",
    email: "alex.rivera@example.com",
    targetRole: "Senior Full-Stack Engineer",
    experienceLevel: "Senior",
    skills: ["React.js", "TypeScript", "Node.js", "System Design", "GraphQL", "MongoDB", "Redis", "Tailwind CSS"],
    preferredCompanies: ["Google", "Meta", "Stripe", "OpenAI"],
    bio: "Senior Full-Stack Engineer with 6+ years specializing in distributed React applications and serverless microservices."
  });

  const [newSkill, setNewSkill] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/profile");
      const json = await res.json();
      if (json.success && json.data) {
        setProfile({
          displayName: json.data.displayName || "Alex Rivera",
          email: json.data.email || "alex.rivera@example.com",
          targetRole: json.data.targetRole || "Senior Full-Stack Engineer",
          experienceLevel: json.data.experienceLevel || "Senior",
          skills: json.data.skills || [],
          preferredCompanies: json.data.preferredCompanies || [],
          bio: json.data.bio || ""
        });
      }
    } catch (err) {
      console.warn("Could not load user profile, using fallback defaults:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSkill.trim()) return;
    if (!profile.skills.includes(newSkill.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  const handleAddCompany = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCompany.trim()) return;
    if (!profile.preferredCompanies.includes(newCompany.trim())) {
      setProfile((prev) => ({
        ...prev,
        preferredCompanies: [...prev.preferredCompanies, newCompany.trim()]
      }));
    }
    setNewCompany("");
  };

  const handleRemoveCompany = (companyToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      preferredCompanies: prev.preferredCompanies.filter((c) => c !== companyToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      const json = await res.json();

      if (json.success) {
        setSaveSuccess(true);
        if (onSaved) onSaved(profile);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        setErrorMsg(json.error || "Failed to save profile.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Network error saving profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 animate-pulse">
        Loading target profile configurations...
      </div>
    );
  }

  return (
    <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 md:p-8 text-slate-100 shadow-2xl max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            Phase 1 • Manual Profile Setup
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Target Role & Skills Profile
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure your target engineering roles, skill tags, and dream companies for AI interview personalization.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Profile configuration saved successfully! Mock AI interview model updated.</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
                placeholder="e.g. Alex Rivera"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
              placeholder="alex@example.com"
              required
            />
          </div>
        </div>

        {/* Target Role & Experience Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
              Target Job Role
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={profile.targetRole}
                onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
                placeholder="e.g. Senior Full-Stack Engineer"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
              Experience Level
            </label>
            <div className="relative">
              <Award className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <select
                value={profile.experienceLevel}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    experienceLevel: e.target.value as ProfileData["experienceLevel"]
                  })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition appearance-none"
              >
                <option value="Entry">Entry Level (0-2 YOE)</option>
                <option value="Mid">Mid Level (2-5 YOE)</option>
                <option value="Senior">Senior Level (5-8 YOE)</option>
                <option value="Lead">Lead Engineer (8+ YOE)</option>
                <option value="Principal">Principal / Staff Architect</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bio / Summary */}
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
            Professional Bio Summary
          </label>
          <textarea
            rows={3}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
            placeholder="Brief overview of your primary tech stack, domain specialties, and key accomplishments..."
          />
        </div>

        {/* Skills Tag List */}
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
            Skill Tags List ({profile.skills.length})
          </label>
          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 min-h-[52px] mb-3">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/80 text-indigo-200 text-xs font-medium"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-400 transition"
                  title="Remove skill"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {profile.skills.length === 0 && (
              <span className="text-xs text-slate-500 py-1">No skill tags added yet. Type below and press Enter.</span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
              placeholder="Add skill tag (e.g. System Design, Redis, GraphQL)"
            />
            <button
              type="button"
              onClick={() => handleAddSkill()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Preferred Companies Tag List */}
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
            Preferred Companies ({profile.preferredCompanies.length})
          </label>
          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 min-h-[52px] mb-3">
            {profile.preferredCompanies.map((company) => (
              <span
                key={company}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs font-medium"
              >
                <Building className="w-3 h-3 text-emerald-400" />
                {company}
                <button
                  type="button"
                  onClick={() => handleRemoveCompany(company)}
                  className="hover:text-rose-400 transition"
                  title="Remove company"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {profile.preferredCompanies.length === 0 && (
              <span className="text-xs text-slate-500 py-1">No preferred companies listed.</span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCompany();
                }
              }}
              className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
              placeholder="Add target company (e.g. Google, Stripe, Meta)"
            />
            <button
              type="button"
              onClick={() => handleAddCompany()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
          >
            {saving ? (
              <>Saving Profile...</>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Profile Configuration
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
