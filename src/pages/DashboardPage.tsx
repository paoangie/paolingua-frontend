import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { progressApi } from '../api/progress'
import { Card } from '../components/ui'
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
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    )
  }

  const xpPercent = progress
    ? ((progress.totalXp % 500) / 500) * 100
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user?.email?.split('@')[0]}
        </h1>
        <p className="text-gray-500">Continua tu aprendizaje de idiomas</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Nivel</p>
            <p className="text-3xl font-bold text-gray-900">
              {progress?.level ?? 1}
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">XP Total</p>
            <p className="text-3xl font-bold text-gray-900">
              {progress?.totalXp ?? 0}
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Racha</p>
            <p className="text-3xl font-bold text-gray-900">
              {streak?.currentStreak ?? 0} dias
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Lecciones</p>
            <p className="text-3xl font-bold text-gray-900">
              {progress?.completedLessons ?? 0}/{progress?.totalLessons ?? 0}
            </p>
          </div>
        </Card>
      </div>

      {progress && (
        <Card>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Progreso hacia el siguiente nivel
          </h2>
          <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
            <span>XP: {progress.totalXp % 500}</span>
            <span>Meta: {progress.xpToNextLevel} XP restantes</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-purple-500 transition-all"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </Card>
      )}

      {progress && (
        <Card>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Progreso general
          </h2>
          <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
            <span>Completado: {progress.completionPercentage}%</span>
            <span>Promedio: {progress.averageScore}/100</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-purple-500 transition-all"
              style={{ width: `${progress.completionPercentage}%` }}
            />
          </div>
        </Card>
      )}

      <div className="flex justify-center pt-4">
        <button
          onClick={() => navigate('/languages')}
          className="rounded-xl bg-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-purple-700 hover:shadow-xl"
        >
          Comenzar a aprender
        </button>
      </div>
    </div>
  )
}
