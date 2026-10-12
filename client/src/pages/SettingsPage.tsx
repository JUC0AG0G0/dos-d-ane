import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AccountSection,
  DevicesSection,
  PrivacySection,
} from '@/features/settings';
import { UsersSection } from '@/features/admin';
import { useAuthStore } from '@/store';

const TABS = [
  { value: 'account', label: 'Compte', Section: AccountSection },
  { value: 'devices', label: 'Appareils connectés', Section: DevicesSection },
  { value: 'privacy', label: 'Confidentialité', Section: PrivacySection },
];

const ADMIN_TABS = [
  { value: 'admin', label: 'Administration', Section: UsersSection },
];

export function SettingsPage() {
  const { tab = 'account' } = useParams();
  const navigate = useNavigate();
  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');
  const tabs = isAdmin ? [...TABS, ...ADMIN_TABS] : TABS;
  if (!tabs.some(({ value }) => value === tab)) {
    return <Navigate to="/settings/account" replace />;
  }

  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-bold">Paramètres</h1>
      <Tabs
        value={tab}
        onValueChange={(value) => navigate(`/settings/${value}`)}
      >
        <TabsList>
          {tabs.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(({ value, Section }) => (
          <TabsContent key={value} value={value} className="mt-4">
            <Section />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
