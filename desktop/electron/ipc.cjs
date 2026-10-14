const { ipcMain, Notification } = require("electron");

function registerWindowHandlers(windowController) {
  const { trusted, current, place, show } = windowController;
  ipcMain.handle("window:resize", (event, expanded) => {
    if (!trusted(event)) return false;
    place(expanded === true);
    return true;
  });
  ipcMain.handle("window:close", (event) => {
    if (!trusted(event)) return false;
    current().close();
    return true;
  });
  ipcMain.handle(
    "window:visible",
    (event) => trusted(event) && current().isVisible(),
  );
  ipcMain.handle("notice:show", (event, title, body) => {
    if (
      !trusted(event) ||
      typeof title !== "string" ||
      typeof body !== "string"
    )
      return false;
    if (Notification.isSupported()) {
      const notice = new Notification({
        title: title.slice(0, 80),
        body: body.slice(0, 240),
      });
      notice.on("click", show);
      notice.show();
    }
    return true;
  });
}

module.exports = { registerWindowHandlers };
