import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/utils/cn';
import { useAction } from '../../hooks/useAction';
import { sessionsService } from '../../services/sessions.service';
import type { CaptureSummary, SessionDetail } from '../../types/sessions.types';
import { BODY_PART_COUNT, formatTimeSeconds, plural } from '../../utils';

/**
 * Captures de la session, de la plus ancienne à la plus récente, 50 par page.
 * Cliquer une ligne la sélectionne (Aperçu) ; la première l'est par défaut.
 */
export function CapturesCard({
  session,
  selected,
  onSelect,
}: {
  session: SessionDetail;
  selected: CaptureSummary | null;
  onSelect: (capture: CaptureSummary) => void;
}) {
  const [captures, setCaptures] = useState<CaptureSummary[] | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const { run, busy } = useAction();
  const names = new Map(session.devices.map((d) => [d.id, d.name]));

  useEffect(() => {
    let cancelled = false;
    sessionsService
      .captures(session.id)
      .then((page) => {
        if (cancelled) return;
        setCaptures(page.items);
        setCursor(page.nextCursor);
        if (page.items[0]) onSelect(page.items[0]);
      })
      .catch(() => !cancelled && setCaptures([]));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.id]);

  const more = async () => {
    if (!cursor) return;
    const page = await run(() => sessionsService.captures(session.id, cursor));
    if (!page) return;
    setCaptures((current) => [...(current ?? []), ...page.items]);
    setCursor(page.nextCursor);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Captures</CardTitle>
        <CardDescription>
          {plural(session.captureCount, 'capture')}, de la plus ancienne à la
          plus récente
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {!captures ? (
          <Skeleton className="h-48" />
        ) : captures.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune capture dans cette session.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Heure</TableHead>
                  <TableHead>Appareil</TableHead>
                  <TableHead className="text-right">Articulations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {captures.map((capture) => (
                  <TableRow
                    key={capture.id}
                    data-state={
                      selected?.id === capture.id ? 'selected' : undefined
                    }
                    className={cn(
                      'cursor-pointer',
                      selected?.id === capture.id && 'bg-accent',
                    )}
                    onClick={() => onSelect(capture)}
                  >
                    <TableCell className="tabular-nums">
                      {formatTimeSeconds(capture.capturedAt)}
                    </TableCell>
                    <TableCell>
                      {names.get(capture.deviceId) ?? 'Appareil supprimé'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {capture.keypointCount} / {BODY_PART_COUNT}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {cursor && (
              <Button
                variant="outline"
                className="justify-self-center"
                onClick={more}
                disabled={busy}
              >
                Afficher plus
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
