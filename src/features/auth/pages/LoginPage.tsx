import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api";
import { useAuth } from "../useAuth.ts";

type FormData = { USER_CLP: string; PASS_CLP: string };

export function LoginPage() {
  const nav = useNavigate();
  const { setSession } = useAuth();

  const login = useMutation({ mutationFn: loginApi });

  const { register, handleSubmit } = useForm<FormData>();

  async function onSubmit(values: FormData) {
    try {
      const data = await login.mutateAsync(values);

      
      setSession(data.token);

      nav("/talent");
    } catch (error) {
      console.error("Error login:", error);
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "40px auto", display: "grid", gap: 12 }}>
      <h1>Login</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "grid", gap: 10 }}
      >
        <label>
          Usuario
          <input {...register("USER_CLP", { required: true })} />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            {...register("PASS_CLP", { required: true })}
          />
        </label>

        {login.isError && (
          <p style={{ color: "crimson" }}>
            Credenciales inválidas
          </p>
        )}

        <button type="submit" disabled={login.isPending}>
          {login.isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}