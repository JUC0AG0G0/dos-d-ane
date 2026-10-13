// Webcam prototype. Images stay in memory: no frame or landmark upload is made.
// The shared analysis server can later consume the landmark list from onFrame.
// MediaPipe API: https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js
const VISION_ROOT = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32';
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
const FRAME_INTERVAL = 125;
const UNKNOWN_REGIONS = () => ({ head: 'unknown', shoulders: 'unknown', torso: 'unknown' });
const RANK = { unknown: -1, good: 0, warning: 1, bad: 2 };
const friendlyError = (error) => {
  if (error?.name === 'NotAllowedError' || error?.name === 'SecurityError') return 'Accès à la caméra refusé. Autorisez la caméra dans les réglages du navigateur.';
  if (error?.name === 'NotFoundError') return 'Aucune caméra détectée. Branchez une webcam, puis réessayez.';
  if (error?.name === 'NotReadableError' || error?.name === 'AbortError') return 'La caméra est indisponible. Fermez les autres applications qui l’utilisent, puis réessayez.';
  return 'Impossible de lancer le suivi. Vérifiez votre connexion pour charger le modèle, puis réessayez.';
};

export function isReliableLandmark(point) {
  return Boolean(point && Number.isFinite(point.x) && Number.isFinite(point.y) &&
    point.x > 0.015 && point.x < 0.985 && point.y > 0.015 && point.y < 0.985 &&
    (point.visibility ?? 1) >= 0.65 && (point.presence ?? 1) >= 0.65);
}

// Pixel-aspect correction prevents a widescreen image from distorting the angles.
function measure(landmarks, width, height) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0 ||
      !landmarks?.length || !isReliableLandmark(landmarks[11]) || !isReliableLandmark(landmarks[12])) return null;
  const point = (index) => ({ x: landmarks[index].x * width, y: landmarks[index].y * height });
  const left = point(11), right = point(12);
  const shoulderSpan = Math.hypot(left.x - right.x, left.y - right.y);
  if (shoulderSpan < width * 0.09) return null;
  const shoulder = { x: (left.x + right.x) / 2, y: (left.y + right.y) / 2 };
  const metrics = {
    shoulderAngle: Math.atan2(right.y - left.y, Math.abs(right.x - left.x)) * 180 / Math.PI,
    headOffset: null,
    headTiltAngle: null,
    torsoAngle: null,
  };
  if (isReliableLandmark(landmarks[0])) {
    const nose = point(0);
    metrics.headOffset = (nose.x - shoulder.x) / shoulderSpan;
  }
  // Prefer the eye centers. Both points of a pair must be visible; otherwise
  // try the ears. A tiny pair would amplify detector noise into a large angle.
  // Signed roll is positive when landmark 5 (or 8) is lower in the raw image.
  for (const [a, b] of [[2, 5], [7, 8]]) {
    if (!isReliableLandmark(landmarks[a]) || !isReliableLandmark(landmarks[b])) continue;
    const first = point(a), second = point(b);
    const dx = second.x - first.x, dy = second.y - first.y;
    if (Math.hypot(dx, dy) < Math.max(width * 0.008, shoulderSpan * 0.08)) continue;
    metrics.headTiltAngle = Math.atan2(dy, Math.abs(dx)) * 180 / Math.PI;
    break;
  }
  if (isReliableLandmark(landmarks[23]) && isReliableLandmark(landmarks[24])) {
    const hipLeft = point(23), hipRight = point(24);
    const hip = { x: (hipLeft.x + hipRight.x) / 2, y: (hipLeft.y + hipRight.y) / 2 };
    if (hip.y - shoulder.y > shoulderSpan * 0.25) {
      metrics.torsoAngle = Math.atan2(shoulder.x - hip.x, hip.y - shoulder.y) * 180 / Math.PI;
    }
  }
  return metrics;
}

function smooth(previous, current) {
  if (!previous) return current;
  return Object.fromEntries(Object.entries(current).map(([key, value]) => [
    key, value === null ? null : previous[key] === null ? value : previous[key] * 0.65 + value * 0.35,
  ]));
}

function severity(distance, warning, bad) {
  return distance >= bad ? 'bad' : distance >= warning ? 'warning' : 'good';
}

function classifyMetrics(metrics) {
  const regions = UNKNOWN_REGIONS();
  if (!metrics) return {
    state: 'unknown', regions, metrics: null,
    reason: 'Placez votre tête et vos épaules face à la caméra, dans le cadre.',
  };
  // Unvalidated prototype hypotheses for a level, front-facing camera. These
  // compare image geometry, not a personal baseline or a medical definition.
  // No forward lean/depth inference is made from these 2D measurements.
  regions.shoulders = severity(Math.abs(metrics.shoulderAngle), 7, 13);
  const headTiltState = metrics.headTiltAngle === null ? 'unknown'
    : severity(Math.abs(metrics.headTiltAngle), 10, 18);
  const headOffsetState = metrics.headOffset === null ? 'unknown'
    : severity(Math.abs(metrics.headOffset), 0.17, 0.30);
  if (metrics.headOffset !== null) {
    regions.head = RANK[headTiltState] > RANK[headOffsetState] ? headTiltState : headOffsetState;
  }
  if (metrics.torsoAngle !== null) {
    regions.torso = severity(Math.abs(metrics.torsoAngle), 8, 15);
  }
  // Missing head/shoulders must never produce a green overall result. Hips
  // are optional in a seated webcam view and remain individually unknown.
  if (regions.head === 'unknown') return {
    state: 'unknown', regions, metrics,
    reason: 'Votre tête est hors du cadre ou mal détectée. Ajustez le cadrage.',
  };
  const ranked = Object.entries(regions).sort((a, b) => RANK[b[1]] - RANK[a[1]]);
  const state = ranked[0][1];
  let reason = state === 'good'
    ? metrics.headTiltAngle === null
      ? 'Votre tête est centrée et vos épaules semblent horizontales. Inclinaison de tête non mesurable.'
      : 'Votre tête et vos épaules semblent alignées.'
    : {
        head: RANK[headTiltState] >= RANK[headOffsetState]
          ? 'Votre tête paraît inclinée sur le côté.'
          : 'Votre tête est décalée sur le côté.',
        shoulders: 'Vos épaules paraissent inclinées.',
        torso: 'Votre buste paraît incliné sur le côté.',
      }[ranked[0][0]];
  if (state === 'good') reason += regions.torso === 'unknown'
    ? ' Le buste n’est pas visible.' : ' Le buste semble aligné.';
  return { state, regions, metrics, reason };
}

/** Pure automatic 2D evaluation. No session state or initial pose is required. */
export function evaluateLandmarks(landmarks, width, height) {
  return { landmarks: landmarks ?? [], ...classifyMetrics(measure(landmarks, width, height)) };
}

/**
 * start(): Promise<boolean>; false means this start was cancelled with stop().
 * stop(): immediately releases an acquired webcam and cancels future inference.
 * onFrame: {landmarks,state,regions,metrics,reason}.
 * Evaluation starts automatically using generic image-alignment heuristics.
 * State names are prototype feedback, not a medical assessment.
 */
export function createPoseEngine({ video, onFrame = () => {}, onStatus = () => {} }) {
  let generation = 0;
  let session = null;
  let filtered = null;
  let lastFrameTime = 0;

  const emitUnknown = (reason, landmarks = []) => onFrame({
    landmarks, state: 'unknown', regions: UNKNOWN_REGIONS(), metrics: null,
    reason,
  });
  const dispose = (run) => {
    if (!run || run.disposed) return;
    run.disposed = true;
    window.clearTimeout(run.timer);
    run.stream?.getTracks().forEach((track) => track.stop());
    try { run.model?.close(); } catch { /* A cancelled initialization may have already disposed it. */ }
    if (video.srcObject === run.stream) {
      video.pause();
      video.srcObject = null;
    }
  };
  const valid = (run) => session === run && generation === run.id && !run.disposed;
  const report = (phase, message) => onStatus({ phase, message });

  const process = (run) => {
    if (!valid(run)) return;
    try {
      if (video.readyState >= 2 && video.currentTime !== run.lastVideoTime) {
        run.lastVideoTime = video.currentTime;
        const result = run.model.detectForVideo(video, performance.now());
        const landmarks = result.landmarks?.[0]?.map(({ x, y, z, visibility, presence }) => ({ x, y, z, visibility, presence })) ?? [];
        const measured = measure(landmarks, video.videoWidth, video.videoHeight);
        lastFrameTime = performance.now();
        if (!measured) {
          filtered = null;
          emitUnknown('Placez votre tête et vos épaules face à la caméra, dans le cadre.', landmarks);
        } else {
          filtered = smooth(filtered, measured);
          onFrame({ landmarks, ...classifyMetrics({ ...filtered }) });
        }
      } else if (lastFrameTime && performance.now() - lastFrameTime > 2500) {
        filtered = null;
        emitUnknown('Le flux de la caméra est interrompu. Vérifiez votre webcam.');
      }
      if (valid(run)) run.timer = window.setTimeout(() => process(run), FRAME_INTERVAL);
    } catch (error) {
      if (!valid(run)) return;
      dispose(run);
      session = null;
      report('error', friendlyError(error));
      emitUnknown('Le suivi est interrompu. Relancez une session.');
    }
  };

  const stop = () => {
    generation += 1;
    dispose(session);
    session = null;
    filtered = null;
    report('stopped', 'Caméra arrêtée.');
  };

  const start = async () => {
    // A second start supersedes a pending permission/model request safely.
    generation += 1;
    dispose(session);
    const run = { id: generation, stream: null, model: null, timer: null, disposed: false, lastVideoTime: -1 };
    session = run;
    filtered = null;
    lastFrameTime = 0;
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera API unavailable');
      report('camera', 'Autorisez la caméra pour démarrer.');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 20, max: 30 } },
        audio: false,
      });
      if (!valid(run)) {
        stream.getTracks().forEach((track) => track.stop());
        return false;
      }
      run.stream = stream;
      for (const track of stream.getVideoTracks()) {
        track.addEventListener('ended', () => {
          if (!valid(run)) return;
          dispose(run);
          session = null;
          report('error', 'La caméra a été déconnectée. Relancez une session.');
          emitUnknown('Caméra déconnectée.');
        });
      }
      video.muted = true;
      video.playsInline = true;
      video.srcObject = stream;
      await video.play();
      if (!valid(run)) return false;
      report('model', 'Chargement du suivi du squelette…');
      const { FilesetResolver, PoseLandmarker } = await import(`${VISION_ROOT}/vision_bundle.mjs`);
      if (!valid(run)) return false;
      const vision = await FilesetResolver.forVisionTasks(`${VISION_ROOT}/wasm`);
      if (!valid(run)) return false;
      const options = {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        runningMode: 'VIDEO', numPoses: 1,
        minPoseDetectionConfidence: 0.6,
        minPosePresenceConfidence: 0.6,
        minTrackingConfidence: 0.6,
        outputSegmentationMasks: false,
      };
      let model;
      try {
        model = await PoseLandmarker.createFromOptions(vision, options);
      } catch (gpuError) {
        if (!valid(run)) return false;
        model = await PoseLandmarker.createFromOptions(vision, {
          ...options, baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' },
        });
      }
      if (!valid(run)) {
        model.close();
        return false;
      }
      run.model = model;
      report('running', 'Caméra active. Le suivi de votre posture démarre automatiquement.');
      process(run);
      return valid(run);
    } catch (error) {
      if (!valid(run)) return false;
      dispose(run);
      session = null;
      const message = friendlyError(error);
      report('error', message);
      throw new Error(message, { cause: error });
    }
  };

  return { start, stop };
}
