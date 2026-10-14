import { mascotLimbs } from "./mascot-limbs.js";
const limit = (value, min, max) =>
  Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : 0;
export function mascotPose(assessment, active = true) {
  const tracked = Boolean(
    active &&
      assessment &&
      (assessment.rawState ?? assessment.state) !== "unknown",
  );
  const m = tracked ? (assessment.metrics ?? {}) : {};
  // Separate head rotation and neck translation. Never bend an unseen back.
  const pitch = limit(m.headPitch, -45, 55);
  const forward = limit(
    (m.neckForward / (m.neckSource === "world" ? 0.45 : 0.75)) * 100,
    0,
    100,
  );
  // Mirror lateral motion in the same way as the webcam preview.
  // Face matrices use Y-up; the 2D landmark fallback uses image Y-down.
  const roll = limit(assessment?.face ? m.headTilt : -m.headTilt, -40, 40),
    lateral = limit(-m.neckLateral, -30, 30),
    yaw = limit(-m.headYaw, -60, 60);
  const bend = Math.max(0, (pitch / 55) * 100, forward);
  const caption = !tracked
    ? active
      ? "En attente du suivi"
      : "Au repos"
    : Math.abs(roll) > 12
      ? "Tête inclinée sur le côté"
      : pitch > 20
        ? "Tête penchée vers le bas"
        : pitch < -20
          ? "Tête relevée"
          : forward > 40
            ? "Tête avancée"
            : Math.abs(lateral) > 12
              ? "Nuque décalée"
              : assessment.regions?.shoulders === "bad"
                ? "Épaules à rééquilibrer"
                : "Alignement visible";
  return {
    pitch,
    forward,
    roll,
    lateral,
    yaw,
    bend,
    tracked,
    caption,
    ...mascotLimbs(assessment, active),
  };
}
