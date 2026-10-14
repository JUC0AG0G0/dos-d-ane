import { normalizeCoco } from '../pose/landmarks.js';

import { asset } from './assets.js';

// YOLOv8n-pose ONNX output: [1, 56, 8400] or [1, 8400, 56].
export function decodeYolo(output, { width, height, scale, padX, padY }) {
  const dims = output.dims;
  if (dims.length !== 3 || dims[0] !== 1)
    throw new Error('Format de sortie YOLO Pose non reconnu.');
  const channelsFirst = dims[1] === 56;
  const stride = channelsFirst ? dims[2] : dims[1];
  if ((channelsFirst ? dims[1] : dims[2]) !== 56)
    throw new Error('Ce modèle YOLO Pose ne fournit pas 17 articulations.');
  const data = output.data;
  const get = (row, channel) =>
    channelsFirst ? data[channel * stride + row] : data[row * 56 + channel];
  let best = -1,
    confidence = 0.35;
  for (let row = 0; row < stride; row++)
    if (get(row, 4) > confidence) {
      confidence = get(row, 4);
      best = row;
    }
  if (best < 0) return [];
  const points = [];
  for (let i = 0; i < 17; i++) {
    const x = (get(best, 5 + 3 * i) - padX) / scale,
      y = (get(best, 6 + 3 * i) - padY) / scale;
    const inside = x >= 0 && x <= width && y >= 0 && y <= height;
    points.push({ x, y, score: inside ? get(best, 7 + 3 * i) : 0 });
  }
  return normalizeCoco(points, width, height);
}
export async function loadYolo() {
  const ort = await import('onnxruntime-web/webgpu');
  ort.env.wasm.wasmPaths = asset('wasm/onnx/');
  ort.env.wasm.numThreads = globalThis.crossOriginIsolated
    ? Math.min(4, navigator.hardwareConcurrency || 2)
    : 1;
  ort.env.wasm.proxy = false;
  const response = await fetch(asset('models/yolov8n-pose.onnx'));
  if (!response.ok)
    throw new Error(
      'Modèle YOLO Pose absent. Lancez « npm run model:yolo » dans le dossier desktop.'
    );
  const bytes = new Uint8Array(await response.arrayBuffer());
  let session, backend;
  if (navigator.gpu) {
    try {
      session = await ort.InferenceSession.create(bytes, {
        executionProviders: ['webgpu'],
        graphOptimizationLevel: 'all'
      });
      backend = 'WebGPU';
    } catch {
      /* This device/model may not support the WebGPU execution provider. */
    }
  }
  if (!session) {
    session = await ort.InferenceSession.create(bytes, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all'
    });
    backend = 'WASM';
  }
  const canvas = new OffscreenCanvas(640, 640),
    context = canvas.getContext('2d', { willReadFrequently: true });
  const plane = 640 * 640,
    values = new Float32Array(3 * plane);
  const tensor = new ort.Tensor('float32', values, [1, 3, 640, 640]);
  return {
    backend,
    run: async (source, width, height) => {
      const scale = Math.min(640 / width, 640 / height),
        targetWidth = Math.round(width * scale),
        targetHeight = Math.round(height * scale);
      const padX = Math.floor((640 - targetWidth) / 2),
        padY = Math.floor((640 - targetHeight) / 2);
      context.fillStyle = '#727272';
      context.fillRect(0, 0, 640, 640);
      context.drawImage(source, padX, padY, targetWidth, targetHeight);
      const pixels = context.getImageData(0, 0, 640, 640).data;
      for (let index = 0; index < plane; index++) {
        const sourceIndex = index * 4;
        values[index] = pixels[sourceIndex] / 255;
        values[plane + index] = pixels[sourceIndex + 1] / 255;
        values[2 * plane + index] = pixels[sourceIndex + 2] / 255;
      }
      const result = await session.run({ [session.inputNames[0]]: tensor });
      try {
        return {
          landmarks: decodeYolo(result[session.outputNames[0]], {
            width,
            height,
            scale,
            padX,
            padY
          })
        };
      } finally {
        for (const output of Object.values(result)) output.dispose();
      }
    },
    dispose: async () => {
      tensor.dispose();
      await session.release();
    }
  };
}
