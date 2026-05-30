import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-2xl font-black text-white">
          P
        </div>

        <div className="mx-auto mt-6 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-700" />

        <p className="mt-5 text-sm font-bold text-slate-700">
          Verificando sesión
        </p>

        <p className="mt-1 text-xs font-medium text-slate-400">
          Validando acceso a tu plataforma
        </p>
      </div>
    </div>
  )
}

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <ProtectedLoading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}