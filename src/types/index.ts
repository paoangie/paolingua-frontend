export interface User {
  id: string
  email: string
  role: string
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface Language {
  id: number
  name: string
  code: string
  flagIcon: string
}

export interface Lesson {
  id: number
  languageId: number
  title: string
  level: number
  xpReward: number
  language?: Language
  exercises?: Exercise[]
  completed?: boolean
  score?: number
}

export type ExerciseType = 'pronunciation' | 'translation' | 'grammar'

export interface ExerciseContent {
  phrase?: string
  hint?: string
  question?: string
  answer?: string
  correct?: string
  options?: string[]
}

export interface Exercise {
  id: number
  lessonId: number
  type: ExerciseType
  content: ExerciseContent
  lesson?: Lesson
}

export interface ExerciseSubmitDto {
  userAnswer: string
  expectedPhrase?: string | null
  timeSpentSeconds: number
  exerciseType?: string
  exerciseContent?: string
}

export interface SubmitResponse {
  score: number
  feedback: string
  correct: boolean
  message: string
}

export interface FeedbackResponse {
  recognizedText: string
  score: number
  grammarFeedback: string
  suggestions: string
}

export interface PronunciationRequest {
  audioBase64: string
  expectedPhrase: string
  exerciseId: number
}

export interface PronunciationAttempt {
  id: number
  recognizedText: string
  expectedText: string
  score: number
  createdAt: string
  exerciseId: number
}

export interface PronunciationStats {
  averageScore: number
  totalAttempts: number
  bestScore: number
  difficultWords: { word: string; averageScore: number; attempts: number }[]
  message: string
}

export interface ProgressSummary {
  level: number
  totalXp: number
  xpToNextLevel: number
  streak: number
  totalLessons: number
  completedLessons: number
  completionPercentage: number
  averageScore: number
}

export interface LanguageProgress {
  languageId: number
  totalLessons: number
  completedLessons: number
  currentLevel: number
  progress: { lessonId: number; score: number; completed: boolean }[]
}

export interface CompleteLessonResponse {
  completed: boolean
  score: number
  xpEarned: number
  nextLessonUnlocked: boolean
  nextLessonId?: number
  nextLessonTitle?: string
  message: string
}

export interface StreakResponse {
  currentStreak: number
  message: string
}

export interface LeaderboardEntry {
  email: string
  totalXp: number
  completedLessons: number
  rank: number
}

export interface GrammarCorrectionRequest {
  text: string
  expectedText?: string | null
}

export interface GrammarCorrectionResponse {
  originalText: string
  correction: string
  suggestions: string
}

export interface FillBlankRequest {
  sentence: string
  userAnswer: string
  correctAnswer: string
}

export interface FillBlankResponse {
  correct: boolean
  feedback: string
  score: number
}

export interface TranslationRequest {
  originalText: string
  userTranslation: string
  correctTranslation: string
}

export interface TranslationResponse {
  score: number
  feedback: string
}

export interface PracticeWordRequest {
  word: string
}

export interface PracticeWordResponse {
  word: string
  phoneticHint: string
  tips: string
  example: string
  feedback: string
}

export interface CompleteLessonRequest {
  score: number
  completed: boolean
  timeSpentSeconds: number
}

export interface TheoryContent {
  title: string
  introduction: string
  sections: TheorySection[]
  summary: string
}

export type TheorySection =
  | VocabularySection
  | GrammarSection
  | PhrasesSection
  | CulturalNoteSection

export interface VocabularySection {
  type: 'vocabulary'
  title: string
  items: VocabularyItem[]
}

export interface VocabularyItem {
  term: string
  translation: string
  pronunciation: string
  example: string
}

export interface GrammarSection {
  type: 'grammar'
  title: string
  rules: GrammarRule[]
}

export interface GrammarRule {
  explanation: string
  examples: string[]
  tip: string
}

export interface PhrasesSection {
  type: 'phrases'
  title: string
  phrases: PhraseItem[]
}

export interface PhraseItem {
  phrase: string
  translation: string
  context: string
}

export interface CulturalNoteSection {
  type: 'cultural_note'
  title: string
  content: string
}

export interface UserRank {
  email: string
  totalXp: number
  completedLessons: number
  rank: number
  totalUsers: number
  percentile: number
}

export interface AdminLessonItem {
  id: number
  title: string
  level: number
  xpReward: number
  languageId: number
  languageName: string
  hasTheory: boolean
  exerciseCount: number
}
