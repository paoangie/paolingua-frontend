import apiClient from './client'
import type { Lesson } from '../types'

export const lessonsApi = {
  getAll: () => apiClient.get<Lesson[]>('/lessons'),

  getById: (id: number) => apiClient.get<Lesson>(`/lessons/${id}`),

  getByLanguage: (languageId: number) =>
    apiClient.get<Lesson[]>(`/lessons/language/${languageId}`),
}
