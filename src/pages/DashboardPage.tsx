import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { progressApi } from '../api/progress'
import { Button, Card } from '../components/ui'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: () => progressApi.getSummary().then((r) => r.data),
  })

  const { data: streak } = useQuery({
    queryKey: ['streak'],
    queryFn: () => progressApi.getStreak().then((r) => r.data),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-300 border-t-teal-700" />
      </div>
    )
  }

  const userName = user?.email?.split('@')[0] ?? 'estudiante'

  const level = progress?.level ?? 1
  const totalXp = progress?.totalXp ?? 0
  const completedLessons = progress?.completedLessons ?? 0
  const totalLessons = progress?.totalLessons ?? 0
  const averageScore = progress?.averageScore ?? 0
  const completionPercentage = progress?.completionPercentage ?? 0
  const xpToNextLevel = progress?.xpToNextLevel ?? 0
  const currentStreak = streak?.currentStreak ?? 0

  const xpPercent = progress ? ((totalXp % 500) / 500) * 100 : 0

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.25)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-slate-500/20 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              Panel de aprendizaje
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              Bienvenida, {userName}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Continúa tu avance, revisa tu progreso y completa nuevas
              lecciones para fortalecer tu aprendizaje de idiomas.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate('/languages')}
              >
                Continuar aprendiendo
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/leaderboard')}
                className="border-white/20 bg-white/10 text-white hover:border-teal-300 hover:bg-white/15 hover:text-white"
              >
                Ver ranking
              </Button>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
            <p className="text-sm font-semibold text-slate-300">
              Nivel actual
            </p>

            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-6xl font-black tracking-tight text-white">
                  {level}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Progreso acumulado
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-black text-teal-300">
                  {totalXp}
                </p>
                <p className="mt-1 text-sm text-slate-400">XP total</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{totalXp % 500} XP</span>
                <span>{xpToNextLevel} XP restantes</span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-700"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Nivel
              </p>
              <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
                {level}
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-sm font-black text-slate-800">
              NIV
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                XP total
              </p>
              <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
                {totalXp}
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-sm font-black text-teal-800">
              XP
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Racha
              </p>
              <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
                {currentStreak}
              </p>
              <p className="text-xs font-semibold text-slate-400">
                días consecutivos
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-sm font-black text-slate-800">
              DÍAS
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Lecciones
              </p>
              <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
                {completedLessons}
                <span className="text-xl text-slate-400">
                  /{totalLessons}
                </span>
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-sm font-black text-teal-800">
              OK
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-950">
                Progreso general
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Resumen de avance en tus lecciones.
              </p>
            </div>

            <span className="rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800">
              {completionPercentage}%
            </span>
          </div>

          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-500">
            <span>Lecciones completadas</span>
            <span>
              {completedLessons} de {totalLessons}
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-slate-800 to-teal-700 transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Promedio
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {averageScore}
                <span className="text-base text-slate-400">/100</span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Pendiente
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {Math.max(totalLessons - completedLessons, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-black tracking-tight text-slate-950">
              Próximo objetivo
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Mantén una práctica constante para subir de nivel.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Siguiente nivel
                </p>
                <p className="mt-2 text-4xl font-black text-slate-950">
                  {level + 1}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-right text-white">
                <p className="text-xs font-semibold text-slate-300">
                  Faltan
                </p>
                <p className="text-xl font-black text-teal-300">
                  {xpToNextLevel} XP
                </p>
              </div>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-teal-700 transition-all duration-700"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-teal-100 bg-teal-50 p-5">
            <p className="text-sm font-bold text-teal-900">
              Recomendación
            </p>
            <p className="mt-2 text-sm leading-6 text-teal-800">
              Completa una lección corta y luego repasa los errores. Eso hará
              que tu progreso se vea más ordenado y profesional dentro del
              sistema.
            </p>
          </div>
        </Card>
      </section>
    </div>
  )
}