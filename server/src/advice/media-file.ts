/**
 * Lecture des fichiers envoyés pour les Conseils (GIF, PNG, MP4) : type
 * reconnu d'après le contenu (pas l'extension ni le type annoncé), taille en
 * pixels, et retrait des métadonnées qui peuvent révéler l'appareil, le lieu
 * ou l'auteur (EXIF, XMP, commentaires).
 */

export const MEDIA_MIME_TYPES = [
  'image/gif',
  'image/png',
  'video/mp4',
] as const;
export type MediaMimeType = (typeof MEDIA_MIME_TYPES)[number];

export const MEDIA_MAX_BYTES = 5 * 1024 * 1024;

export const MEDIA_EXTENSIONS: Record<MediaMimeType, string> = {
  'image/gif': 'gif',
  'image/png': 'png',
  'video/mp4': 'mp4',
};

/** Fichier reçu par multer (FileInterceptor), en mémoire. */
export interface UploadedFile {
  buffer: Buffer;
}

export interface MediaFile {
  mimeType: MediaMimeType;
  data: Buffer;
  width: number | null;
  height: number | null;
}

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

/** Reconnaît le format et renvoie le fichier nettoyé, ou null s'il n'est pas accepté. */
export function readMediaFile(data: Buffer): MediaFile | null {
  try {
    if (data.subarray(0, 8).equals(PNG_SIGNATURE)) return readPng(data);
    const head = data.toString('latin1', 0, 6);
    if (head === 'GIF87a' || head === 'GIF89a') return readGif(data);
    if (data.toString('latin1', 4, 8) === 'ftyp') return readMp4(data);
  } catch {
    // Fichier tronqué ou mal formé.
  }
  return null;
}

// --- PNG : suite de chunks (longueur, type, données, CRC) -------------------

/** Chunks de texte et de date, qui portent les métadonnées. */
const PNG_METADATA_CHUNKS = new Set(['eXIf', 'tEXt', 'zTXt', 'iTXt', 'tIME']);

function readPng(data: Buffer): MediaFile | null {
  const kept: Buffer[] = [PNG_SIGNATURE];
  let width: number | null = null;
  let height: number | null = null;
  let offset = 8;
  let ended = false;
  while (offset + 12 <= data.length && !ended) {
    const length = data.readUInt32BE(offset);
    const type = data.toString('latin1', offset + 4, offset + 8);
    const end = offset + 12 + length;
    if (end > data.length) return null;
    if (type === 'IHDR') {
      width = data.readUInt32BE(offset + 8);
      height = data.readUInt32BE(offset + 12);
    }
    if (!PNG_METADATA_CHUNKS.has(type)) kept.push(data.subarray(offset, end));
    ended = type === 'IEND';
    offset = end;
  }
  if (!ended || width === null) return null;
  return { mimeType: 'image/png', data: Buffer.concat(kept), width, height };
}

// --- GIF : en-tête, palette, puis blocs (extensions, images) ----------------

function readGif(data: Buffer): MediaFile | null {
  const width = data.readUInt16LE(6);
  const height = data.readUInt16LE(8);
  const flags = data[10];
  let offset = 13 + (flags & 0x80 ? 3 * 2 ** ((flags & 0x07) + 1) : 0);
  const kept: Buffer[] = [data.subarray(0, offset)];

  // Sous-blocs (taille sur un octet, terminés par un bloc vide).
  const skipSubBlocks = (from: number) => {
    let i = from;
    while (data[i] !== 0) {
      if (i >= data.length) throw new Error('GIF tronqué');
      i += data[i] + 1;
    }
    return i + 1;
  };

  while (offset < data.length) {
    const start = offset;
    const marker = data[offset];
    if (marker === 0x3b) {
      kept.push(data.subarray(offset, offset + 1));
      return {
        mimeType: 'image/gif',
        data: Buffer.concat(kept),
        width,
        height,
      };
    }
    if (marker === 0x21) {
      const label = data[offset + 1];
      const end = skipSubBlocks(offset + 2);
      // Commentaires (0xFE) et XMP (extension d'application « XMP DataXMP ») retirés.
      const isXmp =
        label === 0xff &&
        data.toString('latin1', offset + 3, offset + 14) === 'XMP DataXMP';
      if (label !== 0xfe && !isXmp) kept.push(data.subarray(start, end));
      offset = end;
    } else if (marker === 0x2c) {
      const localFlags = data[offset + 9];
      offset +=
        10 + (localFlags & 0x80 ? 3 * 2 ** ((localFlags & 0x07) + 1) : 0);
      offset = skipSubBlocks(offset + 1);
      kept.push(data.subarray(start, offset));
    } else {
      return null;
    }
  }
  return null;
}

// --- MP4 : boîtes imbriquées (taille, type) ---------------------------------

/**
 * Les boîtes udta et meta (titre, auteur, coordonnées GPS des téléphones) sont
 * renommées en free, que les lecteurs ignorent : la taille du fichier ne change
 * pas, donc les positions des données vidéo restent valides.
 */
const MP4_METADATA_BOXES = new Set(['udta', 'meta']);
const MP4_CONTAINERS = new Set(['moov', 'trak']);

function readMp4(input: Buffer): MediaFile | null {
  const data = Buffer.from(input);
  let hasMovie = false;
  const walk = (from: number, to: number, depth: number) => {
    let offset = from;
    while (offset + 8 <= to) {
      let size = data.readUInt32BE(offset);
      const type = data.toString('latin1', offset + 4, offset + 8);
      let header = 8;
      if (size === 1) {
        size = Number(data.readBigUInt64BE(offset + 8));
        header = 16;
      } else if (size === 0) {
        size = to - offset;
      }
      if (size < header || offset + size > to) throw new Error('MP4 mal formé');
      if (type === 'moov') hasMovie = true;
      if (depth > 0 && MP4_METADATA_BOXES.has(type)) {
        data.write('free', offset + 4, 'latin1');
      } else if (MP4_CONTAINERS.has(type)) {
        walk(offset + header, offset + size, depth + 1);
      }
      offset += size;
    }
  };
  walk(0, data.length, 0);
  return hasMovie
    ? { mimeType: 'video/mp4', data, width: null, height: null }
    : null;
}
