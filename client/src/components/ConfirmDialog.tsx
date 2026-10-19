import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  /** Libellé du bouton de confirmation (« Supprimer », « Déconnecter »…). */
  confirmLabel: string;
  /** Bouton rouge pour une action destructive (par défaut). */
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/** Demande confirmation avant une action (suppression, déconnexion…). */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  destructive = true,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(value) => !value && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? 'destructive' : 'default'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
