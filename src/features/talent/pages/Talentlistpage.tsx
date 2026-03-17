import { useState } from "react";
import { useTalentList } from "../hooks";
import TalentLayout from "../components/TalentLayout";
import TalentTable from "../components/TalentTable";
//import type { Talent } from "../types";

const EXPERIENCE_FILTERS = ["All", "0–2 yrs", "3–5 yrs", "6–10 yrs", "10+ yrs"];
const ROLE_FILTERS = ["All", "Frontend", "Backend", "Fullstack", "Designer", "PM"];

export function TalentListPage() {
  const { data: talents = [], isLoading, isError } = useTalentList();
  const [search, setSearch]         = useState("");
  const [expFilter, setExpFilter]   = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  // ── Client-side filtering ─────────────────────────────────────────────────
  const filtered = talents.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      t.fullName.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.primaryRole.toLowerCase().includes(q) ||
      t.techStack.toLowerCase().includes(q);

    const years = Number(t.yearsOfExperience ?? 0);
    const matchesExp =
      expFilter === "All" ||
      (expFilter === "0–2 yrs" && years <= 2) ||
      (expFilter === "3–5 yrs" && years >= 3 && years <= 5) ||
      (expFilter === "6–10 yrs" && years >= 6 && years <= 10) ||
      (expFilter === "10+ yrs" && years > 10);

    const matchesRole =
      roleFilter === "All" ||
      t.primaryRole.toLowerCase().includes(roleFilter.toLowerCase());

    return matchesSearch && matchesExp && matchesRole;
  });

  // ── Filter pill ──────────────────────────────────────────────────────────
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

  return (
    <TalentLayout>
      <div className="p-8">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Consulta de Talento</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {isLoading ? "Loading…" : `${filtered.length} candidate${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: 18 }}>
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-[#135bec]/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none"
              placeholder="Search by name, email or role…"
              type="text"
            />
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Experience:</span>
          {EXPERIENCE_FILTERS.map((f) => (
            <FilterPill key={f} label={f} active={expFilter === f} onClick={() => setExpFilter(f)} />
          ))}
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-4">Role:</span>
          {ROLE_FILTERS.map((f) => (
            <FilterPill key={f} label={f} active={roleFilter === f} onClick={() => setRoleFilter(f)} />
          ))}
        </div>

        {/* ── States ── */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <span className="material-symbols-outlined animate-spin" style={{ fontSize: 24 }}>progress_activity</span>
            <span className="text-sm">Loading candidates…</span>
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
            <p className="text-sm font-medium">Error loading talent. Please try again.</p>
          </div>
        )}

        {/* ── Table ── */}
        {!isLoading && !isError && (
          <>
            <TalentTable talents={filtered} />

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {filtered.length} of {talents.length} candidates
              </p>
              <div className="flex items-center gap-2">
                <button disabled className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-lg text-sm disabled:opacity-50 text-slate-600 dark:text-slate-400">
                  Previous
                </button>
                <button className="px-3 py-1 bg-[#135bec] text-white rounded-lg text-sm font-medium">1</button>
                <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </TalentLayout>
  );
}