import { useState, useEffect } from 'react'
import { Button } from '../ui'
import useAudio from '../../hooks/useAudio'
import type { Exercise, ExerciseSubmitDto, FeedbackResponse } from '../../types'
import { pronunciationApi } from '../../api/pronunciation'

interface Props {
  exercise: Exercise; onSubmit: (dto: ExerciseSubmitDto) => void
  feedback?: { score: number; feedback: string; correct: boolean } | null
  onFeedbackClose?: () => void; isLastExercise?: boolean
}

export default function PronunciationExercise({ exercise, onSubmit, feedback: submitFeedback, onFeedbackClose, isLastExercise }: Props) {
  const { isRecording, isSupported, audioBase64, startRecording, stopRecording, error: audioError } = useAudio()
  const [aiFeedback, setAiFeedback] = useState<FeedbackResponse | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  const content = exercise.content

  useEffect(() => { if (audioBase64) setHasRecorded(true) }, [audioBase64])

  const handleRecordToggle = async () => {
    if (isRecording) { stopRecording() }
    else { setAiFeedback(null); setShowResult(false); setHasRecorded(false); await startRecording() }
  }

  const handleEvaluate = async () => {
    if (!audioBase64 || !content.phrase) return
    setIsProcessing(true)
    try {
      const { data } = await pronunciationApi.evaluate({ audioBase64, expectedPhrase: content.phrase, exerciseId: exercise.id })
      setAiFeedback(data); setShowResult(true)
      onSubmit({ userAnswer: data.recognizedText, expectedPhrase: content.phrase, timeSpentSeconds: 0 })
    } catch {
      setAiFeedback({
        recognizedText: 'No se pudo procesar el audio',
        score: 0,
        grammarFeedback: 'Hubo un error al analizar tu pronunciacion. Verifica tu microfono e intenta de nuevo.',
        suggestions: 'Intenta nuevamente'
      })
      setShowResult(true)
    } finally { setIsProcessing(false) }
  }

  const feedback = aiFeedback || submitFeedback
  const score = feedback?.score ?? 0

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-purple-50 to-cyan-50 p-6 text-center">
        <p className="text-sm font-medium text-purple-700 uppercase tracking-wide">Pronunciacion</p>
        <p className="mt-3 text-2xl font-bold text-gray-900">{content.phrase}</p>
        {content.hint && <p className="mt-2 text-sm text-gray-500">{content.hint}</p>}
      </div>
      {audioError && <div className="rounded-xl bg-red-50 p-4 text-center text-sm text-red-700">{audioError}</div>}
      {!showResult && !submitFeedback && (
        <div className="flex flex-col items-center gap-4">
          <button type="button" onClick={handleRecordToggle}
            className={`flex h-28 w-28 items-center justify-center rounded-full transition-all ${
              isRecording ? 'animate-pulse bg-red-500 shadow-xl shadow-red-300' : 'bg-purple-600 shadow-xl hover:bg-purple-700 hover:shadow-purple-200'
            }`}>
            {isRecording ? (
              <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            ) : (
              <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
            )}
          </button>
          <p className="text-sm font-medium text-gray-500">{isRecording ? 'Grabando... presiona para detener' : 'Presiona el microfono para grabar'}</p>
          {!isSupported && <p className="text-sm text-red-500">Tu navegador no soporta grabacion de audio</p>}
          {hasRecorded && !isRecording && <Button onClick={handleEvaluate} isLoading={isProcessing} size="lg">Evaluar pronunciacion</Button>}
        </div>
      )}
      {(showResult || submitFeedback) && (
        <div className="space-y-4 text-center">
          <div className={`rounded-xl p-6 ${score >= 70 ? 'bg-gradient-to-br from-green-50 to-purple-50' : 'bg-gradient-to-br from-orange-50 to-amber-50'}`}>
            <p className="text-3xl font-bold text-gray-900">{score}<span className="text-lg text-gray-400">/100</span></p>
            <div className="mx-auto mt-3 h-2 w-48 overflow-hidden rounded-full bg-gray-200">
              <div className={`h-full rounded-full ${score >= 70 ? 'bg-purple-500' : 'bg-amber-400'}`} style={{ width: `${score}%` }} />
            </div>
          </div>
          {aiFeedback && (
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Texto reconocido</p>
                <p className="font-medium text-gray-900">{aiFeedback.recognizedText}</p>
              </div>
              {aiFeedback.grammarFeedback && <div className="rounded-lg bg-gray-50 p-3 text-left text-sm text-gray-600">{aiFeedback.grammarFeedback}</div>}
              {aiFeedback.suggestions && <p className="text-sm font-medium text-gray-500">{aiFeedback.suggestions}</p>}
            </div>
          )}
          <button onClick={() => onFeedbackClose?.()} className="w-full rounded-xl bg-gray-900 px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800">
            {isLastExercise ? 'Finalizar leccion' : 'Siguiente'}
          </button>
        </div>
      )}
    </div>
  )
}
