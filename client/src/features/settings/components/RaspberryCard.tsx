import { Cpu, Plus } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
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
import { useApi } from '@/hooks/useApi';
import { settingsService } from '../services/settings.service';
import type { UserDevice } from '../types/settings.types';
import { AddRaspberryDialog } from './AddRaspberryDialog';

/** Ce que l'utilisateur voit à la place de « Révoquer la clé ». */
const KEY_STATUS = {
  pending: {
    label: 'En attente',
    hint: 'Ajouté : le Raspberry Pi récupère sa clé dans quelques secondes.',
  },
  revoked: {
    label: 'Clé révoquée',
    hint: 'Il ne se connecte plus. Ajoute-le de nouveau avec le code de son étiquette.',
  },
};

/** Raspberry Pi du compte : ajout par le code de l'étiquette, révocation de la clé. */
export function RaspberryCard({ onChange }: { onChange: () => void }) {
  const devices = useApi(
    settingsService.devices,
    [],
    'Impossible de charger les Raspberry Pi.',
  );
  const [adding, setAdding] = useState(false);
  const [revoking, setRevoking] = useState<UserDevice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pis = devices.data?.filter((d) => d.type === 'raspberry') ?? [];

  const changed = () => {
    devices.reload();
    onChange();
  };

  async function revoke(device: UserDevice) {
    setRevoking(null);
    setError(null);
    try {
      await settingsService.revokeDeviceKey(device.id);
      changed();
    } catch {
      setError(`Impossible de révoquer la clé de « ${device.name} ».`);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Raspberry Pi</CardTitle>
        <CardDescription>
          Ajoute un Raspberry Pi avec le code imprimé sur son étiquette : il se
          connecte tout seul, sans mot de passe.
        </CardDescription>
        <CardAction>
          <Button size="sm" onClick={() => setAdding(true)}>
            <Plus />
            Ajouter un Raspberry Pi
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-3">
        {(devices.error ?? error) && (
          <p className="text-sm text-destructive">{devices.error ?? error}</p>
        )}
        {devices.loading && (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        )}
        {devices.data && pis.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucun Raspberry Pi pour l’instant.
          </p>
        )}
        {pis.map((device) => {
          const status =
            device.keyStatus === 'pending' || device.keyStatus === 'revoked'
              ? KEY_STATUS[device.keyStatus]
              : null;
          return (
            <div
              key={device.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border p-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Cpu className="size-5" />
              </span>
              <div className="grid min-w-0 flex-1 gap-1 text-sm">
                <p className="flex flex-wrap items-center gap-2 font-medium">
                  {device.name}
                  {status && (
                    <Badge
                      variant={
                        device.keyStatus === 'pending' ? 'warning' : 'outline'
                      }
                    >
                      {status.label}
                    </Badge>
                  )}
                </p>
                {status && (
                  <p className="text-muted-foreground">{status.hint}</p>
                )}
              </div>
              {device.keyStatus === 'active' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => setRevoking(device)}
                >
                  Révoquer la clé
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>

      <AddRaspberryDialog
        open={adding}
        onClose={() => setAdding(false)}
        onAdded={changed}
      />
      <ConfirmDialog
        open={revoking !== null}
        title="Révoquer la clé de ce Raspberry Pi ?"
        description={`« ${revoking?.name} » est déconnecté tout de suite et attend d’être ajouté de nouveau avec le code de son étiquette, par toi ou par quelqu’un d’autre.`}
        confirmLabel="Révoquer"
        onConfirm={() => revoking && void revoke(revoking)}
        onClose={() => setRevoking(null)}
      />
    </Card>
  );
}
