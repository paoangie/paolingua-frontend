import { useState } from 'react'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setIsLoading(true)
    try {
      await login({ email, password })
      addToast('Sesion iniciada correctamente', 'success')
      navigate('/dashboard')
    } catch { setError('Credenciales invalidas. Intenta nuevamente.') }
    finally { setIsLoading(false) }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 to-purple-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-purple-600 text-white text-xl font-bold">
            P
          </div>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">PaoLingua</h1>
          <p className="text-gray-500">Inicia sesion para continuar</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
          <Input label="Contrasena" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" required />
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <Button type="submit" isLoading={isLoading} className="w-full" size="lg">Iniciar sesion</Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          No tienes cuenta?{' '}
          <Link to="/register" className="font-medium text-purple-600 hover:text-purple-700">Registrate</Link>
        </p>
      </div>
    </div>
  )
}
