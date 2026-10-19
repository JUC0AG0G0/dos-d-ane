import type { BodyPart, Capture } from '../types/sessions.types';
import { BODY_PART_LABELS, SKELETON_EDGES } from '../utils';
import { cn } from '@/utils/cn';

/**
 * Squelette d'une capture, dans le repère de l'image (imageWidth ×
 * imageHeight) : points et segments COCO ; les articulations absentes sont
 * sautées. L'image elle-même n'est jamais stockée.
 */
export function PostureSkeleton({
  capture,
  className,
}: {
  capture: Pick<Capture, 'imageWidth' | 'imageHeight' | 'keypoints'>;
  className?: string;
}) {
  const { imageWidth: w, imageHeight: h } = capture;
  const points = new Map(capture.keypoints.map((k) => [k.bodyPart, k]));
  const r = Math.max(w, h) / 90;
  const at = (part: BodyPart) => points.get(part);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`Squelette : ${capture.keypoints.length} articulations détectées`}
      className={cn('w-full rounded-lg bg-muted', className)}
    >
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        fill="none"
        stroke="var(--border)"
        strokeDasharray={`${r} ${r}`}
      />
      {SKELETON_EDGES.map(([a, b]) => {
        const p = at(a);
        const q = at(b);
        if (!p || !q) return null;
        return (
          <line
            key={`${a}-${b}`}
            x1={p.x}
            y1={p.y}
            x2={q.x}
            y2={q.y}
            stroke="var(--primary)"
            strokeWidth={r * 0.8}
            strokeLinecap="round"
          />
        );
      })}
      {capture.keypoints.map((k) => (
        <circle
          key={k.bodyPart}
          cx={k.x}
          cy={k.y}
          r={k.bodyPart === 'nose' ? r * 1.6 : r}
          fill="var(--card)"
          stroke="var(--secondary-foreground)"
          strokeWidth={r * 0.6}
        >
          <title>{BODY_PART_LABELS[k.bodyPart]}</title>
        </circle>
      ))}
    </svg>
  );
}
