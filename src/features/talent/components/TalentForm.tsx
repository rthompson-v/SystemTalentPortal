import { useState } from 'react';
import type { TalentFormData, EnglishLevel, WorkScheme, VisaStatus, PrimaryRole } from '../types';

const ROLES: PrimaryRole[] = [
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'Fullstack Engineer',
  'UI/UX Designer',
  'Project Manager',
  'QA Analyst',
];

const ENGLISH_LEVELS: EnglishLevel[] = [
  'A1 - Beginner',
  'A2 - Elementary',
  'B1 - Intermediate',
  'B2 - Upper Intermediate',
  'C1 - Advanced',
  'C2 - Proficient',
];

const WORK_SCHEMES: WorkScheme[] = ['Remote', 'Hybrid', 'On-site', 'Flexible'];

const DEFAULT_FORM: TalentFormData = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  primaryRole: 'Frontend Developer',
  techStack: '',
  yearsOfExperience: 0,
  modules: '',
  englishLevel: 'B1 - Intermediate',
  linkedinUrl: '',
  cvFileName: '',
  salaryExpectation: '',
  hourlyRate: '',
  workScheme: 'Remote',
  visaStatus: 'No',
  isBlacklisted: false,
};

// ── Shared input classes ──────────────────────────────────────────────────────
const inputCls =
  'w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-transparent outline-none transition-all text-sm';
const labelCls = 'block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5';

interface Props {
  initialData?: Partial<TalentFormData>;
  onSubmit: (data: TalentFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
  isEditing?: boolean;
  /** Extra info shown below the form (e.g. "Last updated by…") */
  footerNote?: string;
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-6 text-[#135bec]">
        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{icon}</span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function TalentForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Register Talent',
  isEditing = false,
  footerNote,
}: Props) {
  const [form, setForm] = useState<TalentFormData>({ ...DEFAULT_FORM, ...initialData });

  const set = <K extends keyof TalentFormData>(key: K, value: TalentFormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── Personal Information ── */}
      <Section icon="person" title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Full Name</label>
            <input
              className={inputCls}
              type="text"
              placeholder="e.g. John Doe"
              value={form.fullName}
              onChange={e => set('fullName', e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Email Address</label>
            <input
              className={inputCls}
              type="email"
              placeholder="john.doe@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Phone Number</label>
            <input
              className={inputCls}
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Location</label>
            <input
              className={inputCls}
              type="text"
              placeholder="City, Country"
              value={form.location}
              onChange={e => set('location', e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* ── Professional Profile ── */}
      <Section icon="work" title={isEditing ? 'Role & Experience' : 'Professional Profile'}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className={labelCls}>Primary Role</label>
            <select
              className={inputCls}
              value={form.primaryRole}
              onChange={e => set('primaryRole', e.target.value as PrimaryRole)}
            >
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Core Technology / Stack</label>
            <input
              className={inputCls}
              type="text"
              placeholder="React, Node.js, AWS…"
              value={form.techStack}
              onChange={e => set('techStack', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Years of Experience</label>
            <input
              className={inputCls}
              type="number"
              min={0}
              placeholder="0"
              value={form.yearsOfExperience}
              onChange={e => set('yearsOfExperience', Number(e.target.value))}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Specific Modules / Expertise</label>
            <textarea
              className={`${inputCls} h-24 resize-none`}
              placeholder="SAP FI/CO, AWS Infrastructure, E-commerce…"
              value={form.modules}
              onChange={e => set('modules', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>English Level</label>
            <select
              className={inputCls}
              value={form.englishLevel}
              onChange={e => set('englishLevel', e.target.value as EnglishLevel)}
            >
              {ENGLISH_LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </Section>

      {/* ── Links & Attachments ── */}
      <Section icon="link" title="Links & Attachments">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>LinkedIn Profile URL</label>
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                style={{ fontSize: 18 }}
              >
                link
              </span>
              <input
                className={`${inputCls} pl-10`}
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={form.linkedinUrl}
                onChange={e => set('linkedinUrl', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Resume / CV</label>
            {isEditing && form.cvFileName ? (
              <div className="flex items-center gap-3 p-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                <span className="material-symbols-outlined text-[#135bec]" style={{ fontSize: 20 }}>description</span>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{form.cvFileName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Current CV file</p>
                </div>
                <button
                  type="button"
                  onClick={() => set('cvFileName', '')}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-slate-400 mb-1" style={{ fontSize: 28 }}>cloud_upload</span>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Click to upload CV</p>
                <p className="text-xs text-slate-400 mt-1">PDF, DOCX (Max 10 MB)</p>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={e => set('cvFileName', e.target.files?.[0]?.name ?? '')}
                />
              </label>
            )}
          </div>
        </div>
      </Section>

      {/* ── Expectations & Logistics ── */}
      <Section icon="payments" title="Expectations & Logistics">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className={labelCls}>Salary Expectations (Monthly USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
              <input
                className={`${inputCls} pl-7`}
                type="text"
                placeholder="5,000"
                value={form.salaryExpectation}
                onChange={e => set('salaryExpectation', e.target.value)}
              />
            </div>
          </div>

          {isEditing && (
            <div>
              <label className={labelCls}>Hourly Rate (Optional)</label>
              <input
                className={inputCls}
                type="text"
                placeholder="35"
                value={form.hourlyRate ?? ''}
                onChange={e => set('hourlyRate', e.target.value)}
              />
            </div>
          )}

          <div>
            <label className={labelCls}>Work Scheme</label>
            <select
              className={inputCls}
              value={form.workScheme}
              onChange={e => set('workScheme', e.target.value as WorkScheme)}
            >
              {WORK_SCHEMES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className={labelCls}>US Visa Status</label>
            <div className="flex items-center gap-5 py-3">
              {(['Yes', 'No', 'In Progress'] as VisaStatus[]).map(v => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visa"
                    className="w-4 h-4 accent-[#135bec]"
                    checked={form.visaStatus === v}
                    onChange={() => set('visaStatus', v)}
                  />
                  <span className="text-sm dark:text-slate-300">{v}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Status (Edit only) ── */}
      {isEditing && (
        <Section icon="verified_user" title="Status & Flags">
          <div className="flex flex-wrap gap-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded accent-[#135bec]"
                checked={form.visaStatus === 'Yes'}
                onChange={e => set('visaStatus', e.target.checked ? 'Yes' : 'No')}
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">US Visa Holder</p>
                <p className="text-xs text-slate-500">Candidate has a valid B1/B2 Visa</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded accent-red-500"
                checked={form.isBlacklisted}
                onChange={e => set('isBlacklisted', e.target.checked)}
              />
              <div>
                <p className="text-sm font-bold text-red-600">Blacklist Status</p>
                <p className="text-xs text-slate-500">Flag for internal restrictions</p>
              </div>
            </label>
          </div>
        </Section>
      )}

      {/* ── Action Buttons ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-12 border-t border-slate-200 dark:border-slate-800">
        {footerNote ? (
          <p className="text-slate-500 dark:text-slate-500 text-sm italic">{footerNote}</p>
        ) : (
          <span />
        )}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isEditing ? 'Discard Changes' : 'Discard Draft'}
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-10 py-3 rounded-lg font-bold text-white bg-[#135bec] hover:bg-[#135bec]/90 shadow-lg shadow-[#135bec]/20 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}