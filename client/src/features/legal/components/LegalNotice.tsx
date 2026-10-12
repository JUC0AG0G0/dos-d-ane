import { Link } from 'react-router-dom';
import { LegalDocument, LegalSection } from './LegalDocument';

export function LegalNotice() {
  return (
    <LegalDocument
      title="Mentions légales"
      intro="Informations prévues par l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN)."
    >
      <LegalSection title="Éditeur">
        <p>
          Dos d'âne est une preuve de concept (POC) réalisée par un groupe
          d'étudiants du Master UHA 4.0 de l'Université de Haute-Alsace, dans le
          cadre du projet fil rouge 2026. Le service est gratuit, sans but
          commercial, et destiné aux étudiants et au personnel de la formation.
        </p>
        <ul>
          <li>
            Structure responsable : UHA 4.0 - Université de Haute-Alsace 6 Rue
            des Frères Lumière, 68200 Mulhouse
          </li>
          <li>Contact : uha40@uha.fr</li>
        </ul>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          L'application et sa base de données sont hébergées sur des ordinateurs
          de la formation, en France.
        </p>
        <ul>
          <li>Hébergeur : UHA 4.0 - Université de Haute-Alsace</li>
          <li>Adresse : 6 Rue des Frères Lumière, 68200 Mulhouse</li>
          <li>Téléphone : 03 89 33 64 38</li>
        </ul>
      </LegalSection>

      <LegalSection title="Avertissement santé">
        <p>
          Dos d'âne donne des conseils généraux de posture et d'exercices. Il ne
          pose aucun diagnostic et{' '}
          <strong>ne remplace pas l'avis d'un professionnel de santé</strong>.
          Voir l'
          <Link to="/legal/terms#medical">avertissement médical</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles">
        <p>
          Le traitement de vos données est décrit dans la{' '}
          <Link to="/legal/privacy">politique de confidentialité</Link>.
          L'application ne dépose aucun cookie publicitaire ni de mesure
          d'audience.
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          Le code source, les textes et les illustrations de Dos d'âne
          appartiennent à leurs auteurs. Toute reproduction en dehors du cadre
          pédagogique demande leur accord.
        </p>
        <p>
          Le code source est distribué sous licence libre{' '}
          <a
            href="https://www.gnu.org/licenses/agpl-3.0.html"
            target="_blank"
            rel="noreferrer"
          >
            GNU AGPL v3.0
          </a>
          .
        </p>
        <p>
          Composants d'interface :{' '}
          <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer">
            shadcn/ui
          </a>{' '}
          (licence MIT) et icônes{' '}
          <a href="https://lucide.dev" target="_blank" rel="noreferrer">
            Lucide
          </a>{' '}
          (licence ISC).
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
