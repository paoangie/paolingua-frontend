import { useQuery } from '@tanstack/react-query'
import { progressApi } from '../api/progress'
import { Card } from '../components/ui'
import { useAuth } from '../context/AuthContext'

export default function LeaderboardPage() {
  const { user } = useAuth()

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => progressApi.getLeaderboard(10).then((r) => r.data),
  })

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return <span className="font-bold text-amber-500">#1</span>
    if (rank === 2) return <span className="font-bold text-gray-400">#2</span>
    if (rank === 3) return <span className="font-bold text-amber-700">#3</span>
    return <span className="text-gray-500">#{rank}</span>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ranking</h1>
        <p className="text-gray-500">
          Los mejores estudiantes segun su XP
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        </div>
      ) : (
        <Card className="overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Posicion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Usuario
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  XP
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Lecciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaderboard?.map((entry) => (
                <tr
                  key={entry.email}
                  className={`transition-colors hover:bg-gray-50 ${
                    entry.email === user?.email
                      ? 'bg-purple-50'
                      : ''
                  }`}
                >
                  <td className="px-6 py-4 text-lg">
                    {getRankDisplay(entry.rank)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {entry.email}
                    {entry.email === user?.email && (
                      <span className="ml-2 text-xs text-purple-600">
                        (tu)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    {entry.totalXp}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-500">
                    {entry.completedLessons}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
