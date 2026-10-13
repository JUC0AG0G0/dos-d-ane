/**
 * Historique FICTIF pour la démonstration : 5 semaines de journées de travail
 * (9h–17h, pause à midi), score en légère progression. Sert à voir les écrans
 * Résultats et Conseils remplis sans se filmer pendant des heures.
 * Remplace l'historique réel ; « Effacer l'historique » revient à zéro.
 */
import type { Historique, SessionEnregistree, Tranche } from './statistiques';

/** Générateur pseudo-aléatoire reproductible (mulberry32). */
function aleatoire(graine: number) {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function genererDemo(maintenant: Date, jours = 35): Historique {
  const hasard = aleatoire(42);
  const tranches: Tranche[] = [];
  const sessions: SessionEnregistree[] = [];

  for (let j = jours - 1; j >= 0; j--) {
    const jour = new Date(
      maintenant.getFullYear(),
      maintenant.getMonth(),
      maintenant.getDate() - j,
    );
    const jourSemaine = jour.getDay();
    if (jourSemaine === 0 || jourSemaine === 6) continue; // pas le week-end

    const progression = (jours - j) / jours; // 0 -> 1 au fil des semaines
    for (const [debutH, finH] of [
      [9, 12],
      [13, 18],
    ]) {
      let secondesSession = 0;
      let debutSession = 0;
      for (let h = debutH; h < finH; h++) {
        const debut = new Date(jour.getFullYear(), jour.getMonth(), jour.getDate(), h).getTime();
        if (debut + 3600 * 1000 > maintenant.getTime()) break; // pas d'heure future
        if (!debutSession) debutSession = debut;

        const secondes = Math.round(2400 + hasard() * 1000);
        // Score moyen de l'heure : progresse au fil des semaines, baisse en fin de journée.
        const fatigue = h >= 16 ? 8 : 0;
        const score = Math.max(
          30,
          Math.min(97, 64 + 18 * progression - fatigue + (hasard() - 0.5) * 16),
        );
        const partBonne = Math.min(0.95, Math.max(0.2, (score - 35) / 60));
        const partAmeliorer = Math.max(0.02, (1 - partBonne) * 0.35);
        const partMoyenne = 1 - partBonne - partAmeliorer;
        const cou = 44 + (score - 50) * 0.25 + (hasard() - 0.5) * 3;
        const tronc = Math.max(2, 22 - (score - 50) * 0.3 + (hasard() - 0.5) * 3);

        tranches.push({
          debut,
          secondes,
          scoreSomme: score * secondes,
          couSomme: cou * secondes,
          couSecondes: secondes,
          troncSomme: tronc * secondes,
          troncSecondes: secondes,
          bonne: partBonne * secondes,
          moyenne: partMoyenne * secondes,
          ameliorer: partAmeliorer * secondes,
          couAlerte: (1 - partBonne) * 0.7 * secondes,
          troncAlerte: (1 - partBonne) * 0.4 * secondes,
          troncArriere: (1 - partBonne) * 0.15 * secondes,
        });
        secondesSession += secondes;
      }
      if (secondesSession > 0) {
        sessions.push({
          debut: debutSession,
          fin: debutSession + secondesSession * 1000,
          secondes: secondesSession,
        });
      }
    }
  }
  return { tranches, sessions };
}
