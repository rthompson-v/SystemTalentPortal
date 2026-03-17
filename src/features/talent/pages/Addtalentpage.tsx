import { useNavigate } from "react-router-dom";
import { useCreateTalent } from "../hooks";
import TalentLayout from "../components/TalentLayout";
import TalentForm from "../components/TalentForm";
import type { TalentFormData } from "../types";

export function AddTalentPage() {
  const navigate = useNavigate();
  const create = useCreateTalent();

  const handleSubmit = async (data: TalentFormData) => {
    await create.mutateAsync(data);
    navigate("/talent");
  };

  return (
    <TalentLayout>
      <div className="max-w-[1000px] mx-auto px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/talent")}
            className="flex items-center gap-2 text-[#135bec] text-sm font-semibold mb-2 hover:underline"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            Back to Talent List
          </button>
          <h1 className="text-slate-900 dark:text-white text-4xl font-black tracking-tight">
            Alta de Talento
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Register a new candidate and their professional details in the system.
          </p>
        </div>

        {/* Error banner */}
        {create.isError && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>error</span>
            <p className="text-sm font-medium">Error saving candidate. Please try again.</p>
          </div>
        )}

        <TalentForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/talent")}
          submitLabel={create.isPending ? "Saving…" : "Register Talent"}
          isEditing={false}
        />
      </div>
    </TalentLayout>
  );
}