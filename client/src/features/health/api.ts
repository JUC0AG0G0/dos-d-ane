import type { Health } from '@/types/health';
import { apiFetch } from '@/utils/api';

export function getHealth(): Promise<Health> {
  return apiFetch<Health>('/health');
}
