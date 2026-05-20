import apiClient from './client'
import type {
  PronunciationRequest,
  FeedbackResponse,
  PracticeWordRequest,
  PracticeWordResponse,
  PronunciationAttempt,
  PronunciationStats,
} from '../types'

export const pronunciationApi = {
  evaluate: (data: PronunciationRequest) =>
    apiClient.post<FeedbackResponse>('/pronunciation/evaluate', data),

  practiceWord: (data: PracticeWordRequest) =>
    apiClient.post<PracticeWordResponse>('/pronunciation/practice-word', data),

  getHistory: (limit = 20) =>
    apiClient.get<PronunciationAttempt[]>(
      `/pronunciation/history?limit=${limit}`
    ),

  getHistoryByExercise: (exerciseId: number) =>
    apiClient.get<PronunciationAttempt[]>(
      `/pronunciation/history/${exerciseId}`
    ),

  getStats: () => apiClient.get<PronunciationStats>('/pronunciation/stats'),
}
