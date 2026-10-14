// Visibility-gated alignment heuristics, not a clinically validated posture model.
// Pose landmarks estimate ears / shoulders; they do not locate cervical vertebrae.

import { DEG, clamp, mid } from './geometry.js';

import { asFrame, pair, valid, visibility } from './landmarks.js';

import { credibleFace, faceOrientation, freshFace } from './face.js';

import { determineView, worldNeck } from './body.js';

import {
  overallReason,
  regionCoverageFor,
  regionDescriptions,
  stateFor,
  worst
} from './feedback.js';

/** Angles/ratios stay internal; the UI presents categories. View-dependent
 * thresholds are conservative prototype rules for neutral head/neck/shoulder
 * alignment. Validate them with seated users/camera positions before claiming
 * accuracy. A frontal COCO skeleton alone cannot measure forward-head depth.
 */
export function evaluate(input, width, height, time) {
  const frame = asFrame(input),
    landmarks = frame.landmarks ?? [];
  const regions = {
    head: 'unknown',
    neck: 'unknown',
    shoulders: 'unknown',
    torso: 'unknown'
  };
  const metrics = {
    headTilt: null,
    headOffset: null,
    headPitch: null,
    headYaw: null,
    shoulderTilt: null,
    torsoTilt: null,
    neckLateral: null,
    neckForward: null,
    neckSource: null
  };
  const measurementCoverage = {
    headRoll: false,
    headPitch: false,
    neckLateral: false,
    neckForward: false,
    shoulderLevel: false,
    torsoLean: false
  };
  const unknown = (reason) => ({
    state: 'unknown',
    regions,
    metrics,
    measurementCoverage,
    regionCoverage: regionCoverageFor(measurementCoverage),
    regionReasons: regionDescriptions(
      regions,
      measurementCoverage,
      metrics,
      'unknown'
    ),
    reason,
    coverage: 'insufficient',
    confidence: 0,
    confidenceLabel: 'Détection incertaine',
    view: 'unknown',
    landmarks,
    face: null
  });
  if (!(width > 0 && height > 0))
    return unknown('Gardez vos épaules visibles dans le cadre.');
  const point = (i) => ({
    x: landmarks[i].x * width,
    y: landmarks[i].y * height
  });
  const face = freshFace(frame, time ?? frame.timestamp);
  const orientation = credibleFace(face, landmarks, width, height)
    ? faceOrientation(face.matrix)
    : null;
  const view = determineView(landmarks, orientation, width, height);
  const visibleShoulders = [11, 12].filter((i) => valid(landmarks[i]));
  if (
    !visibleShoulders.length ||
    (visibleShoulders.length < 2 && view !== 'profile')
  )
    return unknown('Gardez vos épaules visibles dans le cadre.');
  const shoulder =
    visibleShoulders.length === 2
      ? mid(point(11), point(12))
      : point(visibleShoulders[0]);
  const shoulderSpan =
    visibleShoulders.length === 2
      ? Math.hypot(point(12).x - point(11).x, point(12).y - point(11).y)
      : 0;
  if (shoulderSpan < width * 0.025 && view !== 'profile')
    return unknown('Reculez légèrement pour garder les deux épaules visibles.');
  const sideHip =
    visibleShoulders.length === 1 ? visibleShoulders[0] + 12 : null;
  const hips = pair(landmarks, 23, 24)
    ? mid(point(23), point(24))
    : sideHip && valid(landmarks[sideHip])
      ? point(sideHip)
      : null;
  const torsoHeight = hips ? hips.y - shoulder.y : 0;
  if (torsoHeight > Math.max(height * 0.07, shoulderSpan * 0.25)) {
    metrics.torsoTilt = Math.atan2(shoulder.x - hips.x, torsoHeight) * DEG;
    regions.torso = stateFor(Math.abs(metrics.torsoTilt), 9, 17);
    measurementCoverage.torsoLean = true;
  }
  if (view === 'front' && shoulderSpan >= width * 0.08) {
    metrics.shoulderTilt =
      Math.atan2(
        point(12).y - point(11).y,
        Math.abs(point(12).x - point(11).x)
      ) * DEG;
    regions.shoulders = stateFor(Math.abs(metrics.shoulderTilt), 7, 13);
    measurementCoverage.shoulderLevel = true;
  }
  if (orientation && Math.abs(orientation.yaw) < 65) {
    metrics.headTilt = orientation.roll;
    metrics.headPitch = orientation.pitch;
    metrics.headYaw = orientation.yaw;
    regions.head = worst(
      stateFor(Math.abs(orientation.roll), 10, 18),
      stateFor(Math.abs(orientation.pitch), 20, 32)
    );
    measurementCoverage.headRoll = true;
    measurementCoverage.headPitch = true;
  } else {
    for (const [a, b] of [
      [2, 5],
      [7, 8]
    ]) {
      if (!pair(landmarks, a, b) || view === 'profile') continue;
      const first = point(a),
        second = point(b);
      if (
        Math.hypot(second.x - first.x, second.y - first.y) <
        Math.max(width * 0.012, shoulderSpan * 0.08)
      )
        continue;
      metrics.headTilt =
        Math.atan2(second.y - first.y, Math.abs(second.x - first.x)) * DEG;
      regions.head = stateFor(Math.abs(metrics.headTilt), 10, 18);
      measurementCoverage.headRoll = true;
      break;
    }
  }
  // Prefer ears to nose: turning the face moves the nose without necessarily
  // changing neck alignment. Eyes are only a fallback for lateral alignment.
  const headCenter = pair(landmarks, 7, 8)
    ? mid(point(7), point(8))
    : pair(landmarks, 2, 5)
      ? mid(point(2), point(5))
      : null;
  if (
    headCenter &&
    view === 'front' &&
    shoulderSpan >= width * 0.08 &&
    shoulder.y - headCenter.y > height * 0.035
  ) {
    metrics.headOffset = (headCenter.x - shoulder.x) / shoulderSpan;
    metrics.neckLateral =
      Math.atan2(headCenter.x - shoulder.x, shoulder.y - headCenter.y) * DEG -
      (metrics.torsoTilt ?? 0);
    regions.neck = stateFor(Math.abs(metrics.neckLateral), 12, 23);
    measurementCoverage.neckLateral = true;
  }
  let neck = worldNeck(frame, landmarks);
  if (!neck && view === 'profile' && valid(landmarks[0])) {
    const candidates = [
      [7, 11],
      [8, 12]
    ]
      .filter(([ear, side]) => valid(landmarks[ear]) && valid(landmarks[side]))
      .sort(
        (a, b) => visibility(landmarks[b[0]]) - visibility(landmarks[a[0]])
      );
    const candidate = candidates[0];
    if (candidate) {
      const ear = point(candidate[0]),
        side = point(candidate[1]),
        neckHeight = side.y - ear.y;
      const facing = Math.sign(point(0).x - ear.x);
      if (
        neckHeight > height * 0.045 &&
        facing &&
        Math.abs(point(0).x - ear.x) > width * 0.015
      ) {
        const torsoShift =
          hips && torsoHeight > height * 0.07
            ? ((shoulder.x - hips.x) * neckHeight) / torsoHeight
            : 0;
        neck = {
          value: Math.max(
            0,
            ((ear.x - side.x - torsoShift) * facing) / neckHeight
          ),
          source: 'profile'
        };
      }
    }
  }
  if (neck) {
    metrics.neckForward = neck.value;
    metrics.neckSource = neck.source;
    regions.neck = worst(
      regions.neck,
      stateFor(
        neck.value,
        neck.source === 'world' ? 0.2 : 0.32,
        neck.source === 'world' ? 0.35 : 0.6
      )
    );
    measurementCoverage.neckForward = true;
  }
  // Keep observable lateral alignment even when forward depth is unavailable.
  // Its partial scope must be shown; inferred off-screen hips cannot fill it.
  const observed = Object.values(measurementCoverage).filter(Boolean).length;
  const coverage =
    observed === 6 ? 'full' : observed >= 2 ? 'partial' : 'insufficient';
  const essentialHead =
    headCenter ||
    credibleFace(face, landmarks, width, height) ||
    (view === 'profile' &&
      valid(landmarks[0]) &&
      (valid(landmarks[7]) || valid(landmarks[8])));
  const state =
    essentialHead && coverage !== 'insufficient'
      ? worst(...Object.values(regions))
      : 'unknown';
  const regionReasons = regionDescriptions(
    regions,
    measurementCoverage,
    metrics,
    view
  );
  const essentialIndices = [
    ...visibleShoulders,
    ...(pair(landmarks, 7, 8) ? [7, 8] : pair(landmarks, 2, 5) ? [2, 5] : [0])
  ];
  const confidence =
    state === 'unknown'
      ? 0
      : clamp(
          Math.min(...essentialIndices.map((i) => visibility(landmarks[i]))) *
            (coverage === 'full' ? 1 : 0.85),
          0,
          1
        );
  return {
    state,
    regions,
    metrics,
    measurementCoverage,
    regionCoverage: regionCoverageFor(measurementCoverage),
    regionReasons,
    reason:
      state === 'unknown'
        ? 'Gardez votre tête et vos épaules dans le cadre.'
        : overallReason(regions, regionReasons, coverage),
    coverage,
    confidence,
    confidenceLabel:
      confidence >= 0.75
        ? 'Bonne visibilité'
        : confidence >= 0.5
          ? 'Visibilité partielle'
          : 'Détection incertaine',
    view,
    landmarks,
    face: orientation ? face : null
  };
}
