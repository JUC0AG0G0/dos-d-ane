import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/store';
import { formatDate } from '@/utils/format';

const ROLE_LABELS = { user: 'Utilisateur', admin: 'Administrateur' };

export function AccountSection() {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;

  const rows = [
    { label: 'Nom affiché', value: user.displayName },
    { label: 'Email', value: user.email },
    { label: 'Rôle', value: ROLE_LABELS[user.role] },
    { label: 'Membre depuis le', value: formatDate(user.createdAt) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compte</CardTitle>
        <CardDescription>Les informations de ton compte.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="divide-y">
          {rows.map(({ label, value }) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-3">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium sm:col-span-2">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
