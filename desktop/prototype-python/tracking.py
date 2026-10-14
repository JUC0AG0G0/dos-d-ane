"""Camera tracking models shared by the live view and packaged self-test."""

from contextlib import ExitStack
from dataclasses import dataclass
from pathlib import Path


@dataclass
class TrackingResult:
    pose: list
    face: list
    hands: list


class BodyTracker:
    def __init__(self, model_directory: Path):
        import mediapipe as mp

        self.mp = mp
        self.model_directory = model_directory
        self.resources = ExitStack()
        self.face_detector = None
        self.hand_detector = None
        try:
            self.pose_detector = self.resources.enter_context(
                mp.tasks.vision.PoseLandmarker.create_from_options(
                    mp.tasks.vision.PoseLandmarkerOptions(
                        base_options=self._base("pose_landmarker_lite.task"),
                        running_mode=mp.tasks.vision.RunningMode.VIDEO,
                        num_poses=1,
                        min_pose_detection_confidence=0.6,
                        min_pose_presence_confidence=0.6,
                        min_tracking_confidence=0.6,
                    )
                )
            )
        except Exception:
            self.resources.close()
            raise

    def _base(self, filename):
        path = self.model_directory / filename
        if not path.is_file():
            raise FileNotFoundError(f"Modèle absent : {filename}. Relancez installer.ps1.")
        return self.mp.tasks.BaseOptions(model_asset_path=str(path))

    def _load_details(self):
        vision = self.mp.tasks.vision
        if self.face_detector is None:
            self.face_detector = self.resources.enter_context(
                vision.FaceLandmarker.create_from_options(
                    vision.FaceLandmarkerOptions(
                        base_options=self._base("face_landmarker.task"),
                        running_mode=vision.RunningMode.VIDEO,
                        num_faces=1,
                        min_face_detection_confidence=0.6,
                        min_face_presence_confidence=0.6,
                        min_tracking_confidence=0.6,
                    )
                )
            )
        if self.hand_detector is None:
            self.hand_detector = self.resources.enter_context(
                vision.HandLandmarker.create_from_options(
                    vision.HandLandmarkerOptions(
                        base_options=self._base("hand_landmarker.task"),
                        running_mode=vision.RunningMode.VIDEO,
                        num_hands=2,
                        min_hand_detection_confidence=0.6,
                        min_hand_presence_confidence=0.6,
                        min_tracking_confidence=0.6,
                    )
                )
            )

    def detect(self, rgb_frame, timestamp_ms: int, details: bool = True) -> TrackingResult:
        image = self.mp.Image(image_format=self.mp.ImageFormat.SRGB, data=rgb_frame)
        pose = self.pose_detector.detect_for_video(image, timestamp_ms)
        face_points, hands = [], []
        if details:
            self._load_details()
            face = self.face_detector.detect_for_video(image, timestamp_ms)
            hand_result = self.hand_detector.detect_for_video(image, timestamp_ms)
            face_points = face.face_landmarks[0] if face.face_landmarks else []
            hands = hand_result.hand_landmarks
        return TrackingResult(pose.pose_landmarks[0] if pose.pose_landmarks else [],
                              face_points, hands)

    def __enter__(self):
        return self

    def __exit__(self, *_):
        self.resources.close()
