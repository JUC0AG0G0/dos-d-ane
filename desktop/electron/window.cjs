const { BrowserWindow, screen } = require("electron");
const path = require("node:path");

const SIZE = {
  compact: { width: 430, height: 138 },
  expanded: { width: 430, height: 704 },
};

function createWindowController({ appRoot, isQuitting }) {
  let win;
  let expanded = false;

  function place(value) {
    if (!win || win.isDestroyed()) return;
    expanded = value;
    const bounds = win.getBounds();
    const display = screen.getDisplayNearestPoint({
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2,
    });
    const { x, y, width, height } = display.workArea;
    const desired = expanded ? SIZE.expanded : SIZE.compact;
    const actualWidth = Math.min(desired.width, width - 24);
    const actualHeight = Math.min(desired.height, height - 24);
    win.setBounds({
      x: x + width - actualWidth - 16,
      y: y + height - actualHeight - 16,
      width: actualWidth,
      height: actualHeight,
    });
  }

  function create() {
    win = new BrowserWindow({
      ...SIZE.compact,
      frame: false,
      transparent: true,
      hasShadow: false,
      resizable: false,
      alwaysOnTop: true,
      show: false,
      backgroundColor: "#00000000",
      webPreferences: {
        preload: path.join(appRoot, "preload.cjs"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        webSecurity: true,
        backgroundThrottling: false,
      },
    });
    if (process.argv.includes("--smoke")) win.setIgnoreMouseEvents(true);
    place(false);
    win.once("ready-to-show", () => win.show());
    win.on("close", (event) => {
      if (!isQuitting()) {
        event.preventDefault();
        win.hide();
      }
    });
    win.on("hide", () => win.webContents.send("window:visibility", false));
    win.on("show", () => win.webContents.send("window:visibility", true));
    win.loadURL(
      process.argv.includes("--dev")
        ? "http://127.0.0.1:5173"
        : "dosdane://bundle/index.html",
    );
    win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
    win.webContents.on("will-navigate", (event, url) => {
      if (
        !url.startsWith("http://127.0.0.1:5173/") &&
        !url.startsWith("dosdane://bundle/")
      ) {
        event.preventDefault();
      }
    });
    return win;
  }

  function show() {
    if (!win || win.isDestroyed()) create();
    else {
      win.show();
      win.focus();
    }
  }

  return {
    create,
    show,
    place,
    reposition: () => place(expanded),
    current: () => win,
    trusted: (event) =>
      win && !win.isDestroyed() && event.sender === win.webContents,
  };
}

module.exports = { createWindowController };
