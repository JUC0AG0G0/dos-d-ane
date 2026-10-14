import { cross, dot, length, mid, sub, unit } from './geometry.js';

import { pair, valid, visibility } from './landmarks.js';

export function determineView(points, orientation, width, height) {
  let headView = orientation
    ? Math.abs(orientation.yaw) >= 50
      ? 'profile'
      : Math.abs(orientation.yaw) > 25
        ? 'oblique'
        : 'front'
    : 'unknown';
  if (pair(points, 7, 8) && valid(points[0])) {
    const ears = mid(points[7], points[8]);
    const span = Math.hypot(
      (points[7].x - points[8].x) * width,
      (points[7].y - points[8].y) * height
    );
    const offset =
      (Math.abs(points[0].x - ears.x) * width) / Math.max(span, width * 0.015);
    if (!orientation)
      headView = offset >= 0.7 ? 'profile' : offset > 0.4 ? 'oblique' : 'front';
  }
  const ear = valid(points[7])
    ? points[7]
    : valid(points[8])
      ? points[8]
      : null;
  if (
    headView === 'unknown' &&
    ear &&
    valid(points[0]) &&
    Math.abs(points[0].x - ear.x) * width > width * 0.025 &&
    !pair(points, 7, 8)
  )
    headView = 'profile';
  if (pair(points, 11, 12)) {
    const shoulders = mid(points[11], points[12]);
    const span = Math.abs(points[12].x - points[11].x) * width;
    const torsoHeight = pair(points, 23, 24)
      ? (mid(points[23], points[24]).y - shoulders.y) * height
      : 0;
    const neckHeight = ear ? (shoulders.y - ear.y) * height : 0;
    const scale = torsoHeight > height * 0.08 ? torsoHeight : neckHeight;
    // Turning only the face does not make a frontal body a side view.
    if (scale > height * 0.04 && span / scale >= 0.5) return 'front';
    if (scale > height * 0.04 && span / scale < 0.4 && headView === 'profile')
      return 'profile';
    return headView === 'profile'
      ? 'oblique'
      : headView === 'unknown' && pair(points, 2, 5)
        ? 'front'
        : headView;
  }
  // A real side view often hides the far shoulder. Require a same-side ear,
  // shoulder and hip together so a cropped frontal shoulder is not enough.
  if (headView === 'profile')
    for (const [earIndex, shoulderIndex, hipIndex] of [
      [7, 11, 23],
      [8, 12, 24]
    ]) {
      if (
        valid(points[earIndex]) &&
        valid(points[shoulderIndex]) &&
        valid(points[hipIndex]) &&
        (points[hipIndex].y - points[shoulderIndex].y) * height > height * 0.08
      )
        return 'profile';
    }
  return 'unknown';
}

export function worldNeck(frame, pixels) {
  const points = frame.worldLandmarks;
  if (!points || (frame.model && frame.model !== 'mediapipe')) return null;
  const usable = (i) =>
    valid(pixels?.[i]) &&
    visibility(pixels[i]) >= 0.65 &&
    points[i] &&
    ['x', 'y', 'z'].every((k) => Number.isFinite(points[i][k])) &&
    visibility(points[i]) >= 0.65;
  if (![0, 7, 8, 11, 12, 23, 24].every(usable)) return null;
  const shoulder = mid(points[11], points[12]),
    hips = mid(points[23], points[24]),
    ears = mid(points[7], points[8]);
  const across = sub(points[12], points[11]),
    up = sub(shoulder, hips);
  const span = length(across),
    torsoLength = length(up);
  if (span < 0.12 || span > 0.75 || torsoLength < 0.15 || torsoLength > 0.85)
    return null;
  const upAxis = unit(up),
    sideAxis = unit(across),
    frontAxis = unit(cross(sideAxis, upAxis));
  if (!frontAxis || Math.abs(dot(sideAxis, upAxis)) > 0.45) return null;
  const facing = dot(sub(points[0], ears), frontAxis);
  if (Math.abs(facing) < span * 0.035) return null;
  const neck = sub(ears, shoulder),
    neckHeight = dot(neck, upAxis);
  if (neckHeight < 0.045 || neckHeight > 0.4 || length(neck) > 0.5) return null;
  // Ear position relative to the torso plane separates whole-body lean from
  // neck translation. This depth is still a monocular model estimate.
  return {
    value: Math.max(0, (dot(neck, frontAxis) * Math.sign(facing)) / span),
    source: 'world'
  };
}
