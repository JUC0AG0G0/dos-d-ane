import { normalizeCoco } from '../pose/landmarks.js';

import { isImageMode } from './assets.js';

export async function loadMoveNet() {
  const tf = await import('@tensorflow/tfjs-core');
  await import('@tensorflow/tfjs-backend-webgl');
  await import('@tensorflow/tfjs-backend-cpu');
  try {
    if (!(await tf.setBackend('webgl'))) throw new Error('WebGL unavailable');
    await tf.ready();
  } catch {
    await tf.setBackend('cpu');
    await tf.ready();
  }
  const poseDetection = await import('@tensorflow-models/pose-detection');
  const detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      enableSmoothing: !isImageMode()
    }
  );
  const canvas = new OffscreenCanvas(480, 360),
    context = canvas.getContext('2d');
  return {
    backend: tf.getBackend() === 'webgl' ? 'WebGL' : 'CPU',
    run: async (source, width, height) => {
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      context.drawImage(source, 0, 0, width, height);
      if (isImageMode()) detector.reset();
      const poses = await detector.estimatePoses(canvas, {
        maxPoses: 1,
        flipHorizontal: false
      });
      return { landmarks: normalizeCoco(poses?.[0]?.keypoints, width, height) };
    },
    dispose: () => detector.dispose()
  };
}
