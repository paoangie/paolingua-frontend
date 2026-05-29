import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { theoryApi } from '../api/theory'
import { lessonsApi } from '../api/lessons'
import VocabularySection from '../components/theory/VocabularySection'
import GrammarSection from '../components/theory/GrammarSection'
import PhrasesSection from '../components/theory/PhrasesSection'
import CulturalNoteSection from '../components/theory/CulturalNoteSection'
import { Button, Card } from '../components/ui'
import type { TheorySection } from '../types'

function renderSection(section: TheorySection) {
  switch (section.type) {
    case 'vocabulary':
      return <VocabularySection section={section} />
    case 'grammar':
      return <GrammarSection section={section} />
    case 'phrases':
      return <PhrasesSection section={section} />
    case 'cultural_note':
      return <CulturalNoteSection section={section} />
    default:
      return null
  }
}

export default function LessonTheoryPage() {
  const { id } = useParams<{ id: string }>()
  const lessonId = Number(id)
  const navigate = useNavigate()

  const { data: lesson } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => lessonsApi.getById(lessonId).then((r) => r.data),
    enabled: !!lessonId,
  })

  const { data: theory, isLoading, isError } = useQuery({
    queryKey: ['theory', lessonId],
    queryFn: () => theoryApi.getByLesson(lessonId).then((r) => r.data),
    enabled: !!lessonId,
  })

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
        <p className="text-red-500">Error al cargar la teoría</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>
    )
  }

  if (!theory) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">No hay teoría disponible para esta lección</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>
    )
  }

  const sectionTypes: Record<string, string> = {
    vocabulary: '📖',
    grammar: '✏️',
    phrases: '💬',
    cultural_note: '🌍',
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          ← Volver
        </button>
        <span className="text-sm text-gray-500">
          {lesson?.title ?? 'Lección'}
        </span>
      </div>

      <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-600 to-purple-800 p-8 text-white shadow-lg">
        <h1 className="text-2xl font-bold">{theory.title}</h1>
        <p className="mt-3 text-purple-100 leading-relaxed">{theory.introduction}</p>
      </div>

      {theory.sections.map((section, idx) => (
        <Card key={idx} className="p-6">
          {renderSection(section)}
        </Card>
      ))}

      {theory.summary && (
        <Card className="border-purple-200 bg-purple-50 p-6">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-purple-800">
            <span>📝</span> Resumen
          </h3>
          <p className="text-purple-700 leading-relaxed">{theory.summary}</p>
        </Card>
      )}

      <div className="flex justify-center pb-10">
        <Button
          size="lg"
          onClick={() => navigate(`/lessons/${lessonId}`)}
          className="px-8"
        >
          Comenzar práctica →
        </Button>
      </div>
    </div>
  )
}
