import type { GrammarSection as GrammarSectionType } from '../../types'

interface Props {
  section: GrammarSectionType
}

export default function GrammarSection({ section }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-3 text-3xl font-black tracking-tight text-slate-950">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-900/20">
            GR
          </span>

          {section.title}
        </h3>

        <p className="mt-2 text-sm font-medium text-slate-500">
          Revisa las reglas gramaticales y observa los ejemplos de uso.
        </p>
      </div>

      <div className="space-y-5">
        {section.rules.map((rule, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
          >
            <div className="border-b border-slate-100 bg-slate-950 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-black uppercase tracking-wide text-teal-300">
                  Regla {String(index + 1).padStart(2, '0')}
                </p>

                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-300">
                  Gramática
                </span>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                  Explicación
                </p>

                <p className="mt-3 text-base leading-7 text-slate-700">
                  {rule.explanation}
                </p>
              </div>

              {rule.examples.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">
                    Ejemplos
                  </p>

                  <div className="grid gap-3">
                    {rule.examples.map((example, exampleIndex) => (
                      <div
                        key={exampleIndex}
                        className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3"
                      >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-xs font-black text-white">
                          {exampleIndex + 1}
                        </span>

                        <p className="text-sm font-semibold leading-6 text-teal-950">
                          {example}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rule.tip && (
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
                    Consejo
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {rule.tip}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}