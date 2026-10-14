const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
  "desktop",
  Object.freeze({
    resize: (expanded) =>
      ipcRenderer.invoke("window:resize", expanded === true),
    close: () => ipcRenderer.invoke("window:close"),
    isVisible: () => ipcRenderer.invoke("window:visible"),
    onVisibility: (callback) => {
      const listener = (_event, visible) => callback(visible === true);
      ipcRenderer.on("window:visibility", listener);
      return () => ipcRenderer.removeListener("window:visibility", listener);
    },
    notify: (title, body) =>
      ipcRenderer.invoke("notice:show", String(title), String(body)),
  }),
);
