import type { CulturalNoteSection as CulturalNoteSectionType } from '../../types'

interface Props {
  section: CulturalNoteSectionType
}

export default function CulturalNoteSection({ section }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-3 text-3xl font-black tracking-tight text-slate-950">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-900/20">
            NC
          </span>

          {section.title}
        </h3>

        <p className="mt-2 text-sm font-medium text-slate-500">
          Comprende el contexto cultural relacionado con esta lección.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-teal-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-slate-200/70 blur-3xl" />

        <div className="relative border-b border-slate-100 bg-slate-950 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full border border-teal-300/20 bg-teal-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-200">
              Nota cultural
            </span>

            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-300">
              Contexto
            </span>
          </div>
        </div>

        <div className="relative p-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-base leading-8 text-slate-700">
              {section.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}