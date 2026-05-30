import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { lessonsApi } from '../api/lessons'
import { theoryApi } from '../api/theory'
import { Button, Card, Input } from '../components/ui'
import { useToast } from '../context/ToastContext'
import type {
  TheoryContent,
  VocabularyItem,
  GrammarRule,
  PhraseItem,
} from '../types'

const EMPTY_VOCAB: VocabularyItem = {
  term: '',
  translation: '',
  pronunciation: '',
  example: '',
}

const EMPTY_GRAMMAR: GrammarRule = {
  explanation: '',
  examples: [''],
  tip: '',
}

const EMPTY_PHRASE: PhraseItem = {
  phrase: '',
  translation: '',
  context: '',
}

export default function AdminTheoryEditPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const id = Number(lessonId)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  const [theory, setTheory] = useState<TheoryContent | null>(null)

  const { data: lesson } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonsApi.getById(id).then((response) => response.data),
    enabled: !!id,
  })

  const { data: fetchedTheory, isLoading } = useQuery({
    queryKey: ['theory', id, 'admin'],
    queryFn: () => theoryApi.getByLesson(id).then((response) => response.data),
    enabled: !!id,
  })

  useEffect(() => {
    if (fetchedTheory) {
      setTheory(fetchedTheory)
    }
  }, [fetchedTheory])

  const saveMutation = useMutation({
    mutationFn: (updatedTheory: TheoryContent) =>
      lessonsApi.updateTheory(id, updatedTheory),

    onSuccess: () => {
      addToast('Teoría guardada correctamente', 'success')
      queryClient.invalidateQueries({ queryKey: ['adminLessons'] })
      queryClient.invalidateQueries({ queryKey: ['theory'] })
    },

    onError: () => {
      addToast('Error al guardar la teoría', 'error')
    },
  })

  if (isLoading || !theory) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-300 border-t-teal-700" />
      </div>
    )
  }

  const updateTheory = (patch: Partial<TheoryContent>) => {
    setTheory((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  const updateSection = (sectionIndex: number, patch: Record<string, unknown>) => {
    setTheory((prev) => {
      if (!prev) return prev

      const sections = [...prev.sections]
      sections[sectionIndex] = {
        ...sections[sectionIndex],
        ...patch,
      } as typeof sections[number]

      return { ...prev, sections }
    })
  }

  const removeSection = (sectionIndex: number) => {
    setTheory((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        sections: prev.sections.filter((_, index) => index !== sectionIndex),
      }
    })
  }

  const addSection = (type: string) => {
    const defaults: Record<string, TheoryContent['sections'][number]> = {
      vocabulary: {
        type: 'vocabulary',
        title: 'Vocabulario clave',
        items: [{ ...EMPTY_VOCAB }],
      },
      grammar: {
        type: 'grammar',
        title: 'Reglas gramaticales',
        rules: [{ ...EMPTY_GRAMMAR }],
      },
      phrases: {
        type: 'phrases',
        title: 'Frases útiles',
        phrases: [{ ...EMPTY_PHRASE }],
      },
      cultural_note: {
        type: 'cultural_note',
        title: 'Nota cultural',
        content: '',
      },
    }

    setTheory((prev) => {
      if (!prev || !defaults[type]) return prev

      return {
        ...prev,
        sections: [...prev.sections, defaults[type]],
      }
    })
  }

  const addVocabItem = (sectionIndex: number) => {
    setTheory((prev) => {
      if (!prev) return prev

      const sections = [...prev.sections]
      const section = sections[sectionIndex]

      if (section.type === 'vocabulary') {
        sections[sectionIndex] = {
          ...section,
          items: [...section.items, { ...EMPTY_VOCAB }],
        }
      }

      return { ...prev, sections }
    })
  }

  const updateVocabItem = (
    sectionIndex: number,
    itemIndex: number,
    patch: Partial<VocabularyItem>
  ) => {
    setTheory((prev) => {
      if (!prev) return prev

      const sections = [...prev.sections]
      const section = sections[sectionIndex]

      if (section.type === 'vocabulary') {
        const items = [...section.items]
        items[itemIndex] = { ...items[itemIndex], ...patch }

        sections[sectionIndex] = { ...section, items }
      }

      return { ...prev, sections }
    })
  }

  const removeVocabItem = (sectionIndex: number, itemIndex: number) => {
    setTheory((prev) => {
      if (!prev) return prev

      const sections = [...prev.sections]
      const section = sections[sectionIndex]

      if (section.type === 'vocabulary') {
        sections[sectionIndex] = {
          ...section,
          items: section.items.filter((_, index) => index !== itemIndex),
        }
      }

      return { ...prev, sections }
    })
  }

  const addGrammarRule = (sectionIndex: number) => {
    setTheory((prev) => {
      if (!prev) return prev

      const sections = [...prev.sections]
      const section = sections[sectionIndex]

      if (section.type === 'grammar') {
        sections[sectionIndex] = {
          ...section,
          rules: [...section.rules, { ...EMPTY_GRAMMAR }],
        }
      }

      return { ...prev, sections }
    })
  }

  const updateGrammarRule = (
    sectionIndex: number,
    ruleIndex: number,
    patch: Partial<GrammarRule>
  ) => {
    setTheory((prev) => {
      if (!prev) return prev

      const sections = [...prev.sections]
      const section = sections[sectionIndex]

      if (section.type === 'grammar') {
        const rules = [...section.rules]
        rules[ruleIndex] = { ...rules[ruleIndex], ...patch }

        sections[sectionIndex] = { ...section, rules }
      }

      return { ...prev, sections }
    })
  }

  const updateGrammarExample = (
    sectionIndex: number,
    ruleIndex: number,
    exampleIndex: number,
    value: string
  ) => {
    setTheory((prev) => {
      if (!prev) return prev

      const sections = [...prev.sections]
      const section = sections[sectionIndex]

      if (section.type === 'grammar') {
        const rules = [...section.rules]
        const examples = [...rules[ruleIndex].examples]
        examples[exampleIndex] = value

        rules[ruleIndex] = {
          ...rules[ruleIndex],
          examples,
        }

        sections[sectionIndex] = { ...section, rules }
      }

      return { ...prev, sections }
    })
  }

  const addGrammarExample = (sectionIndex: number, ruleIndex: number) => {
    setTheory((prev) => {
      if (!prev) return prev

      const sections = [...prev.sections]
      const section = sections[sectionIndex]

      if (section.type === 'grammar') {
        const rules = [...section.rules]
        rules[ruleIndex] = {
          ...rules[ruleIndex],
          examples: [...rules[ruleIndex].examples, ''],
        }

        sections[sectionIndex] = { ...section, rules }
      }

      return { ...prev, sections }
    })
  }

  const removeGrammarRule = (sectionIndex: number, ruleIndex: number) => {
    setTheory((prev) => {
      if (!prev) return prev

      const sections = [...prev.sections]
      const section = sections[sectionIndex]

      if (section.type === 'grammar') {
        sections[sectionIndex] = {
          ...section,
          rules: section.rules.filter((_, index) => index !== ruleIndex),
        }
      }

      return { ...prev, sections }
    })
  }

  const addPhraseItem = (sectionIndex: number) => {
    setTheory((prev) => {
      if (!prev) return prev

      const sections = [...prev.sections]
      const section = sections[sectionIndex]

      if (section.type === 'phrases') {
        sections[sectionIndex] = {
          ...section,
          phrases: [...section.phrases, { ...EMPTY_PHRASE }],
        }
      }

      return { ...prev, sections }
    })
  }

  const updatePhraseItem = (
    sectionIndex: number,
    phraseIndex: number,
    patch: Partial<PhraseItem>
  ) => {
    setTheory((prev) => {
      if (!prev) return prev

      const sections = [...prev.sections]
      const section = sections[sectionIndex]

      if (section.type === 'phrases') {
        const phrases = [...section.phrases]
        phrases[phraseIndex] = { ...phrases[phraseIndex], ...patch }

        sections[sectionIndex] = { ...section, phrases }
      }

      return { ...prev, sections }
    })
  }

  const removePhraseItem = (sectionIndex: number, phraseIndex: number) => {
    setTheory((prev) => {
      if (!prev) return prev

      const sections = [...prev.sections]
      const section = sections[sectionIndex]

      if (section.type === 'phrases') {
        sections[sectionIndex] = {
          ...section,
          phrases: section.phrases.filter((_, index) => index !== phraseIndex),
        }
      }

      return { ...prev, sections }
    })
  }

  const handleSave = () => {
    if (!theory) return
    saveMutation.mutate(theory)
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <button
              onClick={() => navigate('/admin/theory')}
              className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition-all hover:bg-white/15"
            >
              ← Volver a gestión
            </button>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-200">
              <span className="h-2 w-2 rounded-full bg-teal-300" />
              Editor administrativo
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Editar teoría
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              {lesson?.title ?? `Lección ${id}`}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white outline-none backdrop-blur-xl"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) addSection(e.target.value)
                e.target.value = ''
              }}
            >
              <option value="" disabled className="text-slate-900">
                Agregar sección
              </option>
              <option value="vocabulary" className="text-slate-900">
                Vocabulario
              </option>
              <option value="grammar" className="text-slate-900">
                Gramática
              </option>
              <option value="phrases" className="text-slate-900">
                Frases
              </option>
              <option value="cultural_note" className="text-slate-900">
                Nota cultural
              </option>
            </select>

            <Button onClick={handleSave} isLoading={saveMutation.isPending}>
              Guardar teoría
            </Button>
          </div>
        </div>
      </section>

      <Card>
        <div className="grid gap-5 lg:grid-cols-2">
          <Input
            label="Título de la teoría"
            value={theory.title}
            onChange={(e) => updateTheory({ title: e.target.value })}
            placeholder="Ejemplo: Saludos y presentaciones"
          />

          <Input
            label="Resumen"
            value={theory.summary}
            onChange={(e) => updateTheory({ summary: e.target.value })}
            placeholder="Resumen breve de la lección"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Introducción
          </label>

          <textarea
            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            rows={4}
            value={theory.introduction}
            onChange={(e) => updateTheory({ introduction: e.target.value })}
            placeholder="Explica brevemente qué aprenderá el estudiante en esta lección."
          />
        </div>
      </Card>

      <section className="space-y-6">
        {theory.sections.map((section, sectionIndex) => (
          <Card key={`${section.type}-${sectionIndex}`} className="p-0">
            <div className="border-b border-slate-200 bg-slate-950 px-6 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/20 text-sm font-black text-teal-200">
                    {String(sectionIndex + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-300">
                      {section.type}
                    </p>

                    <input
                      value={section.title}
                      onChange={(e) =>
                        updateSection(sectionIndex, { title: e.target.value })
                      }
                      className="mt-1 w-full bg-transparent text-xl font-black text-white outline-none placeholder:text-slate-500"
                      placeholder="Título de sección"
                    />
                  </div>
                </div>

                <button
                  onClick={() => removeSection(sectionIndex)}
                  className="w-fit rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-200 transition-all hover:bg-red-500/20"
                >
                  Eliminar sección
                </button>
              </div>
            </div>

            <div className="p-6">
              {section.type === 'vocabulary' && (
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <p className="text-sm font-black text-slate-700">
                          Término {itemIndex + 1}
                        </p>

                        <button
                          onClick={() =>
                            removeVocabItem(sectionIndex, itemIndex)
                          }
                          className="text-sm font-bold text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          label="Término"
                          value={item.term}
                          onChange={(e) =>
                            updateVocabItem(sectionIndex, itemIndex, {
                              term: e.target.value,
                            })
                          }
                          placeholder="Hello"
                        />

                        <Input
                          label="Traducción"
                          value={item.translation}
                          onChange={(e) =>
                            updateVocabItem(sectionIndex, itemIndex, {
                              translation: e.target.value,
                            })
                          }
                          placeholder="Hola"
                        />

                        <Input
                          label="Pronunciación"
                          value={item.pronunciation}
                          onChange={(e) =>
                            updateVocabItem(sectionIndex, itemIndex, {
                              pronunciation: e.target.value,
                            })
                          }
                          placeholder="/həˈloʊ/"
                        />

                        <Input
                          label="Ejemplo"
                          value={item.example}
                          onChange={(e) =>
                            updateVocabItem(sectionIndex, itemIndex, {
                              example: e.target.value,
                            })
                          }
                          placeholder="Hello, how are you?"
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addVocabItem(sectionIndex)}
                  >
                    Agregar término
                  </Button>
                </div>
              )}

              {section.type === 'grammar' && (
                <div className="space-y-4">
                  {section.rules.map((rule, ruleIndex) => (
                    <div
                      key={ruleIndex}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <p className="text-sm font-black text-slate-700">
                          Regla {ruleIndex + 1}
                        </p>

                        <button
                          onClick={() =>
                            removeGrammarRule(sectionIndex, ruleIndex)
                          }
                          className="text-sm font-bold text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">
                            Explicación
                          </label>

                          <textarea
                            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            rows={3}
                            value={rule.explanation}
                            onChange={(e) =>
                              updateGrammarRule(sectionIndex, ruleIndex, {
                                explanation: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-bold text-slate-700">
                            Ejemplos
                          </label>

                          <div className="space-y-2">
                            {rule.examples.map((example, exampleIndex) => (
                              <Input
                                key={exampleIndex}
                                value={example}
                                onChange={(e) =>
                                  updateGrammarExample(
                                    sectionIndex,
                                    ruleIndex,
                                    exampleIndex,
                                    e.target.value
                                  )
                                }
                                placeholder="Ejemplo gramatical"
                              />
                            ))}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={() =>
                              addGrammarExample(sectionIndex, ruleIndex)
                            }
                          >
                            Agregar ejemplo
                          </Button>
                        </div>

                        <Input
                          label="Consejo"
                          value={rule.tip}
                          onChange={(e) =>
                            updateGrammarRule(sectionIndex, ruleIndex, {
                              tip: e.target.value,
                            })
                          }
                          placeholder="Consejo práctico para el estudiante"
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addGrammarRule(sectionIndex)}
                  >
                    Agregar regla
                  </Button>
                </div>
              )}

              {section.type === 'phrases' && (
                <div className="space-y-4">
                  {section.phrases.map((phrase, phraseIndex) => (
                    <div
                      key={phraseIndex}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <p className="text-sm font-black text-slate-700">
                          Frase {phraseIndex + 1}
                        </p>

                        <button
                          onClick={() =>
                            removePhraseItem(sectionIndex, phraseIndex)
                          }
                          className="text-sm font-bold text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          label="Frase"
                          value={phrase.phrase}
                          onChange={(e) =>
                            updatePhraseItem(sectionIndex, phraseIndex, {
                              phrase: e.target.value,
                            })
                          }
                          placeholder="How are you?"
                        />

                        <Input
                          label="Traducción"
                          value={phrase.translation}
                          onChange={(e) =>
                            updatePhraseItem(sectionIndex, phraseIndex, {
                              translation: e.target.value,
                            })
                          }
                          placeholder="¿Cómo estás?"
                        />

                        <div className="md:col-span-2">
                          <Input
                            label="Contexto"
                            value={phrase.context}
                            onChange={(e) =>
                              updatePhraseItem(sectionIndex, phraseIndex, {
                                context: e.target.value,
                              })
                            }
                            placeholder="Saludo informal común"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addPhraseItem(sectionIndex)}
                  >
                    Agregar frase
                  </Button>
                </div>
              )}

              {section.type === 'cultural_note' && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Contenido
                  </label>

                  <textarea
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                    rows={5}
                    value={section.content}
                    onChange={(e) =>
                      updateSection(sectionIndex, {
                        content: e.target.value,
                      })
                    }
                    placeholder="Escribe la nota cultural de la lección."
                  />
                </div>
              )}
            </div>
          </Card>
        ))}
      </section>

      <div className="flex flex-col gap-3 pb-10 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={() => navigate('/admin/theory')}>
          Cancelar
        </Button>

        <Button onClick={handleSave} isLoading={saveMutation.isPending}>
          Guardar teoría
        </Button>
      </div>
    </div>
  )
}