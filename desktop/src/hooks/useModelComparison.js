import {useCallback, useRef, useState} from 'react';
import {MODEL_NAMES, detectPose} from '../inference-client.js';
import {countVisible, evaluate} from '../pose.js';
import {errorMessage} from './tracking-messages.js';

export function useModelComparison({running, paused, video, generation, setMessage}) {
  const [comparison, setComparison] = useState([]);
  const [comparing, setComparing] = useState(false);
  const compareLock = useRef(false);

  const clearComparison = useCallback(() => setComparison([]), []);
  const resetComparison = useCallback(() => {
    setComparison([]);
    setComparing(false);
    compareLock.current = false;
  }, []);

  const compare = async () => {
    if (!running || paused || comparing || video.current?.readyState < 2 || !video.current?.videoWidth) {
      return;
    }
    compareLock.current = true;
    setComparing(true);
    setComparison([]);
    const comparisonGeneration = generation.current;
    const source = video.current;
    const rows = [];
    let failed = false;

    try {
      const snapshot = document.createElement('canvas');
      snapshot.width = source.videoWidth;
      snapshot.height = source.videoHeight;
      snapshot.getContext('2d').drawImage(source, 0, 0);

      for (const model of Object.keys(MODEL_NAMES)) {
        if (comparisonGeneration !== generation.current) return;
        setMessage(`Comparaison : ${MODEL_NAMES[model]}…`);
        try {
          const frame = await detectPose(model, snapshot, snapshot.width, snapshot.height, {
            detail: true,
            comparison: true,
          });
          rows.push({
            model,
            ...evaluate(frame, snapshot.width, snapshot.height),
            visible: countVisible(frame.landmarks),
            time: Math.round(frame.inferenceMs),
            faceAvailable: frame.faceAvailable,
            handsAvailable: frame.handsAvailable,
            backend: frame.backend,
          });
        } catch (error) {
          rows.push({model, error: errorMessage(error)});
        }
        if (comparisonGeneration !== generation.current) return;
        setComparison([...rows]);
      }
    } catch (error) {
      failed = true;
      if (comparisonGeneration === generation.current) setMessage(errorMessage(error));
    } finally {
      if (comparisonGeneration === generation.current) {
        if (!failed) setMessage('');
        setComparing(false);
        compareLock.current = false;
      }
    }
  };

  return {comparison, comparing, compareLock, compare, clearComparison, resetComparison};
}
