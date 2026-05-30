import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Button, Input } from '../components/ui'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, password })
      addToast('Sesión iniciada correctamente', 'success')
      navigate('/dashboard')
    } catch {
      setError('Credenciales inválidas. Verifica tu email o contraseña.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-100">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-slate-300/60 blur-3xl" />

      <section className="relative hidden flex-1 items-center justify-center bg-slate-950 px-12 lg:flex">
        <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-80 w-80 rounded-full bg-slate-500/20 blur-3xl" />

        <div className="relative max-w-xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-200">
            <span className="h-2 w-2 rounded-full bg-teal-300" />
            Plataforma de aprendizaje de idiomas
          </div>

          <h1 className="text-6xl font-black leading-tight tracking-tight text-white">
            Aprende idiomas con una experiencia más clara y organizada.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Accede a tus lecciones, practica ejercicios, revisa tu progreso y
            continúa desarrollando tus habilidades de aprendizaje.
          </p>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-center backdrop-blur-xl">
              <p className="text-2xl font-black text-teal-300">5</p>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                Idiomas
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-center backdrop-blur-xl">
              <p className="text-2xl font-black text-teal-300">IA</p>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                Soporte
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 text-center backdrop-blur-xl">
              <p className="text-2xl font-black text-teal-300">XP</p>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                Progreso
              </p>
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
                Iniciar sesión
              </h2>

              <p className="mt-2 text-sm font-medium text-slate-500">
                Ingresa a tu cuenta para continuar aprendiendo.
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
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
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
                Ingresar
              </Button>
            </form>

            <div className="mt-7 text-center">
              <p className="text-sm text-slate-500">
                ¿No tienes cuenta?{' '}
                <Link
                  to="/register"
                  className="font-bold text-teal-700 transition-colors hover:text-teal-900"
                >
                  Crear cuenta
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