import { useNavigate } from "react-router-dom";
import type { Talent } from "../types";

// english_score es 0-100, lo convertimos a label CEFR
function getEnglishLabel(score?: number): string {
  if (score == null) return "N/A";
  if (score >= 90) return "C2";
  if (score >= 80) return "C1";
  if (score >= 70) return "B2";
  if (score >= 55) return "B1";
  if (score >= 40) return "A2";
  return "N/A";
}

function getEnglishColor(score?: number): string {
  if (score == null) return "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700";
  if (score >= 80) return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50";
  if (score >= 60) return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50";
  if (score >= 40) return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 border-yellow-200 dark:border-yellow-900/50";
  return "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700";
}

const AVATAR_COLORS = [
  "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
  "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
  "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

interface Props {
  talents: Talent[];
}

export default function TalentTable({ talents }: Props) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left min-w-[900px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
            {["Candidate", "Experience", "Tech Stack", "English", "Location", "Updated", "Links", ""].map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {talents.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                No candidates found.
              </td>
            </tr>
          ) : (
            talents.map((t, i) => (
              <tr key={t.candidate_code ?? i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">

                {/* Candidate */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(t.full_name)}`}>
                      {getInitials(t.full_name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.full_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.email ?? "—"}</p>
                    </div>
                  </div>
                </td>

                {/* Experience */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                  {t.years_experience != null ? `${t.years_experience} yr${t.years_experience !== 1 ? "s" : ""}` : "—"}
                </td>

                {/* Tech Stack / Skillset */}
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {t.skillset
                      ? t.skillset.split(",").slice(0, 3).map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-medium border border-slate-200 dark:border-slate-700">
                            {s.trim()}
                          </span>
                        ))
                      : <span className="text-xs text-slate-400">—</span>
                    }
                  </div>
                </td>

                {/* English */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getEnglishColor(t.english_score)}`}>
                    {getEnglishLabel(t.english_score)}
                    {t.english_score != null ? ` · ${t.english_score}` : ""}
                  </span>
                </td>

                {/* Location */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                  {t.location ?? "—"}
                </td>

                {/* Updated */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-500 italic">
                  {t.last_update
                    ? new Date(t.last_update).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "—"}
                </td>

                {/* Links */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {t.linkedin && (
                      <a href={t.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#135bec] transition-colors" title="LinkedIn">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>link</span>
                      </a>
                    )}
                    {t.cv && (
                      <a href={t.cv} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#135bec] transition-colors" title="CV">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>description</span>
                      </a>
                    )}
                    {t.email && (
                      <a href={`mailto:${t.email}`} className="text-slate-400 hover:text-[#135bec] transition-colors" title="Email">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>mail</span>
                      </a>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.candidate_code && (
                      <button
                        onClick={() => navigate(`/talent/edit/${t.candidate_code}`)}
                        className="p-1.5 text-slate-400 hover:text-[#135bec] hover:bg-[#135bec]/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                      </button>
                    )}
                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}