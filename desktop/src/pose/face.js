import { DEG, clamp, cross, dot, length, mid, unit } from './geometry.js';

import { pair, valid } from './landmarks.js';

export const freshFace = (frame, time) => {
  const face = frame.face;
  if (!face) return null;
  const age = Number.isFinite(face.ageMs)
    ? face.ageMs
    : Number.isFinite(time) &&
        Number.isFinite(face.capturedAt ?? face.timestamp)
      ? time - (face.capturedAt ?? face.timestamp)
      : 0;
  return age >= -50 && age <= 1000 ? face : null;
};

/** MediaPipe's canonical-face -> camera matrix is column-major by default.
 * JS returns MatrixData.packed_data unchanged; the C++ serializer uses Eigen's
 * layout (mediapipe/framework/formats/matrix_data.proto + matrix.cc).
 * Remove uniform scale before reading rotation. Malformed matrices fail closed.
 */
export function faceOrientation(matrix) {
  const data = matrix?.data ?? matrix;
  if (
    !data ||
    data.length !== 16 ||
    Array.from(data).some((v) => !Number.isFinite(v))
  )
    return null;
  if (matrix?.rows && (matrix.rows !== 4 || matrix.columns !== 4)) return null;
  const rowMajor =
    matrix?.layout === 'row-major' || matrix?.layout === 'ROW_MAJOR';
  const at = (row, col) => data[rowMajor ? row * 4 + col : col * 4 + row];
  if (
    Math.abs(at(3, 3) - 1) > 0.05 ||
    [0, 1, 2].some((i) => Math.abs(at(3, i)) > 0.01)
  )
    return null;
  const columns = [0, 1, 2].map((i) => ({
    x: at(0, i),
    y: at(1, i),
    z: at(2, i)
  }));
  const sizes = columns.map(length);
  if (
    Math.min(...sizes) < 0.1 ||
    Math.max(...sizes) / Math.min(...sizes) > 1.15
  )
    return null;
  const [x, y, z] = columns.map(unit);
  if (
    Math.max(Math.abs(dot(x, y)), Math.abs(dot(x, z)), Math.abs(dot(y, z))) >
      0.12 ||
    dot(cross(x, y), z) < 0.85
  )
    return null;
  return {
    pitch: Math.atan2(y.z, z.z) * DEG,
    yaw: Math.asin(clamp(-x.z, -1, 1)) * DEG,
    roll: Math.atan2(x.y, x.x) * DEG
  };
}

export function credibleFace(face, landmarks, width, height) {
  const points = face?.landmarks;
  if (
    !points ||
    points.length < 100 ||
    !pair(points, 33, 263) ||
    !valid(points[152]) ||
    !valid(points[10])
  )
    return false;
  const eyes = mid(points[33], points[263]);
  const extent = Math.hypot(
    (points[33].x - points[263].x) * width,
    (points[33].y - points[263].y) * height
  );
  if (
    extent < width * 0.018 ||
    (points[152].y - points[10].y) * height < height * 0.05
  )
    return false;
  // A second face in the background must not control the tracked body's status.
  if (valid(landmarks?.[0]) && valid(points[1])) {
    if (
      Math.hypot(
        (points[1].x - landmarks[0].x) * width,
        (points[1].y - landmarks[0].y) * height
      ) >
      extent * 1.2
    )
      return false;
  }
  return valid(eyes);
}
