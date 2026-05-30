import { useState } from 'react'
import { Button, Modal } from '../ui'
import type { Exercise, ExerciseSubmitDto } from '../../types'

interface Props {
  exercise: Exercise
  onSubmit: (dto: ExerciseSubmitDto) => void
  isSubmitting: boolean
  feedback?: { score: number; feedback: string; correct: boolean } | null
  onFeedbackClose?: () => void
  isLastExercise?: boolean
}

export default function TranslationExercise({
  exercise,
  onSubmit,
  isSubmitting,
  feedback,
  onFeedbackClose,
  isLastExercise,
}: Props) {
  const [answer, setAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const content = exercise.content

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!answer.trim()) return

    onSubmit({
      userAnswer: answer.trim(),
      expectedPhrase: content.answer,
      timeSpentSeconds: 0,
    })
  }

  return (
    <div className="space-y-7">
      <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
          TR
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700">
          Traducción
        </p>

        <h2 className="mx-auto mt-4 max-w-xl text-2xl font-black leading-snug tracking-tight text-slate-950">
          {content.question}
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
          Escribe la traducción correcta de la frase y verifica tu respuesta.
        </p>
      </div>

      {!feedback && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Tu respuesta
            </label>

            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              autoFocus
              className="
                w-full rounded-2xl border border-slate-200 bg-white px-5 py-4
                text-center text-lg font-semibold text-slate-950 shadow-sm
                outline-none transition-all duration-300
                placeholder:text-slate-400
                focus:border-teal-600 focus:ring-4 focus:ring-teal-100
              "
            />
          </div>

          {content.hint && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
              >
                {showHint ? 'Ocultar pista' : 'Mostrar pista'}
              </button>

              {showHint && (
                <div className="mx-auto mt-3 max-w-md rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3">
                  <p className="text-sm leading-6 text-teal-800">
                    {content.hint}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!answer.trim()}
              size="lg"
            >
              Verificar respuesta
            </Button>
          </div>
        </form>
      )}

      <Modal
        isOpen={!!feedback}
        onClose={onFeedbackClose ?? (() => {})}
        title={feedback?.correct ? 'Respuesta correcta' : 'Revisar respuesta'}
      >
        <div className="space-y-5 text-center">
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-xl font-black ${
              feedback?.correct
                ? 'bg-teal-50 text-teal-800 ring-1 ring-teal-200'
                : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
            }`}
          >
            {feedback?.correct ? 'OK' : 'RE'}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-500">
              Puntuación
            </p>

            <p
              className={`mt-1 text-5xl font-black tracking-tight ${
                feedback?.correct ? 'text-teal-800' : 'text-slate-900'
              }`}
            >
              {feedback?.score}
              <span className="text-2xl text-slate-400">/100</span>
            </p>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                feedback?.correct ? 'bg-teal-700' : 'bg-slate-600'
              }`}
              style={{ width: `${feedback?.score ?? 0}%` }}
            />
          </div>

          {!feedback?.correct && content.answer && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Respuesta esperada
              </p>

              <p className="mt-2 font-bold text-slate-950">
                {content.answer}
              </p>
            </div>
          )}

          {feedback?.feedback && (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-sm leading-6 text-slate-600">
                {feedback.feedback}
              </p>
            </div>
          )}

          <button
            onClick={() => onFeedbackClose?.()}
            className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-teal-800"
          >
            {feedback?.correct
              ? 'Continuar'
              : isLastExercise
                ? 'Finalizar lección'
                : 'Siguiente ejercicio'}
          </button>
        </div>
      </Modal>
    </div>
  )
}