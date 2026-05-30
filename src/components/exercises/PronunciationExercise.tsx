import { useState, useEffect } from 'react'
import { Button } from '../ui'
import useAudio from '../../hooks/useAudio'
import type { Exercise, ExerciseSubmitDto, FeedbackResponse } from '../../types'
import { pronunciationApi } from '../../api/pronunciation'

interface Props {
  exercise: Exercise
  onSubmit: (dto: ExerciseSubmitDto) => void
  feedback?: { score: number; feedback: string; correct: boolean } | null
  onFeedbackClose?: () => void
  isLastExercise?: boolean
}

export default function PronunciationExercise({
  exercise,
  onSubmit,
  feedback: submitFeedback,
  onFeedbackClose,
  isLastExercise,
}: Props) {
  const {
    isRecording,
    isSupported,
    audioBase64,
    startRecording,
    stopRecording,
    error: audioError,
  } = useAudio()

  const [aiFeedback, setAiFeedback] = useState<FeedbackResponse | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)

  const content = exercise.content

  useEffect(() => {
    if (audioBase64) setHasRecorded(true)
  }, [audioBase64])

  const handleRecordToggle = async () => {
    if (isRecording) {
      stopRecording()
      return
    }

    setAiFeedback(null)
    setShowResult(false)
    setHasRecorded(false)
    await startRecording()
  }

  const handleEvaluate = async () => {
    if (!audioBase64 || !content.phrase) return

    setIsProcessing(true)

    try {
      const { data } = await pronunciationApi.evaluate({
        audioBase64,
        expectedPhrase: content.phrase,
        exerciseId: exercise.id,
      })

      setAiFeedback(data)
      setShowResult(true)

      onSubmit({
        userAnswer: data.recognizedText,
        expectedPhrase: content.phrase,
        timeSpentSeconds: 0,
      })
    } catch {
      setAiFeedback({
        recognizedText: 'No se pudo procesar el audio',
        score: 0,
        grammarFeedback:
          'Hubo un error al analizar tu pronunciación. Verifica tu micrófono e intenta nuevamente.',
        suggestions: 'Intenta grabar otra vez en un ambiente con menos ruido.',
      })

      setShowResult(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const feedback = aiFeedback || submitFeedback
  const score = feedback?.score ?? 0
  const isGoodScore = score >= 70

  return (
    <div className="space-y-7">
      <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
          PR
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">
          Pronunciación
        </p>

        <h2 className="mx-auto mt-4 max-w-xl text-2xl font-black leading-snug tracking-tight text-slate-950">
          {content.phrase}
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
          Graba tu voz y recibe una evaluación de pronunciación.
        </p>

        {content.hint && (
          <div className="mx-auto mt-4 max-w-md rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3">
            <p className="text-sm leading-6 text-teal-800">{content.hint}</p>
          </div>
        )}
      </div>

      {audioError && (
        <div className="rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-center text-sm font-semibold text-red-700">
          {audioError}
        </div>
      )}

      {!showResult && !submitFeedback && (
        <div className="flex flex-col items-center gap-5">
          <button
            type="button"
            onClick={handleRecordToggle}
            disabled={!isSupported || isProcessing}
            className={`
              relative flex h-32 w-32 items-center justify-center rounded-full
              border transition-all duration-300
              disabled:cursor-not-allowed disabled:opacity-60
              ${
                isRecording
                  ? 'border-red-200 bg-red-600 shadow-[0_18px_45px_rgba(220,38,38,0.25)]'
                  : 'border-slate-200 bg-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.20)] hover:-translate-y-1 hover:bg-teal-800'
              }
            `}
          >
            {isRecording && (
              <span className="absolute inset-0 animate-ping rounded-full bg-red-500/30" />
            )}

            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white">
              {isRecording ? (
                <svg
                  className="h-9 w-9"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg
                  className="h-9 w-9"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              )}
            </span>
          </button>

          <div className="text-center">
            <p className="text-sm font-bold text-slate-700">
              {isRecording
                ? 'Grabando audio'
                : hasRecorded
                  ? 'Audio grabado correctamente'
                  : 'Presiona para iniciar la grabación'}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {isRecording
                ? 'Presiona nuevamente para detener.'
                : 'Habla de forma clara y en un ambiente sin ruido.'}
            </p>
          </div>

          {!isSupported && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
              Tu navegador no soporta grabación de audio.
            </div>
          )}

          {hasRecorded && !isRecording && (
            <Button onClick={handleEvaluate} isLoading={isProcessing} size="lg">
              Evaluar pronunciación
            </Button>
          )}
        </div>
      )}

      {(showResult || submitFeedback) && (
        <div className="space-y-5 text-center">
          <div
            className={`rounded-[1.75rem] border p-6 ${
              isGoodScore
                ? 'border-teal-200 bg-teal-50'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-xl font-black ${
                isGoodScore
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-700 text-white'
              }`}
            >
              {isGoodScore ? 'OK' : 'RE'}
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">
              Puntuación
            </p>

            <p
              className={`mt-1 text-5xl font-black tracking-tight ${
                isGoodScore ? 'text-teal-900' : 'text-slate-900'
              }`}
            >
              {score}
              <span className="text-2xl text-slate-400">/100</span>
            </p>

            <div className="mx-auto mt-5 h-3 max-w-xs overflow-hidden rounded-full bg-white">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isGoodScore ? 'bg-teal-700' : 'bg-slate-600'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {aiFeedback && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Texto reconocido
                </p>

                <p className="mt-2 font-bold text-slate-950">
                  {aiFeedback.recognizedText}
                </p>
              </div>

              {aiFeedback.grammarFeedback && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                  <p className="text-sm leading-6 text-slate-600">
                    {aiFeedback.grammarFeedback}
                  </p>
                </div>
              )}

              {aiFeedback.suggestions && (
                <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4 text-left">
                  <p className="text-sm font-semibold text-teal-900">
                    Sugerencia
                  </p>

                  <p className="mt-1 text-sm leading-6 text-teal-800">
                    {aiFeedback.suggestions}
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => onFeedbackClose?.()}
            className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-teal-800"
          >
            {isLastExercise ? 'Finalizar lección' : 'Siguiente ejercicio'}
          </button>
        </div>
      )}
    </div>
  )
}