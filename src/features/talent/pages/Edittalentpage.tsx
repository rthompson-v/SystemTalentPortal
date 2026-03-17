import { useNavigate, useParams } from "react-router-dom";
import TalentLayout from "../components/TalentLayout";
import TalentForm from "../components/TalentForm";
import type { TalentFormData } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// NOTE: Replace the two lines below with your real hooks once they exist.
//   import { useTalent, useUpdateTalent } from "../hooks";
//
// For now the page renders the form empty so the UI is fully styled.
// ─────────────────────────────────────────────────────────────────────────────

export function EditTalentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // TODO: swap with → const { data: talent, isLoading } = useTalent(id);
  const talent = undefined as any;
  const isLoading = false;

  // TODO: swap with → const update = useUpdateTalent();
  const update = { mutateAsync: async (d: any) => d, isPending: false, isError: false };

  const handleSubmit = async (data: TalentFormData) => {
    await update.mutateAsync({ id, ...data } as any);
    navigate("/talent");
  };

  if (isLoading) {
    return (
      <TalentLayout>
        <div className="flex items-center justify-center h-full py-20 gap-3 text-slate-400">
          <span className="material-symbols-outlined animate-spin" style={{ fontSize: 24 }}>progress_activity</span>
          <span className="text-sm">Loading candidate…</span>
        </div>
      </TalentLayout>
    );
  }

  const { id: _id, createdAt: _c, updatedAt, ...initialData } = talent ?? {};

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
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
          <span className="text-slate-900 dark:text-slate-100 font-medium">Edit Profile</span>
        </div>

        {/* Page header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">
              Edit Profile{talent?.fullName ? `: ${talent.fullName}` : ""}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base mt-1">
              Modify candidate details, experience, and system flags.
            </p>
          </div>
        </div>

        {/* Error banner */}
        {update.isError && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
            <p className="text-sm font-medium">Error updating candidate. Please try again.</p>
          </div>
        )}

        <TalentForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/talent")}
          submitLabel={update.isPending ? "Saving…" : "Update Profile"}
          isEditing={true}
          footerNote={formattedDate ? `Last updated on ${formattedDate}` : undefined}
        />
      </div>
    </TalentLayout>
  );
}
