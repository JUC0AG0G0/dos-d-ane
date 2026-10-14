import { mid } from './geometry.js';

import { asFrame, pair, valid } from './landmarks.js';

const skeleton = [
  [0, 2],
  [0, 5],
  [2, 7],
  [5, 8],
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28]
];
const palette = {
  good: '#16a34a',
  warning: '#c89122',
  bad: '#d45d49',
  unknown: '#87a295'
};
const faceOval = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378,
  400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21,
  54, 103, 67, 109, 10
];
export function drawSkeleton(canvas, input, regions, width, height) {
  if (!canvas) return;
  const frame = asFrame(input),
    landmarks = frame.landmarks;
  // Avoid reallocating/clearing the backing store when dimensions are unchanged.
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = Math.max(2, width / 200);
  ctx.lineCap = 'round';
  const line = (a, b, color) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(a.x * width, a.y * height);
    ctx.lineTo(b.x * width, b.y * height);
    ctx.stroke();
  };
  for (const [a, b] of skeleton) {
    if (!valid(landmarks?.[a]) || !valid(landmarks?.[b])) continue;
    const region =
      a <= 8 && b <= 8
        ? 'head'
        : a === 11 && b === 12
          ? 'shoulders'
          : ((a === 11 || a === 12) && (b === 23 || b === 24)) ||
              (a === 23 && b === 24)
            ? 'torso'
            : 'tracked';
    line(
      landmarks[a],
      landmarks[b],
      region === 'tracked' ? '#5e9fb4' : palette[regions?.[region] ?? 'unknown']
    );
  }
  if (pair(landmarks, 11, 12)) {
    const head = pair(landmarks, 7, 8)
      ? mid(landmarks[7], landmarks[8])
      : pair(landmarks, 2, 5)
        ? mid(landmarks[2], landmarks[5])
        : valid(landmarks[7])
          ? landmarks[7]
          : valid(landmarks[8])
            ? landmarks[8]
            : null;
    if (head)
      line(
        head,
        mid(landmarks[11], landmarks[12]),
        palette[regions?.neck ?? 'unknown']
      );
  } else {
    for (const [ear, shoulder] of [
      [7, 11],
      [8, 12]
    ])
      if (pair(landmarks, ear, shoulder))
        line(
          landmarks[ear],
          landmarks[shoulder],
          palette[regions?.neck ?? 'unknown']
        );
  }
  const face = frame.face?.landmarks;
  const fingerChains = [
    [0, 1, 2, 3, 4],
    [0, 5, 6, 7, 8],
    [5, 9, 10, 11, 12],
    [9, 13, 14, 15, 16],
    [13, 17, 18, 19, 20],
    [0, 17]
  ];
  for (const hand of frame.hands ?? []) {
    if ((hand.score ?? 0) < 0.5) continue;
    const points = hand.landmarks;
    for (const chain of fingerChains)
      for (let i = 1; i < chain.length; i++)
        if (pair(points, chain[i - 1], chain[i]))
          line(points[chain[i - 1]], points[chain[i]], '#5e9fb4');
    for (const point of points ?? []) {
      if (!valid(point)) continue;
      ctx.fillStyle = '#245b41';
      ctx.beginPath();
      ctx.arc(
        point.x * width,
        point.y * height,
        Math.max(2, width / 260),
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
  if (face?.length > 400) {
    ctx.lineWidth = Math.max(1, width / 350);
    for (let i = 1; i < faceOval.length; i++)
      if (pair(face, faceOval[i - 1], faceOval[i]))
        line(
          face[faceOval[i - 1]],
          face[faceOval[i]],
          palette[regions?.head ?? 'unknown']
        );
  }
  for (let i = 0; i < (landmarks?.length ?? 0); i++) {
    if (!valid(landmarks[i])) continue;
    ctx.fillStyle =
      i <= 10
        ? palette[regions?.head ?? 'unknown']
        : i === 11 || i === 12
          ? palette[regions?.shoulders ?? 'unknown']
          : i === 23 || i === 24
            ? palette[regions?.torso ?? 'unknown']
            : '#5e9fb4';
    ctx.beginPath();
    ctx.arc(
      landmarks[i].x * width,
      landmarks[i].y * height,
      Math.max(3, width / 170),
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}
