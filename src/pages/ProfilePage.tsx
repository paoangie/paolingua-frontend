import { useState, type FormEvent } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { userApi } from '../api/user'
import { useAuth } from '../context/AuthContext'
import { Card, Input, Button } from '../components/ui'

export default function ProfilePage() {
  const { user } = useAuth()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile().then((r) => r.data),
  })

  const changePasswordMutation = useMutation({
    mutationFn: () =>
      userApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    onSuccess: () => {
      setPasswordSuccess('Contraseña actualizada correctamente')
      setPasswordError('')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    },
    onError: () => {
      setPasswordError('Error al cambiar la contraseña. Verifica tus datos.')
      setPasswordSuccess('')
    },
  })

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    changePasswordMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-slate-300 border-t-teal-700" />
      </div>
    )
  }

  const email = profile?.email ?? user?.email ?? ''
  const role = profile?.role ?? user?.role ?? 'User'
  const createdAt = profile?.createdAt
  const userInitial = email.charAt(0).toUpperCase() || 'U'

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-16 h-72 w-72 rounded-full bg-slate-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-200">
              <span className="h-2 w-2 rounded-full bg-teal-300" />
              Configuración de cuenta
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Perfil
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Revisa la información de tu cuenta y actualiza tu contraseña de
              acceso de forma segura.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-500 text-2xl font-black text-slate-950">
                {userInitial}
              </div>

              <div className="min-w-0">
                <p className="truncate text-lg font-black text-white">
                  {email}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-400">
                  Rol: {role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-black tracking-tight text-slate-950">
              Información de cuenta
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Datos principales del usuario autenticado.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Correo electrónico
              </p>
              <p className="mt-2 break-all text-sm font-bold text-slate-950">
                {email}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Rol
              </p>
              <p className="mt-2 text-sm font-bold text-slate-950">
                {role}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Miembro desde
              </p>
              <p className="mt-2 text-sm font-bold text-slate-950">
                {createdAt
                  ? new Date(createdAt).toLocaleDateString('es-BO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'No disponible'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-black tracking-tight text-slate-950">
              Cambiar contraseña
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Usa una contraseña segura de al menos 6 caracteres.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <Input
              label="Contraseña actual"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Ingresa tu contraseña actual"
              autoComplete="current-password"
              required
            />

            <Input
              label="Nueva contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              required
            />

            <Input
              label="Confirmar nueva contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la nueva contraseña"
              autoComplete="new-password"
              required
            />

            {passwordError && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">
                {passwordSuccess}
              </div>
            )}

            <Button
              type="submit"
              isLoading={changePasswordMutation.isPending}
              className="w-full"
              size="lg"
            >
              Actualizar contraseña
            </Button>
          </form>
        </Card>
      </section>
    </div>
  )
}