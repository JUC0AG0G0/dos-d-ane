import { useEffect, useState } from 'react';
import { adviceService } from '../services/advice.service';

/**
 * Adresse locale (blob:) d'un média : le fichier est servi par l'API avec le
 * jeton de session, qu'une balise <img src> ne sait pas envoyer.
 */
export function useMediaUrl(mediaId: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!mediaId) return;
    let objectUrl: string | null = null;
    let cancelled = false;
    adviceService
      .media(mediaId)
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch(() => !cancelled && setUrl(null));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setUrl(null);
    };
  }, [mediaId]);

  return mediaId ? url : null;
}
