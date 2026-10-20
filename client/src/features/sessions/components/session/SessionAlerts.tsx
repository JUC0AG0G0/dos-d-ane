import { MonitorOff, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function NoCaptureAlert() {
  return (
    <Alert>
      <MonitorOff />
      <AlertTitle>Le site web ne capture pas</AlertTitle>
      <AlertDescription>
        Les captures viennent de vos appareils : application mobile, application
        bureau ou Raspberry. Ce navigateur sert à préparer et suivre la session.
      </AlertDescription>
    </Alert>
  );
}

export function PrivacyAlert() {
  return (
    <Alert variant="success">
      <ShieldCheck />
      <AlertTitle>Vos images restent sur l’appareil</AlertTitle>
      <AlertDescription>
        Seules les positions des articulations sont envoyées au serveur :
        l’image n’est jamais stockée.
      </AlertDescription>
    </Alert>
  );
}
