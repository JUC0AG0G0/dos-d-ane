// Visibility-gated alignment heuristics, not a clinically validated posture model.
// Pose landmarks estimate ears / shoulders; they do not locate cervical vertebrae.
const DEG = 180 / Math.PI;
const rank = { unknown: -1, good: 0, warning: 1, bad: 2 };
const regionKeys = ['head', 'neck', 'shoulders', 'torso'];
const worst = (...states) => states.reduce((a, b) => rank[a] >= rank[b] ? a : b, 'unknown');
const stateFor = (value, warning, bad) => value >= bad ? 'bad' : value >= warning ? 'warning' : 'good';
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const visibility = p => Math.min(p?.visibility ?? p?.score ?? 1, p?.presence ?? 1);
export const valid = p => Boolean(p && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x > .005 && p.x < .995 && p.y > .005 && p.y < .995 && visibility(p) >= .5);
const pair = (points, a, b) => valid(points?.[a]) && valid(points?.[b]);
const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: ((a.z ?? 0) + (b.z ?? 0)) / 2 });
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: (a.z ?? 0) - (b.z ?? 0) });
const dot = (a, b) => a.x * b.x + a.y * b.y + (a.z ?? 0) * (b.z ?? 0);
const length = p => Math.hypot(p.x, p.y, p.z ?? 0);
const unit = p => { const n = length(p); return n > 1e-6 ? { x: p.x / n, y: p.y / n, z: (p.z ?? 0) / n } : null; };
const cross = (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
const asFrame = input => Array.isArray(input) ? { landmarks: input } : (input ?? {});
const freshFace = (frame, time) => {
  const face = frame.face;
  if (!face) return null;
  const age = Number.isFinite(face.ageMs) ? face.ageMs : Number.isFinite(time) && Number.isFinite(face.capturedAt ?? face.timestamp) ? time - (face.capturedAt ?? face.timestamp) : 0;
  return age >= -50 && age <= 1000 ? face : null;
};

/** MediaPipe's canonical-face -> camera matrix is column-major by default.
 * JS returns MatrixData.packed_data unchanged; the C++ serializer uses Eigen's
 * layout (mediapipe/framework/formats/matrix_data.proto + matrix.cc).
 * Remove uniform scale before reading rotation. Malformed matrices fail closed.
 */
export function faceOrientation(matrix) {
  const data = matrix?.data ?? matrix;
  if (!data || data.length !== 16 || Array.from(data).some(v => !Number.isFinite(v))) return null;
  if (matrix?.rows && (matrix.rows !== 4 || matrix.columns !== 4)) return null;
  const rowMajor = matrix?.layout === 'row-major' || matrix?.layout === 'ROW_MAJOR';
  const at = (row, col) => data[rowMajor ? row * 4 + col : col * 4 + row];
  if (Math.abs(at(3, 3) - 1) > .05 || [0, 1, 2].some(i => Math.abs(at(3, i)) > .01)) return null;
  const columns = [0, 1, 2].map(i => ({ x: at(0, i), y: at(1, i), z: at(2, i) }));
  const sizes = columns.map(length);
  if (Math.min(...sizes) < .1 || Math.max(...sizes) / Math.min(...sizes) > 1.15) return null;
  const [x, y, z] = columns.map(unit);
  if (Math.max(Math.abs(dot(x, y)), Math.abs(dot(x, z)), Math.abs(dot(y, z))) > .12 || dot(cross(x, y), z) < .85) return null;
  return { pitch: Math.atan2(y.z, z.z) * DEG, yaw: Math.asin(clamp(-x.z, -1, 1)) * DEG, roll: Math.atan2(x.y, x.x) * DEG };
}

function credibleFace(face, landmarks, width, height) {
  const points = face?.landmarks;
  if (!points || points.length < 100 || !pair(points, 33, 263) || !valid(points[152]) || !valid(points[10])) return false;
  const eyes = mid(points[33], points[263]);
  const extent = Math.hypot((points[33].x - points[263].x) * width, (points[33].y - points[263].y) * height);
  if (extent < width * .018 || (points[152].y - points[10].y) * height < height * .05) return false;
  // A second face in the background must not control the tracked body's status.
  if (valid(landmarks?.[0]) && valid(points[1])) {
    if (Math.hypot((points[1].x - landmarks[0].x) * width, (points[1].y - landmarks[0].y) * height) > extent * 1.2) return false;
  }
  return valid(eyes);
}

function determineView(points, orientation, width, height) {
  let headView = orientation ? Math.abs(orientation.yaw) >= 50 ? 'profile' : Math.abs(orientation.yaw) > 25 ? 'oblique' : 'front' : 'unknown';
  if (pair(points, 7, 8) && valid(points[0])) {
    const ears = mid(points[7], points[8]);
    const span = Math.hypot((points[7].x - points[8].x) * width, (points[7].y - points[8].y) * height);
    const offset = Math.abs(points[0].x - ears.x) * width / Math.max(span, width * .015);
    if (!orientation) headView = offset >= .7 ? 'profile' : offset > .4 ? 'oblique' : 'front';
  }
  const ear = valid(points[7]) ? points[7] : valid(points[8]) ? points[8] : null;
  if (headView === 'unknown' && ear && valid(points[0]) && Math.abs(points[0].x - ear.x) * width > width * .025 && !pair(points, 7, 8)) headView = 'profile';
  if (pair(points, 11, 12)) {
    const shoulders = mid(points[11], points[12]);
    const span = Math.abs(points[12].x - points[11].x) * width;
    const torsoHeight = pair(points, 23, 24) ? (mid(points[23], points[24]).y - shoulders.y) * height : 0;
    const neckHeight = ear ? (shoulders.y - ear.y) * height : 0;
    const scale = torsoHeight > height * .08 ? torsoHeight : neckHeight;
    // Turning only the face does not make a frontal body a side view.
    if (scale > height * .04 && span / scale >= .5) return 'front';
    if (scale > height * .04 && span / scale < .4 && headView === 'profile') return 'profile';
    return headView === 'profile' ? 'oblique' : headView === 'unknown' && pair(points, 2, 5) ? 'front' : headView;
  }
  // A real side view often hides the far shoulder. Require a same-side ear,
  // shoulder and hip together so a cropped frontal shoulder is not enough.
  if (headView === 'profile') for (const [earIndex, shoulderIndex, hipIndex] of [[7, 11, 23], [8, 12, 24]]) {
    if (valid(points[earIndex]) && valid(points[shoulderIndex]) && valid(points[hipIndex]) && (points[hipIndex].y - points[shoulderIndex].y) * height > height * .08) return 'profile';
  }
  return 'unknown';
}

function worldNeck(frame, pixels) {
  const points = frame.worldLandmarks;
  if (!points || (frame.model && frame.model !== 'mediapipe')) return null;
  const usable = i => valid(pixels?.[i]) && visibility(pixels[i]) >= .65 && points[i] && ['x', 'y', 'z'].every(k => Number.isFinite(points[i][k])) && visibility(points[i]) >= .65;
  if (![0, 7, 8, 11, 12, 23, 24].every(usable)) return null;
  const shoulder = mid(points[11], points[12]), hips = mid(points[23], points[24]), ears = mid(points[7], points[8]);
  const across = sub(points[12], points[11]), up = sub(shoulder, hips);
  const span = length(across), torsoLength = length(up);
  if (span < .12 || span > .75 || torsoLength < .15 || torsoLength > .85) return null;
  const upAxis = unit(up), sideAxis = unit(across), frontAxis = unit(cross(sideAxis, upAxis));
  if (!frontAxis || Math.abs(dot(sideAxis, upAxis)) > .45) return null;
  const facing = dot(sub(points[0], ears), frontAxis);
  if (Math.abs(facing) < span * .035) return null;
  const neck = sub(ears, shoulder), neckHeight = dot(neck, upAxis);
  if (neckHeight < .045 || neckHeight > .4 || length(neck) > .5) return null;
  // Ear position relative to the torso plane separates whole-body lean from
  // neck translation. This depth is still a monocular model estimate.
  return { value: Math.max(0, dot(neck, frontAxis) * Math.sign(facing) / span), source: 'world' };
}

function regionDescriptions(regions, coverage, metrics, view) {
  const descriptions = {
    head: regions.head === 'unknown' ? view === 'profile' ? 'La rotation précise de la tête reste non mesurable dans cette vue.' : 'Visage insuffisamment visible.' : regions.head === 'good' ? 'Tête bien alignée dans les mouvements observables.' : metrics.headPitch !== null && Math.abs(metrics.headPitch) >= 20 ? 'Votre tête paraît penchée vers le bas ou vers le haut.' : 'Votre tête paraît inclinée sur le côté.',
    neck: regions.neck === 'unknown' ? 'Gardez la tête et les épaules visibles pour analyser la nuque.' : regions.neck === 'good' ? coverage.neckForward ? 'La tête paraît alignée au-dessus des épaules.' : 'La tête paraît centrée entre les épaules dans cette vue.' : metrics.neckForward !== null && metrics.neckForward >= (metrics.neckSource === 'world' ? .20 : .32) ? 'Votre tête paraît avancée par rapport aux épaules.' : 'Votre nuque paraît décalée sur le côté.',
    shoulders: regions.shoulders === 'unknown' ? 'Les deux épaules ne sont pas assez visibles de face.' : regions.shoulders === 'good' ? 'Épaules sensiblement au même niveau.' : 'Vos épaules paraissent déséquilibrées.',
    torso: regions.torso === 'unknown' ? 'Gardez le buste et les hanches dans le cadre pour les analyser.' : regions.torso === 'good' ? 'Buste sensiblement droit.' : view === 'profile' ? 'Votre buste paraît penché vers l’avant ou l’arrière.' : 'Votre buste paraît incliné sur le côté.'
  };
  if (regions.neck !== 'unknown' && !coverage.neckForward) descriptions.neck += ' Alignement de face ; avancée de la tête non mesurée.';
  if (regions.head !== 'unknown' && !coverage.headPitch) descriptions.head += ' Le regard vers le bas reste non mesurable.';
  return descriptions;
}

function regionCoverageFor(coverage) {
  const scope = (a, b) => a && b ? 'full' : a || b ? 'partial' : 'insufficient';
  return {
    head: scope(coverage.headRoll, coverage.headPitch),
    neck: scope(coverage.neckLateral, coverage.neckForward),
    shoulders: coverage.shoulderLevel ? 'full' : 'insufficient',
    torso: coverage.torsoLean ? 'full' : 'insufficient'
  };
}

function overallReason(regions, descriptions, coverage) {
  const state = worst(...Object.values(regions));
  if (state === 'unknown') return 'Gardez votre tête et vos épaules dans le cadre.';
  const key = ['neck', 'head', 'torso', 'shoulders'].find(k => regions[k] === state && state !== 'good');
  return key ? descriptions[key] : coverage === 'full' ? 'Votre posture paraît bien alignée.' : 'Les zones visibles paraissent bien alignées.';
}

/** Angles/ratios stay internal; the UI presents categories. View-dependent
 * thresholds are conservative prototype rules for neutral head/neck/shoulder
 * alignment. Validate them with seated users/camera positions before claiming
 * accuracy. A frontal COCO skeleton alone cannot measure forward-head depth.
 */
export function evaluate(input, width, height, time) {
  const frame = asFrame(input), landmarks = frame.landmarks ?? [];
  const regions = { head: 'unknown', neck: 'unknown', shoulders: 'unknown', torso: 'unknown' };
  const metrics = { headTilt: null, headOffset: null, headPitch: null, headYaw: null, shoulderTilt: null, torsoTilt: null, neckLateral: null, neckForward: null, neckSource: null };
  const measurementCoverage = { headRoll: false, headPitch: false, neckLateral: false, neckForward: false, shoulderLevel: false, torsoLean: false };
  const unknown = reason => ({ state: 'unknown', regions, metrics, measurementCoverage, regionCoverage:regionCoverageFor(measurementCoverage), regionReasons: regionDescriptions(regions, measurementCoverage, metrics, 'unknown'), reason, coverage: 'insufficient', confidence: 0, confidenceLabel: 'Détection incertaine', view: 'unknown', landmarks, face: null });
  if (!(width > 0 && height > 0)) return unknown('Gardez vos épaules visibles dans le cadre.');
  const point = i => ({ x: landmarks[i].x * width, y: landmarks[i].y * height });
  const face = freshFace(frame, time ?? frame.timestamp);
  const orientation = credibleFace(face, landmarks, width, height) ? faceOrientation(face.matrix) : null;
  const view = determineView(landmarks, orientation, width, height);
  const visibleShoulders = [11, 12].filter(i => valid(landmarks[i]));
  if (!visibleShoulders.length || (visibleShoulders.length < 2 && view !== 'profile')) return unknown('Gardez vos épaules visibles dans le cadre.');
  const shoulder = visibleShoulders.length === 2 ? mid(point(11), point(12)) : point(visibleShoulders[0]);
  const shoulderSpan = visibleShoulders.length === 2 ? Math.hypot(point(12).x - point(11).x, point(12).y - point(11).y) : 0;
  if (shoulderSpan < width * .025 && view !== 'profile') return unknown('Reculez légèrement pour garder les deux épaules visibles.');
  const sideHip = visibleShoulders.length === 1 ? visibleShoulders[0] + 12 : null;
  const hips = pair(landmarks, 23, 24) ? mid(point(23), point(24)) : sideHip && valid(landmarks[sideHip]) ? point(sideHip) : null;
  const torsoHeight = hips ? hips.y - shoulder.y : 0;
  if (torsoHeight > Math.max(height * .07, shoulderSpan * .25)) {
    metrics.torsoTilt = Math.atan2(shoulder.x - hips.x, torsoHeight) * DEG;
    regions.torso = stateFor(Math.abs(metrics.torsoTilt), 9, 17);
    measurementCoverage.torsoLean = true;
  }
  if (view === 'front' && shoulderSpan >= width * .08) {
    metrics.shoulderTilt = Math.atan2(point(12).y - point(11).y, Math.abs(point(12).x - point(11).x)) * DEG;
    regions.shoulders = stateFor(Math.abs(metrics.shoulderTilt), 7, 13);
    measurementCoverage.shoulderLevel = true;
  }
  if (orientation && Math.abs(orientation.yaw) < 65) {
    metrics.headTilt = orientation.roll; metrics.headPitch = orientation.pitch; metrics.headYaw = orientation.yaw;
    regions.head = worst(stateFor(Math.abs(orientation.roll), 10, 18), stateFor(Math.abs(orientation.pitch), 20, 32));
    measurementCoverage.headRoll = true; measurementCoverage.headPitch = true;
  } else {
    for (const [a, b] of [[2, 5], [7, 8]]) {
      if (!pair(landmarks, a, b) || view === 'profile') continue;
      const first = point(a), second = point(b);
      if (Math.hypot(second.x - first.x, second.y - first.y) < Math.max(width * .012, shoulderSpan * .08)) continue;
      metrics.headTilt = Math.atan2(second.y - first.y, Math.abs(second.x - first.x)) * DEG;
      regions.head = stateFor(Math.abs(metrics.headTilt), 10, 18); measurementCoverage.headRoll = true;
      break;
    }
  }
  // Prefer ears to nose: turning the face moves the nose without necessarily
  // changing neck alignment. Eyes are only a fallback for lateral alignment.
  const headCenter = pair(landmarks, 7, 8) ? mid(point(7), point(8)) : pair(landmarks, 2, 5) ? mid(point(2), point(5)) : null;
  if (headCenter && view === 'front' && shoulderSpan >= width * .08 && shoulder.y - headCenter.y > height * .035) {
    metrics.headOffset = (headCenter.x - shoulder.x) / shoulderSpan;
    metrics.neckLateral = Math.atan2(headCenter.x - shoulder.x, shoulder.y - headCenter.y) * DEG - (metrics.torsoTilt ?? 0);
    regions.neck = stateFor(Math.abs(metrics.neckLateral), 12, 23); measurementCoverage.neckLateral = true;
  }
  let neck = worldNeck(frame, landmarks);
  if (!neck && view === 'profile' && valid(landmarks[0])) {
    const candidates = [[7, 11], [8, 12]].filter(([ear, side]) => valid(landmarks[ear]) && valid(landmarks[side])).sort((a, b) => visibility(landmarks[b[0]]) - visibility(landmarks[a[0]]));
    const candidate = candidates[0];
    if (candidate) {
      const ear = point(candidate[0]), side = point(candidate[1]), neckHeight = side.y - ear.y;
      const facing = Math.sign(point(0).x - ear.x);
      if (neckHeight > height * .045 && facing && Math.abs(point(0).x - ear.x) > width * .015) {
        const torsoShift = hips && torsoHeight > height * .07 ? (shoulder.x - hips.x) * neckHeight / torsoHeight : 0;
        neck = { value: Math.max(0, (ear.x - side.x - torsoShift) * facing / neckHeight), source: 'profile' };
      }
    }
  }
  if (neck) {
    metrics.neckForward = neck.value; metrics.neckSource = neck.source;
    regions.neck = worst(regions.neck, stateFor(neck.value, neck.source === 'world' ? .20 : .32, neck.source === 'world' ? .35 : .60));
    measurementCoverage.neckForward = true;
  }
  // Keep observable lateral alignment even when forward depth is unavailable.
  // Its partial scope must be shown; inferred off-screen hips cannot fill it.
  const observed = Object.values(measurementCoverage).filter(Boolean).length;
  const coverage = observed === 6 ? 'full' : observed >= 2 ? 'partial' : 'insufficient';
  const essentialHead = headCenter || credibleFace(face, landmarks, width, height) || (view === 'profile' && valid(landmarks[0]) && (valid(landmarks[7]) || valid(landmarks[8])));
  const state = essentialHead && coverage !== 'insufficient' ? worst(...Object.values(regions)) : 'unknown';
  const regionReasons = regionDescriptions(regions, measurementCoverage, metrics, view);
  const essentialIndices = [...visibleShoulders, ...(pair(landmarks, 7, 8) ? [7, 8] : pair(landmarks, 2, 5) ? [2, 5] : [0])];
  const confidence = state === 'unknown' ? 0 : clamp(Math.min(...essentialIndices.map(i => visibility(landmarks[i]))) * (coverage === 'full' ? 1 : .85), 0, 1);
  return { state, regions, metrics, measurementCoverage, regionCoverage:regionCoverageFor(measurementCoverage), regionReasons, reason: state === 'unknown' ? 'Gardez votre tête et vos épaules dans le cadre.' : overallReason(regions, regionReasons, coverage), coverage, confidence, confidenceLabel: confidence >= .75 ? 'Bonne visibilité' : confidence >= .5 ? 'Visibilité partielle' : 'Détection incertaine', view, landmarks, face: orientation ? face : null };
}

/** Adaptive smoothing + time-based hysteresis. No queued frames or reference
 * calibration. One noisy frame must not trigger a posture alert.
 */
export function createPostureTracker({ smoothingMs = 90, warningMs = 450, badMs = 650, recoveryMs = 950, missingMs = 350 } = {}) {
  let previous = null, lastTime = null, context = null;
  const stable = {}, pending = {};
  const reset = () => { previous = null; lastTime = null; context = null; for (const key of regionKeys) { delete stable[key]; delete pending[key]; } };
  const smooth = (next, old, dt, world = false) => (next ?? []).map((p, i) => {
    const prior = old?.[i];
    if (!p || (world ? !Number.isFinite(p.x + p.y + p.z) : !valid(p)) || !prior) return p ? { ...p } : null;
    const movement = Math.hypot(p.x - prior.x, p.y - prior.y, (p.z ?? 0) - (prior.z ?? 0));
    const tau = smoothingMs / (1 + movement * (world ? 35 : 60));
    const alpha = clamp(1 - Math.exp(-dt / Math.max(1, tau)), .15, 1);
    return { ...p, x: prior.x + (p.x - prior.x) * alpha, y: prior.y + (p.y - prior.y) * alpha, ...(Number.isFinite(p.z) ? { z: (prior.z ?? p.z) + (p.z - (prior.z ?? p.z)) * alpha } : {}) };
  });
  return {
    reset,
    update(input, width, height, time = performance.now()) {
      const frame = asFrame(input), key = `${frame.model ?? ''}:${width}:${height}`;
      const maxGap = Math.max(1200, Math.min(3000, (frame.recommendedIntervalMs ?? 0) * 2.5));
      if (context !== null && (context !== key || time <= lastTime || time - lastTime > maxGap)) reset();
      context = key;
      const dt = lastTime === null ? 100 : clamp(time - lastTime, 1, 350);
      const filtered = { ...frame, landmarks: smooth(frame.landmarks, previous?.landmarks, dt), worldLandmarks: frame.worldLandmarks ? smooth(frame.worldLandmarks, previous?.worldLandmarks, dt, true) : undefined };
      const raw = evaluate(filtered, width, height, time);
      previous = filtered; lastTime = time;
      for (const key of regionKeys) {
        const candidate = raw.regions[key];
        if (stable[key] === undefined) stable[key] = candidate;
        if (candidate === stable[key]) { delete pending[key]; continue; }
        if (!pending[key] || pending[key].state !== candidate) pending[key] = { state: candidate, since: time };
        const dwell = candidate === 'unknown' ? missingMs : rank[candidate] > rank[stable[key]] ? candidate === 'bad' ? badMs : warningMs : recoveryMs;
        if (time - pending[key].since >= dwell) { stable[key] = candidate; delete pending[key]; }
      }
      const regions = { ...stable };
      const regionReasons = regionDescriptions(regions, raw.measurementCoverage, raw.metrics, raw.view);
      const state = raw.state === 'unknown' ? 'unknown' : worst(...Object.values(regions));
      return { ...raw, state, regions, regionReasons, reason: state === 'unknown' ? raw.reason : overallReason(regions, regionReasons, raw.coverage), rawState: raw.state, settling: Object.keys(pending).length > 0 };
    }
  };
}

// Map COCO-17 (MoveNet / YOLO Pose) onto MediaPipe's 33-point indices.
const cocoToMediaPipe = [0, 2, 5, 7, 8, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
export function normalizeCoco(keypoints, width, height) {
  const result = Array(33).fill(null);
  if (!(width > 0 && height > 0)) return result;
  for (let i = 0; i < 17; i++) {
    const p = keypoints?.[i];
    if (p) result[cocoToMediaPipe[i]] = { x: p.x / width, y: p.y / height, visibility: p.score ?? 0 };
  }
  return result;
}
export function countVisible(input) { return asFrame(input).landmarks?.filter(valid).length ?? 0; }

const skeleton = [[0, 2], [0, 5], [2, 7], [5, 8], [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], [11, 23], [12, 24], [23, 24], [23, 25], [25, 27], [24, 26], [26, 28]];
const palette = { good: '#16a34a', warning: '#c89122', bad: '#d45d49', unknown: '#87a295' };
const faceOval = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];
export function drawSkeleton(canvas, input, regions, width, height) {
  if (!canvas) return;
  const frame = asFrame(input), landmarks = frame.landmarks;
  // Avoid reallocating/clearing the backing store when dimensions are unchanged.
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height); ctx.lineWidth = Math.max(2, width / 200); ctx.lineCap = 'round';
  const line = (a, b, color) => {
    ctx.strokeStyle = color; ctx.beginPath(); ctx.moveTo(a.x * width, a.y * height); ctx.lineTo(b.x * width, b.y * height); ctx.stroke();
  };
  for (const [a, b] of skeleton) {
    if (!valid(landmarks?.[a]) || !valid(landmarks?.[b])) continue;
    const region = a <= 8 && b <= 8 ? 'head' : a === 11 && b === 12 ? 'shoulders' : (a === 11 || a === 12) && (b === 23 || b === 24) || a === 23 && b === 24 ? 'torso' : 'tracked';
    line(landmarks[a], landmarks[b], region === 'tracked' ? '#5e9fb4' : palette[regions?.[region] ?? 'unknown']);
  }
  if (pair(landmarks, 11, 12)) {
    const head = pair(landmarks, 7, 8) ? mid(landmarks[7], landmarks[8]) : pair(landmarks, 2, 5) ? mid(landmarks[2], landmarks[5]) : valid(landmarks[7]) ? landmarks[7] : valid(landmarks[8]) ? landmarks[8] : null;
    if (head) line(head, mid(landmarks[11], landmarks[12]), palette[regions?.neck ?? 'unknown']);
  } else {
    for (const [ear, shoulder] of [[7, 11], [8, 12]]) if (pair(landmarks, ear, shoulder)) line(landmarks[ear], landmarks[shoulder], palette[regions?.neck ?? 'unknown']);
  }
  const face = frame.face?.landmarks;
  if (face?.length > 400) {
    ctx.lineWidth = Math.max(1, width / 350);
    for (let i = 1; i < faceOval.length; i++) if (pair(face, faceOval[i - 1], faceOval[i])) line(face[faceOval[i - 1]], face[faceOval[i]], palette[regions?.head ?? 'unknown']);
  }
  for (let i = 0; i < (landmarks?.length ?? 0); i++) {
    if (!valid(landmarks[i])) continue;
    ctx.fillStyle = i <= 10 ? palette[regions?.head ?? 'unknown'] : i === 11 || i === 12 ? palette[regions?.shoulders ?? 'unknown'] : i === 23 || i === 24 ? palette[regions?.torso ?? 'unknown'] : '#5e9fb4';
    ctx.beginPath(); ctx.arc(landmarks[i].x * width, landmarks[i].y * height, Math.max(3, width / 170), 0, Math.PI * 2); ctx.fill();
  }
}
