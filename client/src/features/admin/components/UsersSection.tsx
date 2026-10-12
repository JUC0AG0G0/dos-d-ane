import { CircleAlert, ShieldCheck, ShieldOff } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { authService } from '@/features/auth';
import { useAuthStore } from '@/store';
import type { Role, User } from '@/types/user';
import { formatDateTime } from '@/utils/format';
import { useUsers } from '../hooks/useUsers';
import { adminService } from '../services/admin.service';
import { ROLE_LABELS, type RoleChange } from '../types/admin.types';
import { RoleChangeDialog } from './RoleChangeDialog';

export function UsersSection() {
  const { users, loading, error, reload } = useUsers();
  const currentUser = useAuthStore((state) => state.user);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [change, setChange] = useState<RoleChange | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const selectedUsers = users.filter((user) => selected.has(user.id));
  const allSelected = users.length > 0 && selected.size === users.length;

  function toggle(id: string, checked: boolean) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function askChange(users: User[], role: Role) {
    setActionError(null);
    setChange({ users, role });
  }

  async function applyChange({ users, role }: RoleChange) {
    setChange(null);
    try {
      await adminService.updateRoles(
        users.map((user) => user.id),
        role,
      );
      setSelected(new Set());
      if (users.some((user) => user.id === currentUser?.id)) {
        useAuthStore.getState().setUser(await authService.me());
        return;
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Le changement de rôle a échoué.',
      );
    }
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
      {actionError && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>{actionError}</AlertTitle>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>
            Sélectionne des comptes pour changer leur rôle. Il reste toujours au
            moins un administrateur.
          </CardDescription>
          {selectedUsers.length > 0 && (
            <CardAction className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => askChange(selectedUsers, 'admin')}
              >
                <ShieldCheck />
                Passer admin ({selectedUsers.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => askChange(selectedUsers, 'user')}
              >
                <ShieldOff />
                Passer utilisateur ({selectedUsers.length})
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      aria-label="Tout sélectionner"
                      checked={
                        allSelected || (selected.size > 0 && 'indeterminate')
                      }
                      onCheckedChange={(checked) =>
                        setSelected(
                          new Set(
                            checked === true ? users.map((u) => u.id) : [],
                          ),
                        )
                      }
                    />
                  </TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const target: Role = user.role === 'admin' ? 'user' : 'admin';
                  return (
                    <TableRow
                      key={user.id}
                      data-state={selected.has(user.id) && 'selected'}
                    >
                      <TableCell>
                        <Checkbox
                          aria-label={`Sélectionner ${user.displayName}`}
                          checked={selected.has(user.id)}
                          onCheckedChange={(checked) =>
                            toggle(user.id, checked === true)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.displayName}
                        {user.id === currentUser?.id && (
                          <Badge variant="secondary" className="ml-2">
                            Toi
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === 'admin' ? 'default' : 'outline'
                          }
                        >
                          {ROLE_LABELS[user.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            target === 'user' ? 'text-destructive' : undefined
                          }
                          onClick={() => askChange([user], target)}
                        >
                          {target === 'admin'
                            ? 'Passer admin'
                            : 'Passer utilisateur'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <RoleChangeDialog
        change={change}
        currentUserId={currentUser?.id}
        onConfirm={(value) => void applyChange(value)}
        onClose={() => setChange(null)}
      />
    </div>
  );
}
