import { Link } from 'react-router-dom';
import { LegalDocument, LegalSection, ToComplete } from './LegalDocument';

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
            Structure responsable :{' '}
            <ToComplete>nom et adresse postale</ToComplete>
          </li>
          <li>
            Directeur ou directrice de la publication :{' '}
            <ToComplete>nom et fonction</ToComplete>
          </li>
          <li>
            Contact : <ToComplete>adresse email du projet</ToComplete>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          L'application et sa base de données sont hébergées sur des ordinateurs
          de la formation, en France.
        </p>
        <ul>
          <li>
            Hébergeur : <ToComplete>nom ou raison sociale</ToComplete>
          </li>
          <li>
            Adresse : <ToComplete>adresse postale</ToComplete>
          </li>
          <li>
            Téléphone : <ToComplete>numéro de téléphone</ToComplete>
          </li>
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
          pédagogique demande leur accord. Licence du code :{' '}
          <ToComplete>licence choisie par le groupe</ToComplete>.
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
