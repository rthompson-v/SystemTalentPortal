import { NavLink, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard',        icon: 'dashboard',      label: 'Dashboard' },
  { to: '/talent',           icon: 'groups',         label: 'Talent Pool' },
  { to: '/jobs',             icon: 'work',           label: 'Jobs' },
  { to: '/interviews',       icon: 'calendar_today', label: 'Interviews' },
];

const ADMIN_ITEMS = [
  { to: '/settings', icon: 'settings', label: 'Settings' },
  { to: '/support',  icon: 'help',     label: 'Support' },
];

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7f8] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100">
      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#135bec] rounded-lg p-1.5 text-white flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>layers</span>
            </div>
            <div>
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-none">ATS Portal</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Talent Acquisition</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#135bec]/10 text-[#135bec] font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
              {label}
            </NavLink>
          ))}

          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Administration
          </div>

          {ADMIN_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#135bec]/10 text-[#135bec] font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <div className="size-8 rounded-full bg-[#135bec] text-white flex items-center justify-center text-sm font-bold">
              AR
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Alex Rivera</p>
              <p className="text-xs text-slate-500 truncate">Admin Access</p>
            </div>
            <span className="material-symbols-outlined text-slate-400" style={{ fontSize: 20 }}>more_vert</span>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                style={{ fontSize: 20 }}
              >
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#135bec]/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 outline-none"
                placeholder="Search candidates by name, email, or role..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
            </button>
            <button
              onClick={() => navigate('/talent/add')}
              className="flex items-center gap-2 bg-[#135bec] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#135bec]/90 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
              New Candidate
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