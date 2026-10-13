"""Desktop webcam preview and indicative work posture feedback."""

import os
import queue
import sys
import threading
import time
import tkinter as tk
from pathlib import Path
from tkinter import ttk

import cv2
from PIL import Image, ImageTk

from posture import Assessment, assess
from point_data import describe_points
from overlay import draw_overlay
from tracking import BodyTracker

ROOT = Path(__file__).resolve().parent
INFERENCE_WIDTH = {"Fluide": 640, "Détaillée": 960}


class AssessmentStabilizer:
    """Keep the last coherent assessment until a changed state persists."""

    def __init__(self, minimum_frames=4):
        self.minimum_frames = minimum_frames
        self.reset()

    def reset(self):
        self.stable = None
        self.signature = None
        self.candidate = None
        self.candidate_count = 0

    def update(self, assessment):
        if not assessment.indicators:
            self.reset()
            return assessment

        signature = tuple((item.label, item.alert) for item in assessment.indicators)
        if self.stable is None or signature == self.signature:
            self.stable = assessment
            self.signature = signature
            self.candidate = None
            self.candidate_count = 0
        else:
            if signature == self.candidate:
                self.candidate_count += 1
            else:
                self.candidate = signature
                self.candidate_count = 1
            if self.candidate_count >= self.minimum_frames:
                self.stable = assessment
                self.signature = signature
                self.candidate = None
                self.candidate_count = 0
        return self.stable


def open_camera(index):
    """DirectShow is fast on Windows; use the system backend when unavailable."""
    backends = (cv2.CAP_DSHOW, cv2.CAP_ANY) if os.name == "nt" else (cv2.CAP_ANY,)
    for backend in backends:
        capture = cv2.VideoCapture(index, backend)
        if capture.isOpened():
            capture.set(cv2.CAP_PROP_FRAME_WIDTH, 960)
            capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 540)
            capture.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            return capture
        capture.release()
    raise RuntimeError("Caméra inaccessible. Vérifiez son numéro et l'autorisation Windows.")


class CameraWorker(threading.Thread):
    def __init__(self, camera_index, view, quality, show_numbers, output, stop_event,
                 details=True, show_point_data=True, dense_points=True):
        super().__init__(daemon=True)
        self.camera_index = camera_index
        self.view = view
        self.quality = quality
        self.show_numbers = show_numbers
        self.output = output
        self.stop_event = stop_event
        self.details = details
        self.show_point_data = show_point_data
        self.dense_points = dense_points

    def publish(self, item):
        # Keep the newest frame; error and stopped events also fit in this queue.
        while True:
            try:
                self.output.put_nowait(item)
                return
            except queue.Full:
                try:
                    self.output.get_nowait()
                except queue.Empty:
                    pass

    def run(self):
        capture = None
        try:
            capture = open_camera(self.camera_index)
            start = time.monotonic()
            last_stamp = -1
            last_frame_time = None
            fps = 0.0
            failures = 0
            stabilizer = AssessmentStabilizer()
            previous_view = self.view
            with BodyTracker(ROOT / "models") as detector:
                while not self.stop_event.is_set():
                    ok, frame = capture.read()
                    if not ok:
                        failures += 1
                        if failures >= 5:
                            raise RuntimeError("Le flux caméra s'est interrompu.")
                        self.stop_event.wait(0.08)
                        continue
                    failures = 0
                    frame = cv2.flip(frame, 1)
                    height, width = frame.shape[:2]
                    target_width = INFERENCE_WIDTH.get(self.quality, 640)
                    if width > target_width:
                        target_height = max(1, round(height * target_width / width))
                        inference_frame = cv2.resize(
                            frame, (target_width, target_height), interpolation=cv2.INTER_AREA)
                    else:
                        inference_frame = frame
                    stamp = max(last_stamp + 1, int((time.monotonic() - start) * 1000))
                    last_stamp = stamp
                    details = self.details
                    result = detector.detect(
                        cv2.cvtColor(inference_frame, cv2.COLOR_BGR2RGB), stamp, details)

                    current_view = self.view
                    if current_view != previous_view:
                        stabilizer.reset()
                        previous_view = current_view
                    if result.pose:
                        raw_assessment = assess(result.pose, current_view, width / height)
                        assessment = stabilizer.update(raw_assessment)
                    else:
                        stabilizer.reset()
                        assessment = Assessment((), "Cadrez aussi les épaules et le buste pour mesurer la posture.", False)
                    point_data = describe_points(result.pose, width / height)
                    visible_count = draw_overlay(
                        frame, result.pose, assessment.alert, result.face,
                        result.hands, self.show_numbers,
                        show_point_data=self.show_point_data, point_data=point_data,
                        dense_points=self.dense_points)
                    detail_status = (f"Visage : {'suivi' if result.face else 'non détecté'} · "
                                     f"Mains : {len(result.hands)}" if details else "Contours détaillés désactivés")

                    now = time.monotonic()
                    if last_frame_time is not None:
                        current_fps = 1 / max(now - last_frame_time, 0.001)
                        fps = current_fps if fps == 0 else fps * 0.8 + current_fps * 0.2
                    last_frame_time = now
                    self.publish(("frame", cv2.cvtColor(frame, cv2.COLOR_BGR2RGB),
                                  assessment, visible_count, fps, detail_status, point_data))
        except Exception as exc:
            self.publish(("error", str(exc)))
        finally:
            if capture is not None:
                capture.release()
            self.publish(("stopped",))


class PostureApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Dos d'âne — posture au bureau")
        self.root.geometry("1280x780")
        self.root.minsize(900, 620)
        self.root.configure(bg="#101820")
        self.events = queue.Queue(maxsize=2)
        self.worker = None
        self.stop_event = None
        self.photo = None
        self.last_error = False
        self.closed = False
        self.metric_cards = {}

        style = ttk.Style()
        style.theme_use("clam")
        style.configure("TButton", padding=9, font=("Segoe UI", 10))
        style.configure("TCombobox", padding=5)

        header = tk.Frame(root, bg="#101820")
        header.pack(fill="x", padx=24, pady=(18, 8))
        tk.Label(header, text="Dos d'âne", bg="#101820", fg="#f2f6f5",
                 font=("Segoe UI", 24, "bold")).pack(anchor="w")
        tk.Label(header, text="Posture en direct · corps, contours du visage et mains", bg="#101820",
                 fg="#9fb2b7", font=("Segoe UI", 11)).pack(anchor="w")

        controls = tk.Frame(root, bg="#101820")
        controls.pack(fill="x", padx=24, pady=(4, 12))
        tk.Label(controls, text="Caméra", bg="#101820", fg="white").pack(side="left")
        self.camera = tk.Spinbox(controls, from_=0, to=9, width=3)
        self.camera.pack(side="left", padx=(8, 20))
        tk.Label(controls, text="Vue", bg="#101820", fg="white").pack(side="left")
        self.view = ttk.Combobox(controls, values=("Face", "Profil"), state="readonly", width=9)
        self.view.set("Face")
        self.view.pack(side="left", padx=(8, 20))
        self.view.bind("<<ComboboxSelected>>", self.update_worker_options)
        tk.Label(controls, text="Qualité", bg="#101820", fg="white").pack(side="left")
        self.quality = ttk.Combobox(controls, values=("Fluide", "Détaillée"),
                                    state="readonly", width=10)
        self.quality.set("Fluide")
        self.quality.pack(side="left", padx=(8, 20))
        self.quality.bind("<<ComboboxSelected>>", self.update_worker_options)
        self.start_button = ttk.Button(controls, text="Démarrer", command=self.start)
        self.start_button.pack(side="left")
        self.stop_button = ttk.Button(controls, text="Arrêter", command=self.stop, state="disabled")
        self.stop_button.pack(side="left", padx=(8, 0))
        display_options = tk.Frame(root, bg="#101820")
        display_options.pack(fill="x", padx=24, pady=(0, 10))
        self.details = tk.BooleanVar(value=True)
        tk.Checkbutton(
            display_options, text="Visage et mains", variable=self.details,
            command=self.update_worker_options, bg="#101820", fg="#dce5e4",
            selectcolor="#24353c", activebackground="#101820", activeforeground="#dce5e4",
            font=("Segoe UI", 10),
        ).pack(side="left")
        self.dense_points = tk.BooleanVar(value=True)
        self.show_point_data = tk.BooleanVar(value=True)
        for label, variable in (("Points détaillés", self.dense_points),
                                ("Données sur l'image", self.show_point_data)):
            tk.Checkbutton(
                display_options, text=label, variable=variable,
                command=self.update_worker_options, bg="#101820", fg="#dce5e4",
                selectcolor="#24353c", activebackground="#101820", activeforeground="#dce5e4",
                font=("Segoe UI", 10),
            ).pack(side="left", padx=(16, 0))
        self.show_numbers = tk.BooleanVar(value=False)
        self.numbers_button = tk.Checkbutton(
            display_options, text="Numéros", variable=self.show_numbers,
            command=self.update_worker_options, bg="#101820", fg="#dce5e4",
            selectcolor="#24353c", activebackground="#101820", activeforeground="#dce5e4",
            font=("Segoe UI", 10),
        )
        self.numbers_button.pack(side="left", padx=(24, 0))

        content = tk.Frame(root, bg="#101820")
        content.pack(fill="both", expand=True, padx=24, pady=(0, 10))
        preview_frame = tk.Frame(content, bg="#1a2830")
        preview_frame.pack(side="left", fill="both", expand=True)
        self.preview = tk.Label(
            preview_frame, text="Placez la caméra à hauteur du buste, puis démarrez.",
            bg="#1a2830", fg="#c8d7d7", font=("Segoe UI", 13),
        )
        self.preview.pack(fill="both", expand=True)

        panel = tk.Frame(content, bg="#16242b", width=390)
        panel.pack(side="right", fill="y", padx=(14, 0))
        panel.pack_propagate(False)
        tk.Label(panel, text="Analyse", bg="#16242b", fg="#f2f6f5",
                 font=("Segoe UI", 17, "bold"), anchor="w").pack(fill="x", padx=16, pady=(15, 6))
        self.status = tk.Label(
            panel, text="Prêt", bg="#213631", fg="#c8efc4", anchor="w",
            justify="left", padx=12, pady=12, wraplength=340,
            font=("Segoe UI", 11, "bold"),
        )
        self.status.pack(fill="x", padx=12)
        self.tracking = tk.Label(
            panel, text="Corps : — / 33 repères   ·   — ips",
            bg="#16242b", fg="#9fb2b7", anchor="w", font=("Segoe UI", 9),
        )
        self.tracking.pack(fill="x", padx=16, pady=(12, 7))
        self.detail_tracking = tk.Label(
            panel, text="Visage et mains : en attente", bg="#16242b", fg="#9fb2b7",
            anchor="w", font=("Segoe UI", 9))
        self.detail_tracking.pack(fill="x", padx=16, pady=(0, 8))

        notebook = ttk.Notebook(panel)
        notebook.pack(fill="both", expand=True, padx=12, pady=(0, 12))
        metrics_area = tk.Frame(notebook, bg="#16242b")
        point_area = tk.Frame(notebook, bg="#16242b")
        notebook.add(point_area, text="Données des points")
        notebook.add(metrics_area, text="Posture")
        self.metrics_canvas = tk.Canvas(metrics_area, bg="#16242b", highlightthickness=0)
        scrollbar = ttk.Scrollbar(metrics_area, orient="vertical", command=self.metrics_canvas.yview)
        self.metrics_canvas.configure(yscrollcommand=scrollbar.set)
        scrollbar.pack(side="right", fill="y")
        self.metrics_canvas.pack(side="left", fill="both", expand=True)
        self.metrics_inner = tk.Frame(self.metrics_canvas, bg="#16242b")
        self.metrics_window = self.metrics_canvas.create_window(
            (0, 0), window=self.metrics_inner, anchor="nw")
        self.metrics_inner.bind("<Configure>", self.update_metrics_scroll)
        self.metrics_canvas.bind("<Configure>", self.update_metrics_width)
        self.empty_metrics = tk.Label(
            self.metrics_inner, text="Les mesures apparaîtront ici quand la personne sera visible.",
            bg="#16242b", fg="#9fb2b7", justify="left", wraplength=260,
            font=("Segoe UI", 10),
        )
        self.empty_metrics.pack(anchor="w", pady=12)

        tk.Label(point_area, text="Positions dans l'image · angles 2D observés", bg="#16242b",
                 fg="#9fb2b7", font=("Segoe UI", 9)).pack(anchor="w", padx=8, pady=(10, 8))
        table_frame = tk.Frame(point_area, bg="#16242b")
        table_frame.pack(fill="both", expand=True)
        style.configure("Points.Treeview", background="#1e2e36", fieldbackground="#1e2e36",
                        foreground="#e4eeed", rowheight=28, borderwidth=0,
                        font=("Segoe UI", 9))
        style.configure("Points.Treeview.Heading", font=("Segoe UI", 9, "bold"))
        self.point_table = ttk.Treeview(
            table_frame, columns=("name", "x", "y", "visibility", "angle"),
            show="headings", style="Points.Treeview", selectmode="browse")
        for key, heading, width in (("name", "Point", 112), ("x", "X %", 39),
                                     ("y", "Y %", 39), ("visibility", "Visibilité", 85),
                                     ("angle", "Angle", 52)):
            self.point_table.heading(key, text=heading)
            self.point_table.column(key, width=width, minwidth=width, stretch=(key == "name"),
                                    anchor="w" if key == "name" else "center")
        point_scroll = ttk.Scrollbar(table_frame, orient="vertical", command=self.point_table.yview)
        self.point_table.configure(yscrollcommand=point_scroll.set)
        point_scroll.pack(side="right", fill="y")
        self.point_table.pack(side="left", fill="both", expand=True)
        self.point_table.tag_configure("visible", foreground="#bcf2d0")
        self.point_table.tag_configure("missing", foreground="#81949c")
        self.point_table.bind("<<TreeviewSelect>>", self.select_point)
        self.point_hint = tk.Label(
            point_area, text="G / D : côtés de la personne. Sélectionnez un point pour ses détails.",
            bg="#16242b", fg="#a9bfc4", font=("Segoe UI", 9), wraplength=342,
            anchor="w", justify="left", pady=10)
        self.point_hint.pack(fill="x", padx=8)
        self.latest_points = {}
        self.update_points(describe_points([]))

        footer = tk.Frame(root, bg="#101820")
        footer.pack(fill="x", padx=24, pady=(0, 14))
        tk.Label(
            footer,
            text="Repères indicatifs : les mesures 2D dépendent de l'angle de vue. "
                 "Images analysées localement, non enregistrées. "
                 "MediaPipe peut envoyer des métriques techniques à Google.",
            bg="#101820", fg="#8ca4a8", font=("Segoe UI", 9),
            wraplength=1200, justify="left", anchor="w",
        ).pack(fill="x")
        root.protocol("WM_DELETE_WINDOW", self.close)
        root.after(40, self.poll)

    def update_metrics_scroll(self, _event=None):
        self.metrics_canvas.configure(scrollregion=self.metrics_canvas.bbox("all"))

    def update_metrics_width(self, event):
        self.metrics_canvas.itemconfigure(self.metrics_window, width=event.width)

    def update_worker_options(self, _event=None):
        if self.worker and self.worker.is_alive():
            self.worker.view = self.view.get()
            self.worker.quality = self.quality.get()
            self.worker.show_numbers = self.show_numbers.get()
            self.worker.details = self.details.get()
            self.worker.show_point_data = self.show_point_data.get()
            self.worker.dense_points = self.dense_points.get()

    def start(self):
        if self.worker and self.worker.is_alive():
            return
        try:
            index = int(self.camera.get())
            if index < 0:
                raise ValueError
        except ValueError:
            self.show_status("Numéro de caméra invalide.", True)
            return
        self.events = queue.Queue(maxsize=2)
        self.stop_event = threading.Event()
        self.last_error = False
        self.worker = CameraWorker(
            index, self.view.get(), self.quality.get(), self.show_numbers.get(),
            self.events, self.stop_event, self.details.get(),
            self.show_point_data.get(), self.dense_points.get(),
        )
        self.worker.start()
        self.start_button.configure(state="disabled")
        self.stop_button.configure(state="normal")
        self.camera.configure(state="disabled")
        self.show_status("Ouverture de la caméra…", False)

    def stop(self):
        if self.stop_event:
            self.stop_event.set()
        self.stop_button.configure(state="disabled")
        self.show_status("Arrêt de la caméra…", False)

    def show_status(self, message, alert):
        self.status.configure(
            text=message,
            fg="#ffd6bd" if alert else "#c8efc4",
            bg="#493025" if alert else "#213631",
        )

    def update_points(self, points):
        self.latest_points = {point.index: point for point in points}
        # Keep shoulders first and retain selection while values refresh.
        for index in (11, 12, 13, 14, 15, 16, 7, 8, 23, 24, 25, 26, 27, 28):
            point = self.latest_points.get(index)
            if point is None:
                continue
            name = point.name.replace("gauche", "G").replace("droite", "D").replace("droit", "D")
            x = f"{point.x * 100:.1f}" if point.x is not None else "—"
            y = f"{point.y * 100:.1f}" if point.y is not None else "—"
            confidence = (f"{point.visibility * 100:.0f} %" if point.usable and point.visibility is not None
                          else point.state)
            angle = f"{point.angle:.0f}°" if point.angle is not None else "—"
            values = (name, x, y, confidence, angle)
            tags = ("visible",) if point.usable else ("missing",)
            if self.point_table.exists(str(index)):
                self.point_table.item(str(index), values=values, tags=tags)
            else:
                self.point_table.insert("", "end", iid=str(index), values=values, tags=tags)
        self.select_point()

    def select_point(self, _event=None):
        selected = self.point_table.selection()
        if not selected:
            return
        point = self.latest_points.get(int(selected[0]))
        if point is None:
            return
        angle_text = f" Angle 2D : {point.angle:.1f}°." if point.angle is not None else " Angle indisponible."
        self.point_hint.configure(text=f"#{point.index} · {point.name} · {point.state}.{angle_text}\n"
                                      "X : gauche → droite de l'image ; Y : haut → bas.")

    def update_metrics(self, indicators):
        if not indicators:
            for card in self.metric_cards.values():
                card["frame"].pack_forget()
            self.empty_metrics.pack(anchor="w", pady=12)
            return
        self.empty_metrics.pack_forget()
        visible_labels = set()
        for metric in indicators:
            visible_labels.add(metric.label)
            if metric.label not in self.metric_cards:
                frame = tk.Frame(self.metrics_inner, bg="#24343b", padx=12, pady=10)
                title = tk.Label(frame, bg="#24343b", fg="#9fb2b7", anchor="w",
                                 font=("Segoe UI", 9, "bold"))
                title.pack(fill="x")
                value = tk.Label(frame, bg="#24343b", fg="#f2f6f5", anchor="w",
                                 font=("Segoe UI", 19, "bold"))
                value.pack(fill="x", pady=(2, 0))
                detail = tk.Label(frame, bg="#24343b", fg="#c8d7d7", anchor="w",
                                  justify="left", wraplength=245, font=("Segoe UI", 9))
                detail.pack(fill="x")
                self.metric_cards[metric.label] = {
                    "frame": frame, "title": title, "value": value, "detail": detail,
                }
            card = self.metric_cards[metric.label]
            card["frame"].pack(fill="x", pady=(0, 8))
            card["title"].configure(text=metric.label)
            card["value"].configure(text=metric.value,
                                     fg="#ffbc8e" if metric.alert else "#c8efc4")
            card["detail"].configure(text=metric.message)
        for label, card in self.metric_cards.items():
            if label not in visible_labels:
                card["frame"].pack_forget()

    def poll(self):
        if self.closed:
            return
        try:
            while True:
                item = self.events.get_nowait()
                if item[0] == "frame":
                    _, frame, assessment, visible_count, fps, detail_status, point_data = item
                    height, width = frame.shape[:2]
                    available_width = max(self.preview.winfo_width(), 1)
                    available_height = max(self.preview.winfo_height(), 1)
                    scale = min(available_width / width, available_height / height)
                    display_size = (max(1, round(width * scale)),
                                    max(1, round(height * scale)))
                    if display_size != (width, height):
                        frame = cv2.resize(frame, display_size, interpolation=cv2.INTER_AREA)
                    self.photo = ImageTk.PhotoImage(Image.fromarray(frame))
                    self.preview.configure(image=self.photo, text="")
                    self.show_status(assessment.message, assessment.alert)
                    speed = f"{fps:.0f}" if fps else "—"
                    self.tracking.configure(
                        text=f"Corps : {visible_count} / 33 repères   ·   {speed} ips")
                    self.detail_tracking.configure(text=detail_status)
                    self.update_metrics(assessment.indicators)
                    self.update_points(point_data)
                elif item[0] == "error":
                    self.last_error = True
                    self.show_status(item[1], True)
                    self.update_metrics(())
                    self.update_points(describe_points([]))
                elif item[0] == "stopped":
                    self.photo = None
                    self.preview.configure(image="", text="Caméra arrêtée.")
                    self.tracking.configure(text="Corps : — / 33 repères   ·   — ips")
                    self.detail_tracking.configure(text="Visage et mains : en attente")
                    self.update_points(describe_points([]))
                    self.update_metrics(())
                    if not self.last_error:
                        self.show_status("Caméra arrêtée.", False)
                    self.start_button.configure(state="normal")
                    self.stop_button.configure(state="disabled")
                    self.camera.configure(state="normal")
        except queue.Empty:
            pass
        self.root.after(40, self.poll)

    def close(self):
        self.closed = True
        if self.stop_event:
            self.stop_event.set()
        self.root.destroy()


def self_test() -> int:
    """Check bundled native libraries and model without opening the webcam."""
    try:
        import numpy as np
        with BodyTracker(ROOT / "models") as detector:
            detector.detect(np.zeros((256, 256, 3), dtype=np.uint8), 0, details=True)
        return 0
    except Exception:
        if sys.stderr is not None:
            import traceback
            traceback.print_exc()
        return 1


if __name__ == "__main__":
    if "--self-test" in sys.argv[1:]:
        sys.exit(self_test())
    window = tk.Tk()
    PostureApp(window)
    window.mainloop()
