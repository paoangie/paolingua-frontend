import type { PhrasesSection as PhrasesSectionType } from '../../types'

interface Props {
  section: PhrasesSectionType
}

export default function PhrasesSection({ section }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-3 text-3xl font-black tracking-tight text-slate-950">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-900/20">
            FR
          </span>

          {section.title}
        </h3>

        <p className="mt-2 text-sm font-medium text-slate-500">
          Estudia frases útiles, su traducción y el contexto donde se aplican.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {section.phrases.map((item, index) => (
          <div
            key={index}
            className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]"
          >
            <div className="border-b border-slate-100 bg-slate-950 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-teal-300/20 bg-teal-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-200">
                  Frase {String(index + 1).padStart(2, '0')}
                </span>

                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-300">
                  Uso práctico
                </span>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Frase
                </p>

                <h4 className="mt-2 text-2xl font-black leading-snug tracking-tight text-slate-950">
                  {item.phrase}
                </h4>
              </div>

              <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                  Traducción
                </p>

                <p className="mt-2 text-base font-bold leading-6 text-teal-950">
                  {item.translation}
                </p>
              </div>

              {item.context && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Contexto
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.context}
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