import { useState, useCallback, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { exercisesApi } from '../api/exercises'
import { progressApi } from '../api/progress'
import ExerciseRenderer from '../components/exercises/ExerciseRenderer'
import { useToast } from '../context/ToastContext'
import { Button, Card } from '../components/ui'
import type { ExerciseSubmitDto, SubmitResponse } from '../types'

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const lessonId = Number(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const advanceTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

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
    return () => { if (advanceTimer.current) clearTimeout(advanceTimer.current) }
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
      setSubmitError('Error al completar la leccion.')
    },
  })

  const exCount = exercises?.length ?? 0
  const isLastExercise = currentIndex >= exCount - 1
  const currentExercise = exercises?.[currentIndex]
  const currentResult = results[currentIndex]

  const finish = useCallback(() => {
    if (!exercises || results.length === 0) return
    const total = results.reduce((s, r) => s + r.score, 0)
    completeMutation.mutate(Math.round(total / exercises.length))
  }, [exercises, results, completeMutation])

  const advance = useCallback(() => {
    setShowFeedback(false)
    if (!exercises) return
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1)
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
      submitMutation.mutate({ exerciseId: currentExercise.id, dto: enrichedDto })
    },
    [currentExercise, submitMutation]
  )

  const handleFeedbackClose = useCallback(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    advance()
  }, [advance])

  useEffect(() => {
    if (!currentResult || !showFeedback) return
    if (advanceTimer.current) clearTimeout(advanceTimer.current)
    if (currentResult.correct) {
      advanceTimer.current = setTimeout(advance, 1200)
    }
    return () => { if (advanceTimer.current) clearTimeout(advanceTimer.current) }
  }, [currentIndex, showFeedback, advance])

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
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500">Error al cargar los ejercicios</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>
    )
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">No hay ejercicios en esta leccion</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/languages')}>
          Ir a idiomas
        </Button>
      </div>
    )
  }

  if (lessonComplete && lessonResult) {
    const avgScore = results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
      : 0

    return (
      <div className="mx-auto max-w-lg py-10">
        <Card className="text-center">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold ${
            avgScore >= 70 ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {avgScore >= 70 ? 'A' : 'B'}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {avgScore >= 70 ? 'Leccion completada' : 'Sigue practicando'}
          </h2>
          <p className="mt-2 text-gray-500">{lessonResult.message}</p>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
              <span className="text-gray-600">Puntaje promedio</span>
              <span className="font-semibold">{avgScore}/100</span>
            </div>
            <div className="flex justify-between rounded-lg bg-purple-50 px-4 py-3">
              <span className="text-purple-700">XP ganados</span>
              <span className="font-semibold text-purple-700">+{lessonResult.xpEarned}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <Button variant="outline" onClick={handleRetry}>Reintentar</Button>
            {lessonResult.nextLessonId ? (
              <Button onClick={() => navigate(`/lessons/${lessonResult.nextLessonId}`)}>
                Siguiente: {lessonResult.nextLessonTitle}
              </Button>
            ) : (
              <Button onClick={() => navigate('/languages')}>Mas lecciones</Button>
            )}
          </div>
        </Card>
      </div>
    )
  }

  const safeIndex = Math.min(currentIndex, exCount - 1)
  const safeExCount = Math.max(exCount, 1)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-sm text-purple-600 hover:text-purple-700">
          ← Volver
        </button>
        <span className="text-sm text-gray-500">
          Ejercicio {safeIndex + 1} de {safeExCount}
        </span>
      </div>

      <div className="flex gap-1">
        {exercises.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 flex-1 rounded-full ${
              idx < currentIndex
                ? results[idx]?.correct ? 'bg-purple-500' : 'bg-amber-400'
                : idx === currentIndex ? 'bg-purple-300' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {submitError && (
        <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-700">{submitError}</div>
      )}

      <Card className="p-8">
        {currentExercise && (
          <ExerciseRenderer
            key={currentExercise.id + (currentResult ? '-done' : '')}
            exercise={currentExercise}
            onSubmit={handleSubmit}
            isSubmitting={submitMutation.isPending}
            feedback={currentResult && showFeedback ? {
              score: currentResult.score,
              feedback: currentResult.feedback,
              correct: currentResult.correct,
            } : null}
            onFeedbackClose={handleFeedbackClose}
            isLastExercise={isLastExercise}
          />
        )}
      </Card>
    </div>
  )
}
