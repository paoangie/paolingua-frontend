import apiClient from './client'

export const userApi = {
  getProfile: () => apiClient.get<{ id: string; email: string; role: string; createdAt: string }>('/user/me'),

  updateProfile: (data: { name?: string }) =>
    apiClient.put('/user/me', data),

  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    apiClient.put('/user/change-password', data),
}
