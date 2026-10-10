import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiError, devicesService } from '@/services';
import type { SessionDevice } from '@/types/auth';

interface RenameDeviceDialogProps {
  device: SessionDevice | null;
  onClose: () => void;
  onRenamed: () => void;
}

export function RenameDeviceDialog({
  device,
  onClose,
  onRenamed,
}: RenameDeviceDialogProps) {
  return (
    <Dialog open={device !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {device && (
          <RenameForm device={device} onClose={onClose} onRenamed={onRenamed} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function RenameForm({
  device,
  onClose,
  onRenamed,
}: RenameDeviceDialogProps & { device: SessionDevice }) {
  const [name, setName] = useState(device.name);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      await devicesService.rename(device.id, name);
      onRenamed();
      onClose();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Serveur injoignable.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>Renommer l'appareil</DialogTitle>
        <DialogDescription>
          Un nom qui t'aide à le reconnaître, par exemple « PC du bureau ».
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-2">
        <Label htmlFor="device-name">Nom</Label>
        <Input
          id="device-name"
          required
          minLength={2}
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby="device-name-hint"
        />
        <p
          id="device-name-hint"
          className={
            error ? 'text-sm text-destructive' : 'text-sm text-muted-foreground'
          }
        >
          {error ?? '2 caractères minimum.'}
        </p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Annuler
          </Button>
        </DialogClose>
        <Button type="submit" disabled={pending}>
          Enregistrer
        </Button>
      </DialogFooter>
    </form>
  );
}
