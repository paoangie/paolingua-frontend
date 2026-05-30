import { useQuery } from '@tanstack/react-query'
import { progressApi } from '../api/progress'
import { Card } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import PersonalRankCard from '../components/ranking/PersonalRankCard'

export default function LeaderboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => progressApi.getLeaderboard(10).then((r) => r.data),
    enabled: isAdmin,
  })

  if (!isAdmin) {
    return (
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-200">
              <span className="h-2 w-2 rounded-full bg-teal-300" />
              Ranking personal
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Mi posición
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Aquí puedes revisar tu posición personal dentro del sistema sin
              visualizar información de otros estudiantes.
            </p>
          </div>
        </section>

        <PersonalRankCard />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-300 border-t-teal-700" />
      </div>
    )
  }

  const topThree = leaderboard?.slice(0, 3) ?? []

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'border-teal-200 bg-teal-50 text-teal-900'
    if (rank === 2) return 'border-slate-300 bg-slate-100 text-slate-800'
    if (rank === 3) return 'border-slate-200 bg-white text-slate-700'
    return 'border-slate-200 bg-slate-50 text-slate-600'
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-16 h-72 w-72 rounded-full bg-slate-500/20 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-200">
            <span className="h-2 w-2 rounded-full bg-teal-300" />
            Panel administrativo
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Ranking general
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Vista administrativa del avance de los estudiantes según XP
            acumulado y lecciones completadas.
          </p>
        </div>
      </section>

      {topThree.length > 0 && (
        <section className="grid gap-5 lg:grid-cols-3">
          {topThree.map((entry) => (
            <Card key={entry.email}>
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-lg font-black ${getRankStyle(
                  entry.rank
                )}`}
              >
                #{entry.rank}
              </div>

              <div className="mt-6">
                <h3 className="truncate text-xl font-black tracking-tight text-slate-950">
                  {entry.email}
                </h3>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  Estudiante destacado
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    XP
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    {entry.totalXp}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Lecciones
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    {entry.completedLessons}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </section>
      )}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200 bg-white px-6 py-5">
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            Lista completa
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Información visible solo para administradores.
          </p>
        </div>

        {leaderboard && leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                    Posición
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-400">
                    XP
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-400">
                    Lecciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {leaderboard.map((entry) => (
                  <tr key={entry.email} className="bg-white hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-black ${getRankStyle(
                          entry.rank
                        )}`}
                      >
                        #{entry.rank}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                          {entry.email.charAt(0).toUpperCase()}
                        </div>

                        <p className="font-bold text-slate-950">
                          {entry.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <p className="text-lg font-black text-slate-950">
                        {entry.totalXp}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-slate-600">
                        {entry.completedLessons}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-xl font-black text-slate-700">
              —
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-950">
              No hay datos de ranking
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Cuando existan estudiantes con progreso, aparecerán en esta tabla.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}