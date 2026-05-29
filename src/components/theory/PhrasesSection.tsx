import type { PhrasesSection as PhrasesSectionType } from '../../types'

interface Props {
  section: PhrasesSectionType
}

export default function PhrasesSection({ section }: Props) {
  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
        <span className="text-xl">💬</span> {section.title}
      </h3>
      <div className="space-y-3">
        {section.phrases.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm"
          >
            <p className="text-lg font-semibold text-blue-700">{item.phrase}</p>
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-medium text-gray-800">Traducción:</span> {item.translation}
            </p>
            <p className="mt-1 text-xs text-gray-400 italic">Contexto: {item.context}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
