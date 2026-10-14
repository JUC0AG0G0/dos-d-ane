import { isImageMode } from './assets.js';

import { freshHands, handTrackingInterval } from './landmarks.js';

import {
  loadFace,
  loadHands,
  loadMediaPipe,
  resetMediaPipeTimestamps
} from './mediapipe.js';

import { loadMoveNet } from './movenet.js';

import { loadYolo } from './yolo.js';

let selected = null;
let selectedDetector = null;
let faceDetector = null;
let faceUnavailable = false;
let faceError = null;
let faceCache = null;
let lastFaceAttempt = -Infinity;
let handDetector = null;
let handUnavailable = false;
let handError = null;
let handCache = null;
let lastHandAttempt = -Infinity;
let smoothedInferenceMs = 0;

const loaders = {
  mediapipe: loadMediaPipe,
  movenet: loadMoveNet,
  yolo: loadYolo
};

export async function detectPose(
  model,
  source,
  width,
  height,
  { detail = true, comparison = false } = {}
) {
  if (!loaders[model]) throw new Error('Modèle inconnu.');
  const loadStart = performance.now();
  let loaded = false;
  if (selected !== model || !selectedDetector) {
    await selectedDetector?.dispose();
    selectedDetector = null;
    selected = model;
    selectedDetector = await loaders[model]();
    smoothedInferenceMs = 0;
    loaded = true;
  }
  const faceDue =
    detail &&
    (comparison ||
      performance.now() - lastFaceAttempt >=
        Math.max(70, smoothedInferenceMs * 1.3));
  let faceLoaded = false;
  if (faceDue && !faceUnavailable && !faceDetector) {
    try {
      faceDetector = await loadFace();
      faceLoaded = true;
    } catch (error) {
      faceUnavailable = true;
      faceCache = null;
      faceError = error.message || 'Analyse du visage indisponible.';
    }
  }
  const handDue =
    detail &&
    (isImageMode() ||
      comparison ||
      performance.now() - lastHandAttempt >=
        handTrackingInterval(smoothedInferenceMs));
  let handLoaded = false;
  if (handDue && !handUnavailable && !handDetector) {
    try {
      handDetector = await loadHands();
      handLoaded = true;
    } catch (error) {
      handUnavailable = true;
      handCache = null;
      handError = error.message || 'Suivi des mains indisponible.';
    }
  }
  // Warm-up excludes load and GPU compilation from reported inference timings.
  if (loaded) await selectedDetector.run(source, width, height);
  if (faceLoaded) {
    try {
      faceDetector.run(source);
    } catch (error) {
      faceUnavailable = true;
      faceCache = null;
      faceError = error.message || 'Analyse du visage indisponible.';
    }
  }
  if (handLoaded) {
    try {
      handDetector.run(source);
    } catch (error) {
      handUnavailable = true;
      handCache = null;
      handError = error.message || 'Suivi des mains indisponible.';
    }
  }
  const loadMs = performance.now() - loadStart;
  const started = performance.now();
  const result = await selectedDetector.run(source, width, height);
  let faceMs = 0;
  if (faceDue && faceDetector && !faceUnavailable) {
    lastFaceAttempt = performance.now();
    const faceStart = performance.now();
    try {
      const face = faceDetector.run(source);
      faceMs = performance.now() - faceStart;
      faceCache = face
        ? { ...face, capturedAt: performance.now(), inferenceMs: faceMs }
        : null;
    } catch (error) {
      faceCache = null;
      faceUnavailable = true;
      faceError = error.message || 'Analyse du visage interrompue.';
    }
  }
  let handMs = 0;
  if (handDue && handDetector && !handUnavailable) {
    lastHandAttempt = performance.now();
    const handStart = performance.now();
    try {
      const hands = handDetector.run(source);
      handMs = performance.now() - handStart;
      // Empty detections immediately remove stale fingers from the avatar.
      handCache = hands.length
        ? { hands, capturedAt: performance.now() }
        : null;
    } catch (error) {
      handCache = null;
      handUnavailable = true;
      handError = error.message || 'Suivi des mains interrompu.';
    }
  }
  const inferenceMs = performance.now() - started;
  smoothedInferenceMs = smoothedInferenceMs
    ? smoothedInferenceMs * 0.8 + inferenceMs * 0.2
    : inferenceMs;
  const ageMs = faceCache ? performance.now() - faceCache.capturedAt : Infinity;
  if (ageMs > 900) faceCache = null;
  const handAgeMs = handCache
    ? performance.now() - handCache.capturedAt
    : Infinity;
  if (handAgeMs > 250 || !detail) handCache = null;
  return {
    ...result,
    face: detail && faceCache ? { ...faceCache, ageMs } : null,
    faceAvailable: Boolean(detail && faceDetector && !faceUnavailable),
    faceError,
    hands: detail ? freshHands(handCache, performance.now()) : [],
    handsAvailable: Boolean(detail && handDetector && !handUnavailable),
    handError,
    handAgeMs: handCache ? handAgeMs : null,
    model,
    width,
    height,
    inferenceMs: Math.round(inferenceMs),
    poseMs: Math.round(inferenceMs - faceMs - handMs),
    handMs: Math.round(handMs),
    loadMs: loaded ? Math.round(loadMs) : 0,
    backend: selectedDetector.backend,
    recommendedIntervalMs: Math.max(
      70,
      Math.min(1500, Math.round(smoothedInferenceMs * 1.3))
    )
  };
}
export async function releaseModels() {
  await selectedDetector?.dispose();
  selectedDetector = null;
  selected = null;
  faceDetector?.dispose();
  faceDetector = null;
  faceCache = null;
  faceUnavailable = false;
  faceError = null;
  handDetector?.dispose();
  handDetector = null;
  handCache = null;
  handUnavailable = false;
  handError = null;
  lastFaceAttempt = -Infinity;
  lastHandAttempt = -Infinity;
  resetMediaPipeTimestamps();
  smoothedInferenceMs = 0;
}
