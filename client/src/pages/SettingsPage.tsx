import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AccountSection,
  DevicesSection,
  PrivacySection,
} from '@/features/settings';
import { PageHeader } from '@/components/PageHeader';

const TABS = [
  { value: 'account', label: 'Compte', Section: AccountSection },
  { value: 'devices', label: 'Appareils connectés', Section: DevicesSection },
  { value: 'privacy', label: 'Confidentialité', Section: PrivacySection },
];

export function SettingsPage() {
  const { tab = 'account' } = useParams();
  const navigate = useNavigate();
  if (!TABS.some(({ value }) => value === tab)) {
    return <Navigate to="/settings/account" replace />;
  }

  return (
    <section className="grid gap-6">
      <PageHeader title="Paramètres" />
      <Tabs
        value={tab}
        onValueChange={(value) => navigate(`/settings/${value}`)}
      >
        <TabsList>
          {TABS.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map(({ value, Section }) => (
          <TabsContent key={value} value={value} className="mt-4">
            <Section />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
