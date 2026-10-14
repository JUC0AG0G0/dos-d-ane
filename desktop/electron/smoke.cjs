const { app } = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");

function registerSmokeTest({ win, tray, showWindow, appRoot }) {
  win.webContents.once("did-finish-load", async () => {
    try {
      const smokeRoot = app.isPackaged
        ? path.join(app.getPath("temp"), "dosdane-smoke")
        : path.join(appRoot, "output", "smoke");
      await fs.mkdir(smokeRoot, { recursive: true });
      await new Promise((resolve) => setTimeout(resolve, 700));
      const result = await win.webContents.executeJavaScript(`(async()=>({
          rendered: !!document.querySelector('.shell') && document.body.textContent.includes('Démarrer'),
          mediaPipe: (await fetch('./models/pose_landmarker_lite.task')).ok,
          yolo: (await fetch('./models/yolov8n-pose.onnx')).ok,
          face: (await fetch('./models/face_landmarker.task')).ok,
          hands: (await fetch('./models/hand_landmarker.task')).ok,
          wasm: (await fetch('./wasm/mediapipe/vision_wasm_internal.wasm')).ok
        }))()`);
      await fs.writeFile(
        path.join(smokeRoot, "dosdane-smoke.png"),
        (await win.webContents.capturePage()).toPNG(),
      );
      await win.webContents.executeJavaScript(
        "document.querySelector('.window-button').click()",
      );
      await new Promise((resolve) => setTimeout(resolve, 250));
      result.expanded = await win.webContents.executeJavaScript(
        "!!document.querySelector('.shell.expanded #model') && document.querySelectorAll('#model option').length === 3",
      );
      result.noDegrees = await win.webContents.executeJavaScript(
        "!document.body.textContent.includes('°')",
      );
      result.neckRow = await win.webContents.executeJavaScript(
        "[...document.querySelectorAll('.region-row > span')].some(row=>row.textContent==='Nuque')",
      );
      result.isolated = await win.webContents.executeJavaScript(
        "window.crossOriginIsolated",
      );
      result.mascot = await win.webContents.executeJavaScript(
        "document.querySelector('.mascot')?.dataset.ready==='true'",
      );
      await fs.writeFile(
        path.join(smokeRoot, "dosdane-smoke-expanded.png"),
        (await win.webContents.capturePage()).toPNG(),
      );
      if (process.argv.includes("--smoke-models")) {
        await win.webContents.executeJavaScript(
          "window.__smokeHeartbeat={at:performance.now(),gaps:[]};window.__smokeTimer=setInterval(()=>{const now=performance.now();window.__smokeHeartbeat.gaps.push(now-window.__smokeHeartbeat.at);window.__smokeHeartbeat.at=now},20)",
        );
        await win.webContents.executeJavaScript(
          "document.querySelector('.start').click()",
        );
        await new Promise((resolve) => setTimeout(resolve, 2500));
        await win.webContents.executeJavaScript(
          "document.querySelector('.comparison-heading button').click()",
        );
        for (let i = 0; i < 60; i++) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const rows = await win.webContents.executeJavaScript(
            "[...document.querySelectorAll('.comparison-item')].map(row=>({name:row.querySelector('strong')?.textContent,details:[...row.querySelectorAll('small')].map(node=>node.textContent).join(' / '),status:row.querySelector('span')?.textContent,face:row.dataset.faceAvailable,hands:row.dataset.handsAvailable,backend:row.dataset.backend}))",
          );
          if (rows.length === 3) {
            result.models = rows;
            break;
          }
        }
        result.detectors =
          result.models?.length === 3 &&
          result.models.every(
            (row) =>
              row.status !== "Indisponible" &&
              row.face === "true" &&
              row.hands === "true",
          );
        result.regions = await win.webContents.executeJavaScript(
          "[...document.querySelectorAll('.region-row')].map(row=>({name:row.dataset.region,scope:row.dataset.scope,state:row.querySelector('strong').className,label:row.querySelector('strong').textContent,description:row.querySelector('small')?.textContent}))",
        );
        result.uiTimer = await win.webContents.executeJavaScript(
          "(()=>{clearInterval(window.__smokeTimer);const gaps=window.__smokeHeartbeat.gaps.sort((a,b)=>a-b);return {samples:gaps.length,maxMs:Math.round(gaps.at(-1)||0),p95Ms:Math.round(gaps[Math.floor(gaps.length*.95)]||0)}})()",
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const beforeHide = await win.webContents.executeJavaScript(
          "Number(document.querySelector('.shell').dataset.observedAt)",
        );
        await win.webContents.executeJavaScript(
          "document.querySelector('.close-button').click()",
        );
        await new Promise((resolve) => setTimeout(resolve, 1800));
        result.hiddenSession =
          !win.isVisible() &&
          (await win.webContents.executeJavaScript(
            `document.querySelector('video').srcObject?.active===true && Number(document.querySelector('.shell').dataset.observedAt)>${beforeHide}`,
          ));
        showWindow();
        result.trayRestore = win.isVisible() && !tray.isDestroyed();
        await new Promise((resolve) => setTimeout(resolve, 300));
        await fs.writeFile(
          path.join(smokeRoot, "dosdane-smoke-live.png"),
          (await win.webContents.capturePage()).toPNG(),
        );
        await win.webContents.executeJavaScript(
          "document.querySelector('.small-action').click()",
        );
        await new Promise((resolve) => setTimeout(resolve, 200));
        const paused = await win.webContents.executeJavaScript(
          "document.querySelector('video').srcObject===null && document.querySelector('.small-action').textContent==='Reprendre'",
        );
        await win.webContents.executeJavaScript(
          "document.querySelector('.small-action').click()",
        );
        await new Promise((resolve) => setTimeout(resolve, 800));
        result.pauseResume =
          paused &&
          (await win.webContents.executeJavaScript(
            "document.querySelector('video').srcObject?.active===true && document.querySelector('.small-action').textContent==='Pause'",
          ));
        await win.webContents.executeJavaScript(
          "document.querySelector('.stop').click()",
        );
        await new Promise((resolve) => setTimeout(resolve, 200));
        result.cameraStopped = await win.webContents.executeJavaScript(
          "document.querySelector('video').srcObject===null && !!document.querySelector('.start')",
        );
      }
      console.log("Electron smoke:", JSON.stringify(result));
      await fs.writeFile(
        path.join(smokeRoot, "dosdane-smoke.json"),
        JSON.stringify(result, null, 2),
      );
      const checks = [
        "rendered",
        "mediaPipe",
        "yolo",
        "face",
        "hands",
        "wasm",
        "expanded",
        "noDegrees",
        "neckRow",
        "mascot",
      ];
      if (process.argv.includes("--smoke-models"))
        checks.push(
          "detectors",
          "pauseResume",
          "cameraStopped",
          "hiddenSession",
          "trayRestore",
        );
      app.exit(checks.every((key) => result[key] === true) ? 0 : 1);
    } catch (error) {
      console.error("Electron smoke failed:", error);
      console.error(
        await win.webContents.executeJavaScript("document.body.innerText"),
      );
      app.exit(1);
    }
  });
}

module.exports = { registerSmokeTest };
