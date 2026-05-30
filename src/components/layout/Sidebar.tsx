import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    description: 'Resumen general',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
      </svg>
    ),
  },
  {
    to: '/languages',
    label: 'Idiomas',
    description: 'Cursos disponibles',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    to: '/leaderboard',
    label: 'Ranking',
    description: 'Posiciones',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Perfil',
    description: 'Cuenta y seguridad',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'Admin'

  const allItems = [
    ...navItems,
    ...(isAdmin
      ? [
          {
            to: '/admin/theory',
            label: 'Teoría',
            description: 'Gestión admin',
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            ),
          },
        ]
      : []),
  ]

  return (
    <aside className="relative hidden h-full w-72 shrink-0 overflow-hidden border-r border-slate-200 bg-white/90 shadow-[12px_0_35px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:flex lg:flex-col">
      <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-teal-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-slate-200/70 blur-3xl" />

      <div className="relative border-b border-slate-200 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white shadow-lg shadow-slate-900/20">
            P
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-950">
              Pao<span className="text-teal-700">Lingua</span>
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              Plataforma de idiomas
            </p>
          </div>
        </div>
      </div>

      <nav className="relative flex-1 space-y-2 px-4 py-5">
        {allItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `
                group flex items-center gap-3 rounded-2xl px-4 py-3
                text-sm font-semibold transition-all duration-300
                ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/15'
                    : 'text-slate-600 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-950'
                }
              `
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-xl transition-all
                    ${
                      isActive
                        ? 'bg-teal-500/20 text-teal-200'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-800'
                    }
                  `}
                >
                  {item.icon}
                </div>

                <div className="min-w-0">
                  <p className="truncate">{item.label}</p>
                  <p
                    className={`
                      truncate text-xs font-medium
                      ${isActive ? 'text-slate-400' : 'text-slate-400'}
                    `}
                  >
                    {item.description}
                  </p>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative px-4 pb-5">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
              {user?.email?.charAt(0).toUpperCase() ?? 'U'}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-900">
                {user?.email?.split('@')[0] ?? 'Usuario'}
              </p>
              <p className="truncate text-xs font-semibold text-slate-500">
                {user?.role ?? 'Estudiante'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  )
}