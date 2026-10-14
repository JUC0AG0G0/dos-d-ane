"""Lightweight, subpixel webcam overlays for body, facial contours and fingers.

Coordinates must describe the same image as ``frame``. Apply mirroring before
inference or after the complete rendering, never to only one of them.
"""

import math

import cv2
import numpy as np


MIN_VISIBILITY = 0.55
LANDMARK_COUNT = 33
_SHIFT = 4
_UNIT = 1 << _SHIFT

# Pose's few facial and hand landmarks are useful to assess posture, but cannot
# describe contours. Only use the dedicated dense models for those drawings.
BODY_CONNECTIONS = (
    (11, 12), (11, 13), (13, 15), (12, 14), (14, 16),
    (11, 23), (12, 24), (23, 24), (23, 25), (24, 26),
    (25, 27), (26, 28), (27, 29), (28, 30), (29, 31),
    (30, 32), (27, 31), (28, 32),
)
BODY_POINTS = tuple(range(11, 17)) + tuple(range(23, 33))

# Exact paths from MediaPipe's FaceLandmarksConnections.FACE_LANDMARKS_CONTOURS.
# Keeping the topology here avoids importing the inference runtime for rendering
# or unit tests. The final repeated index closes the oval/eye/lip contour.
FACE_PATHS = (
    (10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
     397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
     172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10),
    (263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385,
     386, 387, 388, 466, 263),
    (33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158,
     159, 160, 161, 246, 33),
    (276, 283, 282, 295, 285), (300, 293, 334, 296, 336),
    (46, 53, 52, 65, 55), (70, 63, 105, 66, 107),
    (61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409,
     270, 269, 267, 0, 37, 39, 40, 185, 61),
    (78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415,
     310, 311, 312, 13, 82, 81, 80, 191, 78),
)
FACE_CONNECTIONS = tuple(
    edge for path in FACE_PATHS for edge in zip(path, path[1:])
)
HAND_PATHS = (
    (0, 1, 2, 3, 4), (0, 5, 6, 7, 8), (5, 9, 10, 11, 12),
    (9, 13, 14, 15, 16), (13, 17, 18, 19, 20), (0, 17),
)
HAND_CONNECTIONS = tuple(
    edge for path in HAND_PATHS for edge in zip(path, path[1:])
)
FACE_CONTOUR_POINTS = tuple(sorted({index for path in FACE_PATHS for index in path}))
JOINT_LABELS = {
    11: "Epaule G", 12: "Epaule D", 13: "Coude G", 14: "Coude D",
    15: "Poignet G", 16: "Poignet D",
}


def visible(point, check_confidence=True):
    """Reject missing, non-finite, out-of-frame or uncertain landmarks."""
    if point is None:
        return False
    try:
        x, y = float(point.x), float(point.y)
        if not (math.isfinite(x) and math.isfinite(y)
                and 0 <= x <= 1 and 0 <= y <= 1):
            return False
        if check_confidence:
            for name in ("visibility", "presence"):
                confidence = getattr(point, name, None)
                if confidence is not None:
                    confidence = float(confidence)
                    if not math.isfinite(confidence) or confidence < MIN_VISIBILITY:
                        return False
    except (AttributeError, TypeError, ValueError):
        return False
    return True


def _pixels(points, width, height, limit, check_confidence=True):
    """Subpixel positions; ``None`` breaks a connection rather than bridging it."""
    if points is None:
        return []
    return [
        (round(float(point.x) * (width - 1) * _UNIT),
         round(float(point.y) * (height - 1) * _UNIT))
        if visible(point, check_confidence) else None
        for point in points[:limit]
    ]


def _lines(frame, points, connections, color, thickness):
    for first, second in connections:
        if first >= len(points) or second >= len(points):
            continue
        if points[first] is None or points[second] is None:
            continue
        cv2.line(frame, points[first], points[second], color, thickness,
                 cv2.LINE_AA, shift=_SHIFT)


def _position(point):
    return tuple(round(value / _UNIT) for value in point)


def _dotted_line(frame, start, end, color, scale):
    """A dashed reference cannot be mistaken for a detected bone."""
    distance = math.dist(start, end)
    if distance < 1:
        return
    step = max(5, round(9 * scale))
    for offset in range(0, math.ceil(distance), step):
        first = offset / distance
        last = min(1, (offset + step * 0.5) / distance)
        a = tuple(round(start[i] + (end[i] - start[i]) * first) for i in (0, 1))
        b = tuple(round(start[i] + (end[i] - start[i]) * last) for i in (0, 1))
        cv2.line(frame, a, b, color, 1, cv2.LINE_AA)


def _overlap(first, second):
    width = max(0, min(first[2], second[2]) - max(first[0], second[0]))
    height = max(0, min(first[3], second[3]) - max(first[1], second[1]))
    return width * height


def _callout(frame, anchor, lines, color, scale, outward, occupied):
    """Place a compact label inside the image, favouring free space below a joint."""
    height, width = frame.shape[:2]
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = max(0.30, 0.41 * scale)
    padding = max(5, round(8 * scale))
    # Small camera previews still get clipped safely; shorten the text to fit.
    available = max(0, width - padding * 4)
    fitted = []
    for line in lines:
        while line and cv2.getTextSize(line, font, font_scale, 1)[0][0] > available:
            line = line[:-1]
        fitted.append(line)
    sizes = [cv2.getTextSize(line, font, font_scale, 1)[0] for line in fitted]
    box_width = min(width, max(size[0] for size in sizes) + padding * 2)
    line_height = max(13, round(18 * scale))
    box_height = min(height, line_height * len(fitted) + padding * 2)
    x, y = anchor
    gap = max(12, round(20 * scale))
    outer_x = x + gap if outward > 0 else x - gap - box_width
    inner_x = x - gap - box_width if outward > 0 else x + gap
    candidates = (
        (outer_x, y + gap), (outer_x, y - box_height - gap),
        (x - box_width // 2, y + gap * 2),
        (inner_x, y + gap), (outer_x, y + gap * 4),
    )
    boxes = []
    for candidate_x, candidate_y in candidates:
        left = max(0, min(width - box_width, round(candidate_x)))
        top = max(0, min(height - box_height, round(candidate_y)))
        boxes.append((left, top, left + box_width, top + box_height))
    # Existing labels and the face receive a high overlap cost. The candidate
    # order keeps stable placement when several free positions are available.
    box = min(enumerate(boxes), key=lambda item: (
        sum(_overlap(item[1], other) for other in occupied), item[0]
    ))[1]
    left, top, right, bottom = box
    occupied.append(box)
    target = (min(max(x, left), right - 1), min(max(y, top), bottom - 1))
    cv2.line(frame, anchor, target, color, 1, cv2.LINE_AA)
    roi = frame[top:bottom, left:right]
    if roi.size:
        dark = np.empty_like(roi)
        dark[:] = (28, 25, 20)
        cv2.addWeighted(roi, 0.16, dark, 0.84, 0, dst=roi)
        cv2.rectangle(frame, (left, top), (right - 1, bottom - 1), color, 1, cv2.LINE_AA)
    for line_index, line in enumerate(fitted):
        baseline = top + padding + line_height * line_index + sizes[line_index][1]
        if baseline >= bottom:
            break
        cv2.putText(frame, line, (left + padding, baseline), font, font_scale,
                    (244, 246, 242) if line_index else color, 1, cv2.LINE_AA)
    return box


def _finite(value):
    try:
        return math.isfinite(float(value))
    except (TypeError, ValueError):
        return False


def _point_annotations(frame, body, face, point_data, color, scale):
    """Measured joint readouts; inferred centres have a different marker."""
    height, width = frame.shape[:2]
    data = {item.index: item for item in (point_data or [])}
    occupied = []
    face_positions = [_position(center) for center in face if center is not None]
    if face_positions:
        occupied.append((min(p[0] for p in face_positions), min(p[1] for p in face_positions),
                         max(p[0] for p in face_positions), max(p[1] for p in face_positions)))

    def usable(index):
        if index >= len(body) or body[index] is None:
            return False
        return index not in data or bool(data[index].usable)

    # These are mathematical midpoints, never labelled as detected spine/neck.
    centres = []
    for first, second in ((11, 12), (23, 24)):
        if usable(first) and usable(second):
            a, b = _position(body[first]), _position(body[second])
            centres.append((round((a[0] + b[0]) / 2), round((a[1] + b[1]) / 2)))
        else:
            centres.append(None)
    reference_color = (229, 195, 122)
    if all(center is not None for center in centres):
        _dotted_line(frame, centres[0], centres[1], reference_color, scale)
    for center in centres:
        if center is None:
            continue
        x, y = center
        radius = max(3, round(5 * scale))
        vertices = np.array([(x, y - radius), (x + radius, y), (x, y + radius),
                             (x - radius, y)], dtype=np.int32)
        cv2.polylines(frame, [vertices], True, reference_color, 1, cv2.LINE_AA)
        _callout(frame, center, ["Centre calcule"], reference_color, scale * 0.8, 1, occupied)
    if centres[0] is not None:
        a, b = _position(body[11]), _position(body[12])
        start, end = sorted((a, b))
        midpoint = centres[0]
        if math.dist(start, end) >= max(2, 4 * scale):
            _dotted_line(frame, (start[0], midpoint[1]), (end[0], midpoint[1]), reference_color, scale)
            # Pixel coordinates account for camera aspect ratio. Coincident
            # shoulders (common in profile) do not define a meaningful angle.
            angle = math.degrees(math.atan2(end[1] - start[1], end[0] - start[0]))
            _callout(frame, (midpoint[0], max(0, midpoint[1] - round(18 * scale))),
                     [f"Ligne epaules {angle:+.1f} deg"], reference_color, scale * 0.9, 1, occupied)

    for index, label in JOINT_LABELS.items():
        if not usable(index) or index not in data:
            continue
        item = data[index]
        center = _position(body[index])
        lines = [f"{label}  #{index}"]
        if index in (11, 12):
            confidence = f"{item.visibility:.0%}" if _finite(item.visibility) else "--"
            coordinates = (f"X {item.x:.0%}  Y {item.y:.0%}"
                           if _finite(item.x) and _finite(item.y) else "X --  Y --")
            lines.append(f"Conf. {confidence}  {coordinates}")
            if _finite(item.angle):
                lines.append(f"Bras / buste {item.angle:.0f} deg")
        elif _finite(item.angle):
            lines[0] += f"  {item.angle:.0f} deg"
        midpoint_x = centres[0][0] if centres[0] is not None else width / 2
        _callout(frame, center, lines, color, scale, -1 if center[0] < midpoint_x else 1, occupied)


def draw_overlay(frame, pose_points, alert, face_points=None, hands=None,
                 show_numbers=False, show_point_data=False, point_data=None,
                 dense_points=False):
    """Draw in place and return the number of reliable pose landmarks (0–33).

    ``face_points`` is one normalized 468/478 point face; ``hands`` is a list
    of normalized 21 point hands. Face and hand results already passed their
    detector confidence threshold; their optional pose-only confidence fields
    are ignored. Missing results are never replaced by invented contours.
    ``dense_points`` adds markers to the real face contour vertices. Calculated
    centres and point readouts are only shown when ``show_point_data`` is true.
    """
    height, width = frame.shape[:2]
    if not width or not height:
        return 0
    scale = min(width / 960, height / 540)
    body_width = max(1, round(1.6 * scale))
    detail_width = max(1, round(0.85 * scale))
    body_radius = max(2.0, 3.7 * scale)
    hand_radius = max(1.0, 1.6 * scale)
    body_color = (96, 185, 245) if alert else (169, 221, 115)
    detail_color = (218, 218, 131)
    hand_color = (211, 224, 127)

    body = _pixels(pose_points, width, height, LANDMARK_COUNT)
    face = _pixels(face_points, width, height, 478, check_confidence=False)
    _lines(frame, body, BODY_CONNECTIONS, body_color, body_width)
    for index in BODY_POINTS:
        if index >= len(body) or body[index] is None:
            continue
        center = body[index]
        cv2.circle(frame, center, round((body_radius + max(1, scale)) * _UNIT),
                   (28, 25, 20), -1, cv2.LINE_AA, shift=_SHIFT)
        cv2.circle(frame, center, round(body_radius * _UNIT), body_color,
                   -1, cv2.LINE_AA, shift=_SHIFT)
        cv2.circle(frame, center, round(max(0.8, body_radius * 0.35) * _UNIT),
                   (241, 251, 248), -1, cv2.LINE_AA, shift=_SHIFT)

    _lines(frame, face, FACE_CONNECTIONS, detail_color, detail_width)
    if dense_points:
        for index in FACE_CONTOUR_POINTS:
            if index < len(face) and face[index] is not None:
                cv2.circle(frame, face[index], round(max(1.0, 1.4 * scale) * _UNIT),
                           detail_color, -1, cv2.LINE_AA, shift=_SHIFT)
    if hands is not None:
        for hand in hands:
            points = _pixels(hand, width, height, 21, check_confidence=False)
            _lines(frame, points, HAND_CONNECTIONS, hand_color, detail_width)
            for center in points:
                if center is not None:
                    cv2.circle(frame, center, round(hand_radius * _UNIT),
                               hand_color, -1, cv2.LINE_AA, shift=_SHIFT)

    if show_point_data:
        _point_annotations(frame, body, face, point_data, body_color, scale)

    if show_numbers:
        # Only posture landmarks are numbered; dense face IDs would obscure it.
        for index, center in enumerate(body):
            if center is None:
                continue
            x, y = (round(value / _UNIT) for value in center)
            cv2.putText(frame, str(index), (x + 4, max(12, y - 5)),
                        cv2.FONT_HERSHEY_SIMPLEX, max(0.32, 0.36 * scale),
                        body_color, 1, cv2.LINE_AA)
    return sum(point is not None for point in body)
