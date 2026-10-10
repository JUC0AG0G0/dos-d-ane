import { CircleAlert, Info, Monitor, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLogout } from '@/features/auth';
import { authService } from '@/services';
import type { Session, SessionDevice } from '@/types/auth';
import { formatDateTime } from '@/utils/format';
import { ConfirmDialog } from './ConfirmDialog';
import { RenameDeviceDialog } from './RenameDeviceDialog';
import { useSessions } from './useSessions';

function DeviceIcon({ type }: { type: string }) {
  const Icon = type === 'mobile' ? Smartphone : Monitor;
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
      <Icon className="size-5" />
    </span>
  );
}

export function DevicesSection() {
  const { active, past, loading, error, reload } = useSessions();
  const logout = useLogout();
  const [renaming, setRenaming] = useState<SessionDevice | null>(null);
  const [revoking, setRevoking] = useState<Session | null>(null);
  const [revokingOthers, setRevokingOthers] = useState(false);

  async function revoke(session: Session) {
    setRevoking(null);
    if (session.current) return logout();
    await authService.revokeSession(session.id).catch(() => undefined);
    await reload();
  }

  async function revokeOthers() {
    setRevokingOthers(false);
    await authService.revokeOtherSessions().catch(() => undefined);
    await reload();
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>{error}</AlertTitle>
      </Alert>
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sessions actives</CardTitle>
          <CardDescription>
            Les appareils actuellement connectés à ton compte.
          </CardDescription>
          {active.length > 1 && (
            <CardAction>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => setRevokingOthers(true)}
              >
                Déconnecter les autres appareils
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent className="grid gap-3">
          {loading && (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          )}
          {active.map((session) => (
            <div
              key={session.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border p-4"
            >
              <DeviceIcon type={session.device.type} />
              <div className="min-w-0 flex-1 text-sm">
                <p className="flex flex-wrap items-center gap-2 font-medium">
                  {session.device.name}
                  {session.current && <Badge>Cet appareil</Badge>}
                </p>
                <p className="text-muted-foreground">
                  Dernière activité le {formatDateTime(session.lastUsedAt)}
                  {session.ipAddress && ` · IP ${session.ipAddress}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRenaming(session.device)}
                >
                  Renommer
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setRevoking(session)}
                >
                  Déconnecter
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
          <CardDescription>Sessions expirées ou déconnectées.</CardDescription>
        </CardHeader>
        <CardContent>
          {past.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune session passée.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appareil</TableHead>
                  <TableHead>Connexion</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Adresse IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {past.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">
                      {session.device.name}
                    </TableCell>
                    <TableCell>{formatDateTime(session.createdAt)}</TableCell>
                    <TableCell>
                      {session.revokedAt
                        ? `Déconnectée le ${formatDateTime(session.revokedAt)}`
                        : `Expirée le ${formatDateTime(session.expiresAt)}`}
                    </TableCell>
                    <TableCell>{session.ipAddress ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Alert>
        <Info />
        <AlertTitle>Pourquoi l'adresse IP est enregistrée ?</AlertTitle>
        <p className="col-start-2 text-sm text-muted-foreground">
          Elle est relevée à la connexion pour t'aider à repérer un appareil que
          tu ne reconnais pas. Elle n'est utilisée pour rien d'autre.
        </p>
      </Alert>

      <RenameDeviceDialog
        device={renaming}
        onClose={() => setRenaming(null)}
        onRenamed={() => void reload()}
      />
      <ConfirmDialog
        open={revoking !== null}
        title="Déconnecter cet appareil ?"
        description={
          revoking?.current
            ? 'Tu seras déconnecté de cet appareil et renvoyé vers la page de connexion.'
            : `« ${revoking?.device.name} » devra se reconnecter pour accéder à ton compte.`
        }
        confirmLabel="Déconnecter"
        onConfirm={() => revoking && void revoke(revoking)}
        onClose={() => setRevoking(null)}
      />
      <ConfirmDialog
        open={revokingOthers}
        title="Déconnecter tous les autres appareils ?"
        description="Seul cet appareil restera connecté. Les autres devront se reconnecter."
        confirmLabel="Tout déconnecter"
        onConfirm={() => void revokeOthers()}
        onClose={() => setRevokingOthers(false)}
      />
    </div>
  );
}
