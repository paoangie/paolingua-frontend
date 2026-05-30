import { useQuery } from '@tanstack/react-query'
import { progressApi } from '../../api/progress'

export default function PersonalRankCard() {
  const { data: rank, isLoading } = useQuery({
    queryKey: ['myRank'],
    queryFn: () => progressApi.getMyRank().then((r) => r.data),
  })

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    )
  }

  if (!rank) return null

  const isTopThree = rank.rank <= 3

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl">
      <div className="relative overflow-hidden bg-slate-950 px-6 py-5">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-teal-500/20 blur-3xl" />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black tracking-tight text-white">
              Tu posición
            </h3>

            <p className="mt-1 text-sm font-medium text-slate-400">
              Rendimiento dentro del ranking general
            </p>
          </div>

          {isTopThree && (
            <span className="rounded-full border border-teal-300/20 bg-teal-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-200">
              Top 3
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-teal-200 bg-teal-50 text-2xl font-black text-teal-900">
              #{rank.rank}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">
                Posición actual
              </p>

              <p className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                De {rank.totalUsers} estudiantes
              </p>

              <p className="mt-2 text-sm font-medium text-slate-500">
                Mejor que el {rank.percentile}% de los estudiantes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:min-w-56">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                XP total
              </p>

              <p className="mt-2 text-2xl font-black text-slate-950">
                {rank.totalXp}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Lecciones
              </p>

              <p className="mt-2 text-2xl font-black text-slate-950">
                {rank.completedLessons}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3">
          <p className="text-sm leading-6 text-teal-900">
            Sigue completando lecciones para mejorar tu posición y aumentar tu
            experiencia acumulada.
          </p>
        </div>
      </div>
    </div>
  )
}