import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { lessonsApi } from '../api/lessons'
import { progressApi } from '../api/progress'
import { Card } from '../components/ui'

export default function LessonsPage() {
  const { languageId } = useParams<{ languageId: string }>()
  const navigate = useNavigate()
  const langId = Number(languageId)

  if (isNaN(langId)) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Idioma no valido</p>
        <button
          onClick={() => navigate('/languages')}
          className="mt-4 text-sm text-purple-600 hover:text-purple-700"
        >
          ← Volver a idiomas
        </button>
      </div>
    )
  }

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons', langId],
    queryFn: () => lessonsApi.getByLanguage(langId).then((r) => r.data),
    enabled: !!langId,
  })

  const { data: langProgress } = useQuery({
    queryKey: ['progress', 'language', langId],
    queryFn: () => progressApi.getByLanguage(langId).then((r) => r.data),
    enabled: !!langId,
  })

  if (lessonsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    )
  }

  const totalLessons = lessons?.length ?? 0
  const completedLessons =
    lessons?.filter((l) => l.completed || langProgress?.progress?.find((p) => p.lessonId === l.id)?.completed).length ?? 0
  const progressPercent =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate('/languages')}
          className="mb-2 text-sm text-purple-600 hover:text-purple-700"
        >
          ← Volver a idiomas
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Lecciones</h1>
        <p className="text-gray-500">
          {completedLessons}/{totalLessons} completadas
          {langProgress ? ` · Nivel ${langProgress.currentLevel}` : ''}
        </p>
      </div>

      {totalLessons > 0 && (
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-purple-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      <div className="space-y-3">
        {lessons?.map((lesson) => {
          const progress = langProgress?.progress?.find(
            (p) => p.lessonId === lesson.id
          )
          const isCompleted = progress?.completed ?? lesson.completed
          const score = progress?.score ?? lesson.score

          return (
            <Card
              key={lesson.id}
              onClick={() => navigate(`/lessons/${lesson.id}/theory`)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    isCompleted ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? (score != null && score >= 70 ? 'A' : 'B') : String(lesson.id)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Nivel {lesson.level} · {lesson.xpReward} XP
                  </p>
                </div>
              </div>
              <div className="text-right">
                {isCompleted && score != null && (
                  <p className="text-sm font-medium text-purple-600">
                    {score}/100
                  </p>
                )}
                {!isCompleted && (
                  <span className="text-sm text-gray-400">Pendiente</span>
                )}
              </div>
            </Card>
          )
        })}
        {lessons?.length === 0 && (
          <p className="py-8 text-center text-gray-500">
            No hay lecciones disponibles para este idioma
          </p>
        )}
      </div>
    </div>
  )
}
