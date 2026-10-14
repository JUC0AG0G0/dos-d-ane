import {useCallback, useEffect, useRef, useState} from 'react';
import {MODEL_NAMES, detectPose, releaseModels} from '../inference-client.js';
import {countVisible, createPostureTracker, drawSkeleton} from '../pose.js';
import {mascotPose} from '../mascot-pose.js';
import {errorMessage, trackingAvailabilityMessage} from './tracking-messages.js';

export function usePostureTracking({
  running, paused, selected, video, canvas, generation, compareLock,
  visibleRef, mascotSample, clearDrawing, setMessage,
}) {
  const [assessment, setAssessment] = useState(null);
  const [visiblePoints, setVisiblePoints] = useState(0);
  const badSince = useRef(null);
  const lastObservation = useRef(0);
  const nextNotice = useRef(0);

  const clearAssessment = useCallback(() => {
    mascotSample.current = null;
    setAssessment(null);
    setVisiblePoints(0);
  }, [mascotSample]);

  const resetNotices = useCallback(() => {
    badSince.current = null;
    lastObservation.current = 0;
    nextNotice.current = 0;
  }, []);

  useEffect(() => {
    if (!running || paused) return;
    let cancelled = false;
    let timer;
    let lastVideoTime = -1;
    let lastUi = 0;
    let uiSignature = '';
    const sessionGeneration = generation.current;
    const tracker = createPostureTracker();

    clearAssessment();
    clearDrawing();
    setMessage(`Préparation de ${MODEL_NAMES[selected]}…`);

    function updateNotice(next, now) {
      if (lastObservation.current && now - lastObservation.current > 2000) {
        badSince.current = null;
      }
      lastObservation.current = now;
      if (next.state !== 'bad') {
        badSince.current = null;
        return;
      }
      badSince.current ??= now;
      if (now - badSince.current >= 30000 && now >= nextNotice.current) {
        window.desktop?.notify('Dos d’âne · posture à corriger', next.reason);
        nextNotice.current = now + 60000;
      }
    }

    function updatePreview(frame, next, source, now) {
      // The mascot consumes every sample; React only needs meaningful UI changes.
      mascotSample.current = next;
      if (visibleRef.current && !document.hidden) {
        drawSkeleton(
          canvas.current,
          {...frame, landmarks: next.landmarks ?? frame.landmarks, face: next.face},
          next.regions,
          source.videoWidth,
          source.videoHeight,
        );
      }
      if (now - lastUi < 250) return;
      const signature = JSON.stringify([
        next.state, next.regions, next.reason, next.coverage,
        next.regionCoverage, next.regionReasons, mascotPose(next).caption,
        next.hands?.length ?? 0,
      ]);
      if (signature !== uiSignature) {
        setAssessment(next);
        uiSignature = signature;
      }
      setVisiblePoints(countVisible(next.landmarks ?? frame.landmarks));
      lastUi = now;
    }

    async function loop() {
      if (cancelled) return;
      const frameStart = performance.now();
      let interval = 120;
      try {
        const source = video.current;
        const hasNewFrame = source?.readyState >= 2 && source.videoWidth &&
          source.currentTime !== lastVideoTime && !compareLock.current;
        if (hasNewFrame) {
          lastVideoTime = source.currentTime;
          const frame = await detectPose(selected, source, source.videoWidth, source.videoHeight);
          if (cancelled || sessionGeneration !== generation.current) return;
          const now = performance.now();
          const next = tracker.update(frame, source.videoWidth, source.videoHeight, now);
          interval = frame.recommendedIntervalMs ?? Math.max(
            selected === 'yolo' ? 220 : 100,
            Math.min(800, (frame.inferenceMs ?? 100) * 1.25),
          );
          updatePreview(frame, next, source, now);
          setMessage(trackingAvailabilityMessage(frame));
          updateNotice(next, now);
        }
      } catch (error) {
        if (cancelled || sessionGeneration !== generation.current || error?.name === 'AbortError') {
          return;
        }
        uiSignature = '';
        badSince.current = null;
        lastObservation.current = 0;
        setMessage(`${MODEL_NAMES[selected]} : ${errorMessage(error)}`);
        clearAssessment();
        clearDrawing();
        interval = 1500;
      }
      if (!cancelled) {
        timer = setTimeout(loop, Math.max(20, interval - (performance.now() - frameStart)));
      }
    }

    const freshness = setInterval(() => {
      const stale = lastObservation.current && performance.now() - lastObservation.current > 3000;
      if (!cancelled && !compareLock.current && stale) {
        clearAssessment();
        clearDrawing();
        uiSignature = '';
        lastObservation.current = 0;
        setMessage('Le suivi est interrompu. Vérifiez le cadrage et la webcam.');
      }
    }, 500);

    loop();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearInterval(freshness);
      releaseModels();
      badSince.current = null;
      lastObservation.current = 0;
    };
  }, [
    running, paused, selected, video, canvas, generation, compareLock,
    visibleRef, mascotSample, clearDrawing, clearAssessment, setMessage,
  ]);

  return {assessment, visiblePoints, lastObservation, clearAssessment, resetNotices};
}
