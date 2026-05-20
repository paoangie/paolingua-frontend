import { useState } from 'react'
import { Button, Modal } from '../ui'
import type { Exercise, ExerciseSubmitDto } from '../../types'

interface Props {
  exercise: Exercise; onSubmit: (dto: ExerciseSubmitDto) => void; isSubmitting: boolean
  feedback?: { score: number; feedback: string; correct: boolean } | null
  onFeedbackClose?: () => void; isLastExercise?: boolean
}

export default function TranslationExercise({ exercise, onSubmit, isSubmitting, feedback, onFeedbackClose, isLastExercise }: Props) {
  const [answer, setAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const content = exercise.content

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim()) return
    onSubmit({ userAnswer: answer.trim(), expectedPhrase: content.answer, timeSpentSeconds: 0 })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-purple-50 to-amber-50 p-6 text-center">
        <p className="text-sm font-medium text-purple-700 uppercase tracking-wide">Traduccion</p>
        <p className="mt-3 text-2xl font-bold text-gray-900">{content.question}</p>
      </div>
      {!feedback && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)}
            placeholder="Escribe tu respuesta aqui..." autoFocus
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-center text-lg transition-all focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-100" />
          {content.hint && (
            <div className="text-center">
              <button type="button" onClick={() => setShowHint(!showHint)} className="text-sm text-purple-600 hover:text-purple-700">
                {showHint ? 'Ocultar pista' : 'Mostrar pista'}
              </button>
              {showHint && <p className="mt-2 text-sm text-gray-500">{content.hint}</p>}
            </div>
          )}
          <div className="flex justify-center">
            <Button type="submit" isLoading={isSubmitting} disabled={!answer.trim()} size="lg">Verificar respuesta</Button>
          </div>
        </form>
      )}
      <Modal isOpen={!!feedback} onClose={onFeedbackClose ?? (() => {})} title={feedback?.correct ? 'Correcto' : 'Incorrecto'}>
        <div className="space-y-4 text-center">
          <p className="text-sm text-gray-500">Puntuacion</p>
          <p className={`text-5xl font-bold ${feedback?.correct ? 'text-purple-600' : 'text-red-600'}`}>
            {feedback?.score}<span className="text-2xl text-gray-400">/100</span>
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div className={`h-full rounded-full transition-all ${feedback?.correct ? 'bg-purple-500' : 'bg-red-400'}`} style={{ width: `${feedback?.score ?? 0}%` }} />
          </div>
          {!feedback?.correct && content.answer && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Respuesta correcta</p>
              <p className="font-semibold text-gray-900">{content.answer}</p>
            </div>
          )}
          {feedback?.feedback && <p className="rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-600">{feedback.feedback}</p>}
          <button onClick={() => onFeedbackClose?.()} className="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800">
            {feedback?.correct ? 'Continuar' : isLastExercise ? 'Finalizar leccion' : 'Siguiente'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
