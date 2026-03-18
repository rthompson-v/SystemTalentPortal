import { useState } from "react";
import type { CreateTalent } from "../types";

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Fullstack Engineer",
  "UI/UX Designer",
  "Project Manager",
  "QA Analyst",
];

const WORK_SCHEMES = ["Remote", "Hybrid", "On-site", "Flexible"];

const DEFAULT_FORM: CreateTalent = {
  Nombre:       "",
  Telefono:     "",
  Email:        "",
  Rol:          "",
  Skillset:     "",
  EnglishLevel: undefined,
  Experiencia:  undefined,
  Location:     "",
  Visa:         "No",
  Esquema:      "Remote",
  Expectativas: "",
  CV:           "",
  Tecnologia:   "",
};

// ── Estilos compartidos ───────────────────────────────────────────────────────
const inputCls = (error?: string) =>
  `w-full px-4 py-3 rounded-lg border ${
    error
      ? "border-red-400 dark:border-red-500 focus:ring-red-400"
      : "border-slate-200 dark:border-slate-700 focus:ring-[#135bec]"
  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-all text-sm`;

const labelCls = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

interface Props {
  initialData?: Partial<CreateTalent>;
  onSubmit:     (data: CreateTalent) => void;
  onCancel:     () => void;
  submitLabel?: string;
  isEditing?:   boolean;
  footerNote?:  string;
  isPending?:   boolean;
}

// ── Section wrapper ───────────────────────────────────────────────────────────
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

// ── Error message ─────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>error</span>
      {msg}
    </p>
  );
}

// ── Validation ────────────────────────────────────────────────────────────────
type Errors = Partial<Record<keyof CreateTalent, string>>;

function validate(form: CreateTalent): Errors {
  const e: Errors = {};
  if (!form.Nombre?.trim())                          e.Nombre       = "El nombre es requerido";
  if (!form.Email?.trim())                           e.Email        = "El email es requerido";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) e.Email = "Email inválido";
  if (!form.Telefono?.trim())                        e.Telefono     = "El teléfono es requerido";
  if (!form.Rol?.trim())                             e.Rol          = "El rol es requerido";
  if (!form.Location?.trim())                        e.Location     = "La ubicación es requerida";
  if (!form.Skillset || String(form.Skillset).trim() === "") e.Skillset = "El skillset es requerido";
  if (!form.Tecnologia || String(form.Tecnologia).trim() === "") e.Tecnologia = "La tecnología es requerida";
  if (form.EnglishLevel === undefined || form.EnglishLevel === null || String(form.EnglishLevel) === "")
    e.EnglishLevel = "El nivel de inglés es requerido";
  else if (Number(form.EnglishLevel) < 0 || Number(form.EnglishLevel) > 100)
    e.EnglishLevel = "Debe ser un valor entre 0 y 100";
  if (form.Experiencia === undefined || form.Experiencia === null || String(form.Experiencia) === "")
    e.Experiencia = "Los años de experiencia son requeridos";
  else if (Number(form.Experiencia) < 0)
    e.Experiencia = "Debe ser un valor positivo";
  if (!form.Esquema?.trim())                         e.Esquema      = "El esquema de trabajo es requerido";
  return e;
}

export default function TalentForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Register Talent",
  isEditing   = false,
  footerNote,
  isPending   = false,
}: Props) {
  const [form, setForm]     = useState<CreateTalent>({ ...DEFAULT_FORM, ...initialData });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CreateTalent, boolean>>>({});

  const set = <K extends keyof CreateTalent>(key: K, value: CreateTalent[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Limpiar error del campo al modificarlo
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const touch = (key: keyof CreateTalent) =>
    setTouched((prev) => ({ ...prev, [key]: true }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Marcar todos como tocados para mostrar errores
      const allTouched = Object.keys(errs).reduce(
        (acc, k) => ({ ...acc, [k]: true }),
        {} as typeof touched
      );
      setTouched(allTouched);
      return;
    }
    onSubmit(form);
  };

  const err = (key: keyof CreateTalent) => (touched[key] ? errors[key] : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">

      {/* ── Personal Information ── */}
      <Section icon="person" title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nombre */}
          <div className="md:col-span-2">
            <label className={labelCls}>
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              className={inputCls(err("Nombre"))}
              type="text"
              placeholder="e.g. John Doe"
              value={form.Nombre}
              onChange={(e) => set("Nombre", e.target.value)}
              onBlur={() => touch("Nombre")}
            />
            <FieldError msg={err("Nombre")} />
          </div>

          {/* Email */}
          <div>
            <label className={labelCls}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className={inputCls(err("Email"))}
              type="email"
              placeholder="john.doe@example.com"
              value={form.Email ?? ""}
              onChange={(e) => set("Email", e.target.value)}
              onBlur={() => touch("Email")}
            />
            <FieldError msg={err("Email")} />
          </div>

          {/* Teléfono */}
          <div>
            <label className={labelCls}>
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              className={inputCls(err("Telefono"))}
              type="tel"
              placeholder="+52 55 0000 0000"
              value={form.Telefono ?? ""}
              onChange={(e) => set("Telefono", e.target.value)}
              onBlur={() => touch("Telefono")}
            />
            <FieldError msg={err("Telefono")} />
          </div>

          {/* Location */}
          <div>
            <label className={labelCls}>
              Ubicación <span className="text-red-500">*</span>
            </label>
            <input
              className={inputCls(err("Location"))}
              type="text"
              placeholder="Ciudad, País"
              value={form.Location ?? ""}
              onChange={(e) => set("Location", e.target.value)}
              onBlur={() => touch("Location")}
            />
            <FieldError msg={err("Location")} />
          </div>

          {/* LinkedIn */}
          <div>
            <label className={labelCls}>LinkedIn</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: 18 }}>
                link
              </span>
              <input
                className={`${inputCls()} pl-10`}
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={form.CV ?? ""}
                onChange={(e) => set("CV", e.target.value)}
              />
            </div>
          </div>

        </div>
      </Section>

      {/* ── Professional Profile ── */}
      <Section icon="work" title={isEditing ? "Role & Experience" : "Professional Profile"}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Rol */}
          <div>
            <label className={labelCls}>
              Rol Principal <span className="text-red-500">*</span>
            </label>
            <select
              className={inputCls(err("Rol"))}
              value={form.Rol ?? ""}
              onChange={(e) => set("Rol", e.target.value)}
              onBlur={() => touch("Rol")}
            >
              <option value="">Seleccionar rol…</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <FieldError msg={err("Rol")} />
          </div>

          {/* Tecnología */}
          <div>
            <label className={labelCls}>
              Tecnología principal <span className="text-red-500">*</span>
            </label>
            <input
              className={inputCls(err("Tecnologia"))}
              type="text"
              placeholder="React, Node.js, SAP…"
              value={String(form.Tecnologia ?? "")}
              onChange={(e) => set("Tecnologia", e.target.value)}
              onBlur={() => touch("Tecnologia")}
            />
            <FieldError msg={err("Tecnologia")} />
          </div>

          {/* Experiencia */}
          <div>
            <label className={labelCls}>
              Años de experiencia <span className="text-red-500">*</span>
            </label>
            <input
              className={inputCls(err("Experiencia"))}
              type="number"
              min={0}
              placeholder="0"
              value={form.Experiencia ?? ""}
              onChange={(e) => set("Experiencia", e.target.value === "" ? undefined : Number(e.target.value))}
              onBlur={() => touch("Experiencia")}
            />
            <FieldError msg={err("Experiencia")} />
          </div>

          {/* Skillset */}
          <div className="md:col-span-2">
            <label className={labelCls}>
              Skillset <span className="text-red-500">*</span>
              <span className="ml-1 font-normal text-slate-400 text-xs">(separado por comas)</span>
            </label>
            <textarea
              className={`${inputCls(err("Skillset"))} h-24 resize-none`}
              placeholder="React, Tailwind, Node.js, AWS…"
              value={String(form.Skillset ?? "")}
              onChange={(e) => set("Skillset", e.target.value)}
              onBlur={() => touch("Skillset")}
            />
            <FieldError msg={err("Skillset")} />
          </div>

          {/* English Level */}
          <div>
            <label className={labelCls}>
              English Score (0–100) <span className="text-red-500">*</span>
            </label>
            <input
              className={inputCls(err("EnglishLevel"))}
              type="number"
              min={0}
              max={100}
              placeholder="75"
              value={form.EnglishLevel ?? ""}
              onChange={(e) => set("EnglishLevel", e.target.value === "" ? undefined : Number(e.target.value))}
              onBlur={() => touch("EnglishLevel")}
            />
            {/* Score → CEFR helper */}
            {form.EnglishLevel !== undefined && form.EnglishLevel !== null && (
              <p className="mt-1.5 text-xs text-slate-400">
                Equivale a:{" "}
                <span className="font-semibold text-[#135bec]">
                  {form.EnglishLevel >= 90 ? "C2" :
                   form.EnglishLevel >= 80 ? "C1" :
                   form.EnglishLevel >= 70 ? "B2" :
                   form.EnglishLevel >= 55 ? "B1" :
                   form.EnglishLevel >= 40 ? "A2" : "A1"}
                </span>
              </p>
            )}
            <FieldError msg={err("EnglishLevel")} />
          </div>

        </div>
      </Section>

      {/* ── Expectations & Logistics ── */}
      <Section icon="payments" title="Expectations & Logistics">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Esquema */}
          <div>
            <label className={labelCls}>
              Esquema de trabajo <span className="text-red-500">*</span>
            </label>
            <select
              className={inputCls(err("Esquema"))}
              value={form.Esquema ?? ""}
              onChange={(e) => set("Esquema", e.target.value)}
              onBlur={() => touch("Esquema")}
            >
              <option value="">Seleccionar…</option>
              {WORK_SCHEMES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <FieldError msg={err("Esquema")} />
          </div>

          {/* Expectativas salariales */}
          <div>
            <label className={labelCls}>Expectativa salarial (USD/mes)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
              <input
                className={`${inputCls()} pl-7`}
                type="text"
                placeholder="5,000"
                value={form.Expectativas ?? ""}
                onChange={(e) => set("Expectativas", e.target.value)}
              />
            </div>
          </div>

          {/* Visa */}
          <div>
            <label className={labelCls}>US Visa</label>
            <div className="flex items-center gap-5 py-3">
              {(["Yes", "No", "In Progress"] as const).map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visa"
                    value={v}
                    className="w-4 h-4 accent-[#135bec]"
                    checked={form.Visa === v}
                    onChange={() => set("Visa", v)}
                  />
                  <span className="text-sm dark:text-slate-300">{v}</span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </Section>

      {/* ── Resumen de errores (si intentó enviar con errores) ── */}
      {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
          <span className="material-symbols-outlined shrink-0 mt-0.5" style={{ fontSize: 20 }}>error</span>
          <div>
            <p className="text-sm font-semibold">Por favor corrige los siguientes campos:</p>
            <ul className="mt-1 text-xs space-y-0.5 list-disc list-inside">
              {Object.values(errors).filter(Boolean).map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-12 border-t border-slate-200 dark:border-slate-800">
        {footerNote
          ? <p className="text-slate-500 dark:text-slate-500 text-sm italic">{footerNote}</p>
          : <span />
        }
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isEditing ? "Discard Changes" : "Discard Draft"}
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto px-10 py-3 rounded-lg font-bold text-white bg-[#135bec] hover:bg-[#135bec]/90 shadow-lg shadow-[#135bec]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span>
                Guardando…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
                {submitLabel}
              </>
            )}
          </button>
        </div>
      </div>

    </form>
  );
}