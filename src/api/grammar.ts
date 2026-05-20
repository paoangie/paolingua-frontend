import apiClient from './client'
import type {
  GrammarCorrectionRequest,
  GrammarCorrectionResponse,
  FillBlankRequest,
  FillBlankResponse,
  TranslationRequest,
  TranslationResponse,
} from '../types'

export const grammarApi = {
  correct: (data: GrammarCorrectionRequest) =>
    apiClient.post<GrammarCorrectionResponse>('/grammar/correct', data),

  completeFillBlank: (data: FillBlankRequest) =>
    apiClient.post<FillBlankResponse>('/grammar/exercise/complete', data),

  translate: (data: TranslationRequest) =>
    apiClient.post<TranslationResponse>('/grammar/exercise/translate', data),
}
