import { asset, isImageMode } from './assets.js';

import {
  copyLandmarks,
  normalizeFaceLandmarks,
  normalizeHands
} from './landmarks.js';

let lastMediaPipeTime = 0;
let lastFaceTime = 0;
let lastHandTime = 0;

async function visionFiles() {
  const { FilesetResolver } = await import('@mediapipe/tasks-vision');
  const vision = await FilesetResolver.forVisionTasks(asset('wasm/mediapipe'));
  // MediaPipe's classic loader gets an ES module boundary wrapper at build time.
  if (typeof document === 'undefined') {
    vision.wasmLoaderPath = vision.wasmLoaderPath.replace(/\.js$/, '.mjs');
    globalThis.import = async (url) => {
      const module = await import(/* @vite-ignore */ url);
      globalThis.ModuleFactory = module.default;
    };
  }
  return vision;
}
async function createVisionTask(Task, vision, options) {
  try {
    return {
      task: await Task.createFromOptions(vision, {
        ...options,
        baseOptions: { ...options.baseOptions, delegate: 'GPU' }
      }),
      backend: 'WebGL'
    };
  } catch {
    return {
      task: await Task.createFromOptions(vision, {
        ...options,
        baseOptions: { ...options.baseOptions, delegate: 'CPU' }
      }),
      backend: 'CPU'
    };
  }
}
export async function loadMediaPipe() {
  const { PoseLandmarker } = await import('@mediapipe/tasks-vision');
  const { task, backend } = await createVisionTask(
    PoseLandmarker,
    await visionFiles(),
    {
      baseOptions: {
        modelAssetPath: asset('models/pose_landmarker_lite.task')
      },
      runningMode: isImageMode() ? 'IMAGE' : 'VIDEO',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
      outputSegmentationMasks: false
    }
  );
  return {
    backend,
    run: async (source) => {
      lastMediaPipeTime = Math.max(performance.now(), lastMediaPipeTime + 1);
      const output = isImageMode()
        ? task.detect(source)
        : task.detectForVideo(source, lastMediaPipeTime);
      return {
        landmarks: copyLandmarks(output.landmarks?.[0]),
        worldLandmarks: copyLandmarks(output.worldLandmarks?.[0])
      };
    },
    dispose: () => task.close()
  };
}
export async function loadFace() {
  const { FaceLandmarker } = await import('@mediapipe/tasks-vision');
  const { task, backend } = await createVisionTask(
    FaceLandmarker,
    await visionFiles(),
    {
      baseOptions: { modelAssetPath: asset('models/face_landmarker.task') },
      runningMode: isImageMode() ? 'IMAGE' : 'VIDEO',
      numFaces: 1,
      minFaceDetectionConfidence: 0.5,
      minFacePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: true
    }
  );
  return {
    backend,
    run: (source) => {
      lastFaceTime = Math.max(performance.now(), lastFaceTime + 1);
      const output = isImageMode()
        ? task.detect(source)
        : task.detectForVideo(source, lastFaceTime);
      if (!output.faceLandmarks?.[0]?.length) return null;
      const matrix = output.facialTransformationMatrixes?.[0];
      return {
        landmarks: normalizeFaceLandmarks(output.faceLandmarks[0]),
        matrix: matrix
          ? {
              data: Array.from(matrix.data),
              rows: matrix.rows,
              columns: matrix.columns,
              layout: 'column-major'
            }
          : null
      };
    },
    dispose: () => task.close()
  };
}
export async function loadHands() {
  const { HandLandmarker } = await import('@mediapipe/tasks-vision');
  const { task, backend } = await createVisionTask(
    HandLandmarker,
    await visionFiles(),
    {
      baseOptions: { modelAssetPath: asset('models/hand_landmarker.task') },
      runningMode: isImageMode() ? 'IMAGE' : 'VIDEO',
      numHands: 2,
      minHandDetectionConfidence: 0.5,
      minHandPresenceConfidence: 0.5,
      minTrackingConfidence: 0.5
    }
  );
  return {
    backend,
    run: (source) => {
      lastHandTime = Math.max(performance.now(), lastHandTime + 1);
      return normalizeHands(
        isImageMode()
          ? task.detect(source)
          : task.detectForVideo(source, lastHandTime)
      );
    },
    dispose: () => task.close()
  };
}

export function resetMediaPipeTimestamps() {
  lastMediaPipeTime = 0;
  lastFaceTime = 0;
  lastHandTime = 0;
}
