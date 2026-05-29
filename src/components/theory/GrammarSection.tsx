import type { GrammarSection as GrammarSectionType } from '../../types'

interface Props {
  section: GrammarSectionType
}

export default function GrammarSection({ section }: Props) {
  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
        <span className="text-xl">✏️</span> {section.title}
      </h3>
      <div className="space-y-4">
        {section.rules.map((rule, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm"
          >
            <p className="mb-3 text-gray-700">{rule.explanation}</p>
            <div className="mb-3 space-y-1">
              {rule.examples.map((ex, i) => (
                <p key={i} className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-purple-700 border border-purple-100">
                  {ex}
                </p>
              ))}
            </div>
            {rule.tip && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-100 p-3">
                <span className="text-amber-600 text-sm">💡</span>
                <p className="text-sm text-amber-800">{rule.tip}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
