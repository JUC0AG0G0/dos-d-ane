import { Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExerciseMedia, type MediaRef } from '@/features/advice';
import { adminAdviceService } from '../services/admin-advice.service';
import { errorMessage } from '../utils';

const ACCEPT = 'image/gif,image/png,video/mp4';
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Média d'un exercice : aperçu, envoi (le fichier part tout de suite, l'id est
 * enregistré avec l'exercice), remplacement et retrait.
 */
export function MediaField({
  media,
  title,
  onChange,
}: {
  media: MediaRef | null;
  title: string;
  onChange: (media: MediaRef | null) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setError('Fichier trop lourd : 5 Mo maximum.');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const { id, mimeType } = await adminAdviceService.uploadMedia(file);
      onChange({ id, mimeType });
    } catch (e) {
      setError(errorMessage(e, 'L’envoi du fichier a échoué.'));
    } finally {
      setUploading(false);
      if (input.current) input.current.value = '';
    }
  }

  return (
    <div className="grid gap-2.5">
      <ExerciseMedia
        media={media}
        title={title}
        className="aspect-[4/3] w-full rounded-lg border"
        showBadge
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => input.current?.click()}
        >
          <Upload />
          {uploading ? 'Envoi…' : media ? 'Remplacer' : 'Choisir un fichier'}
        </Button>
        {media && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
          >
            <Trash2 />
            Retirer
          </Button>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(event) => void upload(event.target.files?.[0])}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
