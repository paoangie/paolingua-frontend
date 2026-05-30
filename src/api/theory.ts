import apiClient from './client'
import type { TheoryContent } from '../types'

export const theoryApi = {
  getByLesson: (lessonId: number) =>
    apiClient.get<TheoryContent>(`/lessons/${lessonId}/theory`),
}