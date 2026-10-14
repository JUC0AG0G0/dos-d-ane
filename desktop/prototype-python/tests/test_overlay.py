"""Regression checks for the overlay that replaced coarse face/hand triangles."""

import unittest
from types import SimpleNamespace
from unittest.mock import patch

import cv2
import numpy as np

from overlay import draw_overlay


def point(x, y, **kwargs):
    return SimpleNamespace(x=x, y=y, **kwargs)


class OverlayTests(unittest.TestCase):
    def test_sparse_pose_face_and_hand_points_do_not_invent_contours(self):
        frame = np.zeros((540, 960, 3), dtype=np.uint8)
        pose = [None] * 33
        for index in (*range(11), *range(17, 23)):
            pose[index] = point(0.2 + index / 100, 0.2 + index / 100)
        self.assertEqual(draw_overlay(frame, pose, False), 17)
        self.assertFalse(frame.any())

    def test_uncertain_or_invalid_landmarks_cannot_form_body_lines(self):
        frame = np.zeros((540, 960, 3), dtype=np.uint8)
        pose = [None] * 33
        pose[11] = point(0.2, 0.4)
        pose[12] = point(0.8, 0.4, visibility=0.1)
        pose[13] = point(float("nan"), 0.5)
        pose[23] = point(1.2, 0.8)
        pose[24] = point(0.7, 0.8, presence=float("nan"))
        self.assertEqual(draw_overlay(frame, pose, False), 1)
        self.assertFalse(frame[:, 250:].any())
        self.assertTrue(frame[210:225, 180:205].any())

    def test_face_contour_and_finger_render_without_a_body_detection(self):
        frame = np.zeros((540, 960, 3), dtype=np.uint8)
        face = [None] * 478
        face[10] = point(0.2, 0.2)
        face[338] = point(0.3, 0.2)
        hand = [None] * 21
        hand[7] = point(0.7, 0.5)
        hand[8] = point(0.7, 0.3)
        self.assertEqual(draw_overlay(frame, None, False, face, [hand]), 0)
        self.assertTrue(frame[105:111, 230:245].any())
        self.assertTrue(frame[210:225, 669:674].any())

    def test_partial_results_and_image_boundaries_are_safe(self):
        frame = np.zeros((72, 128, 3), dtype=np.uint8)
        hand = [point(0, 0), point(1, 1)]
        self.assertEqual(draw_overlay(frame, [], False, [], [hand]), 0)
        self.assertTrue(frame[0, 0].any())
        self.assertTrue(frame[-1, -1].any())

    def test_dense_mode_marks_only_actual_contour_vertices(self):
        face = [None] * 478
        face[10] = point(0.2, 0.2)
        face[200] = point(0.8, 0.8)  # not part of the selected contour paths
        frame = np.zeros((540, 960, 3), dtype=np.uint8)
        draw_overlay(frame, None, False, face, dense_points=False)
        self.assertFalse(frame.any())
        draw_overlay(frame, None, False, face, dense_points=True)
        self.assertTrue(frame[104:113, 187:197].any())
        self.assertFalse(frame[425:440, 760:775].any())

    def test_shoulder_readouts_use_data_and_pixel_aspect_ratio(self):
        frame = np.zeros((540, 960, 3), dtype=np.uint8)
        pose = [None] * 33
        pose[11], pose[12] = point(0.25, 0.25), point(0.75, 0.75)
        data = [SimpleNamespace(index=11, usable=True, visibility=0.93,
                                x=0.25, y=0.25, angle=83.0),
                SimpleNamespace(index=12, usable=True, visibility=0.96,
                                x=0.75, y=0.75, angle=None)]
        with patch("overlay.cv2.putText", wraps=cv2.putText) as text:
            draw_overlay(frame, pose, False, show_point_data=True, point_data=data)
        labels = [call.args[1] for call in text.call_args_list]
        self.assertIn("Epaule G  #11", labels)
        self.assertIn("Conf. 93%  X 25%  Y 25%", labels)
        self.assertIn("Bras / buste 83 deg", labels)
        self.assertIn("Ligne epaules +29.3 deg", labels)
        self.assertIn("Centre calcule", labels)

    def test_invalid_or_unusable_points_never_get_a_readout(self):
        frame = np.zeros((540, 960, 3), dtype=np.uint8)
        pose = [None] * 33
        pose[11], pose[12] = point(0.25, 0.5, visibility=0.1), point(0.75, 0.5)
        data = [SimpleNamespace(index=11, usable=True),
                SimpleNamespace(index=12, usable=False)]
        with patch("overlay.cv2.putText", wraps=cv2.putText) as text:
            draw_overlay(frame, pose, False, show_point_data=True, point_data=data)
        text.assert_not_called()

    def test_point_readouts_are_safe_at_image_edges_and_tiny_sizes(self):
        pose = [None] * 33
        pose[11], pose[12] = point(0, 0), point(1, 1)
        data = [SimpleNamespace(index=index, usable=True, visibility=1,
                                x=pose[index].x, y=pose[index].y, angle=None)
                for index in (11, 12)]
        for width, height in ((128, 72), (1, 1)):
            with self.subTest(width=width, height=height):
                frame = np.zeros((height, width, 3), dtype=np.uint8)
                self.assertEqual(draw_overlay(frame, pose, False, show_point_data=True,
                                              point_data=data, dense_points=True), 2)


if __name__ == "__main__":
    unittest.main()
