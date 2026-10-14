import { valid } from "./pose.js";

export const FINGERS = ["Thumb", "Index", "Middle", "Ring", "Pinky"];
export const LIMB_AXES = ["left", "right"].flatMap((side) =>
  ["Upper", "Lower", "Wrist", ...FINGERS, "ArmVisible", "HandVisible"].map(
    (name) => side + name,
  ),
);
export const ANGLE_AXES = new Set([
  "roll",
  "yaw",
  ...["left", "right"].flatMap((side) =>
    ["Upper", "Lower", "Wrist"].map((name) => side + name),
  ),
]);
export const wrapAngle = (value) => ((((value + 180) % 360) + 360) % 360) - 180;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const jointBend = (a, b, c) => {
  const u = [a.x - b.x, a.y - b.y, a.z - b.z],
    v = [c.x - b.x, c.y - b.y, c.z - b.z];
  const lengths = Math.hypot(...u) * Math.hypot(...v);
  if (lengths < 1e-5) return null;
  return (
    180 -
    (Math.acos(
      clamp(u.reduce((sum, n, i) => sum + n * v[i], 0) / lengths, -1, 1),
    ) *
      180) /
      Math.PI
  );
};

// Geometric articulation, without a list of permitted gestures. Each finger
// remains independent, including an extended middle finger with the rest closed.
export function fingerCurls(points, width = 640, height = 480) {
  if (
    points?.length !== 21 ||
    points.some((p) => !valid(p) || !Number.isFinite(p.z))
  )
    return null;
  const p = points.map(({ x, y, z }) => ({
    x: x * width,
    y: y * height,
    z: z * width,
  }));
  const a = [p[5].x - p[0].x, p[5].y - p[0].y, p[5].z - p[0].z],
    b = [p[17].x - p[0].x, p[17].y - p[0].y, p[17].z - p[0].z];
  const normal = [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const normalLength = Math.hypot(...normal);
  const curls = {};
  for (let i = 0; i < 5; i++) {
    const start = 1 + i * 4;
    const proximalBone = [
      p[start + 1].x - p[start].x,
      p[start + 1].y - p[start].y,
      p[start + 1].z - p[start].z,
    ];
    const denominator = normalLength * Math.hypot(...proximalBone);
    // Splaying fingers in the palm plane is not curling them.
    const proximal =
      denominator > 1e-5
        ? (Math.asin(
            clamp(
              Math.abs(
                proximalBone.reduce((sum, n, j) => sum + n * normal[j], 0),
              ) / denominator,
              0,
              1,
            ),
          ) *
            180) /
          Math.PI
        : 0;
    const middle = jointBend(p[start], p[start + 1], p[start + 2]);
    const distal = jointBend(p[start + 1], p[start + 2], p[start + 3]);
    if ([proximal, middle, distal].some((n) => n === null)) return null;
    // PIP/IP and DIP carry most closure; MCP alone can also fold a finger.
    const bend =
      i === 0
        ? middle * 0.6 + distal * 0.4
        : Math.max(proximal * 0.85, middle * 0.7 + distal * 0.3);
    curls[FINGERS[i]] = clamp(((bend - 8) / 82) * 100, 0, 100);
  }
  return curls;
}

export function mascotLimbs(
  assessment,
  active = true,
  now = performance.now(),
) {
  const output = Object.fromEntries(LIMB_AXES.map((key) => [key, 0]));
  if (
    !active ||
    !assessment ||
    (Number.isFinite(assessment.observedAt) &&
      now - assessment.observedAt > 600)
  )
    return output;
  const points = assessment.landmarks ?? [];
  const { width = 640, height = 480 } = assessment.frameSize ?? {};
  // Mirror with the camera preview. Rive joints are rotations from a downward bone.
  const pixel = (p) => ({ x: (1 - p.x) * width, y: p.y * height });
  const armAngle = (a, b) =>
    (Math.atan2(-(b.x - a.x), b.y - a.y) * 180) / Math.PI;
  const arms = [];
  for (const [side, s, e, w] of [
    ["left", 11, 13, 15],
    ["right", 12, 14, 16],
  ]) {
    if (![s, e, w].every((i) => valid(points[i]))) continue;
    const [shoulder, elbow, wrist] = [s, e, w].map((i) => pixel(points[i]));
    if (
      Math.min(distance(shoulder, elbow), distance(elbow, wrist)) <
      height * 0.025
    )
      continue;
    const upper = armAngle(shoulder, elbow),
      lower = armAngle(elbow, wrist);
    output[side + "Upper"] = upper;
    output[side + "Lower"] = wrapAngle(lower - upper);
    output[side + "ArmVisible"] = 1;
    arms.push({ side, wrist, lower });
  }
  const handFresh =
    !Number.isFinite(assessment.handsObservedAt) ||
    now - assessment.handsObservedAt <= 250;
  const hands = (handFresh ? (assessment.hands ?? []) : [])
    .filter((h) => (h.score ?? 0) >= 0.5 && h.landmarks?.length === 21)
    .map((h) => ({
      ...h,
      curls: fingerCurls(h.landmarks, width, height),
      wrist: pixel(h.landmarks[0]),
    }))
    .filter((h) => h.curls);
  const span =
    valid(points[11]) && valid(points[12])
      ? distance(pixel(points[11]), pixel(points[12]))
      : width * 0.25;
  const tolerance = Math.max(width * 0.08, Math.min(width * 0.22, span * 0.65));
  // Prefer a consistent assignment to body wrists; detector handedness alone
  // can swap when hands cross or rotate. Never attach another person's hand.
  let best = [],
    bestCost = Infinity;
  const assign = (index, used, matches, cost) => {
    if (index === arms.length) {
      if (
        matches.length > best.length ||
        (matches.length === best.length && cost < bestCost)
      ) {
        best = [...matches];
        bestCost = cost;
      }
      return;
    }
    assign(index + 1, used, matches, cost);
    for (let h = 0; h < hands.length; h++) {
      const gap = distance(arms[index].wrist, hands[h].wrist);
      if (used.has(h) || gap >= tolerance) continue;
      used.add(h);
      matches.push({ a: arms[index], h: hands[h] });
      assign(index + 1, used, matches, cost + gap);
      matches.pop();
      used.delete(h);
    }
  };
  assign(0, new Set(), [], 0);
  for (const { a, h } of best) {
    const wrist = pixel(h.landmarks[0]),
      middle = pixel(h.landmarks[9]);
    if (distance(wrist, middle) < height * 0.012) continue;
    // Palm points up at rotation zero; subtract the forearm's global angle.
    const palm =
      (Math.atan2(middle.x - wrist.x, -(middle.y - wrist.y)) * 180) / Math.PI;
    output[a.side + "Wrist"] = wrapAngle(palm - a.lower);
    output[a.side + "HandVisible"] = 1;
    for (const name of FINGERS) output[a.side + name] = h.curls[name];
  }
  return output;
}
