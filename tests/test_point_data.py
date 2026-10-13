import math
import unittest
from types import SimpleNamespace

from point_data import describe_points


def landmark(x, y, visibility=0.99, presence=0.99):
    return SimpleNamespace(x=x, y=y, visibility=visibility, presence=presence)


def rows(points, ratio=1.0):
    return {point.index: point for point in describe_points(points, ratio)}


class PointDataTests(unittest.TestCase):
    def test_missing_detection_preserves_named_rows(self):
        for source in (None, [], [None] * 33):
            with self.subTest(source=source):
                result = describe_points(source)
                self.assertEqual([point.index for point in result],
                                 [7, 8, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28])
                self.assertEqual(result[2].name, "Épaule gauche")
                self.assertEqual(result[3].name, "Épaule droite")
                self.assertTrue(all(point.state == "Absent" and not point.usable
                                    and point.angle is None for point in result))

    def test_malformed_and_out_of_frame_values_are_identified(self):
        points = [None] * 33
        points[7] = landmark(float("nan"), 0.2)
        points[8] = landmark(0.2, "0.2")
        points[11] = landmark(-0.01, 0.5)
        points[12] = landmark(0.8, 1.01)
        points[13] = landmark(0.4, 0.5, float("inf"))
        points[14] = landmark(True, 0.5)
        result = rows(points)
        self.assertIsNone(result[7].x)
        self.assertIsNone(result[8].y)
        self.assertEqual(result[7].state, "Absent")
        self.assertEqual(result[11].state, "Hors cadre")
        self.assertEqual(result[12].state, "Hors cadre")
        self.assertEqual(result[11].x, -0.01)
        self.assertIsNone(result[13].visibility)
        self.assertEqual(result[13].state, "Faible")
        self.assertEqual(result[14].state, "Absent")
        self.assertTrue(all(not point.usable for point in result.values()))

    def test_both_confidences_must_be_known_and_trusted(self):
        points = [None] * 33
        points[11] = landmark(0.3, 0.4, 0.54)
        points[12] = landmark(0.7, 0.4, 0.99, 0.1)
        points[13] = SimpleNamespace(x=0.3, y=0.6, visibility=0.99)
        points[14] = landmark(0.7, 0.6, 1.1)
        points[15] = landmark(0.3, 0.7, 0.55, 0.55)
        result = rows(points)
        for index in (11, 12, 13, 14):
            self.assertEqual(result[index].state, "Faible")
            self.assertFalse(result[index].usable)
            self.assertIsNotNone(result[index].x)
        self.assertEqual(result[11].visibility, 0.54)
        self.assertTrue(result[15].usable)

    def test_bilateral_joint_angles_use_their_own_limbs(self):
        points = [None] * 33
        for shoulder, elbow, wrist, hip, knee, ankle, x, direction in (
            (11, 13, 15, 23, 25, 27, 0.3, -1),
            (12, 14, 16, 24, 26, 28, 0.7, 1),
        ):
            points[shoulder] = landmark(x, 0.2)
            points[elbow] = landmark(x + direction * 0.1, 0.2)
            points[wrist] = landmark(x + direction * 0.1, 0.4)
            points[hip] = landmark(x, 0.6)
            points[knee] = landmark(x + direction * 0.15, 0.6)
            points[ankle] = landmark(x + direction * 0.15, 0.9)
        result = rows(points, 16 / 9)
        for index in (11, 12, 13, 14, 23, 24, 25, 26):
            self.assertAlmostEqual(result[index].angle, 90.0)
        for index in (15, 16, 27, 28):
            self.assertIsNone(result[index].angle)
        points[14].presence = 0.1
        result = rows(points)
        self.assertIsNone(result[12].angle)
        self.assertIsNone(result[14].angle)
        self.assertAlmostEqual(result[11].angle, 90)
        self.assertAlmostEqual(result[13].angle, 90)

    def test_angles_are_corrected_for_pixel_aspect_ratio(self):
        points = [None] * 33
        points[11] = landmark(0.3, 0.3)
        points[13] = landmark(0.5, 0.5)
        points[15] = landmark(0.7, 0.3)
        self.assertAlmostEqual(rows(points)[13].angle, 90)
        expected = math.degrees(math.acos(-0.6))
        self.assertAlmostEqual(rows(points, 2.0)[13].angle, expected)
        for ratio in (0, -1, float("nan"), float("inf"), None):
            self.assertAlmostEqual(rows(points, ratio)[13].angle, 90)

    def test_short_or_hidden_segments_cannot_produce_angles(self):
        points = [None] * 33
        points[11] = landmark(0.5, 0.5)
        points[13] = landmark(0.51, 0.5)
        points[15] = landmark(0.7, 0.6)
        self.assertIsNone(rows(points)[13].angle)
        points[11] = landmark(0.3, 0.3)
        points[13] = landmark(0.5, 0.5)
        points[15] = landmark(1.01, 0.6)
        self.assertIsNone(rows(points)[13].angle)
        points[15] = landmark(0.7, 0.6, 0.1)
        self.assertIsNone(rows(points)[13].angle)


if __name__ == "__main__":
    unittest.main()
