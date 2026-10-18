import { Badge } from '@/components/ui/badge';
import { STATUS_LABELS, type ContentStatus } from '../types/admin-advice.types';

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <Badge variant={status === 'published' ? 'secondary' : 'outline'}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
