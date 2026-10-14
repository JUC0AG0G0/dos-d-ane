import { useEffect, useRef, useState } from "react";
import { Rive, RuntimeLoader, Layout, Fit, Alignment } from "@rive-app/canvas";
import { mascotPose } from "./mascot-pose.js";
import { LIMB_AXES, ANGLE_AXES, wrapAngle } from "./mascot-limbs.js";
RuntimeLoader.setWasmUrl(
  new URL("./wasm/rive/rive.wasm", document.baseURI).href,
);
RuntimeLoader.setWasmFallbackUrl(
  new URL("./wasm/rive/rive_fallback.wasm", document.baseURI).href,
);

export default function PostureMascot({ sample, assessment, active, visible }) {
  const canvas = useRef(null),
    instance = useRef(null),
    current = useRef({});
  const [view, setView] = useState(1);
  const [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false);
  const pose = mascotPose(assessment, active);
  useEffect(() => {
    let disposed = false;
    const rive = new Rive({
      src: new URL("./mascot/ane.riv", document.baseURI).href,
      canvas: canvas.current,
      stateMachines: "Posture",
      autoBind: true,
      autoplay: true,
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      onLoad: () => {
        if (disposed) return;
        rive.resizeDrawingSurfaceToCanvas(
          Math.min(2, window.devicePixelRatio || 1),
        );
        setReady(true);
      },
      onLoadError: () => {
        if (!disposed) setFailed(true);
      },
    });
    instance.current = rive;
    const observer = new ResizeObserver(() => {
      if (!disposed)
        rive.resizeDrawingSurfaceToCanvas(
          Math.min(2, window.devicePixelRatio || 1),
        );
    });
    observer.observe(canvas.current);
    return () => {
      disposed = true;
      observer.disconnect();
      rive.cleanup();
      instance.current = null;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const rive = instance.current;
    const axes = ["pitch", "forward", "roll", "lateral", "yaw", ...LIMB_AXES];
    const inputs = Object.fromEntries(
      [...axes, "view"].map((key) => [
        key,
        rive.viewModelInstance?.number(key),
      ]),
    );
    if (Object.values(inputs).some((input) => !input)) {
      setFailed(true);
      return;
    }
    if (!visible) {
      rive.stopRendering();
      return;
    }
    rive.startRendering();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    inputs.view.value = view;
    let frame,
      stopTimer,
      last = performance.now();
    const tick = (now) => {
      // Read the newest inference directly, independently of React's text refresh.
      const target = mascotPose(sample.current, active);
      const alpha =
        reduced || !active ? 1 : 1 - Math.exp(-Math.min(100, now - last) / 35);
      last = now;
      for (const key of axes) {
        const previous = current.current[key] ?? target[key];
        const delta = ANGLE_AXES.has(key)
          ? wrapAngle(target[key] - previous)
          : target[key] - previous;
        const next = previous + delta * alpha;
        current.current[key] = key.endsWith("Visible")
          ? target[key]
          : ANGLE_AXES.has(key)
            ? wrapAngle(next)
            : next;
        inputs[key].value = current.current[key];
      }
      canvas.current.dataset.pose = JSON.stringify(current.current);
      if (active) frame = requestAnimationFrame(tick);
      else
        stopTimer = setTimeout(() => {
          if (instance.current === rive) rive.stopRendering();
        }, 50);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(stopTimer);
    };
  }, [ready, visible, active, view, sample]);
  return (
    <figure
      className={`mascot ${pose.tracked ? "tracked" : "resting"}`}
      data-ready={ready && !failed}
      data-bend={Math.round(pose.bend)}
      title="Représentation simplifiée de votre posture"
    >
      <canvas
        ref={canvas}
        aria-label={`Petit âne : ${pose.caption}`}
        role="img"
      />
      <div className="mascot-views" aria-label="Vue de la mascotte">
        <button
          type="button"
          aria-pressed={view === 1}
          onClick={() => setView(1)}
        >
          Face
        </button>
        <button
          type="button"
          aria-pressed={view === 0}
          onClick={() => setView(0)}
        >
          Profil
        </button>
      </div>
      <figcaption>{failed ? "Mascotte indisponible" : pose.caption}</figcaption>
    </figure>
  );
}
