import { Link } from 'react-router-dom';
import { LegalDocument, LegalSection, ToComplete } from './LegalDocument';

export function PrivacyPolicy() {
  return (
    <LegalDocument
      title="Politique de confidentialité"
      intro="Quelles données Dos d'âne traite, pourquoi, combien de temps, et comment exercer vos droits, conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés."
    >
      <LegalSection title="Responsable du traitement">
        <ul>
          <li>
            Responsable : <ToComplete>structure et représentant</ToComplete>
          </li>
          <li>
            Délégué à la protection des données (DPO) :{' '}
            <ToComplete>nom ou service et adresse email</ToComplete>
          </li>
          <li>
            Contact pour vos données :{' '}
            <ToComplete>adresse email du projet</ToComplete>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Données collectées">
        <p>Dos d'âne ne collecte que ce dont il a besoin pour fonctionner :</p>
        <ul>
          <li>
            <strong>Compte</strong> : adresse email, nom affiché, mot de passe
            (jamais stocké en clair, seulement une empreinte calculée avec
            scrypt), rôle, dates de création et de modification.
          </li>
          <li>
            <strong>Appareils et connexions</strong> : nom et type de
            l'appareil, navigateur et système (lus dans le User-Agent), adresse
            IP, dates de connexion, de dernière activité, d'expiration et de
            déconnexion.
          </li>
          <li>
            <strong>Posture</strong> : pour chaque capture, la date, la taille
            de l'image et la position de 17 points du corps (tête, épaules,
            coudes, poignets, hanches, genoux, chevilles…).{' '}
            <strong>
              L'image elle-même n'est jamais enregistrée ni transmise à un tiers
            </strong>
            .
          </li>
        </ul>
        <p>
          Les points du corps peuvent révéler des informations sur votre santé
          (troubles de la posture, gêne physique). Ils sont donc traités comme
          des données de santé au sens de l'article 9 du RGPD.
        </p>
      </LegalSection>

      <LegalSection title="Finalités et bases légales">
        <ul>
          <li>
            Créer et gérer votre compte, vous connecter : exécution des{' '}
            <Link to="/legal/terms">conditions d'utilisation</Link> (art. 6.1.b
            du RGPD).
          </li>
          <li>
            Sécuriser les connexions (adresse IP, User-Agent, historique des
            sessions) et vous permettre de déconnecter un appareil : intérêt
            légitime à protéger votre compte (art. 6.1.f).
          </li>
          <li>
            Analyser votre posture et vous proposer des conseils et des
            exercices : votre consentement explicite (art. 6.1.a et 9.2.a), que
            vous pouvez retirer à tout moment en coupant la capture ou en nous
            contactant.
          </li>
          <li>
            Repérer les problèmes de posture les plus fréquents pour améliorer
            les exercices : statistiques agrégées et anonymisées, sans accès aux
            données individuelles.
          </li>
        </ul>
        <p>
          Les conseils sont générés automatiquement à partir de vos points du
          corps. Ils n'ont aucun effet juridique et ne vous engagent à rien.
        </p>
      </LegalSection>

      <LegalSection title="Destinataires">
        <p>
          Vos données ne sont ni vendues, ni louées, ni utilisées à des fins
          publicitaires. Seuls les membres de l'équipe projet chargés de
          l'administration y ont accès, dans la limite de leurs missions. Les
          administrateurs ne voient que des statistiques anonymisées. Les
          données restent hébergées en France et ne sont pas transférées hors de
          l'Union européenne.
        </p>
      </LegalSection>

      <LegalSection title="Durées de conservation">
        <ul>
          <li>
            Compte : jusqu'à sa suppression, au plus tard{' '}
            <ToComplete>durée après la dernière connexion</ToComplete> sans
            connexion, et au plus tard à la fin du projet (
            <ToComplete>date</ToComplete>).
          </li>
          <li>
            Historique des connexions (adresse IP, User-Agent) :{' '}
            <ToComplete>durée</ToComplete> après la fin de la session.
          </li>
          <li>
            Données de posture : jusqu'à la suppression de l'appareil ou du
            compte, au plus tard <ToComplete>durée</ToComplete>.
          </li>
        </ul>
        <p>
          Supprimer votre compte supprime aussi vos appareils, vos sessions et
          toutes vos données de posture.
        </p>
      </LegalSection>

      <LegalSection title="Stockage dans votre navigateur">
        <p>
          Dos d'âne n'utilise pas de cookie. Il garde dans le stockage local de
          votre navigateur (localStorage) votre jeton de session, votre nom
          affiché et votre email, ainsi que l'identifiant de l'appareil pour le
          reconnaître à la connexion suivante. Ces éléments sont strictement
          nécessaires au service et ne demandent donc pas de consentement
          (article 82 de la loi Informatique et Libertés). Ils sont effacés à la
          déconnexion, sauf l'identifiant de l'appareil.
        </p>
      </LegalSection>

      <LegalSection title="Sécurité">
        <ul>
          <li>
            Le traitement des images se fait au plus près de l'appareil ; seuls
            les points du corps sont envoyés au serveur.
          </li>
          <li>Les mots de passe sont stockés sous forme d'empreinte.</li>
          <li>
            Chaque connexion est une session révocable, qui expire après une
            période d'inactivité.
          </li>
          <li>L'accès aux données d'origine est limité aux administrateurs.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Vous avez le droit d'accéder à vos données, de les rectifier, de les
          effacer, d'en limiter le traitement, de vous y opposer, de les
          récupérer dans un format lisible (portabilité), de retirer votre
          consentement à tout moment et de définir des directives sur leur sort
          après votre décès.
        </p>
        <p>
          Dans l'application, vous pouvez déjà voir et déconnecter vos appareils
          (Paramètres, Appareils connectés). Pour tout autre demande, écrivez à{' '}
          <ToComplete>adresse email du projet</ToComplete>. Nous répondons dans
          un délai d'un mois.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez
          adresser une réclamation à la{' '}
          <a
            href="https://www.cnil.fr/fr/plaintes"
            target="_blank"
            rel="noreferrer"
          >
            CNIL
          </a>{' '}
          (3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07).
        </p>
      </LegalSection>

      <LegalSection title="Modifications">
        <p>
          Cette politique peut évoluer avec le projet, par exemple à l'ajout
          d'un nouveau capteur. La date de mise à jour figure en haut de la
          page. En cas de changement important, vous en serez informé dans
          l'application.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
