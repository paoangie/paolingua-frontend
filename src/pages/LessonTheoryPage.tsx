import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { lessonsApi } from '../api/lessons'
import { theoryApi } from '../api/theory'
import { Button, Card } from '../components/ui'
import VocabularySection from '../components/theory/VocabularySection'
import GrammarSection from '../components/theory/GrammarSection'
import PhrasesSection from '../components/theory/PhrasesSection'
import CulturalNoteSection from '../components/theory/CulturalNoteSection'

export default function LessonTheoryPage() {
  const { id } = useParams<{ id: string }>()
  const lessonId = Number(id)
  const navigate = useNavigate()

  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => lessonsApi.getById(lessonId).then((response) => response.data),
    enabled: !!lessonId,
  })

  const {
    data: theory,
    isLoading: theoryLoading,
    isError,
  } = useQuery({
    queryKey: ['theory', lessonId],
    queryFn: () =>
      theoryApi.getByLesson(lessonId).then((response) => response.data),
    enabled: !!lessonId,
  })

  if (lessonLoading || theoryLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-300 border-t-teal-700" />
      </div>
    )
  }

  if (isError || !theory) {
    return (
      <div className="mx-auto max-w-2xl py-20">
        <Card>
          <div className="py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-xl font-black text-slate-700">
              —
            </div>

            <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
              No hay teoría disponible
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Esta lección todavía no tiene contenido teórico registrado. Puedes
              continuar directamente a la práctica.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Volver
              </Button>

              <Button onClick={() => navigate(`/lessons/${lessonId}`)}>
                Ir a la práctica
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-16 h-72 w-72 rounded-full bg-slate-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition-all hover:bg-white/15"
            >
              ← Volver
            </button>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-200">
              <span className="h-2 w-2 rounded-full bg-teal-300" />
              Teoría de la lección
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              {theory.title || lesson?.title || 'Lección'}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              {theory.introduction ||
                'Revisa el contenido antes de comenzar la práctica.'}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 text-white backdrop-blur-xl">
            <p className="text-sm font-semibold text-slate-300">
              Preparación
            </p>

            <p className="mt-2 text-4xl font-black text-teal-300">
              {theory.sections.length}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              secciones disponibles
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        {theory.sections.map((section, index) => (
          <Card key={`${section.type}-${index}`}>
            {section.type === 'vocabulary' && (
              <VocabularySection section={section} />
            )}

            {section.type === 'grammar' && (
              <GrammarSection section={section} />
            )}

            {section.type === 'phrases' && (
              <PhrasesSection section={section} />
            )}

            {section.type === 'cultural_note' && (
              <CulturalNoteSection section={section} />
            )}
          </Card>
        ))}
      </section>

      {theory.summary && (
        <Card>
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            Resumen de la lección
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            {theory.summary}
          </p>
        </Card>
      )}

      <div className="flex flex-col gap-3 pb-8 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Volver
        </Button>

        <Button onClick={() => navigate(`/lessons/${lessonId}`)}>
          Comenzar práctica
        </Button>
      </div>
    </div>
  )
}