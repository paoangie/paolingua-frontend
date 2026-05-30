import { useState } from 'react'
import { motion } from 'framer-motion'

import type { VocabularySection as VocabSectionType } from '../../types'

interface Props {
  section: VocabSectionType
}

export default function VocabularySection({ section }: Props) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})

  const toggleFlip = (idx: number) => {
    setFlipped((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-3 text-3xl font-black text-slate-900">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
            📖
          </span>

          {section.title}
        </h3>

        <p className="mt-2 text-slate-500">
          Toca las tarjetas para descubrir traducciones.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {section.items.map((item, idx) => {
          const isFlipped = flipped[idx]

          return (
            <motion.button
              key={`${item.term}-${idx}`}
              type="button"
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleFlip(idx)}
              className="group relative h-[230px] w-full cursor-pointer text-left [perspective:1200px]"
            >
              <div
                className={`
                  relative h-full w-full rounded-[30px]
                  transition-transform duration-500
                  [transform-style:preserve-3d]
                  ${isFlipped ? '[transform:rotateY(180deg)]' : ''}
                `}
              >
                {/* FRONT */}
                <div
                  className="
                    absolute inset-0 rounded-[30px]
                    bg-gradient-to-br from-slate-950 via-slate-900 to-teal-800
                    p-6 text-white shadow-2xl
                    [backface-visibility:hidden]
                  "
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-200 backdrop-blur-xl">
                        Vocabulary
                      </span>

                      {item.pronunciation && (
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur-xl">
                          {item.pronunciation}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-4xl font-black tracking-tight text-white">
                        {item.term}
                      </h4>

                      {item.example && (
                        <p className="mt-3 text-sm leading-6 text-slate-300">
                          {item.example}
                        </p>
                      )}
                    </div>

                    <div className="text-sm font-bold text-teal-300">
                      Toca para traducir →
                    </div>
                  </div>
                </div>

                {/* BACK */}
                <div
                  className="
                    absolute inset-0 rounded-[30px]
                    bg-white p-6 shadow-2xl
                    [backface-visibility:hidden]
                    [transform:rotateY(180deg)]
                  "
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-800">
                        Traducción
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
                        ES
                      </span>
                    </div>

                    <div>
                      <h4 className="text-4xl font-black tracking-tight text-slate-950">
                        {item.translation}
                      </h4>

                      {item.example && (
                        <p className="mt-4 text-sm leading-6 text-slate-500">
                          {item.example}
                        </p>
                      )}
                    </div>

                    <div className="text-sm font-bold text-teal-700">
                      Toca para volver →
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}