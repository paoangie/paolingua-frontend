import type { CulturalNoteSection as CulturalNoteSectionType } from '../../types'

interface Props {
  section: CulturalNoteSectionType
}

export default function CulturalNoteSection({ section }: Props) {
  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
        <span className="text-xl">🌍</span> {section.title}
      </h3>
      <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-5 shadow-sm">
        <p className="text-gray-700 leading-relaxed">{section.content}</p>
      </div>
    </div>
  )
}
