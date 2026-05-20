import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { languagesApi } from '../api/languages'
import { Card } from '../components/ui'

export default function LanguagesPage() {
  const navigate = useNavigate()

  const { data: languages, isLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: () => languagesApi.getAll().then((r) => r.data),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Idiomas</h1>
        <p className="text-gray-500">
          Selecciona un idioma para empezar a aprender
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {languages?.map((lang) => (
          <Card
            key={lang.id}
            onClick={() => navigate(`/languages/${lang.id}/lessons`)}
            className="flex items-center gap-4 p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-lg font-bold text-purple-700 uppercase">
              {lang.code}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {lang.name}
              </h3>
              <p className="text-sm text-gray-500 uppercase">{lang.code}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
