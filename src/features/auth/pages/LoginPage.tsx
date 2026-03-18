import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api";
import { useAuth } from "../useAuth";

type FormData = { USER_CLP: string; PASS_CLP: string };

export function LoginPage() {
  const nav = useNavigate();
  const { setSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const login = useMutation({ mutationFn: loginApi });
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

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
    <div className="bg-[#0f172a] text-slate-100 min-h-screen font-sans relative selection:bg-blue-600/30">

      {/* ── Logo ── */}
      <header className="absolute top-0 left-0 p-8 z-20 flex items-center gap-4">
        <img
          src="https://portal.everscalegroup.com/wp-content/uploads/2019/10/Secondary-Logo_white-01.png"
          alt="Everscale Group"
          className="h-8 object-contain"
        />
        <div className="h-6 w-px bg-slate-700" />
        <span className="text-slate-400 font-medium text-sm md:text-base">
          System Talent Portal
        </span>
      </header>

      <div className="flex flex-col items-center w-full min-h-screen">

        {/* ── Hero image ── */}
        <div className="w-full h-[45vh] overflow-hidden relative">
          <div
            className="w-full h-full bg-center bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLZBZm09lPx5dnQQQliIC_joobm7K7JtoxQsrzzXce1TxcpnwDaQ7tHW-F9JIB03ZrNM-DcY133krxFraMWkzryG1V816DPBcx4H-gAF2qLE5i8yZEUnl4oiHd1nXa2jFJBdNvBw0eSv-Iuhx1UGKaptXU0kH6yaeD7iior8kaLD0NNtQoEOv-bRL4IAJVdkX31E4Wq47keTyT2AHf_UKDUS1gONcP-ez79ZzPccTlQGEeOcHXqRsJzCHh3p79-O1Gg_xxebwDqsmc")`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/40 via-[#0f172a]/20 to-[#0f172a]" />
          </div>
        </div>

        {/* ── Form ── */}
        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[1200px] px-4 -mt-32 relative z-10 pb-16">
          <div className="w-full max-w-[450px] bg-slate-900/80 backdrop-blur-md p-10 rounded-xl border border-slate-800 shadow-2xl relative overflow-hidden">

            {/* Mint accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#99ff99]" />

            <div className="mb-10 text-center">
              <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Bienvenido</h1>
              <p className="text-slate-400 text-sm">Ingrese sus credenciales para acceder al portal</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Usuario */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-300 text-sm font-semibold px-1">Usuario</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#0d6cf2] transition-colors" style={{ fontSize: 20 }}>
                    person
                  </span>
                  <input
                    {...register("USER_CLP", { required: "El usuario es requerido" })}
                    className="w-full pl-10 pr-4 h-12 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-[#0d6cf2] focus:border-[#0d6cf2] transition-all outline-none text-sm"
                    placeholder="Nombre de usuario"
                    type="text"
                    autoComplete="username"
                  />
                </div>
                {errors.USER_CLP && (
                  <p className="text-red-400 text-xs px-1">{errors.USER_CLP.message}</p>
                )}
              </div>

              {/* Contraseña */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-300 text-sm font-semibold px-1">Contraseña</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#0d6cf2] transition-colors" style={{ fontSize: 20 }}>
                    lock
                  </span>
                  <input
                    {...register("PASS_CLP", { required: "La contraseña es requerida" })}
                    className="w-full pl-10 pr-12 h-12 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-[#0d6cf2] focus:border-[#0d6cf2] transition-all outline-none text-sm"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#0d6cf2] transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {errors.PASS_CLP && (
                  <p className="text-red-400 text-xs px-1">{errors.PASS_CLP.message}</p>
                )}
              </div>

              {/* Recordarme */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 accent-[#0d6cf2]"
                  />
                  <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
                    Recordarme
                  </span>
                </label>
                <a href="#" className="text-[#0d6cf2] font-bold hover:underline text-sm">
                  ¿Olvidó su contraseña?
                </a>
              </div>

              {/* Error de credenciales */}
              {login.isError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
                  Credenciales inválidas. Intente de nuevo.
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={login.isPending}
                className="w-full h-12 bg-[#0d6cf2] hover:bg-[#0d6cf2]/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-[#0d6cf2]/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {login.isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span>
                    Entrando…
                  </>
                ) : (
                  <>
                    <span>Entrar</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer del card */}
            <div className="mt-10 pt-6 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-500">
                ¿Necesita ayuda?
                <a href="#" className="text-[#0d6cf2] font-bold hover:underline ml-1">
                  Contactar soporte
                </a>
              </p>
            </div>
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="w-full py-8 text-center text-slate-600 text-xs mt-auto">
          <p>© 2024 ATS Recruitment Portal. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}