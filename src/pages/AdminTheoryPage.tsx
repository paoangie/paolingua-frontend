import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { lessonsApi } from '../api/lessons'
import { Card } from '../components/ui'

export default function AdminTheoryPage() {
  const navigate = useNavigate()

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['adminLessons'],
    queryFn: () => lessonsApi.getAdminList().then((r) => r.data),
  })

  const grouped = lessons?.reduce<Record<string, typeof lessons>>((acc, l) => {
    const key = l.languageName
    if (!acc[key]) acc[key] = []
    acc[key].push(l)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Teoría</h1>
          <p className="text-gray-500">Administrar contenido teórico de las lecciones</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-8">
          {grouped &&
            Object.entries(grouped).map(([langName, items]) => (
              <div key={langName}>
                <h2 className="mb-3 text-lg font-semibold text-gray-700">
                  📚 {langName}
                </h2>
                <div className="space-y-2">
                  {items.map((lesson) => (
                    <Card
                      key={lesson.id}
                      onClick={() => navigate(`/admin/theory/${lesson.id}`)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                            lesson.hasTheory
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {lesson.hasTheory ? '✓' : '—'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                          <p className="text-sm text-gray-500">
                            Nivel {lesson.level} · {lesson.xpReward} XP ·{' '}
                            {lesson.exerciseCount} ejercicios
                          </p>
                        </div>
                      </div>
                      <div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            lesson.hasTheory
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {lesson.hasTheory ? 'Teoría guardada' : 'Sin teoría'}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
