import { useState } from "react";
import { useTalentList } from "../hooks";
import TalentLayout from "../components/TalentLayout";
import TalentTable from "../components/TalentTable";

const PAGE_SIZE = 20;
const EXPERIENCE_FILTERS = ["All", "0–2 yrs", "3–5 yrs", "6–10 yrs", "10+ yrs"];
const SKILL_FILTERS      = ["All", "React", "Node", "Python", "SAP", "AWS"];

export function TalentListPage() {
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState("");
  const [expFilter, setExpFilter] = useState("All");
  const [skillFilter, setSkillFilter] = useState("All");

  const { data: response, isLoading, isError, isFetching } = useTalentList(page, PAGE_SIZE);

  const talents    = response?.data       ?? [];
  const total      = response?.total      ?? 0;
  const totalPages = response?.totalPages ?? 1;

  // ── Client-side filtering (sobre la página actual) ────────────────────────
  const filtered = talents.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      t.full_name?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.skillset?.toLowerCase().includes(q) ||
      t.location?.toLowerCase().includes(q);

    const years = Number(t.years_experience ?? 0);
    const matchesExp =
      expFilter === "All" ||
      (expFilter === "0–2 yrs" && years <= 2) ||
      (expFilter === "3–5 yrs" && years >= 3 && years <= 5) ||
      (expFilter === "6–10 yrs" && years >= 6 && years <= 10) ||
      (expFilter === "10+ yrs" && years > 10);

    const matchesSkill =
      skillFilter === "All" ||
      t.skillset?.toLowerCase().includes(skillFilter.toLowerCase());

    return matchesSearch && matchesExp && matchesSkill;
  });

  // ── Resetear a página 1 cuando se filtra ─────────────────────────────────
  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleExp    = (val: string) => { setExpFilter(val); setPage(1); };
  const handleSkill  = (val: string) => { setSkillFilter(val); setPage(1); };

  function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
      <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
          active
            ? "bg-[#135bec] text-white border-[#135bec]"
            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
      >
        {label}
      </button>
    );
  }

  // ── Páginas a mostrar en el paginador ─────────────────────────────────────
  function getPageNumbers(): (number | "...")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (page >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }

  return (
    <TalentLayout>
      <div className="p-8">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Consulta de Talento
              {isFetching && !isLoading && (
                <span className="ml-3 text-sm font-normal text-slate-400 dark:text-slate-500">Updating…</span>
              )}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {isLoading ? "Loading…" : `${total} total candidates · showing page ${page} of ${totalPages}`}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: 18 }}>
              search
            </span>
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-[#135bec]/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none"
              placeholder="Search by name, email, skill…"
              type="text"
            />
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Experience:</span>
          {EXPERIENCE_FILTERS.map((f) => (
            <FilterPill key={f} label={f} active={expFilter === f} onClick={() => handleExp(f)} />
          ))}
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-4">Skill:</span>
          {SKILL_FILTERS.map((f) => (
            <FilterPill key={f} label={f} active={skillFilter === f} onClick={() => handleSkill(f)} />
          ))}
        </div>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 24 }}>progress_activity</span>
            <span className="text-sm">Loading candidates…</span>
          </div>
        )}

        {/* ── Error ── */}
        {isError && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
            <p className="text-sm font-medium">Error loading talent. Please try again.</p>
          </div>
        )}

        {/* ── Table + Pagination ── */}
        {!isLoading && !isError && (
          <>
            <TalentTable talents={filtered} />

            {/* ── Pagination ── */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} candidates
              </p>

              <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
                  Prev
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="px-2 py-1 text-slate-400 text-sm select-none">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-[#135bec] text-white"
                          : "border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  Next
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </TalentLayout>
  );
}