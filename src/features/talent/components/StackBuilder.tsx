import { useState } from "react";
import { useTechnologies } from "../hooks";
import type { ModuloInput } from "../types";

interface Props {
  value:    ModuloInput[];
  onChange: (rows: ModuloInput[]) => void;
}

const inputCls = "w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#135bec] focus:border-transparent outline-none transition-all text-sm";

type Step = "tech" | "module" | "submodule" | "done";

function StepIndicator({ step }: { step: Step }) {
  const steps = [
    { key: "tech",      label: "Tecnología" },
    { key: "module",    label: "Módulo"     },
    { key: "submodule", label: "Submódulo"  },
  ];
  const order = ["tech", "module", "submodule", "done"];
  const current = order.indexOf(step);

  return (
    <div className="flex items-center gap-2 mb-5">
      {steps.map((s, i) => {
        const done    = current > i;
        const active  = current === i;
        return (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              done   ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
              active ? "bg-[#135bec] text-white" :
                       "bg-slate-100 dark:bg-slate-800 text-slate-400"
            }`}>
              {done
                ? <span className="material-symbols-outlined" style={{ fontSize: 13 }}>check</span>
                : <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] font-bold" style={{ borderColor: active ? "white" : "currentColor" }}>{i + 1}</span>
              }
              {s.label}
            </div>
            {i < steps.length - 1 && (
              <span className={`text-xs ${current > i ? "text-green-400" : "text-slate-300 dark:text-slate-600"}`}>→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function StackBuilder({ value, onChange }: Props) {
  const { data: technologies = [] } = useTechnologies();

  const [step, setStep]           = useState<Step>("tech");
  const [tech, setTech]           = useState("");
  const [isNewTech, setIsNewTech] = useState(false);
  const [module, setModule]       = useState("");
  const [submodule, setSubmodule] = useState("");

  const reset = () => {
    setStep("tech");
    setTech("");
    setIsNewTech(false);
    setModule("");
    setSubmodule("");
  };

  const confirmTech = () => {
    if (!tech.trim()) return;
    setStep("module");
  };

  const confirmModule = () => {
    // módulo es opcional — si está vacío saltar directo a agregar
    setStep("submodule");
  };

 

  const addEntry = (sub: string) => {
    const entry: ModuloInput = {
      technology: tech.trim(),
      module:     module.trim()  || undefined,
      submodule:  sub.trim()     || undefined,
    };
    const updated = [...value, entry];
    onChange(updated);
    reset();
  };

  const removeEntry = (idx: number) => {
    const updated = value.filter((_, i) => i !== idx);
    onChange(updated);
  };

  // ── Label para mostrar en chip ─────────────────────────────────────────────
  const entryLabel = (e: ModuloInput) => {
    const parts = [e.technology, e.module, e.submodule].filter(Boolean);
    return parts.join(" › ");
  };

  return (
    <div className="space-y-4">

      {/* ── Chips de entradas ya agregadas ── */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((entry, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#135bec]/10 dark:bg-[#135bec]/20 border border-[#135bec]/20 rounded-full text-sm text-[#135bec] font-medium"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>layers</span>
              <span>{entryLabel(entry)}</span>
              <button
                type="button"
                onClick={() => removeEntry(idx)}
                className="hover:text-red-500 transition-colors ml-1"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Panel paso a paso ── */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-5">

        <StepIndicator step={step} />

        {/* PASO 1 — Tecnología */}
        {step === "tech" && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ¿Qué tecnología maneja el candidato?
              </label>

              {isNewTech ? (
                <div className="space-y-2">
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="Escribe el nombre de la tecnología…"
                    value={tech}
                    onChange={(e) => setTech(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), confirmTech())}
                    autoFocus
                  />
                  <p className="text-xs text-amber-500 dark:text-amber-400 flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>auto_fix</span>
                    Esta tecnología se creará en el catálogo si no existe.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setIsNewTech(false); setTech(""); }}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
                  >
                    ← Volver al catálogo
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <select
                    className={inputCls}
                    value={tech}
                    onChange={(e) => setTech(e.target.value)}
                  >
                    <option value="">Selecciona una tecnología…</option>
                    {technologies.map((t) => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => { setIsNewTech(true); setTech(""); }}
                    className="text-xs text-[#135bec] hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>add</span>
                    No está en la lista — agregar nueva
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={confirmTech}
                disabled={!tech.trim()}
                className="px-5 py-2 bg-[#135bec] text-white rounded-lg text-sm font-semibold hover:bg-[#135bec]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                Continuar
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* PASO 2 — Módulo */}
        {step === "module" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[#135bec]" style={{ fontSize: 18 }}>layers</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{tech}</span>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ¿Tiene algún módulo específico? <span className="font-normal text-slate-400">(opcional)</span>
              </label>
              <input
                className={inputCls}
                type="text"
                placeholder="Ej: FI, SD, CO, Basis… o deja vacío"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), confirmModule())}
                autoFocus
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Si el módulo no existe en el sistema se creará automáticamente.
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={confirmModule}
                className="px-5 py-2 bg-[#135bec] text-white rounded-lg text-sm font-semibold hover:bg-[#135bec]/90 transition-colors flex items-center gap-1.5"
              >
                {module.trim() ? "Continuar" : "Sin módulo"}
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </button>
              <button
                type="button"
                onClick={reset}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                ← Atrás
              </button>
            </div>
          </div>
        )}

        {/* PASO 3 — Submódulo */}
        {step === "submodule" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-900 dark:text-white">{tech}</span>
              {module && <><span>›</span><span className="font-medium text-slate-700 dark:text-slate-300">{module}</span></>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                ¿Tiene submódulo? <span className="font-normal text-slate-400">(opcional)</span>
              </label>
              <input
                className={inputCls}
                type="text"
                placeholder="Ej: GL, AR, AP… o deja vacío"
                value={submodule}
                onChange={(e) => setSubmodule(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEntry(submodule))}
                autoFocus
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => addEntry(submodule)}
                className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
                Agregar al perfil
              </button>
              <button
                type="button"
                onClick={() => setStep("module")}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                ← Atrás
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Botón para agregar otra tecnología si ya hay alguna */}
      {value.length > 0 && step === "tech" && (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          ¿Tiene más tecnologías? Selecciona otra arriba y continúa.
        </p>
      )}
    </div>
  );
}