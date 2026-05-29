import apiClient from './client'
import type {
  ProgressSummary,
  LanguageProgress,
  CompleteLessonRequest,
  CompleteLessonResponse,
  StreakResponse,
  LeaderboardEntry,
  UserRank,
} from '../types'

export const progressApi = {
  getSummary: () => apiClient.get<ProgressSummary>('/progress/me'),

  getByLanguage: (languageId: number) =>
    apiClient.get<LanguageProgress>(`/progress/me/language/${languageId}`),

  completeLesson: (lessonId: number, data: CompleteLessonRequest) =>
    apiClient.post<CompleteLessonResponse>(
      `/progress/lesson/${lessonId}/complete`,
      data
    ),

  getStreak: () => apiClient.get<StreakResponse>('/progress/streak'),

  getLeaderboard: (limit = 10) =>
    apiClient.get<LeaderboardEntry[]>(`/progress/leaderboard?limit=${limit}`),

  getMyRank: () => apiClient.get<UserRank>('/progress/me/rank'),
}
