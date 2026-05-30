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
      <div className="flex items-center justify-center py-24">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-300 border-t-teal-700" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_22px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-slate-200/60 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              Catálogo de idiomas
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Elige tu idioma
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Selecciona el idioma que deseas practicar y continúa con tus
              lecciones, ejercicios y progreso personalizado.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-950 px-6 py-5 text-white shadow-lg shadow-slate-900/15">
            <p className="text-sm font-semibold text-slate-300">
              Idiomas disponibles
            </p>
            <p className="mt-1 text-4xl font-black text-teal-300">
              {languages?.length ?? 0}
            </p>
          </div>
        </div>
      </section>

      {languages && languages.length > 0 ? (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {languages.map((lang) => (
            <Card
              key={lang.id}
              onClick={() => navigate(`/languages/${lang.id}/lessons`)}
              className="p-0"
            >
              <div className="p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-lg font-black uppercase text-slate-900">
                    {lang.code}
                  </div>

                  <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-800">
                    Disponible
                  </span>
                </div>

                <h3 className="text-2xl font-black tracking-tight text-slate-950">
                  {lang.name}
                </h3>

                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-400">
                  Código: {lang.code}
                </p>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm leading-6 text-slate-600">
                    Accede a las lecciones disponibles, practica ejercicios y
                    revisa tu avance dentro de este idioma.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-sm font-semibold text-slate-500">
                    Ver lecciones
                  </span>

                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white transition-all group-hover:bg-teal-700">
                    →
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </section>
      ) : (
        <Card>
          <div className="py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-xl font-black text-slate-700">
              —
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-950">
              No hay idiomas disponibles
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Cuando se registren idiomas en el sistema, aparecerán en esta
              sección.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}