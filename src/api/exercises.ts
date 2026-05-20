import apiClient from './client'
import type { Exercise, ExerciseSubmitDto, SubmitResponse, ExerciseContent } from '../types'

function parseExerciseContent(exercise: Exercise): Exercise {
  if (typeof exercise.content === 'string') {
    try {
      exercise.content = JSON.parse(exercise.content) as ExerciseContent
    } catch {
      exercise.content = {}
    }
  }
  return exercise
}

export const exercisesApi = {
  getByLesson: async (lessonId: number) => {
    const res = await apiClient.get<Exercise[]>(`/exercises/lesson/${lessonId}`)
    res.data = res.data.map(parseExerciseContent)
    return res
  },

  getById: async (id: number) => {
    const res = await apiClient.get<Exercise>(`/exercises/${id}`)
    res.data = parseExerciseContent(res.data)
    return res
  },

  submit: (id: number, data: ExerciseSubmitDto) => {
    const dto: ExerciseSubmitDto = {
      ...data,
      exerciseType: data.exerciseType || undefined,
      exerciseContent: data.exerciseContent || undefined,
    }
    return apiClient.post<SubmitResponse>(`/exercises/${id}/submit`, dto)
  },

  getHint: (id: number) => apiClient.get<{ hint: string }>(`/exercises/${id}/hint`),
}
