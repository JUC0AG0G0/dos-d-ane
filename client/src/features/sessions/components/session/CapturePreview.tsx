import { Skeleton } from '@/components/ui/skeleton';
import { useApi } from '@/hooks/useApi';
import { sessionsService } from '../../services/sessions.service';
import { detectionSentence } from '../../utils';
import { PostureSkeleton } from '../PostureSkeleton';

/** Squelette d'une capture (chargé par son id) et phrase des articulations. */
export function CapturePreview({
  captureId,
  details,
}: {
  captureId: string;
  /** Ligne sous le squelette (« iPhone de Jules · image 640 × 480 »…). */
  details?: (size: string) => string;
}) {
  const { data: capture, error } = useApi(
    () => sessionsService.capture(captureId),
    [captureId],
    'Impossible de charger la capture.',
  );
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (capture?.id !== captureId) return <Skeleton className="aspect-4/3" />;
  return (
    <div className="grid gap-3">
      <PostureSkeleton capture={capture} />
      {details && (
        <p className="text-sm text-muted-foreground">
          {details(`image ${capture.imageWidth} × ${capture.imageHeight}`)}
        </p>
      )}
      <p className="text-sm">{detectionSentence(capture.keypoints)}</p>
    </div>
  );
}
