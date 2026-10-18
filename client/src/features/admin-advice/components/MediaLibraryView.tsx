import { Download, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ExerciseMedia,
  LoadState,
  PageHeader,
  useApi,
  useMediaUrl,
} from '@/features/advice';
import { adminAdviceService } from '../services/admin-advice.service';
import type { AdminMedia } from '../types/admin-advice.types';
import { errorMessage, formatShortDate } from '../utils';
import { ConfirmDelete } from './ConfirmDelete';
import { ErrorAlert } from './ErrorAlert';

const TYPE_LABELS: Record<AdminMedia['mimeType'], string> = {
  'image/gif': 'GIF',
  'image/png': 'PNG',
  'video/mp4': 'Vidéo MP4',
};

type Filter = 'tous' | 'utilises' | 'inutilises';

const isUsed = (media: AdminMedia) =>
  media.exercises.length + media.postureTips.length > 0;

/** « 482 Ko », « 1,2 Mo » */
function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / 1024 / 1024).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Mo`;
}

/**
 * Administration › Médias : tous les fichiers du stockage S3 local, avec les
 * contenus qui les utilisent. Un média inutilisé (envoi annulé, ancien média)
 * peut être supprimé.
 */
export function MediaLibraryView() {
  const { data, error, reload } = useApi(
    adminAdviceService.media,
    [],
    'Impossible de charger les médias.',
  );
  const [filter, setFilter] = useState<Filter>('tous');
  const [preview, setPreview] = useState<AdminMedia | null>(null);
  const [deleting, setDeleting] = useState<AdminMedia | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const media = data ?? [];
  const unused = media.filter((m) => !isUsed(m)).length;
  const shown = media.filter((m) =>
    filter === 'tous' ? true : filter === 'utilises' ? isUsed(m) : !isUsed(m),
  );
  const total = media.reduce((sum, m) => sum + m.sizeBytes, 0);

  async function remove(item: AdminMedia) {
    setDeleting(null);
    setActionError(null);
    try {
      await adminAdviceService.deleteMedia(item.id);
      reload();
    } catch (e) {
      setActionError(errorMessage(e, 'La suppression a échoué.'));
    }
  }

  return (
    <section className="grid grid-cols-1 gap-6">
      <PageHeader
        title="Médias"
        description="Tous les fichiers stockés (GIF, PNG, MP4) et les contenus qui les utilisent."
      />
      {!data ? (
        <LoadState error={error} />
      ) : (
        <>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList>
              <TabsTrigger value="tous">Tous ({media.length})</TabsTrigger>
              <TabsTrigger value="utilises">
                Utilisés ({media.length - unused})
              </TabsTrigger>
              <TabsTrigger value="inutilises">
                Non utilisés ({unused})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <ErrorAlert message={actionError} />

          <Card>
            <CardHeader>
              <CardTitle>Fichiers</CardTitle>
              <CardDescription>
                {media.length} fichier{media.length > 1 && 's'} ·{' '}
                {formatSize(total)} au total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Aperçu</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Utilisé par</TableHead>
                    <TableHead>Envoyé par</TableHead>
                    <TableHead>Envoyé le</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shown.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-8 text-center text-muted-foreground"
                      >
                        {media.length === 0
                          ? 'Aucun fichier stocké pour le moment. Les médias s’envoient depuis la fenêtre d’un exercice.'
                          : 'Aucun fichier pour ce filtre.'}
                      </TableCell>
                    </TableRow>
                  )}
                  {shown.map((item) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer"
                      onClick={() => setPreview(item)}
                    >
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => setPreview(item)}
                          aria-label="Agrandir"
                        >
                          <ExerciseMedia
                            media={item}
                            title="Aperçu du média"
                            className="size-14 rounded-md"
                          />
                        </button>
                      </TableCell>
                      <TableCell>{TYPE_LABELS[item.mimeType]}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatSize(item.sizeBytes)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.width && item.height
                          ? `${item.width} × ${item.height} px`
                          : '—'}
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        {isUsed(item) ? (
                          <div className="grid gap-0.5">
                            {item.exercises.map((e) => (
                              <Link
                                onClick={(event) => event.stopPropagation()}
                                key={e.id}
                                to="/admin/conseils/exercices"
                                className="text-primary underline-offset-2 hover:underline"
                              >
                                Exercice · {e.title}
                              </Link>
                            ))}
                            {item.postureTips.map((t) => (
                              <Link
                                onClick={(event) => event.stopPropagation()}
                                key={t.id}
                                to="/admin/conseils/installation"
                                className="text-primary underline-offset-2 hover:underline"
                              >
                                Réglage · {t.title}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <Badge variant="warning">Non utilisé</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.uploadedBy ?? 'Compte supprimé'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatShortDate(item.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div
                          className="flex justify-end gap-1"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <DownloadButton media={item} />
                          <span
                            title={
                              isUsed(item)
                                ? 'Retirez d’abord le média du contenu qui l’utilise'
                                : undefined
                            }
                          >
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              disabled={isUsed(item)}
                              onClick={() => setDeleting(item)}
                              aria-label="Supprimer"
                            >
                              <Trash2 />
                            </Button>
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      <Dialog
        open={preview !== null}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {preview && TYPE_LABELS[preview.mimeType]}
            </DialogTitle>
            <DialogDescription>
              {preview &&
                `${formatSize(preview.sizeBytes)} · envoyé le ${formatShortDate(preview.createdAt)}`}
            </DialogDescription>
          </DialogHeader>
          {preview && (
            <ExerciseMedia
              media={preview}
              title="Aperçu du média"
              className="max-h-[70dvh] w-full rounded-lg border [&_img]:object-contain [&_video]:object-contain"
              playable
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={deleting !== null}
        title="Supprimer ce média ?"
        description="Le fichier est effacé du stockage. Cette action est définitive."
        onCancel={() => setDeleting(null)}
        onConfirm={() => deleting && void remove(deleting)}
      />
    </section>
  );
}

/** Téléchargement : le fichier est lu avec le jeton de session (blob). */
function DownloadButton({ media }: { media: AdminMedia }) {
  const url = useMediaUrl(media.id);
  const extension = media.mimeType.split('/')[1];
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      asChild={!!url}
      disabled={!url}
      aria-label="Télécharger"
    >
      {url ? (
        <a href={url} download={`media-${media.id}.${extension}`}>
          <Download />
        </a>
      ) : (
        <Download />
      )}
    </Button>
  );
}
