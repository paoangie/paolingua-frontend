import type { ComponentType } from 'react'
import TranslationExercise from './TranslationExercise'
import GrammarExercise from './GrammarExercise'
import PronunciationExercise from './PronunciationExercise'
import type {
  Exercise,
  ExerciseSubmitDto,
  ExerciseType,
} from '../../types'

interface Props {
  exercise: Exercise
  onSubmit: (dto: ExerciseSubmitDto) => void
  isSubmitting: boolean
  feedback?: { score: number; feedback: string; correct: boolean } | null
  onFeedbackClose?: () => void
  isLastExercise?: boolean
}

const exerciseStrategies: Record<ExerciseType, ComponentType<Props>> = {
  translation: TranslationExercise,
  grammar: GrammarExercise,
  pronunciation: PronunciationExercise,
}

function UnsupportedExercise({ type }: { type: string }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-xl font-black text-white">
        !
      </div>

      <h2 className="mt-5 text-xl font-black tracking-tight text-slate-950">
        Tipo de ejercicio no disponible
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        El sistema no reconoce este tipo de ejercicio:
      </p>

      <div className="mx-auto mt-4 inline-flex rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">
        {type}
      </div>
    </div>
  )
}

export default function ExerciseRenderer(props: Props) {
  const { exercise } = props
  const SelectedExercise = exerciseStrategies[exercise.type]

  if (!SelectedExercise) {
    return <UnsupportedExercise type={exercise.type} />
  }

  return <SelectedExercise {...props} />
}