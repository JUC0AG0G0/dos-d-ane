import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { LoginResponse, User } from './types';

/** Session de l'utilisateur connecté, gardée chiffrée dans le trousseau du téléphone. */
type Session = { accessToken: string; user: User };

type Etat =
  { statut: 'chargement' } | { statut: 'deconnecte' } | { statut: 'connecte'; session: Session };

const CLE_SESSION = 'dosdane.session';
// L'appareil est gardé après déconnexion : le serveur le reconnaît à la
// connexion suivante au lieu d'en créer un nouveau.
const CLE_APPAREIL = 'dosdane.appareil';

// Copie hors React, lue par le client HTTP et le stockage des données.
let jeton: string | null = null;
let utilisateur: User | null = null;
let surExpiration: (() => void) | null = null;

/** Jeton à envoyer dans `Authorization: Bearer`, null si déconnecté. */
export function jetonActuel(): string | null {
  return jeton;
}

/** Utilisateur connecté, null sinon (sert à séparer les données par compte). */
export function utilisateurActuel(): User | null {
  return utilisateur;
}

/** Appelé par le client HTTP sur un 401 : la session a expiré côté serveur. */
export function signalerSessionExpiree() {
  surExpiration?.();
}

export async function idAppareil(): Promise<string | undefined> {
  return (await SecureStore.getItemAsync(CLE_APPAREIL)) ?? undefined;
}

type ContexteSession = {
  etat: Etat;
  connecter: (reponse: LoginResponse) => Promise<void>;
  deconnecter: () => Promise<void>;
  mettreAJourUtilisateur: (user: User) => Promise<void>;
};

const Contexte = createContext<ContexteSession | null>(null);

export function FournisseurSession({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<Etat>({ statut: 'chargement' });

  const appliquer = useCallback((session: Session | null) => {
    jeton = session?.accessToken ?? null;
    utilisateur = session?.user ?? null;
    setEtat(session ? { statut: 'connecte', session } : { statut: 'deconnecte' });
  }, []);

  const deconnecter = useCallback(async () => {
    await SecureStore.deleteItemAsync(CLE_SESSION);
    appliquer(null);
  }, [appliquer]);

  const connecter = useCallback(
    async ({ accessToken, user, deviceId }: LoginResponse) => {
      const session = { accessToken, user };
      await SecureStore.setItemAsync(CLE_SESSION, JSON.stringify(session));
      await SecureStore.setItemAsync(CLE_APPAREIL, deviceId);
      appliquer(session);
    },
    [appliquer],
  );

  const mettreAJourUtilisateur = useCallback(
    async (user: User) => {
      if (!jeton) return;
      const session = { accessToken: jeton, user };
      await SecureStore.setItemAsync(CLE_SESSION, JSON.stringify(session));
      appliquer(session);
    },
    [appliquer],
  );

  // Au lancement : reprend la session enregistrée, s'il y en a une.
  useEffect(() => {
    let actif = true;
    SecureStore.getItemAsync(CLE_SESSION)
      .then((brut) => (brut ? (JSON.parse(brut) as Session) : null))
      .catch(() => null)
      .then((session) => actif && appliquer(session?.accessToken ? session : null));
    return () => {
      actif = false;
    };
  }, [appliquer]);

  // Un 401 du serveur (session expirée ou fermée ailleurs) déconnecte.
  useEffect(() => {
    surExpiration = () => void deconnecter();
    return () => {
      surExpiration = null;
    };
  }, [deconnecter]);

  const valeur = useMemo(
    () => ({ etat, connecter, deconnecter, mettreAJourUtilisateur }),
    [etat, connecter, deconnecter, mettreAJourUtilisateur],
  );
  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function useSession(): ContexteSession {
  const contexte = useContext(Contexte);
  if (!contexte) throw new Error('useSession doit être utilisé dans <FournisseurSession>');
  return contexte;
}
