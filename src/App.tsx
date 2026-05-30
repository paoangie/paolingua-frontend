import type { ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import AppLayout from './components/layout/AppLayout'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import LanguagesPage from './pages/LanguagesPage'
import LessonsPage from './pages/LessonsPage'
import LessonTheoryPage from './pages/LessonTheoryPage'
import LessonDetailPage from './pages/LessonDetailPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'
import AdminTheoryPage from './pages/AdminTheoryPage'
import AdminTheoryEditPage from './pages/AdminTheoryEditPage'

function AppLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-2xl font-black text-white">
          P
        </div>

        <div className="mx-auto mt-6 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-700" />

        <p className="mt-5 text-sm font-bold text-slate-700">
          Cargando PaoLingua
        </p>

        <p className="mt-1 text-xs font-medium text-slate-400">
          Preparando tu espacio de aprendizaje
        </p>
      </div>
    </div>
  )
}

function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <AppLoading />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />

      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/languages" element={<LanguagesPage />} />
          <Route
            path="/languages/:languageId/lessons"
            element={<LessonsPage />}
          />

          <Route path="/lessons/:id/theory" element={<LessonTheoryPage />} />
          <Route path="/lessons/:id" element={<LessonDetailPage />} />

          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin/theory" element={<AdminTheoryPage />} />
            <Route
              path="/admin/theory/:lessonId"
              element={<AdminTheoryEditPage />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}