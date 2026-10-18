import { ImageIcon, Play } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { useMediaUrl } from '../hooks/useMediaUrl';
import type { MediaRef } from '../types/advice.types';

interface ExerciseMediaProps {
  media: MediaRef | null;
  title: string;
  className?: string;
  /** Badge GIF / Vidéo en haut à gauche (cartes). */
  showBadge?: boolean;
  /** Vidéo lue au clic sur le bouton lecture (fenêtre Détail). */
  playable?: boolean;
}

/** Image, GIF ou vidéo d'un exercice, ou une illustration vide s'il n'en a pas. */
export function ExerciseMedia({
  media,
  title,
  className,
  showBadge,
  playable,
}: ExerciseMediaProps) {
  const url = useMediaUrl(media?.id);
  const [playing, setPlaying] = useState(false);
  const isVideo = media?.mimeType === 'video/mp4';

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-muted',
        className,
      )}
    >
      {!media || !url ? (
        <ImageIcon className="size-7 text-muted-foreground" aria-hidden />
      ) : isVideo ? (
        <video
          src={url}
          className="size-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          controls={playing}
          autoPlay={playing}
          aria-label={title}
        />
      ) : (
        <img src={url} alt={title} className="size-full object-cover" />
      )}
      {showBadge && media && (
        <Badge variant="secondary" className="absolute top-2.5 left-2.5">
          {media.mimeType === 'image/gif' ? 'GIF' : isVideo ? 'Vidéo' : 'Image'}
        </Badge>
      )}
      {playable && isVideo && url && !playing && (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute flex size-14 items-center justify-center rounded-full bg-card/90 text-primary shadow-sm hover:bg-card"
        >
          <Play className="size-6" aria-hidden />
          <span className="sr-only">Lire la vidéo</span>
        </button>
      )}
    </div>
  );
}
