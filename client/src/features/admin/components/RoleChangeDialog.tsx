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
import { ROLE_LABELS, type RoleChange } from '../types/admin.types';

interface RoleChangeDialogProps {
  change: RoleChange | null;
  currentUserId: string | undefined;
  onConfirm: (change: RoleChange) => void;
  onClose: () => void;
}

export function RoleChangeDialog({
  change,
  currentUserId,
  onConfirm,
  onClose,
}: RoleChangeDialogProps) {
  const users = change?.users ?? [];
  const role = change ? ROLE_LABELS[change.role].toLowerCase() : '';
  const demotesSelf =
    change?.role === 'user' && users.some((u) => u.id === currentUserId);

  return (
    <AlertDialog
      open={change !== null}
      onOpenChange={(value) => !value && onClose()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {users.length === 1
              ? `Passer ${users[0].displayName} en ${role} ?`
              : `Passer ${users.length} utilisateurs en ${role} ?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {change?.role === 'admin'
              ? `${users.length === 1 ? 'Ce compte aura' : 'Ces comptes auront'} accès à l’administration, dont la gestion des rôles.`
              : `${users.length === 1 ? 'Ce compte perdra' : 'Ces comptes perdront'} l’accès à l’administration.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ul className="max-h-60 divide-y overflow-y-auto rounded-lg border text-sm">
          {users.map((user) => (
            <li key={user.id} className="px-3 py-2">
              <p className="font-medium">{user.displayName}</p>
              <p className="text-muted-foreground">{user.maskedEmail}</p>
            </li>
          ))}
        </ul>
        {demotesSelf && (
          <p className="text-sm font-medium text-destructive">
            Tu fais partie de la sélection : tu perdras toi aussi l’accès à
            l’administration.
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            variant={change?.role === 'user' ? 'destructive' : 'default'}
            onClick={() => change && onConfirm(change)}
          >
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
