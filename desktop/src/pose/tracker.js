import { clamp } from './geometry.js';

import { asFrame, valid } from './landmarks.js';

import {
  overallReason,
  rank,
  regionDescriptions,
  regionKeys,
  worst
} from './feedback.js';

import { evaluate } from './evaluate.js';

/** Adaptive smoothing + time-based hysteresis. No queued frames or reference
 * calibration. One noisy frame must not trigger a posture alert.
 */
export function createPostureTracker({
  smoothingMs = 90,
  warningMs = 450,
  badMs = 650,
  recoveryMs = 950,
  missingMs = 350
} = {}) {
  let previous = null,
    lastTime = null,
    context = null;
  const stable = {},
    pending = {};
  const reset = () => {
    previous = null;
    lastTime = null;
    context = null;
    for (const key of regionKeys) {
      delete stable[key];
      delete pending[key];
    }
  };
  const smooth = (next, old, dt, world = false) =>
    (next ?? []).map((p, i) => {
      const prior = old?.[i];
      if (
        !p ||
        (world ? !Number.isFinite(p.x + p.y + p.z) : !valid(p)) ||
        !prior
      )
        return p ? { ...p } : null;
      const movement = Math.hypot(
        p.x - prior.x,
        p.y - prior.y,
        (p.z ?? 0) - (prior.z ?? 0)
      );
      const tau = smoothingMs / (1 + movement * (world ? 35 : 60));
      const alpha = clamp(1 - Math.exp(-dt / Math.max(1, tau)), 0.15, 1);
      return {
        ...p,
        x: prior.x + (p.x - prior.x) * alpha,
        y: prior.y + (p.y - prior.y) * alpha,
        ...(Number.isFinite(p.z)
          ? { z: (prior.z ?? p.z) + (p.z - (prior.z ?? p.z)) * alpha }
          : {})
      };
    });
  return {
    reset,
    update(input, width, height, time = performance.now()) {
      const frame = asFrame(input),
        key = `${frame.model ?? ''}:${width}:${height}`;
      const maxGap = Math.max(
        1200,
        Math.min(3000, (frame.recommendedIntervalMs ?? 0) * 2.5)
      );
      if (
        context !== null &&
        (context !== key || time <= lastTime || time - lastTime > maxGap)
      )
        reset();
      context = key;
      const dt = lastTime === null ? 100 : clamp(time - lastTime, 1, 350);
      const filtered = {
        ...frame,
        landmarks: smooth(frame.landmarks, previous?.landmarks, dt),
        worldLandmarks: frame.worldLandmarks
          ? smooth(frame.worldLandmarks, previous?.worldLandmarks, dt, true)
          : undefined
      };
      const raw = evaluate(filtered, width, height, time);
      previous = filtered;
      lastTime = time;
      for (const key of regionKeys) {
        const candidate = raw.regions[key];
        if (stable[key] === undefined) stable[key] = candidate;
        if (candidate === stable[key]) {
          delete pending[key];
          continue;
        }
        if (!pending[key] || pending[key].state !== candidate)
          pending[key] = { state: candidate, since: time };
        const dwell =
          candidate === 'unknown'
            ? missingMs
            : rank[candidate] > rank[stable[key]]
              ? candidate === 'bad'
                ? badMs
                : warningMs
              : recoveryMs;
        if (time - pending[key].since >= dwell) {
          stable[key] = candidate;
          delete pending[key];
        }
      }
      const regions = { ...stable };
      const regionReasons = regionDescriptions(
        regions,
        raw.measurementCoverage,
        raw.metrics,
        raw.view
      );
      const state =
        raw.state === 'unknown' ? 'unknown' : worst(...Object.values(regions));
      return {
        ...raw,
        state,
        regions,
        regionReasons,
        hands: frame.hands ?? [],
        handsAvailable: frame.handsAvailable,
        observedAt: time,
        handsObservedAt: time - (frame.handAgeMs ?? 0),
        frameSize: { width, height },
        reason:
          state === 'unknown'
            ? raw.reason
            : overallReason(regions, regionReasons, raw.coverage),
        rawState: raw.state,
        settling: Object.keys(pending).length > 0
      };
    }
  };
}
