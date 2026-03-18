import { useNavigate, useParams } from "react-router-dom";
import { useTalent, useUpdateTalent } from "../hooks";
import TalentLayout from "../components/TalentLayout";
import type { UpdateTalent } from "../types";

export function EditTalentPage() {
  const { id: candidate_code = "" } = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const { data: talent, isLoading, isError } = useTalent(candidate_code);
  const update = useUpdateTalent(candidate_code);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const payload: UpdateTalent = {
      Nombre:       fd.get("Nombre") as string,
      Telefono:     fd.get("Telefono") as string,
      Email:        fd.get("Email") as string,
      Location:     fd.get("Location") as string,
      Skillset:     fd.get("Skillset") as string,
      EnglishLevel: Number(fd.get("EnglishLevel")) || undefined,
      Experiencia:  Number(fd.get("Experiencia")) || undefined,
      Rol:          fd.get("Rol") as string,
      Esquema:      fd.get("Esquema") as string,
      Expectativas: fd.get("Expectativas") as string,
      Visa:         fd.get("Visa") as string,
    };

    await update.mutateAsync(payload);
    navigate("/talent");
  };

  // ── Shared input classes ───────────────────────────────────────────────────
  const inputCls = "w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-transparent outline-none transition-all text-sm";
  const labelCls = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

  function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
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

  if (isLoading) {
    return (
      <TalentLayout>
        <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
          <span className="material-symbols-outlined animate-spin" style={{ fontSize: 24 }}>progress_activity</span>
          <span className="text-sm">Loading candidate…</span>
        </div>
      </TalentLayout>
    );
  }

  if (isError || !talent) {
    return (
      <TalentLayout>
        <div className="flex items-center gap-3 p-4 m-8 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
          <p className="text-sm font-medium">Candidate not found.</p>
        </div>
      </TalentLayout>
    );
  }

  return (
    <TalentLayout>
      <div className="max-w-[1120px] mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-500 text-sm">
          <button onClick={() => navigate("/talent")} className="hover:text-[#135bec] transition-colors">
            Talent Pool
          </button>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
          <span className="text-slate-900 dark:text-slate-100 font-medium">Edit Profile</span>
        </div>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">
            Edit Profile: {talent.full_name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
            Modify candidate details, experience, and system flags.
          </p>
        </div>

        {/* Error banner */}
        {update.isError && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
            <p className="text-sm font-medium">Error updating candidate. Please try again.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── Personal ── */}
          <Section icon="person" title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelCls}>Full Name</label>
                <input name="Nombre" defaultValue={talent.full_name} className={inputCls} type="text" required />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input name="Email" defaultValue={talent.email ?? ""} className={inputCls} type="email" />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input name="Telefono" defaultValue={talent.phone ?? ""} className={inputCls} type="tel" />
              </div>
              <div>
                <label className={labelCls}>Location</label>
                <input name="Location" defaultValue={talent.location ?? ""} className={inputCls} type="text" />
              </div>
              <div>
                <label className={labelCls}>LinkedIn</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: 18 }}>link</span>
                  <input name="LinkedIn" defaultValue={talent.linkedin ?? ""} className={`${inputCls} pl-10`} type="url" />
                </div>
              </div>
            </div>
          </Section>

          {/* ── Professional ── */}
          <Section icon="work" title="Role & Experience">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className={labelCls}>Primary Role</label>
                <input name="Rol" defaultValue={""} placeholder="e.g. Frontend Developer" className={inputCls} type="text" />
              </div>
              <div>
                <label className={labelCls}>Years of Experience</label>
                <input name="Experiencia" defaultValue={talent.years_experience ?? ""} className={inputCls} type="number" min={0} />
              </div>
              <div>
                <label className={labelCls}>English Score (0–100)</label>
                <input name="EnglishLevel" defaultValue={talent.english_score ?? ""} className={inputCls} type="number" min={0} max={100} />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className={labelCls}>Skillset (comma separated)</label>
                <textarea name="Skillset" defaultValue={talent.skillset ?? ""} className={`${inputCls} h-24 resize-none`} placeholder="React, Node.js, AWS…" />
              </div>
            </div>
          </Section>

          {/* ── Expectations ── */}
          <Section icon="payments" title="Expectations & Logistics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className={labelCls}>Salary Expectation</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
                  <input name="Expectativas" defaultValue={talent.costo_expectativa ?? ""} className={`${inputCls} pl-7`} type="text" placeholder="5,000" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Work Scheme</label>
                <select name="Esquema" className={inputCls}>
                  {["Remote", "Hybrid", "On-site", "Flexible"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>US Visa</label>
                <div className="flex items-center gap-5 py-3">
                  {["Yes", "No", "In Progress"].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="Visa" value={v} className="w-4 h-4 accent-[#135bec]" />
                      <span className="text-sm dark:text-slate-300">{v}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* ── Actions ── */}
          <div className="flex items-center justify-between pt-4 pb-12 border-t border-slate-200 dark:border-slate-800">
            {talent.last_update && (
              <p className="text-slate-500 text-sm italic">
                Last updated: {new Date(talent.last_update).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            )}
            <div className="flex gap-4 ml-auto">
              <button
                type="button"
                onClick={() => navigate("/talent")}
                className="px-8 py-3 rounded-lg font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Discard Changes
              </button>
              <button
                type="submit"
                disabled={update.isPending}
                className="px-10 py-3 rounded-lg font-bold text-white bg-[#135bec] hover:bg-[#135bec]/90 shadow-lg shadow-[#135bec]/20 transition-all flex items-center gap-2 disabled:opacity-70"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
                {update.isPending ? "Saving…" : "Update Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </TalentLayout>
  );
}