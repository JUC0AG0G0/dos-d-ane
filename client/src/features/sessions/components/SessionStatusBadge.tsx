import { Badge } from '@/components/ui/badge';
import type { SessionStatus } from '../types/sessions.types';
import { STATUS_BADGES } from '../utils';

export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const { label, variant } = STATUS_BADGES[status];
  return <Badge variant={variant}>{label}</Badge>;
}
