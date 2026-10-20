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
import { ApiError } from '@/services';
import { settingsService } from '../services/settings.service';
import { FormField } from '@/components/FormField';

interface AddRaspberryDialogProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

/** Ajoute un Raspberry Pi avec le code imprimé sur son étiquette (appairage par code). */
export function AddRaspberryDialog({
  open,
  onClose,
  onAdded,
}: AddRaspberryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent>
        {open && <AddForm onClose={onClose} onAdded={onAdded} />}
      </DialogContent>
    </Dialog>
  );
}

function AddForm({ onClose, onAdded }: Omit<AddRaspberryDialogProps, 'open'>) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('Raspberry Pi');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await settingsService.claimRaspberry(code, name);
      onAdded();
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
        <DialogTitle>Ajouter un Raspberry Pi</DialogTitle>
        <DialogDescription>
          Branche le Raspberry Pi, attends une minute qu’il démarre, puis tape
          le code imprimé sur son étiquette.
        </DialogDescription>
      </DialogHeader>
      <FormField label="Code de l’étiquette" htmlFor="pairing-code">
        <Input
          id="pairing-code"
          required
          placeholder="K7F-29Q-M4T"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={20}
          className="font-mono uppercase tracking-widest"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby="pairing-code-hint"
        />
        <p
          id="pairing-code-hint"
          className={
            error ? 'text-sm text-destructive' : 'text-sm text-muted-foreground'
          }
        >
          {error ?? '9 caractères ; majuscules et tirets facultatifs.'}
        </p>
      </FormField>
      <FormField label="Nom" htmlFor="raspberry-name">
        <Input
          id="raspberry-name"
          required
          minLength={2}
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormField>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Annuler
          </Button>
        </DialogClose>
        <Button type="submit" disabled={pending}>
          Ajouter
        </Button>
      </DialogFooter>
    </form>
  );
}
