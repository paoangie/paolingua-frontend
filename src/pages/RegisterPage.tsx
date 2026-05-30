import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Button, Input } from '../components/ui'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      await register({ email, password, confirmPassword })
      addToast('Cuenta creada correctamente', 'success')
      navigate('/dashboard')
    } catch {
      setError('Error al registrarse. El email podría ya estar en uso.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-100">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-0 h-96 w-96 rounded-full bg-slate-300/60 blur-3xl" />

      <section className="relative hidden flex-1 items-center justify-center bg-slate-950 px-12 lg:flex">
        <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-80 w-80 rounded-full bg-slate-500/20 blur-3xl" />

        <div className="relative max-w-xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-200">
            <span className="h-2 w-2 rounded-full bg-teal-300" />
            Nueva cuenta de aprendizaje
          </div>

          <h1 className="text-6xl font-black leading-tight tracking-tight text-white">
            Empieza tu ruta de aprendizaje con una plataforma organizada.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Crea tu cuenta para acceder a idiomas, lecciones, ejercicios,
            progreso personalizado y práctica con apoyo inteligente.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400/10 text-sm font-black text-teal-300">
                01
              </div>

              <div>
                <p className="font-bold text-white">
                  Lecciones por idioma
                </p>
                <p className="text-sm text-slate-400">
                  Avanza de forma ordenada según tu progreso.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400/10 text-sm font-black text-teal-300">
                02
              </div>

              <div>
                <p className="font-bold text-white">
                  Ejercicios interactivos
                </p>
                <p className="text-sm text-slate-400">
                  Practica traducción, gramática y pronunciación.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400/10 text-sm font-black text-teal-300">
                03
              </div>

              <div>
                <p className="font-bold text-white">
                  Seguimiento de avance
                </p>
                <p className="text-sm text-slate-400">
                  Consulta nivel, XP, racha y lecciones completadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-screen w-full items-center justify-center px-5 py-10 lg:w-[520px] lg:px-10">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.15)] backdrop-blur-xl">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-2xl font-black text-white shadow-xl shadow-slate-900/20">
                P
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950">
                Crear cuenta
              </h2>

              <p className="mt-2 text-sm font-medium text-slate-500">
                Regístrate para empezar tu aprendizaje.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />

              <Input
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                required
              />

              <Input
                label="Confirmar contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                required
              />

              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                size="lg"
              >
                Crear cuenta
              </Button>
            </form>

            <div className="mt-7 text-center">
              <p className="text-sm text-slate-500">
                ¿Ya tienes cuenta?{' '}
                <Link
                  to="/login"
                  className="font-bold text-teal-700 transition-colors hover:text-teal-900"
                >
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs font-semibold text-slate-400">
            PaoLingua · Plataforma de aprendizaje de idiomas
          </p>
        </div>
      </section>
    </div>
  )
}