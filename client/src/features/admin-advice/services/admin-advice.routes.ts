const id = (value: string) => encodeURIComponent(value);

export const ADMIN_ADVICE_ROUTES = {
  exercises: '/admin/advice/exercises',
  exercise: (exerciseId: string) => `/admin/advice/exercises/${id(exerciseId)}`,
  postureTips: '/admin/advice/posture-tips',
  postureTipsOrder: '/admin/advice/posture-tips/order',
  postureTip: (tipId: string) => `/admin/advice/posture-tips/${id(tipId)}`,
  postureTipReset: (tipId: string) =>
    `/admin/advice/posture-tips/${id(tipId)}/reset`,
  painZones: '/admin/advice/pain-zones',
  painZonesOrder: '/admin/advice/pain-zones/order',
  painZone: (zoneId: string) => `/admin/advice/pain-zones/${id(zoneId)}`,
  whenToSeeDoctor: '/admin/advice/settings/when-to-see-doctor',
  media: '/admin/advice/media',
} as const;
