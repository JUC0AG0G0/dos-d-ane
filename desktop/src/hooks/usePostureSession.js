import {useCallback, useEffect, useRef, useState} from 'react';
import {releaseModels} from '../inference-client.js';
import {errorMessage} from './tracking-messages.js';
import {useModelComparison} from './useModelComparison.js';
import {usePostureTracking} from './usePostureTracking.js';

export function usePostureSession(visibleRef) {
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState('mediapipe');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const video = useRef(null);
  const canvas = useRef(null);
  const stream = useRef(null);
  const generation = useRef(0);
  const mascotSample = useRef(null);
  const startedAt = useRef(0);
  const elapsedBase = useRef(0);

  const clearDrawing = useCallback(() => {
    const drawing = canvas.current;
    if (drawing) drawing.getContext('2d').clearRect(0, 0, drawing.width, drawing.height);
  }, []);

  const {comparison, comparing, compareLock, compare, clearComparison, resetComparison} =
    useModelComparison({running, paused, video, generation, setMessage});
  const {assessment, visiblePoints, lastObservation, clearAssessment, resetNotices} =
    usePostureTracking({
      running, paused, selected, video, canvas, generation, compareLock,
      visibleRef, mascotSample, clearDrawing, setMessage,
    });

  const stopTracks = useCallback(() => {
    generation.current++;
    stream.current?.getTracks().forEach(track => track.stop());
    stream.current = null;
    if (video.current) {
      video.current.pause();
      video.current.srcObject = null;
    }
    clearDrawing();
  }, [clearDrawing]);

  const resetSession = useCallback((nextMessage = '') => {
    stopTracks();
    releaseModels();
    setRunning(false);
    setPaused(false);
    setBusy(false);
    clearAssessment();
    resetComparison();
    resetNotices();
    setElapsed(0);
    setMessage(nextMessage);
  }, [stopTracks, clearAssessment, resetComparison, resetNotices]);

  const startCamera = useCallback(async () => {
    const current = ++generation.current;
    setBusy(true);
    setMessage('Ouverture de la webcam…');
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: {ideal: 640},
          height: {ideal: 480},
          frameRate: {ideal: 24, max: 30},
        },
        audio: false,
      });
      if (current !== generation.current) {
        media.getTracks().forEach(track => track.stop());
        return false;
      }
      stream.current = media;
      video.current.srcObject = media;
      await video.current.play();
      if (current !== generation.current) {
        media.getTracks().forEach(track => track.stop());
        return false;
      }
      for (const track of media.getVideoTracks()) {
        track.onended = () => {
          if (current !== generation.current) return;
          resetSession('Connexion à la webcam interrompue.');
        };
      }
      setMessage('');
      setBusy(false);
      return true;
    } catch (error) {
      if (current === generation.current) {
        stream.current?.getTracks().forEach(track => track.stop());
        stream.current = null;
        if (video.current) video.current.srcObject = null;
        setBusy(false);
        setMessage(errorMessage(error));
      }
      return false;
    }
  }, [resetSession]);

  const start = async () => {
    if (running || busy) return;
    if (await startCamera()) {
      elapsedBase.current = 0;
      startedAt.current = performance.now();
      setElapsed(0);
      setRunning(true);
      setPaused(false);
      clearComparison();
    }
  };

  const stop = () => resetSession();

  const togglePause = async () => {
    if (paused) {
      if (await startCamera()) {
        startedAt.current = performance.now();
        setPaused(false);
      }
      return;
    }
    elapsedBase.current += Math.floor((performance.now() - startedAt.current) / 1000);
    stopTracks();
    setPaused(true);
    clearAssessment();
    resetComparison();
    setMessage('Suivi en pause · caméra arrêtée');
  };

  const selectModel = model => {
    setSelected(model);
    clearComparison();
  };

  useEffect(() => () => {
    stopTracks();
    releaseModels();
  }, [stopTracks]);

  useEffect(() => {
    if (!running || paused) return;
    const id = setInterval(() => {
      setElapsed(elapsedBase.current + Math.floor((performance.now() - startedAt.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [running, paused]);

  return {
    running, paused, selected, busy, message, elapsed,
    video, canvas, stream, mascotSample, assessment, visiblePoints,
    lastObservation, comparison, comparing, compare, start, stop, togglePause, selectModel,
  };
}
