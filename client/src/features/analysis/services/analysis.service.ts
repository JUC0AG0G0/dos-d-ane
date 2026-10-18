import { http } from '@/services';
import type {
  AnalysisSessionDetail,
  AnalysisSessionSummary,
} from '../types/analysis.types';
import { ANALYSIS_ROUTES } from './analysis.routes';

export const analysisService = {
  sessions: () => http.get<AnalysisSessionSummary[]>(ANALYSIS_ROUTES.sessions),
  session: (id: string) =>
    http.get<AnalysisSessionDetail>(ANALYSIS_ROUTES.session(id)),
};
