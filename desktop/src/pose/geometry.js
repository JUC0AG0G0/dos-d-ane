export const DEG = 180 / Math.PI;
export const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
export const mid = (a, b) => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
  z: ((a.z ?? 0) + (b.z ?? 0)) / 2
});
export const sub = (a, b) => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: (a.z ?? 0) - (b.z ?? 0)
});
export const dot = (a, b) => a.x * b.x + a.y * b.y + (a.z ?? 0) * (b.z ?? 0);
export const length = (p) => Math.hypot(p.x, p.y, p.z ?? 0);
export const unit = (p) => {
  const n = length(p);
  return n > 1e-6 ? { x: p.x / n, y: p.y / n, z: (p.z ?? 0) / n } : null;
};
export const cross = (a, b) => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x
});
