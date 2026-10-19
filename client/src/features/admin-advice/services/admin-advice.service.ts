import { http } from '@/services';
import type {
  AdminExercise,
  AdminMedia,
  AdminPainZone,
  AdminPainZones,
  AdminPostureTip,
  ExerciseInput,
  PainZoneInput,
  PostureTipInput,
  UploadedMedia,
} from '../types/admin-advice.types';
import { ADMIN_ADVICE_ROUTES as ROUTES } from './admin-advice.routes';

export const adminAdviceService = {
  exercises: () => http.get<AdminExercise[]>(ROUTES.exercises),
  createExercise: (input: ExerciseInput) =>
    http.post<AdminExercise>(ROUTES.exercises, input),
  updateExercise: (id: string, input: Partial<ExerciseInput>) =>
    http.patch<AdminExercise>(ROUTES.exercise(id), input),
  deleteExercise: (id: string) => http.delete<void>(ROUTES.exercise(id)),

  postureTips: () => http.get<AdminPostureTip[]>(ROUTES.postureTips),
  updatePostureTip: (id: string, input: Partial<PostureTipInput>) =>
    http.patch<AdminPostureTip>(ROUTES.postureTip(id), input),
  resetPostureTip: (id: string) =>
    http.post<AdminPostureTip>(ROUTES.postureTipReset(id)),
  orderPostureTips: (ids: string[]) =>
    http.put<AdminPostureTip[]>(ROUTES.postureTipsOrder, { ids }),

  painZones: () => http.get<AdminPainZones>(ROUTES.painZones),
  createPainZone: (input: PainZoneInput) =>
    http.post<AdminPainZone>(ROUTES.painZones, input),
  updatePainZone: (id: string, input: Partial<PainZoneInput>) =>
    http.patch<AdminPainZone>(ROUTES.painZone(id), input),
  deletePainZone: (id: string) => http.delete<void>(ROUTES.painZone(id)),
  orderPainZones: (ids: string[]) =>
    http.put<AdminPainZones>(ROUTES.painZonesOrder, { ids }),
  updateWhenToSeeDoctor: (text: string) =>
    http.put<{ text: string }>(ROUTES.whenToSeeDoctor, { text }),

  uploadMedia: (file: File) => http.upload<UploadedMedia>(ROUTES.media, file),
  media: () => http.get<AdminMedia[]>(ROUTES.media),
  deleteMedia: (id: string) => http.delete<void>(ROUTES.mediaItem(id)),
};
