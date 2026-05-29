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

const EMPTY_VOCAB: VocabularyItem = { term: '', translation: '', pronunciation: '', example: '' }
const EMPTY_GRAMMAR: GrammarRule = { explanation: '', examples: [''], tip: '' }
const EMPTY_PHRASE: PhraseItem = { phrase: '', translation: '', context: '' }

export default function AdminTheoryEditPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const id = Number(lessonId)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  const [theory, setTheory] = useState<TheoryContent | null>(null)

  const { data: lesson } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => lessonsApi.getById(id).then((r) => r.data),
    enabled: !!id,
  })

  const { data: fetchedTheory, isLoading } = useQuery({
    queryKey: ['theory', id, 'admin'],
    queryFn: () => theoryApi.getByLesson(id).then((r) => r.data),
    enabled: !!id,
  })

  useEffect(() => {
    if (fetchedTheory) setTheory(fetchedTheory)
  }, [fetchedTheory])

  const saveMutation = useMutation({
    mutationFn: (t: TheoryContent) => lessonsApi.updateTheory(id, t),
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
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    )
  }

  const updateTheory = (patch: Partial<TheoryContent>) => {
    setTheory((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  const updateSection = (sectionIdx: number, patch: Record<string, unknown>) => {
    setTheory((prev) => {
      if (!prev) return prev
      const sections = [...prev.sections]
      sections[sectionIdx] = { ...sections[sectionIdx], ...patch } as typeof sections[0]
      return { ...prev, sections }
    })
  }

  const addVocabItem = (sectionIdx: number) => {
    setTheory((prev) => {
      if (!prev) return prev
      const sections = [...prev.sections]
      const s = sections[sectionIdx]
      if (s.type === 'vocabulary') {
        sections[sectionIdx] = { ...s, items: [...(s.items ?? []), { ...EMPTY_VOCAB }] }
      }
      return { ...prev, sections }
    })
  }

  const updateVocabItem = (sectionIdx: number, itemIdx: number, patch: Partial<VocabularyItem>) => {
    setTheory((prev) => {
      if (!prev) return prev
      const sections = [...prev.sections]
      const s = sections[sectionIdx]
      if (s.type === 'vocabulary' && s.items) {
        const items = [...s.items]
        items[itemIdx] = { ...items[itemIdx], ...patch }
        sections[sectionIdx] = { ...s, items } as typeof sections[0]
      }
      return { ...prev, sections }
    })
  }

  const removeVocabItem = (sectionIdx: number, itemIdx: number) => {
    setTheory((prev) => {
      if (!prev) return prev
      const sections = [...prev.sections]
      const s = sections[sectionIdx]
      if (s.type === 'vocabulary' && s.items) {
        sections[sectionIdx] = { ...s, items: s.items.filter((_, i) => i !== itemIdx) } as typeof sections[0]
      }
      return { ...prev, sections }
    })
  }

  const addGrammarRule = (sectionIdx: number) => {
    setTheory((prev) => {
      if (!prev) return prev
      const sections = [...prev.sections]
      const s = sections[sectionIdx]
      if (s.type === 'grammar') {
        sections[sectionIdx] = { ...s, rules: [...(s.rules ?? []), { ...EMPTY_GRAMMAR }] }
      }
      return { ...prev, sections }
    })
  }

  const updateGrammarRule = (sectionIdx: number, ruleIdx: number, patch: Partial<GrammarRule>) => {
    setTheory((prev) => {
      if (!prev) return prev
      const sections = [...prev.sections]
      const s = sections[sectionIdx]
      if (s.type === 'grammar' && s.rules) {
        const rules = [...s.rules]
        rules[ruleIdx] = { ...rules[ruleIdx], ...patch }
        sections[sectionIdx] = { ...s, rules } as typeof sections[0]
      }
      return { ...prev, sections }
    })
  }

  const updateGrammarExample = (sectionIdx: number, ruleIdx: number, exampleIdx: number, value: string) => {
    setTheory((prev) => {
      if (!prev) return prev
      const sections = [...prev.sections]
      const s = sections[sectionIdx]
      if (s.type === 'grammar' && s.rules) {
        const rules = [...s.rules]
        const examples = [...rules[ruleIdx].examples]
        examples[exampleIdx] = value
        rules[ruleIdx] = { ...rules[ruleIdx], examples }
        sections[sectionIdx] = { ...s, rules } as typeof sections[0]
      }
      return { ...prev, sections }
    })
  }

  const addGrammarExample = (sectionIdx: number, ruleIdx: number) => {
    setTheory((prev) => {
      if (!prev) return prev
      const sections = [...prev.sections]
      const s = sections[sectionIdx]
      if (s.type === 'grammar' && s.rules) {
        const rules = [...s.rules]
        rules[ruleIdx] = { ...rules[ruleIdx], examples: [...rules[ruleIdx].examples, ''] }
        sections[sectionIdx] = { ...s, rules } as typeof sections[0]
      }
      return { ...prev, sections }
    })
  }

  const removeGrammarRule = (sectionIdx: number, ruleIdx: number) => {
    setTheory((prev) => {
      if (!prev) return prev
      const sections = [...prev.sections]
      const s = sections[sectionIdx]
      if (s.type === 'grammar' && s.rules) {
        sections[sectionIdx] = { ...s, rules: s.rules.filter((_, i) => i !== ruleIdx) } as typeof sections[0]
      }
      return { ...prev, sections }
    })
  }

  const addPhraseItem = (sectionIdx: number) => {
    setTheory((prev) => {
      if (!prev) return prev
      const sections = [...prev.sections]
      const s = sections[sectionIdx]
      if (s.type === 'phrases') {
        sections[sectionIdx] = { ...s, phrases: [...(s.phrases ?? []), { ...EMPTY_PHRASE }] }
      }
      return { ...prev, sections }
    })
  }

  const updatePhraseItem = (sectionIdx: number, phraseIdx: number, patch: Partial<PhraseItem>) => {
    setTheory((prev) => {
      if (!prev) return prev
      const sections = [...prev.sections]
      const s = sections[sectionIdx]
      if (s.type === 'phrases' && s.phrases) {
        const phrases = [...s.phrases]
        phrases[phraseIdx] = { ...phrases[phraseIdx], ...patch }
        sections[sectionIdx] = { ...s, phrases } as typeof sections[0]
      }
      return { ...prev, sections }
    })
  }

  const removePhraseItem = (sectionIdx: number, phraseIdx: number) => {
    setTheory((prev) => {
      if (!prev) return prev
      const sections = [...prev.sections]
      const s = sections[sectionIdx]
      if (s.type === 'phrases' && s.phrases) {
        sections[sectionIdx] = { ...s, phrases: s.phrases.filter((_, i) => i !== phraseIdx) } as typeof sections[0]
      }
      return { ...prev, sections }
    })
  }

  const addSection = (type: string) => {
    const defaults: Record<string, object> = {
      vocabulary: { type: 'vocabulary', title: 'Vocabulario Clave', items: [{ ...EMPTY_VOCAB }] },
      grammar: { type: 'grammar', title: 'Reglas Gramaticales', rules: [{ ...EMPTY_GRAMMAR }] },
      phrases: { type: 'phrases', title: 'Frases Útiles', phrases: [{ ...EMPTY_PHRASE }] },
      cultural_note: { type: 'cultural_note', title: 'Nota Cultural', content: '' },
    }
    setTheory((prev) => {
      if (!prev) return prev
      return { ...prev, sections: [...prev.sections, defaults[type] as typeof prev.sections[0]] }
    })
  }

  const removeSection = (sectionIdx: number) => {
    setTheory((prev) => {
      if (!prev) return prev
      return { ...prev, sections: prev.sections.filter((_, i) => i !== sectionIdx) }
    })
  }

  const handleSave = () => {
    if (!theory) return
    saveMutation.mutate(theory)
  }

  const sectionLabels: Record<string, string> = {
    vocabulary: '📖 Vocabulario',
    grammar: '✏️ Gramática',
    phrases: '💬 Frases',
    cultural_note: '🌍 Nota Cultural',
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/admin/theory')}
            className="mb-1 text-sm text-purple-600 hover:text-purple-700"
          >
            ← Volver a gestión
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Editar teoría: {lesson?.title ?? `Lección ${id}`}
          </h1>
        </div>
        <div className="flex gap-3">
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
            onChange={(e) => {
              if (e.target.value) addSection(e.target.value)
              e.target.value = ''
            }}
            defaultValue=""
          >
            <option value="" disabled>
              + Agregar sección
            </option>
            <option value="vocabulary">📖 Vocabulario</option>
            <option value="grammar">✏️ Gramática</option>
            <option value="phrases">💬 Frases</option>
            <option value="cultural_note">🌍 Nota Cultural</option>
          </select>
          <Button onClick={handleSave} isLoading={saveMutation.isPending}>
            Guardar
          </Button>
        </div>
      </div>

      <Card>
        <Input
          label="Título"
          value={theory.title}
          onChange={(e) => updateTheory({ title: e.target.value })}
        />
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Introducción
          </label>
          <textarea
            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
            value={theory.introduction}
            onChange={(e) => updateTheory({ introduction: e.target.value })}
          />
        </div>
      </Card>

      {theory.sections.map((section, sIdx) => (
        <Card key={sIdx} className="relative">
          <button
            className="absolute right-4 top-4 text-sm text-red-500 hover:text-red-700"
            onClick={() => removeSection(sIdx)}
            title="Eliminar sección"
          >
            ✕ Eliminar
          </button>

          <div className="mb-4 flex items-center gap-2">
            <span className="text-xl">{sectionLabels[section.type]?.split(' ')[0]}</span>
            <Input
              className="flex-1"
              value={section.title}
              onChange={(e) => updateSection(sIdx, { title: e.target.value })}
            />
          </div>

          {section.type === 'vocabulary' && (
            <div className="space-y-4">
              {section.items?.map((item, iIdx) => (
                <div key={iIdx} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-2 flex justify-between">
                    <span className="text-xs font-medium text-gray-400">Término #{iIdx + 1}</span>
                    <button
                      className="text-xs text-red-500 hover:text-red-700"
                      onClick={() => removeVocabItem(sIdx, iIdx)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label="Término"
                      value={item.term}
                      onChange={(e) => updateVocabItem(sIdx, iIdx, { term: e.target.value })}
                      placeholder="Hello"
                    />
                    <Input
                      label="Traducción"
                      value={item.translation}
                      onChange={(e) => updateVocabItem(sIdx, iIdx, { translation: e.target.value })}
                      placeholder="Hola"
                    />
                    <Input
                      label="Pronunciación (IPA)"
                      value={item.pronunciation}
                      onChange={(e) => updateVocabItem(sIdx, iIdx, { pronunciation: e.target.value })}
                      placeholder="/həˈloʊ/"
                    />
                    <Input
                      label="Ejemplo"
                      value={item.example}
                      onChange={(e) => updateVocabItem(sIdx, iIdx, { example: e.target.value })}
                      placeholder="Hello, how are you?"
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addVocabItem(sIdx)}>
                + Agregar término
              </Button>
            </div>
          )}

          {section.type === 'grammar' && (
            <div className="space-y-4">
              {section.rules?.map((rule, rIdx) => (
                <div key={rIdx} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-2 flex justify-between">
                    <span className="text-xs font-medium text-gray-400">Regla #{rIdx + 1}</span>
                    <button
                      className="text-xs text-red-500 hover:text-red-700"
                      onClick={() => removeGrammarRule(sIdx, rIdx)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Explicación
                      </label>
                      <textarea
                        className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        rows={2}
                        value={rule.explanation}
                        onChange={(e) => updateGrammarRule(sIdx, rIdx, { explanation: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Ejemplos
                      </label>
                      {rule.examples.map((ex, eIdx) => (
                        <div key={eIdx} className="mb-1 flex gap-2">
                          <Input
                            value={ex}
                            onChange={(e) => updateGrammarExample(sIdx, rIdx, eIdx, e.target.value)}
                            placeholder="Ejemplo de uso"
                          />
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addGrammarExample(sIdx, rIdx)}
                      >
                        + Agregar ejemplo
                      </Button>
                    </div>
                    <Input
                      label="Tip / Consejo"
                      value={rule.tip}
                      onChange={(e) => updateGrammarRule(sIdx, rIdx, { tip: e.target.value })}
                      placeholder="Consejo práctico para recordar esta regla"
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addGrammarRule(sIdx)}>
                + Agregar regla
              </Button>
            </div>
          )}

          {section.type === 'phrases' && (
            <div className="space-y-4">
              {section.phrases?.map((item, pIdx) => (
                <div key={pIdx} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-2 flex justify-between">
                    <span className="text-xs font-medium text-gray-400">Frase #{pIdx + 1}</span>
                    <button
                      className="text-xs text-red-500 hover:text-red-700"
                      onClick={() => removePhraseItem(sIdx, pIdx)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label="Frase"
                      value={item.phrase}
                      onChange={(e) => updatePhraseItem(sIdx, pIdx, { phrase: e.target.value })}
                      placeholder="How are you?"
                    />
                    <Input
                      label="Traducción"
                      value={item.translation}
                      onChange={(e) => updatePhraseItem(sIdx, pIdx, { translation: e.target.value })}
                      placeholder="¿Cómo estás?"
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="Contexto de uso"
                        value={item.context}
                        onChange={(e) => updatePhraseItem(sIdx, pIdx, { context: e.target.value })}
                        placeholder="Saludo informal común"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addPhraseItem(sIdx)}>
                + Agregar frase
              </Button>
            </div>
          )}

          {section.type === 'cultural_note' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Contenido
              </label>
              <textarea
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
                value={section.content ?? ''}
                onChange={(e) => updateSection(sIdx, { content: e.target.value })}
              />
            </div>
          )}
        </Card>
      ))}

      <Card>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Resumen</label>
          <textarea
            className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
            value={theory.summary}
            onChange={(e) => updateTheory({ summary: e.target.value })}
          />
        </div>
      </Card>

      <div className="flex justify-end gap-3 pb-10">
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
