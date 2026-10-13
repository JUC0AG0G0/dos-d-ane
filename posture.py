"""Indicative, image-based posture measurements from MediaPipe landmarks.

Only joints that are visible and present contribute to a measurement. The
angles are measured in the camera image, not in three-dimensional space.
"""

from dataclasses import dataclass
from math import acos, atan2, degrees, hypot, isfinite
from numbers import Real
from typing import Sequence

MIN_VISIBILITY = 0.55
MIN_PRESENCE = 0.55
MIN_SEGMENT = 0.025


@dataclass(frozen=True)
class Indicator:
    label: str
    value: str
    message: str
    alert: bool


@dataclass(frozen=True)
class Assessment:
    indicators: tuple[Indicator, ...]
    message: str
    alert: bool


def _point(points: Sequence, index: int):
    """Ignore uncertain, malformed, or substantially off-screen landmarks."""
    if index >= len(points):
        return None
    point = points[index]
    if point is None:
        return None
    try:
        x, y = point.x, point.y
        if not isinstance(x, Real) or not isinstance(y, Real):
            return None
        if not (isfinite(x) and isfinite(y) and -0.02 <= x <= 1.02 and -0.02 <= y <= 1.02):
            return None
        for field, minimum in (("visibility", MIN_VISIBILITY), ("presence", MIN_PRESENCE)):
            confidence = getattr(point, field, None)
            if confidence is not None:
                if not isinstance(confidence, Real):
                    return None
                if not isfinite(confidence) or confidence < minimum:
                    return None
    except (AttributeError, TypeError, ValueError, OverflowError):
        return None
    return point


def _confidence(point) -> float:
    """Ranking score for choosing the clearest side when both are visible."""
    values = [float(value) for field in ("visibility", "presence")
              if (value := getattr(point, field, None)) is not None]
    return min(values) if values else 1.0


def _aspect(aspect_ratio: float) -> float:
    """A pixel has the same scale on both axes after scaling x by width/height."""
    try:
        ratio = float(aspect_ratio)
    except (TypeError, ValueError, OverflowError):
        return 1.0
    return ratio if isfinite(ratio) and ratio > 0 else 1.0


def _distance(a, b, aspect_ratio: float) -> float:
    return hypot((a.x - b.x) * aspect_ratio, a.y - b.y)


def _line_angle(a, b, aspect_ratio: float, *, vertical: bool = False) -> float:
    dx = abs(a.x - b.x) * aspect_ratio
    dy = abs(a.y - b.y)
    return degrees(atan2(dx, dy)) if vertical else degrees(atan2(dy, dx))


def _joint_angle(a, vertex, b, aspect_ratio: float) -> float | None:
    ax, ay = (a.x - vertex.x) * aspect_ratio, a.y - vertex.y
    bx, by = (b.x - vertex.x) * aspect_ratio, b.y - vertex.y
    first, second = hypot(ax, ay), hypot(bx, by)
    if min(first, second) < MIN_SEGMENT:
        return None
    cosine = max(-1.0, min(1.0, (ax * bx + ay * by) / (first * second)))
    return degrees(acos(cosine))


def _result(indicators: list[Indicator], *, view: str, complete: bool) -> Assessment:
    if not indicators:
        hint = ("Montrez la tête, les deux épaules et le buste face à la caméra."
                if view == "Face" else
                "Montrez une oreille, une épaule et une hanche de profil.")
        return Assessment((), hint, False)
    alert = any(item.alert for item in indicators)
    if not complete:
        message = ("Écart visible sur les repères disponibles. Montrez davantage le corps."
                   if alert else "Repères partiellement visibles : montrez davantage le corps.")
    elif alert:
        message = "Ajustez votre position si elle reste inconfortable."
    else:
        message = "Aucun écart notable sur les repères visibles."
    return Assessment(tuple(indicators), message, alert)


def assess_front(points: Sequence, aspect_ratio: float = 1.0) -> Assessment:
    """Face view: shoulders, head alignment, head tilt, pelvis, torso axis."""
    ratio = _aspect(aspect_ratio)
    left_shoulder, right_shoulder = _point(points, 11), _point(points, 12)
    if left_shoulder is None or right_shoulder is None:
        return _result([], view="Face", complete=False)
    shoulder_width = _distance(left_shoulder, right_shoulder, ratio)
    if shoulder_width < 0.08 * ratio:
        return Assessment((), "Reculez ou orientez la caméra bien en face de vous.", False)

    indicators: list[Indicator] = []
    shoulder_angle = _line_angle(left_shoulder, right_shoulder, ratio)
    shoulder_alert = shoulder_angle > 7
    indicators.append(Indicator("Épaules", f"{shoulder_angle:.0f}°",
                                "Inclinaison visible" if shoulder_alert else "Niveau proche", shoulder_alert))

    left_ear, right_ear = _point(points, 7), _point(points, 8)
    left_eye, right_eye = _point(points, 2), _point(points, 5)
    head_pair = None
    for pair in ((left_ear, right_ear), (left_eye, right_eye)):
        if pair[0] is not None and pair[1] is not None and _distance(*pair, ratio) >= 0.12 * shoulder_width:
            head_pair = pair
            break
    nose = _point(points, 0)
    head_x = ((head_pair[0].x + head_pair[1].x) / 2 if head_pair is not None else
              nose.x if nose is not None else None)
    if head_x is not None:
        center_x = (left_shoulder.x + right_shoulder.x) / 2
        head_offset = abs(head_x - center_x) * ratio / shoulder_width
        head_alert = head_offset > 0.18
        indicators.append(Indicator("Tête centrée", f"{head_offset * 100:.0f} %",
                                    "Décalage visible" if head_alert else "Proche de l'axe", head_alert))
    if head_pair is not None:
        head_tilt = _line_angle(*head_pair, ratio)
        tilt_alert = head_tilt > 10
        indicators.append(Indicator("Tête inclinée", f"{head_tilt:.0f}°",
                                    "Inclinaison visible" if tilt_alert else "Niveau proche", tilt_alert))

    left_hip, right_hip = _point(points, 23), _point(points, 24)
    hips_visible = left_hip is not None and right_hip is not None
    if hips_visible:
        hip_width = _distance(left_hip, right_hip, ratio)
        if hip_width >= 0.08 * ratio:
            hip_angle = _line_angle(left_hip, right_hip, ratio)
            hip_alert = hip_angle > 9
            indicators.append(Indicator("Bassin", f"{hip_angle:.0f}°",
                                        "Inclinaison visible" if hip_alert else "Niveau proche", hip_alert))
            shoulder_mid_x = (left_shoulder.x + right_shoulder.x) / 2
            shoulder_mid_y = (left_shoulder.y + right_shoulder.y) / 2
            hip_mid_x = (left_hip.x + right_hip.x) / 2
            hip_mid_y = (left_hip.y + right_hip.y) / 2
            torso_height = abs(shoulder_mid_y - hip_mid_y)
            if torso_height >= 0.10:
                torso_angle = degrees(atan2(abs(shoulder_mid_x - hip_mid_x) * ratio,
                                            torso_height))
                torso_alert = torso_angle > 9
                indicators.append(Indicator("Axe du buste", f"{torso_angle:.0f}°",
                                            "Inclinaison latérale visible" if torso_alert else
                                            "Proche de la verticale", torso_alert))

    complete = len(indicators) == 5
    return _result(indicators, view="Face", complete=complete)


def assess_side(points: Sequence, aspect_ratio: float = 1.0) -> Assessment:
    """Profile view: head and torso plus observed elbow, hip, and knee angles."""
    ratio = _aspect(aspect_ratio)
    candidates = []
    for ear_id, shoulder_id, hip_id, elbow_id, wrist_id, knee_id, ankle_id in (
        (7, 11, 23, 13, 15, 25, 27), (8, 12, 24, 14, 16, 26, 28)
    ):
        ear, shoulder, hip, elbow, wrist, knee, ankle = (
            _point(points, i) for i in (ear_id, shoulder_id, hip_id,
                                        elbow_id, wrist_id, knee_id, ankle_id)
        )
        if shoulder is None or hip is None or _distance(shoulder, hip, ratio) < 0.10:
            continue
        # Prefer a complete, confident upper-body profile over extra limb points.
        core = (ear, shoulder, hip)
        score = sum(_confidence(point) for point in core if point is not None)
        score += 0.5 if ear is not None else 0
        candidates.append((score, ear, shoulder, hip, elbow, wrist, knee, ankle))
    if not candidates:
        return _result([], view="Profil", complete=False)

    _, ear, shoulder, hip, elbow, wrist, knee, ankle = max(candidates, key=lambda c: c[0])
    indicators: list[Indicator] = []
    torso_height = abs(shoulder.y - hip.y)
    if torso_height < 0.10:
        return Assessment((), "Placez la caméra de profil à hauteur du buste.", False)
    torso_angle = _line_angle(shoulder, hip, ratio, vertical=True)

    if ear is not None:
        head_offset = abs(ear.x - shoulder.x) * ratio / torso_height
        head_alert = head_offset > 0.30
        indicators.append(Indicator("Tête / épaule", f"{head_offset * 100:.0f} %",
                                    "Décalage visible" if head_alert else "Proches sur l'image", head_alert))

    torso_alert = torso_angle > 13
    indicators.append(Indicator("Buste", f"{torso_angle:.0f}°",
                                "Inclinaison visible" if torso_alert else "Proche de la verticale", torso_alert))

    for label, triple in (("Coude", (shoulder, elbow, wrist)),
                          ("Hanche", (shoulder, hip, knee)),
                          ("Genou", (hip, knee, ankle))):
        if all(point is not None for point in triple):
            angle = _joint_angle(*triple, ratio)
            if angle is not None:
                indicators.append(Indicator(label, f"{angle:.0f}°", "Angle observé de profil", False))

    return _result(indicators, view="Profil", complete=ear is not None)


def assess(points: Sequence, view: str, aspect_ratio: float = 1.0) -> Assessment:
    return (assess_front(points, aspect_ratio) if view == "Face" else
            assess_side(points, aspect_ratio))
