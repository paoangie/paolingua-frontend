import { useState, useCallback, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { exercisesApi } from '../api/exercises'
import { progressApi } from '../api/progress'
import ExerciseRenderer from '../components/exercises/ExerciseRenderer'
import { useToast } from '../context/ToastContext'
import { Button, Card } from '../components/ui'
import type { ExerciseSubmitDto, SubmitResponse } from '../types'

function calculateAverageScore(results: SubmitResponse[]) {
  if (results.length === 0) return 0

  const totalScore = results.reduce(
    (sum, exerciseResult) => sum + exerciseResult.score,
    0
  )

  return Math.round(totalScore / results.length)
}

function calculateProgressPercent(currentIndex: number, totalExercises: number) {
  if (totalExercises <= 0) return 0

  return Math.round(((currentIndex + 1) / totalExercises) * 100)
}

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const lessonId = Number(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<SubmitResponse[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [lessonComplete, setLessonComplete] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [lessonResult, setLessonResult] = useState<{
    score: number
    xpEarned: number
    message: string
    nextLessonId?: number
    nextLessonTitle?: string
  } | null>(null)

  const { data: exercises, isLoading, isError } = useQuery({
    queryKey: ['exercises', lessonId],
    queryFn: () => exercisesApi.getByLesson(lessonId).then((r) => r.data),
    enabled: !!lessonId,
  })

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [])

  useEffect(() => {
    setCurrentIndex(0)
    setResults([])
    setShowFeedback(false)
    setLessonComplete(false)
    setLessonResult(null)
    setSubmitError(null)
  }, [lessonId])

  const submitMutation = useMutation({
    mutationFn: ({
      exerciseId,
      dto,
    }: {
      exerciseId: number
      dto: ExerciseSubmitDto
    }) => exercisesApi.submit(exerciseId, dto),
    onSuccess: (data) => {
      setResults((prev) => [...prev, data.data])
      setSubmitError(null)
      setShowFeedback(true)
    },
    onError: () => {
      setSubmitError('Error al enviar la respuesta. Intenta nuevamente.')
    },
  })

  const completeMutation = useMutation({
    mutationFn: (score: number) =>
      progressApi.completeLesson(lessonId, {
        score,
        completed: true,
        timeSpentSeconds: 0,
      }),
    onSuccess: (data) => {
      setLessonResult({
        score: data.data.score,
        xpEarned: data.data.xpEarned,
        message: data.data.message,
        nextLessonId: data.data.nextLessonId,
        nextLessonTitle: data.data.nextLessonTitle,
      })

      setLessonComplete(true)
      addToast(`+${data.data.xpEarned} XP ganados`, 'success')
      queryClient.invalidateQueries({ queryKey: ['progress'] })
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
    },
    onError: () => {
      setSubmitError('Error al completar la lección.')
    },
  })

  const totalExercises = exercises?.length ?? 0
  const isLastExercise = currentIndex >= totalExercises - 1
  const currentExercise = exercises?.[currentIndex]
  const currentExerciseResult = results[currentIndex]

  const finish = useCallback(() => {
    if (!exercises || results.length === 0) return

    const averageScore = calculateAverageScore(results)
    completeMutation.mutate(averageScore)
  }, [exercises, results, completeMutation])

  const advance = useCallback(() => {
    setShowFeedback(false)

    if (!exercises) return

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((index) => index + 1)
    } else {
      finish()
    }
  }, [currentIndex, exercises, finish])

  const handleSubmit = useCallback(
    (dto: ExerciseSubmitDto) => {
      if (!currentExercise) return

      setSubmitError(null)

      const enrichedDto: ExerciseSubmitDto = {
        ...dto,
        exerciseType: currentExercise.type,
        exerciseContent: JSON.stringify(currentExercise.content),
      }

      submitMutation.mutate({
        exerciseId: currentExercise.id,
        dto: enrichedDto,
      })
    },
    [currentExercise, submitMutation]
  )

  const handleFeedbackClose = useCallback(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advance()
  }, [advance])

  useEffect(() => {
    if (!currentExerciseResult || !showFeedback) return

    if (advanceTimer.current) clearTimeout(advanceTimer.current)

    if (currentExerciseResult.correct) {
      advanceTimer.current = setTimeout(advance, 1200)
    }

    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current)
    }
  }, [currentExerciseResult, showFeedback, advance])

  const handleRetry = () => {
    setCurrentIndex(0)
    setResults([])
    setLessonComplete(false)
    setLessonResult(null)
    setSubmitError(null)
    setShowFeedback(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-300 border-t-teal-700" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-xl font-black text-red-700">
          !
        </div>

        <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
          Error al cargar los ejercicios
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          No se pudieron obtener los ejercicios de esta lección.
        </p>

        <Button variant="outline" className="mt-6" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>
    )
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-xl font-black text-slate-700">
          —
        </div>

        <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
          No hay ejercicios disponibles
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Esta lección todavía no tiene ejercicios registrados.
        </p>

        <Button
          variant="outline"
          className="mt-6"
          onClick={() => navigate('/languages')}
        >
          Ir a idiomas
        </Button>
      </div>
    )
  }

  if (lessonComplete && lessonResult) {
    const averageScore = calculateAverageScore(results)
    const approved = averageScore >= 70

    return (
      <div className="mx-auto max-w-3xl py-8">
        <Card className="p-0">
          <div className="overflow-hidden rounded-3xl">
            <div className="bg-slate-950 px-8 py-10 text-center">
              <div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl text-3xl font-black ${
                  approved
                    ? 'bg-teal-400 text-slate-950'
                    : 'bg-slate-700 text-white'
                }`}
              >
                {approved ? 'OK' : 'RE'}
              </div>

              <h1 className="mt-6 text-3xl font-black tracking-tight text-white">
                {approved ? 'Lección completada' : 'Sigue practicando'}
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-300">
                {lessonResult.message}
              </p>
            </div>

            <div className="space-y-6 p-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Puntaje
                  </p>

                  <p className="mt-2 text-3xl font-black text-slate-950">
                    {averageScore}
                    <span className="text-base text-slate-400">/100</span>
                  </p>
                </div>

                <div className="rounded-3xl border border-teal-200 bg-teal-50 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                    XP ganados
                  </p>

                  <p className="mt-2 text-3xl font-black text-teal-900">
                    +{lessonResult.xpEarned}
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Ejercicios
                  </p>

                  <p className="mt-2 text-3xl font-black text-slate-950">
                    {results.length}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button variant="outline" onClick={handleRetry}>
                  Reintentar
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate(`/lessons/${lessonId}/theory`)}
                >
                  Repasar teoría
                </Button>

                {lessonResult.nextLessonId ? (
                  <Button
                    onClick={() =>
                      navigate(`/lessons/${lessonResult.nextLessonId}/theory`)
                    }
                  >
                    Siguiente lección
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/languages')}>
                    Ver más idiomas
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const safeIndex = Math.min(currentIndex, totalExercises - 1)
  const safeTotalExercises = Math.max(totalExercises, 1)
  const progressPercent = calculateProgressPercent(
    safeIndex,
    safeTotalExercises
  )

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-7 shadow-[0_24px_70px_rgba(15,23,42,0.20)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition-all hover:bg-white/15"
            >
              ← Volver
            </button>

            <h1 className="text-3xl font-black tracking-tight text-white">
              Práctica de lección
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Resuelve cada ejercicio y revisa tu avance antes de completar la
              lección.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] px-5 py-4 text-right backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Ejercicio
            </p>

            <p className="mt-1 text-3xl font-black text-white">
              {safeIndex + 1}
              <span className="text-lg text-slate-400">
                /{safeTotalExercises}
              </span>
            </p>
          </div>
        </div>

        <div className="relative mt-7">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Avance</span>
            <span>{progressPercent}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-2 sm:grid-cols-3">
        {exercises.map((_, index) => {
          const exerciseResult = results[index]
          const isDone = index < currentIndex
          const isCurrent = index === currentIndex

          return (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                isDone
                  ? exerciseResult?.correct
                    ? 'bg-teal-700'
                    : 'bg-slate-500'
                  : isCurrent
                    ? 'bg-slate-950'
                    : 'bg-slate-200'
              }`}
            />
          )
        })}
      </div>

      {submitError && (
        <div className="rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-center text-sm font-semibold text-red-700">
          {submitError}
        </div>
      )}

      <Card className="p-0">
        <div className="p-6 sm:p-8">
          {currentExercise && (
            <ExerciseRenderer
              key={
                currentExercise.id + (currentExerciseResult ? '-done' : '')
              }
              exercise={currentExercise}
              onSubmit={handleSubmit}
              isSubmitting={submitMutation.isPending}
              feedback={
                currentExerciseResult && showFeedback
                  ? {
                      score: currentExerciseResult.score,
                      feedback: currentExerciseResult.feedback,
                      correct: currentExerciseResult.correct,
                    }
                  : null
              }
              onFeedbackClose={handleFeedbackClose}
              isLastExercise={isLastExercise}
            />
          )}
        </div>
      </Card>
    </div>
  )
}