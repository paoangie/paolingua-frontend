import TranslationExercise from './TranslationExercise'
import GrammarExercise from './GrammarExercise'
import PronunciationExercise from './PronunciationExercise'
import type { Exercise, ExerciseSubmitDto } from '../../types'

interface Props {
  exercise: Exercise
  onSubmit: (dto: ExerciseSubmitDto) => void
  isSubmitting: boolean
  feedback?: { score: number; feedback: string; correct: boolean } | null
  onFeedbackClose?: () => void
  isLastExercise?: boolean
}

export default function ExerciseRenderer(props: Props) {
  const { exercise } = props
  switch (exercise.type) {
    case 'translation': return <TranslationExercise {...props} />
    case 'grammar': return <GrammarExercise {...props} />
    case 'pronunciation': return <PronunciationExercise {...props} />
    default:
      return <div className="rounded-lg bg-yellow-50 p-6 text-center text-yellow-800">Tipo de ejercicio no soportado: {exercise.type}</div>
  }
}
