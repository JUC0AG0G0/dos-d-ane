const { protocol, net, session } = require("electron");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

function registerBundleProtocol(appRoot) {
  const distRoot = path.join(appRoot, "dist");
  protocol.handle("dosdane", async (request) => {
    const url = new URL(request.url);
    if (
      url.hostname !== "bundle" ||
      !["GET", "HEAD"].includes(request.method)
    ) {
      return new Response("Forbidden", { status: 403 });
    }
    const target = path.resolve(
      distRoot,
      "." + decodeURIComponent(url.pathname),
    );
    const relative = path.relative(distRoot, target);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      return new Response("Forbidden", { status: 403 });
    }
    const response = await net.fetch(pathToFileURL(target).toString());
    const headers = new Headers(response.headers);
    headers.set("Cross-Origin-Opener-Policy", "same-origin");
    headers.set("Cross-Origin-Embedder-Policy", "require-corp");
    headers.set("Cross-Origin-Resource-Policy", "same-origin");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  });
}

function registerCameraPermissions(windowController) {
  const mediaAllowed = (contents, permission) =>
    permission === "media" &&
    contents === windowController.current()?.webContents;
  const ses = session.defaultSession;
  ses.setPermissionCheckHandler(mediaAllowed);
  ses.setPermissionRequestHandler((contents, permission, callback, details) => {
    callback(
      Boolean(
        mediaAllowed(contents, permission) &&
          details.mediaTypes?.includes("video") &&
          !details.mediaTypes?.includes("audio"),
      ),
    );
  });
}

module.exports = { registerBundleProtocol, registerCameraPermissions };
