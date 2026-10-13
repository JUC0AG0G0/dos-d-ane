// pose-detection bundles an optional legacy MediaPipe BlazePose backend.
// This app only uses its MoveNet backend. Keep the unused import out of the build.
export class Pose {
  constructor() { throw new Error('Legacy BlazePose backend is unavailable.'); }
}
