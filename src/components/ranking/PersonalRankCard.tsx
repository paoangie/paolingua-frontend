import { useQuery } from '@tanstack/react-query'
import { progressApi } from '../../api/progress'

export default function PersonalRankCard() {
  const { data: rank, isLoading } = useQuery({
    queryKey: ['myRank'],
    queryFn: () => progressApi.getMyRank().then((r) => r.data),
  })

  if (isLoading) {
    return (
      <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm">
        <div className="h-20 animate-pulse rounded-lg bg-purple-100" />
      </div>
    )
  }

  if (!rank) return null

  const getMedalEmoji = () => {
    if (rank.rank === 1) return '🥇'
    if (rank.rank === 2) return '🥈'
    if (rank.rank === 3) return '🥉'
    return null
  }

  const medal = getMedalEmoji()

  return (
    <div className="overflow-hidden rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-sm">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          🏆 Tu posición en el ranking
        </h3>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-3xl">
              {medal ?? (
                <span className="text-2xl font-bold text-purple-700">
                  #{rank.rank}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Posición</p>
              <p className="text-2xl font-bold text-gray-900">
                #{rank.rank} <span className="text-base font-normal text-gray-400">de {rank.totalUsers}</span>
              </p>
              <p className="text-xs text-gray-400">
                Mejor que el {rank.percentile}% de los estudiantes
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <p className="text-xs text-gray-500">XP Total</p>
              <p className="text-xl font-bold text-purple-700">{rank.totalXp}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Lecciones</p>
              <p className="text-lg font-semibold text-gray-700">{rank.completedLessons}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
