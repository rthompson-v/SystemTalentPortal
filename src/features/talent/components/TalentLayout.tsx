import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

const NAV_ITEMS = [
  { to: "/dashboard",  icon: "dashboard",      label: "Dashboard",   disabled: true  },
  { to: "/talent",     icon: "groups",         label: "Talent Pool", disabled: false },
  { to: "/jobs",       icon: "work",           label: "Jobs",        disabled: true  },
  { to: "/interviews", icon: "calendar_today", label: "Interviews",  disabled: true  },
];

const ADMIN_ITEMS = [
  { to: "/settings", icon: "settings", label: "Settings", disabled: true },
  { to: "/support",  icon: "help",     label: "Support",  disabled: true },
];

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name.split(/[\s._-]/).map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = user?.USER_CLP ?? "Usuario";
  const roleName    = user?.RoleName  ?? "—";
  const initials    = getInitials(user?.USER_CLP);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // ── Nav item ─────────────────────────────────────────────────────────────
  function NavItem({ to, icon, label, disabled }: { to: string; icon: string; label: string; disabled: boolean }) {
    if (disabled) {
      return (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500/50 dark:text-slate-600 cursor-not-allowed select-none">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
          <span className="flex-1">{label}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
            Soon
          </span>
        </div>
      );
    }
    return (
      <NavLink
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? "bg-[#135bec]/10 text-[#135bec] font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`
        }
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
        {label}
      </NavLink>
    );
  }

  // ── Sidebar content ───────────────────────────────────────────────────────
  function SidebarContent() {
    return (
      <>
        {/* Logo */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <img
            src="https://portal.everscalegroup.com/wp-content/uploads/2019/10/Secondary-Logo_white-01.png"
            alt="Everscale Group"
            className="h-7 object-contain w-full max-w-[160px]"
          />
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">Talent Acquisition</p>
        </div>
   

      
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Administration
          </div>
          {ADMIN_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

       
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <div className="size-8 rounded-full bg-[#135bec] text-white flex items-center justify-center text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-100">{displayName}</p>
              <p className="text-xs text-slate-500 truncate">{roleName}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
            Cerrar sesión
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7f8] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100">

      {/* ── Sidebar desktop ── */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <SidebarContent />
      </aside>

      {/* ── Sidebar mobile overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center px-4 md:px-8 shrink-0 gap-3">

          {/* Hamburger (solo mobile) */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>menu</span>
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: 18 }}>
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#135bec]/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none"
              placeholder="Search candidates…"
              type="text"
            />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
            </button>

            {/* Logout en header — solo desktop */}
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="hidden md:flex p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
            </button>

            {/* New Candidate */}
            <button
              onClick={() => navigate("/talent/add")}
              className="flex items-center gap-1.5 bg-[#135bec] text-white px-3 md:px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#135bec]/90 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
              <span className="hidden sm:inline">New Candidate</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}