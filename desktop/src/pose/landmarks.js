export const visibility = (p) =>
  Math.min(p?.visibility ?? p?.score ?? 1, p?.presence ?? 1);
export const valid = (p) =>
  Boolean(
    p &&
      Number.isFinite(p.x) &&
      Number.isFinite(p.y) &&
      p.x > 0.005 &&
      p.x < 0.995 &&
      p.y > 0.005 &&
      p.y < 0.995 &&
      visibility(p) >= 0.5
  );
export const pair = (points, a, b) => valid(points?.[a]) && valid(points?.[b]);

export const asFrame = (input) =>
  Array.isArray(input) ? { landmarks: input } : (input ?? {});

// Map COCO-17 (MoveNet / YOLO Pose) onto MediaPipe's 33-point indices.
const cocoToMediaPipe = [
  0, 2, 5, 7, 8, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28
];
export function normalizeCoco(keypoints, width, height) {
  const result = Array(33).fill(null);
  if (!(width > 0 && height > 0)) return result;
  for (let i = 0; i < 17; i++) {
    const p = keypoints?.[i];
    if (p)
      result[cocoToMediaPipe[i]] = {
        x: p.x / width,
        y: p.y / height,
        visibility: p.score ?? 0
      };
  }
  return result;
}
export function countVisible(input) {
  return asFrame(input).landmarks?.filter(valid).length ?? 0;
}
