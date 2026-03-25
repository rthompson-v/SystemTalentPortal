import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTalent, useUpdateTalent, useHiringPreferences } from "../hooks";
import TalentLayout from "../components/TalentLayout";
import StackBuilder from "../components/StackBuilder";
import type { UpdateTalent, ModuloInput } from "../types";

const ROLES = [
  "Account Executive", "Administrator", "Adobe Analytics", "Analyst", "Architect",
  "Associate Customer Sucess Manager", "Associate Sales Engineer", "Brand Partner",
  "Business Analyst", "Business Development Representative",
  "Business Development Representative Manager", "Channel Account Manager",
  "Chief Manager", "Cloud Engineer", "Consultant", "Contracting Specialist",
  "Customer Success Engineer", "Customer Success Manager", "Customer Support Engineer",
  "Cybersecurity", "DBA", "DBA / Administrator", "DBA / Architect", "Data Analyst",
  "Data Analytics", "Data Engineer", "Data Scientist", "Designer", "Developer",
  "Developer/Project Leader", "Developer/Technical Leader", "End User",
  "Engagement Lead", "Engineer", "FinOps Lead", "Functional",
  "Functional / Developer / Architect", "GTM Partner Manager", "Information Security",
  "Information Technology Coordinator", "JDA", "Java", "Kafka", "LLM Data Engineer",
  "Lead Data Engineer", "Lead Developer", "MAC", "Major Incident Management",
  "Manager", "Marketing SEO", "Microsoft", "Mobile", "Platform Administrator",
  "Point of Sales Technician", "Production Support Engineer", "Project Leader",
  "Project Manager", "QA", "Regional Sales Director", "Release Manager", "SQL Admin",
  "Sales", "Sales Engineer", "Scrum Master", "Senior Technical Support Engineer",
  "Site Reliability Engineer", "Software Asset Managament", "Software Engineer",
  "Solutions Architect", "Solutions Engineer", "Specialist",
  "Sr. Business & Information Analyst", "Support Coordinator", "Support Engineer Manager",
  "Talent Acquisition Specialist", "Technical", "Technical Functional", "Technical Leader",
  "Technical Product Manager", "Technical Project Manager", "Technical Support",
  "Technical Support Analyst", "Technical Support Engineer II", "Tester",
  "Vulnerability Remediation Specialist",
];

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

export function EditTalentPage() {
  const { id: candidate_code = "" } = useParams<{ id: string }>();
  const navigate  = useNavigate();

  const { data: rawTalent, isLoading, isError } = useTalent(candidate_code);

  // getCandidateByCode devuelve: { ok, data: { candidate, stack, lastSkillset, lastCompensation } }
  // El hook puede devolver la respuesta completa o ya desenvuelta (.data). Manejamos ambos casos.
  const talent = (() => {
    if (!rawTalent) return null;
    const r = rawTalent as any;
    // Desenvuelve .data si el hook no lo hizo
    const nested   = r?.data ?? r;
    // Extrae .candidate si existe, o usa el objeto directamente (respuesta plana)
    const cand     = nested?.candidate ?? nested;
    const stackArr: any[] = nested?.stack ?? [];

    return {
      ...cand,
      skillset:          nested?.lastSkillset?.note_text    ?? cand?.skillset           ?? "",
      costo_expectativa: nested?.lastCompensation?.cost_text ?? cand?.costo_expectativa ?? "",
      hiring_preference: cand?.hiring_preference             ?? "",
      _stack: stackArr
        .map((s: any) => ({
          technology: s.technology_name ?? s.technology ?? "",
          module:     s.module_name     ?? s.module     ?? undefined,
          submodule:  s.submodule_name  ?? s.submodule  ?? undefined,
        }))
        .filter((s: any) => Boolean(s.technology)),
    };
  })();
  const update                               = useUpdateTalent(candidate_code);
  const { data: hiringPrefs = [] }           = useHiringPreferences();

  // ── Estado controlado ────────────────────────────────────────────────────
  const [stack, setStack]                   = useState<ModuloInput[]>([]);
  const [skillset, setSkillset]             = useState("");
  const [hiringPref, setHiringPref]         = useState("");
  const [englishScore, setEnglishScore]     = useState<string>("");
  const [stackModified, setStackModified] = useState(false);
  const [initialized, setInitialized]     = useState(false);

  // Inicializar cuando llegan los datos del candidato
  if (talent && !initialized) {
    setSkillset(talent.skillset ?? "");
    setEnglishScore(String(talent.english_score ?? ""));
    setHiringPref(talent.hiring_preference ?? "");
    // Cargar stack existente del candidato
    if (talent._stack?.length > 0) {
      setStack(talent._stack);
    }
    setInitialized(true);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const payload: UpdateTalent = {
      Name:             fd.get("Name")         as string || undefined,
      Telefono:         fd.get("Telefono")      as string || undefined,
      Email:            fd.get("Email")         as string || undefined,
      CV:               fd.get("CV")            as string || undefined,
      Linkedin:         fd.get("Linkedin")      as string || undefined,
      Location:         fd.get("Location")      as string || undefined,
      Rol:              fd.get("Rol")           as string || undefined,
      Experiencia:      fd.get("Experiencia")   ? Number(fd.get("Experiencia"))   : undefined,
      EnglishLevel:     englishScore            ? Number(englishScore)             : undefined,
      Expectativas:     fd.get("Expectativas")  as string || undefined,
      Visa:             fd.get("Visa")          as string || undefined,
      HiringPreference: hiringPref              || undefined,
      Skillset:         skillset                || undefined,
      // Stack: solo enviar si el usuario modificó algo
      ...(stackModified && stack.length > 0 && {
        Tecnologia:   stack.map((r) => r.technology),
        Modulos:      stack,
        replaceStack: true,
      }),
    };

    await update.mutateAsync(payload);
    navigate("/talent");
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <TalentLayout>
        <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
          <span className="material-symbols-outlined animate-spin" style={{ fontSize: 24 }}>progress_activity</span>
          <span className="text-sm">Cargando candidato…</span>
        </div>
      </TalentLayout>
    );
  }

  if (isError || !talent) {
    return (
      <TalentLayout>
        <div className="flex items-center gap-3 p-4 m-8 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
          <p className="text-sm font-medium">Candidato no encontrado.</p>
        </div>
      </TalentLayout>
    );
  }

  const formattedDate = talent.last_update
    ? new Date(talent.last_update).toLocaleDateString("es-MX", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <TalentLayout>
      <div className="max-w-[1120px] mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-slate-500 dark:text-slate-500 text-sm">
          <button onClick={() => navigate("/talent")} className="hover:text-[#135bec] transition-colors">
            Talent Pool
          </button>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
          <span className="text-slate-900 dark:text-slate-100 font-medium">Editar Perfil</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">
            Editar Perfil: {talent.full_name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
            Modifica los datos, experiencia y tecnologías del candidato.
          </p>
        </div>

        {/* Error banner */}
        {update.isError && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
            <p className="text-sm font-medium">Error al actualizar. Intenta de nuevo.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Personal ── */}
          <Section icon="person" title="Información Personal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelCls}>Nombre completo</label>
                <input name="Name" defaultValue={talent.full_name} className={inputCls} type="text" required />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input name="Email" defaultValue={talent.email ?? ""} className={inputCls} type="email" />
              </div>
              <div>
                <label className={labelCls}>Teléfono</label>
                <input name="Telefono" defaultValue={talent.phone ?? ""} className={inputCls} type="tel" />
              </div>
              <div>
                <label className={labelCls}>Ubicación</label>
                <input name="Location" defaultValue={talent.location ?? ""} className={inputCls} type="text" />
              </div>
              <div>
                <label className={labelCls}>LinkedIn</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: 18 }}>link</span>
                  <input name="Linkedin" defaultValue={talent.linkedin ?? ""} className={`${inputCls} pl-10`} type="url" />
                </div>
              </div>
              <div>
                <label className={labelCls}>CV (URL)</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: 18 }}>description</span>
                  <input name="CV" defaultValue={talent.cv ?? talent.cv_url ?? ""} className={`${inputCls} pl-10`} type="url" placeholder="https://drive.google.com/…" />
                </div>
              </div>
            </div>
          </Section>

          {/* ── Role & Experience ── */}
          <Section icon="work" title="Rol y Experiencia">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className={labelCls}>Rol Principal</label>
                <select name="Rol" className={inputCls} defaultValue={(talent as any).role ?? talent.Rol ?? ""}>
                  <option value="">Seleccionar rol…</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Años de experiencia</label>
                <input
                  name="Experiencia"
                  defaultValue={talent.years_experience ?? ""}
                  className={inputCls}
                  type="number"
                  min={0}
                />
              </div>
              <div>
                <label className={labelCls}>English Score (0–100)</label>
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  max={100}
                  value={englishScore}
                  onChange={(e) => setEnglishScore(e.target.value)}
                  placeholder="75"
                />
                {englishScore && (
                  <p className="mt-1.5 text-xs text-slate-400">
                    Equivale a:{" "}
                    <span className="font-semibold text-[#135bec]">
                      {Number(englishScore) >= 90 ? "C2" :
                       Number(englishScore) >= 80 ? "C1" :
                       Number(englishScore) >= 70 ? "B2" :
                       Number(englishScore) >= 55 ? "B1" :
                       Number(englishScore) >= 40 ? "A2" : "A1"}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </Section>

          {/* ── Technology Stack ── */}
          <Section icon="layers" title="Technology Stack">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Agrega nuevas tecnologías al perfil. El stack actual del candidato se reemplazará
              solo si agregas al menos una entrada aquí.
            </p>
            <StackBuilder
              value={stack}
              onChange={(rows) => { setStack(rows); setStackModified(true); }}
            />
            {stackModified && stack.length > 0 && (
              <p className="mt-3 text-xs text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>warning</span>
                Al guardar, el stack actual del candidato será reemplazado por estas entradas.
              </p>
            )}
          </Section>

          {/* ── Resumen / Skills ── */}
          <Section icon="description" title="Resumen Profesional">
            <div>
              <label className={labelCls}>Resumen / Skills</label>
              <textarea
                className={`${inputCls} h-36 resize-none`}
                placeholder="Describe la experiencia, habilidades clave, proyectos destacados…"
                value={skillset}
                onChange={(e) => setSkillset(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Este campo se guarda como nota interna del candidato.
              </p>
            </div>
          </Section>

          {/* ── Expectations ── */}
          <Section icon="payments" title="Expectativas y Logística">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <div>
                <label className={labelCls}>Preferencia de contratación</label>
                <select
                  className={inputCls}
                  value={hiringPref}
                  onChange={(e) => setHiringPref(e.target.value)}
                >
                  <option value="">Seleccionar…</option>
                  {hiringPrefs.map((h) => (
                    <option key={h.id} value={h.name}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Expectativa salarial (USD/mes)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
                  <input
                    name="Expectativas"
                    defaultValue={talent.costo_expectativa ?? ""}
                    className={`${inputCls} pl-7`}
                    type="text"
                    placeholder="5,000"
                  />
                </div>
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
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 pb-12 border-t border-slate-200 dark:border-slate-800 gap-4">
            {formattedDate && (
              <p className="text-slate-500 text-sm italic">
                Última actualización: {formattedDate}
              </p>
            )}
            <div className="flex gap-4 ml-auto">
              <button
                type="button"
                onClick={() => navigate("/talent")}
                className="px-8 py-3 rounded-lg font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Descartar cambios
              </button>
              <button
                type="submit"
                disabled={update.isPending}
                className="px-10 py-3 rounded-lg font-bold text-white bg-[#135bec] hover:bg-[#135bec]/90 shadow-lg shadow-[#135bec]/20 transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {update.isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span>
                    Guardando…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
                    Actualizar Perfil
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </TalentLayout>
  );
}