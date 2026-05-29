import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { userApi } from '../api/user'
import { useAuth } from '../context/AuthContext'
import { Card, Input, Button } from '../components/ui'
import PersonalRankCard from '../components/ranking/PersonalRankCard'

export default function ProfilePage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'Admin'

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const changePasswordMutation = useMutation({
    mutationFn: () =>
      userApi.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    onSuccess: () => {
      setPasswordSuccess('Contrasena actualizada correctamente')
      setPasswordError('')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    },
    onError: () => {
      setPasswordError('Error al cambiar la contrasena. Verifica tus datos.')
      setPasswordSuccess('')
    },
  })

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contrasenas no coinciden')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('La contrasena debe tener al menos 6 caracteres')
      return
    }

    changePasswordMutation.mutate()
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
        <p className="text-gray-500">Gestiona tu cuenta</p>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Informacion de la cuenta
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-900">{user.email}</span>
          </div>
          <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-gray-500">Rol</span>
            <span className="font-medium text-gray-900">{user.role}</span>
          </div>
          <div className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-gray-500">Miembro desde</span>
            <span className="font-medium text-gray-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>

      {!isAdmin && <PersonalRankCard />}

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Cambiar contrasena
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="Contrasena actual"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="Nueva contrasena"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="Confirmar nueva contrasena"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {passwordError && (
            <p className="text-sm text-red-600">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-sm text-green-600">{passwordSuccess}</p>
          )}

          <Button
            type="submit"
            isLoading={changePasswordMutation.isPending}
            className="w-full"
          >
            Cambiar contrasena
          </Button>
        </form>
      </Card>
    </div>
  )
}
