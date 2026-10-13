"""Named, confidence-aware landmarks and descriptive angles in the camera image.

Coordinates use the original normalized image axes (x from left to right, y
from top to bottom). Values outside 0..1 are retained to explain why a point
is out of frame. Left/right refer to the person's anatomical sides.
"""

from dataclasses import dataclass, replace
from math import acos, degrees, hypot, isfinite
from numbers import Real
from typing import Sequence

from posture import MIN_PRESENCE, MIN_SEGMENT, MIN_VISIBILITY


@dataclass(frozen=True)
class PointInfo:
    index: int
    name: str
    x: float | None
    y: float | None
    visibility: float | None
    usable: bool
    state: str
    angle: float | None = None


POINT_NAMES = (
    (7, "Oreille gauche"), (8, "Oreille droite"),
    (11, "Épaule gauche"), (12, "Épaule droite"),
    (13, "Coude gauche"), (14, "Coude droit"),
    (15, "Poignet gauche"), (16, "Poignet droit"),
    (23, "Hanche gauche"), (24, "Hanche droite"),
    (25, "Genou gauche"), (26, "Genou droit"),
    (27, "Cheville gauche"), (28, "Cheville droite"),
)

# The middle landmark is the vertex of each image-space joint angle.
ANGLE_TRIPLES = (
    (23, 11, 13), (24, 12, 14),
    (11, 13, 15), (12, 14, 16),
    (11, 23, 25), (12, 24, 26),
    (23, 25, 27), (24, 26, 28),
)


def _number(value) -> float | None:
    if isinstance(value, bool) or not isinstance(value, Real):
        return None
    try:
        value = float(value)
    except (TypeError, ValueError, OverflowError):
        return None
    return value if isfinite(value) else None


def _field(point, name: str) -> float | None:
    try:
        return _number(getattr(point, name, None))
    except (AttributeError, TypeError, ValueError, OverflowError):
        return None


def _describe(point, index: int, name: str) -> PointInfo:
    x, y = _field(point, "x"), _field(point, "y")
    visibility = _field(point, "visibility")
    presence = _field(point, "presence")
    if x is None or y is None:
        state = "Absent"
    elif not (0 <= x <= 1 and 0 <= y <= 1):
        state = "Hors cadre"
    elif (visibility is None or presence is None
          or not MIN_VISIBILITY <= visibility <= 1
          or not MIN_PRESENCE <= presence <= 1):
        state = "Faible"
    else:
        state = "Visible"
    return PointInfo(index, name, x, y, visibility, state == "Visible", state)


def _angle(a: PointInfo, vertex: PointInfo, b: PointInfo, ratio: float) -> float | None:
    if not all(point.usable for point in (a, vertex, b)):
        return None
    ax, ay = (a.x - vertex.x) * ratio, a.y - vertex.y
    bx, by = (b.x - vertex.x) * ratio, b.y - vertex.y
    first, second = hypot(ax, ay), hypot(bx, by)
    if not all(isfinite(length) and length >= MIN_SEGMENT for length in (first, second)):
        return None
    # Unit vectors avoid overflow in the dot product for extreme image ratios.
    cosine = (ax / first) * (bx / second) + (ay / first) * (by / second)
    return degrees(acos(max(-1.0, min(1.0, cosine))))


def describe_points(points: Sequence | None, aspect_ratio: float = 1.0) -> list[PointInfo]:
    """Return 14 stable rows, with trustworthy 2D angles where available.

    An angle needs all three landmarks inside the frame, with both presence
    and visibility at least 0.55, and two nondegenerate segments. It is an
    observation in the image, not an assessment of a healthy posture.
    """
    ratio = _number(aspect_ratio)
    if ratio is None or ratio <= 0:
        ratio = 1.0
    result = {}
    for index, name in POINT_NAMES:
        point = points[index] if points is not None and index < len(points) else None
        result[index] = _describe(point, index, name)
    for first, vertex, last in ANGLE_TRIPLES:
        value = _angle(result[first], result[vertex], result[last], ratio)
        result[vertex] = replace(result[vertex], angle=value)
    return list(result.values())
