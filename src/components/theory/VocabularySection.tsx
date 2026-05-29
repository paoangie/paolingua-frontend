import { useState } from 'react'
import type { VocabularySection as VocabSectionType } from '../../types'

interface Props {
  section: VocabSectionType
}

export default function VocabularySection({ section }: Props) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})

  const toggleFlip = (idx: number) => {
    setFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
        <span className="text-xl">📖</span> {section.title}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {section.items.map((item, idx) => (
          <div
            key={idx}
            className="cursor-pointer rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm transition-all hover:shadow-md"
            onClick={() => toggleFlip(idx)}
          >
            {flipped[idx] ? (
              <div className="space-y-2">
                <p className="text-lg font-bold text-purple-700">{item.translation}</p>
                <p className="text-sm text-gray-500 italic">{item.example}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-purple-700">{item.term}</p>
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-600">
                    {item.pronunciation}
                  </span>
                </div>
                <p className="text-sm text-gray-500 italic">{item.example}</p>
                <p className="text-xs text-gray-400">Toca para ver traducción</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
