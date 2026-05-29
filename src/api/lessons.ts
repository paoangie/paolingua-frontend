import apiClient from './client'
import type { Lesson, AdminLessonItem, TheoryContent } from '../types'

export const lessonsApi = {
  getAll: () => apiClient.get<Lesson[]>('/lessons'),

  getById: (id: number) => apiClient.get<Lesson>(`/lessons/${id}`),

  getByLanguage: (languageId: number) =>
    apiClient.get<Lesson[]>(`/lessons/language/${languageId}`),

  getAdminList: () =>
    apiClient.get<AdminLessonItem[]>('/lessons/admin/list'),

  updateTheory: (lessonId: number, theory: TheoryContent) =>
    apiClient.put<{ message: string; lessonId: number }>(
      `/lessons/${lessonId}/theory`,
      theory
    ),
}
