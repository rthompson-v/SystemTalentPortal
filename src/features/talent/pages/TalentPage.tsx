import { useCreateTalent, useTalentList } from "../hooks";
import { useForm } from "react-hook-form";

type FormData = { fullName: string; email: string; role?: string };

export function TalentPage() {
  const list = useTalentList();
  const create = useCreateTalent();
  const { register, handleSubmit, reset } = useForm<FormData>();

  return (
    <div style={{ padding: 20, display: "grid", gap: 16 }}>
      <h1>Gestión de Talento</h1>

      <form
        onSubmit={handleSubmit(async (values) => {
          await create.mutateAsync(values);
          reset();
        })}
        style={{ display: "grid", gap: 8, maxWidth: 520 }}
      >
        <h2>Nuevo registro</h2>
        <input placeholder="Nombre completo" {...register("fullName", { required: true })} />
        <input placeholder="Email" {...register("email", { required: true })} />
        <input placeholder="Rol (opcional)" {...register("role")} />
        <button type="submit" disabled={create.isPending}>
          {create.isPending ? "Guardando..." : "Guardar"}
        </button>
      </form>

      <div>
        <h2>Listado</h2>
        {list.isLoading && <p>Cargando...</p>}
        {list.isError && <p style={{ color: "crimson" }}>Error cargando talento</p>}
        {list.data && (
          <table cellPadding={8} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th align="left">Nombre</th>
                <th align="left">Email</th>
                <th align="left">Rol</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((t) => (
                <tr key={t.id} style={{ borderTop: "1px solid #eee" }}>
                  <td>{t.fullName}</td>
                  <td>{t.email}</td>
                  <td>{t.role ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}