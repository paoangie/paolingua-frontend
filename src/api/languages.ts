import apiClient from './client'
import type { Language, Lesson } from '../types'

export const languagesApi = {
  getAll: () => apiClient.get<Language[]>('/languages'),

  getById: (id: number) => apiClient.get<Language>(`/languages/${id}`),

  getLessons: (id: number) =>
    apiClient.get<Lesson[]>(`/languages/${id}/lessons`),
}
