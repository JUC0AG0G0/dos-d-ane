/**
 * Mesures envoyées par public/pose.js (mode session) et leur traduction en
 * message et en score pour l'écran « Session en cours ».
 */

export type Niveau = 'vert' | 'orange' | 'rouge' | 'gris';

export type Mesure =
  | { personne: false }
  | {
      personne: true;
      cote: 'gauche' | 'droite';
      /** Score 0–100 calculé à partir des angles (posture.js, scorePosture). */
      score: number | null;
      cou: { angle: number | null; niveau: Niveau };
      /** sens : avant (penché vers l'écran), arriere (avachi), null si inconnu. */
      tronc: { angle: number | null; niveau: Niveau; sens?: 'avant' | 'arriere' | null };
    };

/** Lit un message de la WebView ; null si ce n'est pas une mesure. */
export function lireMesure(donnees: string): Mesure | null {
  try {
    const objet = JSON.parse(donnees);
    if (objet?.type !== 'mesure') return null;
    return objet as Mesure;
  } catch {
    return null;
  }
}

/** Message principal de la carte de statut, du plus urgent au plus rassurant. */
export function messagePosture(mesure: Mesure | null): {
  titre: string;
  conseil: string;
  alerte: boolean;
} {
  if (!mesure) {
    return {
      titre: 'Démarrage de la caméra…',
      conseil: 'Autorisez l’accès à la caméra',
      alerte: false,
    };
  }
  if (!mesure.personne) {
    return {
      titre: 'Aucune personne détectée',
      conseil: 'Placez-vous de profil, face à l’écran du téléphone',
      alerte: false,
    };
  }
  const { cou, tronc } = mesure;
  if (cou.niveau === 'gris' && tronc.niveau === 'gris') {
    return {
      titre: 'Position non mesurable',
      conseil: 'Oreille, épaule et hanche doivent être visibles',
      alerte: false,
    };
  }
  if (cou.niveau === 'rouge' || cou.niveau === 'orange') {
    return {
      titre: 'Tête en avant détectée',
      conseil: 'Rentrez légèrement le menton',
      alerte: true,
    };
  }
  if (tronc.niveau === 'rouge' || tronc.niveau === 'orange') {
    if (tronc.sens === 'arriere') {
      return {
        titre: 'Dos avachi détecté',
        conseil: 'Asseyez-vous au fond de la chaise, le dos contre le dossier',
        alerte: true,
      };
    }
    return {
      titre: 'Buste penché en avant',
      conseil: 'Redressez-vous, rapprochez plutôt l’écran',
      alerte: true,
    };
  }
  return { titre: 'Bonne posture', conseil: 'Continuez comme ça', alerte: false };
}

/** Score instantané 0–100, arrondi ; null si rien n'est mesurable. */
export function scoreInstantane(mesure: Mesure | null): number | null {
  if (!mesure || !mesure.personne || mesure.score === null || !isFinite(mesure.score)) return null;
  return Math.round(mesure.score);
}

/** « 04:07 » ou « 1:04:07 ». */
export function formaterDuree(secondes: number): string {
  const h = Math.floor(secondes / 3600);
  const m = Math.floor((secondes % 3600) / 60);
  const s = secondes % 60;
  const deux = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${deux(m)}:${deux(s)}` : `${deux(m)}:${deux(s)}`;
}
