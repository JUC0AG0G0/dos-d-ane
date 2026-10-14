let baseURL;
let independentImages = false;
// Offline benchmark only: prevent temporal tracking between unrelated photos.
// Configure before loading models; live application keeps VIDEO as its default.
export function configureModelAssets(url, { imageMode = false } = {}) {
  baseURL = url;
  independentImages = imageMode;
}
const asset = (name) =>
  new URL(`./${name}`, baseURL ?? globalThis.location?.href).href;
export const isImageMode = () => independentImages;
export { asset };
