import unittest
from types import SimpleNamespace

from posture import assess, assess_front, assess_side


def pose(**coordinates):
    points = [None] * 33
    for index, data in coordinates.items():
        x, y, *confidence = data
        visibility = confidence[0] if confidence else 0.99
        presence = confidence[1] if len(confidence) > 1 else 0.99
        points[int(index)] = SimpleNamespace(x=x, y=y, visibility=visibility,
                                             presence=presence)
    return points


class PostureAssessmentTests(unittest.TestCase):
    def test_front_aligned_and_tilted(self):
        aligned = pose(**{"0": (0.5, 0.2), "11": (0.35, 0.4), "12": (0.65, 0.4)})
        tilted = pose(**{"0": (0.5, 0.2), "11": (0.35, 0.35), "12": (0.65, 0.45)})
        self.assertFalse(assess_front(aligned).alert)
        self.assertTrue(assess_front(tilted).alert)

    def test_side_detects_forward_head(self):
        aligned = pose(**{"7": (0.51, 0.19), "11": (0.5, 0.4), "23": (0.5, 0.7)})
        forward = pose(**{"7": (0.7, 0.19), "11": (0.5, 0.4), "23": (0.5, 0.7)})
        self.assertFalse(assess_side(aligned).alert)
        self.assertTrue(assess_side(forward).alert)

    def test_missing_landmarks_do_not_produce_a_verdict(self):
        self.assertEqual(assess_side([None] * 33).indicators, ())
        self.assertFalse(assess_front([None] * 33).alert)

    def test_front_reports_five_measures_when_landmarks_are_visible(self):
        points = pose(**{
            "0": (0.50, 0.21), "7": (0.43, 0.22), "8": (0.57, 0.22),
            "11": (0.35, 0.40), "12": (0.65, 0.40),
            "23": (0.40, 0.70), "24": (0.60, 0.70),
        })
        result = assess(points, "Face", aspect_ratio=16 / 9)
        self.assertEqual([item.label for item in result.indicators],
                         ["Épaules", "Tête centrée", "Tête inclinée", "Bassin", "Axe du buste"])
        self.assertFalse(result.alert)

    def test_side_reports_arm_hip_and_knee_angles_as_observations(self):
        points = pose(**{
            "7": (0.50, 0.24), "11": (0.50, 0.40), "13": (0.55, 0.48),
            "15": (0.60, 0.55), "23": (0.50, 0.70), "25": (0.65, 0.83),
            "27": (0.65, 0.95),
        })
        result = assess(points, "Profil", aspect_ratio=16 / 9)
        self.assertEqual([item.label for item in result.indicators],
                         ["Tête / épaule", "Buste", "Coude", "Hanche", "Genou"])
        self.assertFalse(any(item.alert for item in result.indicators[2:]))

    def test_aspect_ratio_corrects_image_angles_and_offsets(self):
        front = pose(**{"0": (0.5, 0.2), "11": (0.3, 0.4), "12": (0.7, 0.45)})
        self.assertTrue(assess_front(front, aspect_ratio=1).indicators[0].alert)
        self.assertFalse(assess_front(front, aspect_ratio=2).indicators[0].alert)
        side = pose(**{"7": (0.56, 0.2), "11": (0.5, 0.4), "23": (0.5, 0.7)})
        self.assertFalse(assess_side(side, aspect_ratio=1).indicators[0].alert)
        self.assertTrue(assess_side(side, aspect_ratio=2).indicators[0].alert)

    def test_low_presence_and_invalid_points_are_omitted(self):
        front = pose(**{
            "0": (0.5, 0.2, 0.99, 0.1),
            "11": (0.35, 0.4), "12": (0.65, 0.4),
            "23": (0.4, 0.7), "24": (0.6, 0.7),
        })
        front[7] = SimpleNamespace(x=float("nan"), y=0.2, visibility=0.99, presence=0.99)
        result = assess_front(front)
        self.assertNotIn("Tête centrée", [item.label for item in result.indicators])
        self.assertIn("partiellement visibles", result.message)
        side = pose(**{
            "7": (0.8, 0.2, 0.99, 0.1), "11": (0.5, 0.4), "23": (0.5, 0.7),
        })
        result = assess_side(side)
        self.assertEqual([item.label for item in result.indicators], ["Buste"])
        self.assertFalse(result.alert)

    def test_hidden_shoulder_does_not_create_a_false_alert(self):
        points = pose(**{
            "0": (0.8, 0.2), "11": (0.35, 0.3, 0.20, 0.99),
            "12": (0.65, 0.5), "23": (0.4, 0.7), "24": (0.6, 0.7),
        })
        result = assess_front(points)
        self.assertEqual(result.indicators, ())
        self.assertFalse(result.alert)

    def test_degenerate_limb_does_not_create_angle(self):
        points = pose(**{
            "7": (0.5, 0.2), "11": (0.5, 0.4), "13": (0.5, 0.4),
            "15": (0.6, 0.5), "23": (0.5, 0.7),
        })
        self.assertNotIn("Coude", [item.label for item in assess_side(points).indicators])


if __name__ == "__main__":
    unittest.main()
