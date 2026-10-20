import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { apiErrorMessage } from '@/utils/api-error';

/**
 * Lance une action sur l'API (busy pendant l'appel) ; une erreur s'affiche en
 * toast avec le message du serveur. Renvoie le résultat, ou undefined si
 * l'action a échoué.
 */
export function useAction() {
  const [busy, setBusy] = useState(false);
  const run = useCallback(
    async <T>(action: () => Promise<T>, fallback = 'L’action a échoué.') => {
      setBusy(true);
      try {
        return await action();
      } catch (error) {
        toast.error(apiErrorMessage(error, fallback));
        return undefined;
      } finally {
        setBusy(false);
      }
    },
    [],
  );
  return { busy, run };
}
