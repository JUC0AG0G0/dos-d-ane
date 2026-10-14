const {
  app,
  BrowserWindow,
  screen,
  protocol,
  Tray,
  Menu,
} = require("electron");
const path = require("node:path");
const { createWindowController } = require("./electron/window.cjs");
const {
  registerBundleProtocol,
  registerCameraPermissions,
} = require("./electron/protocol.cjs");
const { registerWindowHandlers } = require("./electron/ipc.cjs");
const { registerSmokeTest } = require("./electron/smoke.cjs");

protocol.registerSchemesAsPrivileged([
  {
    scheme: "dosdane",
    privileges: { standard: true, secure: true, supportFetchAPI: true },
  },
]);
if (process.argv.includes("--smoke-models")) {
  app.commandLine.appendSwitch("use-fake-device-for-media-stream");
  app.commandLine.appendSwitch("use-fake-ui-for-media-stream");
}

let quitting = false;
let tray;
const windowController = createWindowController({
  appRoot: __dirname,
  isQuitting: () => quitting,
});

app.whenReady().then(() => {
  registerBundleProtocol(__dirname);
  registerCameraPermissions(windowController);
  registerWindowHandlers(windowController);
  const win = windowController.create();

  tray = new Tray(path.join(__dirname, "assets", "icon.ico"));
  tray.setToolTip("Dos d’âne · suivi de posture");
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: "Ouvrir Dos d’âne", click: windowController.show },
      { type: "separator" },
      { label: "Quitter et arrêter la caméra", click: () => app.quit() },
    ]),
  );
  tray.on("click", windowController.show);

  if (process.argv.includes("--smoke")) {
    registerSmokeTest({
      win,
      tray,
      showWindow: windowController.show,
      appRoot: __dirname,
    });
  }
  screen.on("display-metrics-changed", windowController.reposition);
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) windowController.create();
  });
});
app.on("before-quit", () => {
  quitting = true;
});
app.on("window-all-closed", () => {
  if (quitting) app.quit();
});
