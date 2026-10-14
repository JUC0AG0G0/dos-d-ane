export const copyLandmarks = (points) =>
  points?.map(({ x, y, z, visibility, presence }) => ({
    x,
    y,
    z,
    visibility: Math.min(visibility ?? 1, presence ?? 1)
  })) ?? [];
// FaceLandmarker gates the whole face, but its JS landmark converter sets
// unsupported per-point visibility/presence fields to zero. They are not
// body-joint confidence scores: retain coordinates for geometric validation.
export const normalizeFaceLandmarks = (points) =>
  points?.map(({ x, y, z }) => ({ x, y, z })) ?? [];
// Hand presence is checked by the task. Like face landmarks, individual hand
// points do not carry usable visibility scores. Keep all 21 joints, including
// curled/extended fingers, without trying to classify or censor the gesture.
export function normalizeHands(output) {
  return (output?.landmarks ?? []).flatMap((points, index) => {
    const category = output.handedness?.[index]?.[0];
    if (
      points.length !== 21 ||
      !points.every(
        (p) =>
          p &&
          Number.isFinite(p.x) &&
          Number.isFinite(p.y) &&
          Number.isFinite(p.z)
      )
    )
      return [];
    if (
      !['Left', 'Right'].includes(category?.categoryName) ||
      !Number.isFinite(category.score)
    )
      return [];
    return [
      {
        landmarks: points.map(({ x, y, z }) => ({ x, y, z })),
        handedness: category.categoryName,
        score: Math.max(0, Math.min(1, category.score))
      }
    ];
  });
}
export const handTrackingInterval = (inferenceMs) =>
  Math.max(
    90,
    Math.min(120, (Number.isFinite(inferenceMs) ? inferenceMs : 0) * 1.2)
  );
export const freshHands = (cache, now) =>
  cache && now - cache.capturedAt <= 250 ? cache.hands : [];
