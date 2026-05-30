import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { lessonsApi } from '../api/lessons'
import { progressApi } from '../api/progress'
import { Card } from '../components/ui'

export default function LessonsPage() {
  const { languageId } = useParams<{ languageId: string }>()
  const navigate = useNavigate()
  const langId = Number(languageId)
  const isInvalidLanguage = Number.isNaN(langId)

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons', langId],
    queryFn: () => lessonsApi.getByLanguage(langId).then((r) => r.data),
    enabled: !isInvalidLanguage && !!langId,
  })

  const { data: langProgress } = useQuery({
    queryKey: ['progress', 'language', langId],
    queryFn: () => progressApi.getByLanguage(langId).then((r) => r.data),
    enabled: !isInvalidLanguage && !!langId,
  })

  if (isInvalidLanguage) {
    return (
      <div className="mx-auto max-w-lg py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-xl font-black text-slate-700">
          —
        </div>

        <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
          Idioma no válido
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          No se pudo identificar el idioma seleccionado.
        </p>

        <button
          onClick={() => navigate('/languages')}
          className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-teal-800"
        >
          Volver a idiomas
        </button>
      </div>
    )
  }

  if (lessonsLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-300 border-t-teal-700" />
      </div>
    )
  }

  const totalLessons = lessons?.length ?? 0

  const completedLessons =
    lessons?.filter((lesson) => {
      const progress = langProgress?.progress?.find(
        (item) => item.lessonId === lesson.id
      )

      return lesson.completed || progress?.completed
    }).length ?? 0

  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const currentLevel = langProgress?.currentLevel ?? 1

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-16 h-72 w-72 rounded-full bg-slate-500/20 blur-3xl" />

        <div className="relative">
          <button
            onClick={() => navigate('/languages')}
            className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition-all hover:bg-white/15"
          >
            ← Volver a idiomas
          </button>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-200">
                <span className="h-2 w-2 rounded-full bg-teal-300" />
                Ruta de aprendizaje
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                Lecciones disponibles
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Avanza por cada lección, revisa tu progreso y continúa
                practicando hasta completar este idioma.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-300">
                    Avance del idioma
                  </p>

                  <p className="mt-2 text-5xl font-black text-white">
                    {progressPercent}%
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-400">
                    Nivel
                  </p>

                  <p className="mt-1 text-3xl font-black text-teal-300">
                    {currentLevel}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>
                    {completedLessons} de {totalLessons} lecciones
                  </span>
                  <span>{progressPercent}%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {totalLessons > 0 ? (
        <section className="space-y-4">
          {lessons?.map((lesson, index) => {
            const progress = langProgress?.progress?.find(
              (item) => item.lessonId === lesson.id
            )

            const isCompleted = lesson.completed || progress?.completed
            const score = progress?.score ?? lesson.score ?? 0

            return (
              <Card
                key={lesson.id}
                onClick={() => navigate(`/lessons/${lesson.id}/theory`)}
                className="p-0"
              >
                <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-5">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${
                        isCompleted
                          ? 'bg-teal-50 text-teal-800 ring-1 ring-teal-200'
                          : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
                      }`}
                    >
                      {isCompleted ? 'OK' : String(index + 1).padStart(2, '0')}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-black tracking-tight text-slate-950">
                          {lesson.title}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                            isCompleted
                              ? 'border border-teal-200 bg-teal-50 text-teal-800'
                              : 'border border-slate-200 bg-slate-50 text-slate-500'
                          }`}
                        >
                          {isCompleted ? 'Completada' : 'Pendiente'}
                        </span>
                      </div>

                      <p className="mt-2 text-sm font-medium text-slate-500">
                        Nivel {lesson.level} · {lesson.xpReward} XP
                      </p>

                      <div className="mt-4 h-2 max-w-md overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isCompleted ? 'bg-teal-700' : 'bg-slate-300'
                          }`}
                          style={{ width: `${isCompleted ? 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-5 border-t border-slate-100 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Puntaje
                      </p>

                      <p className="mt-1 text-2xl font-black text-slate-950">
                        {score}
                        <span className="text-sm text-slate-400">/100</span>
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white transition-all group-hover:bg-teal-700">
                      →
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </section>
      ) : (
        <Card>
          <div className="py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-xl font-black text-slate-700">
              —
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-950">
              No hay lecciones disponibles
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Cuando existan lecciones registradas para este idioma, aparecerán
              en esta sección.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}