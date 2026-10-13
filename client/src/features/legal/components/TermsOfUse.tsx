import { Link } from 'react-router-dom';
import { LegalDocument, LegalSection } from './LegalDocument';

export function TermsOfUse() {
  return (
    <LegalDocument
      title="Conditions d'utilisation"
      intro="En créant un compte, vous acceptez ces conditions. Lisez en particulier l'avertissement médical."
    >
      <LegalSection title="Objet du service">
        <p>
          Dos d'âne aide les personnes qui travaillent assises à surveiller leur
          posture et leur propose des conseils et des exercices. C'est une
          preuve de concept réalisée dans un cadre pédagogique (Master UHA 4.0,
          Université de Haute-Alsace). Il est gratuit et réservé aux étudiants
          et au personnel de la formation.
        </p>
      </LegalSection>

      <LegalSection id="medical" title="Avertissement médical">
        <p>
          <strong>
            Dos d'âne ne remplace pas l'avis d'un professionnel de santé.
          </strong>{' '}
          Ce n'est pas un dispositif médical : il ne pose aucun diagnostic et ne
          prescrit aucun traitement. Ses conseils sont généraux et peuvent ne
          pas convenir à votre situation.
        </p>
        <ul>
          <li>
            Arrêtez un exercice s'il provoque une douleur, un engourdissement ou
            un vertige.
          </li>
          <li>
            Consultez un médecin ou un kinésithérapeute en cas de douleur qui
            dure, d'antécédent ou de doute avant de faire un exercice.
          </li>
          <li>En cas d'urgence, appelez le 15 (SAMU) ou le 112.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Votre compte">
        <ul>
          <li>
            Vous donnez des informations exactes et un seul compte par personne.
          </li>
          <li>
            Vous gardez votre mot de passe secret. Si vous pensez qu'un appareil
            inconnu est connecté, déconnectez-le dans Paramètres, Appareils
            connectés, puis prévenez-nous.
          </li>
          <li>Vous êtes responsable de ce qui est fait depuis votre compte.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Capture de la posture">
        <p>
          La capture est facultative : vous l'activez et la coupez vous-même,
          appareil par appareil. Ne cadrez que vous-même. Si une autre personne
          peut apparaître dans le champ, prévenez-la ou coupez la capture. Le
          traitement des données est décrit dans la{' '}
          <Link to="/legal/privacy">politique de confidentialité</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Bon usage">
        <p>
          Vous vous engagez à ne pas tenter d'accéder aux données d'autres
          utilisateurs, à ne pas perturber le service et à ne pas l'utiliser à
          d'autres fins que le suivi de votre propre posture.
        </p>
      </LegalSection>

      <LegalSection title="Disponibilité et responsabilité">
        <p>
          Comme toute preuve de concept, le service est fourni en l'état, sans
          garantie de disponibilité ni d'exactitude des analyses. Il peut être
          interrompu, modifié ou arrêté à tout moment, en particulier à la fin
          du projet ; vos données seront alors supprimées. Dans les limites
          permises par la loi, l'équipe projet n'est pas responsable des
          conséquences d'une mauvaise utilisation des conseils ou d'une
          interruption du service.
        </p>
      </LegalSection>

      <LegalSection title="Suspension et suppression du compte">
        <p>
          Vous pouvez demander la suppression de votre compte à tout moment.
          L'équipe projet peut suspendre un compte qui ne respecte pas ces
          conditions, après vous en avoir informé sauf urgence.
        </p>
      </LegalSection>

      <LegalSection title="Modifications et droit applicable">
        <p>
          Ces conditions peuvent évoluer ; la date de mise à jour figure en haut
          de la page. Elles sont soumises au droit français.
        </p>
        <p>Contact : uha40@uha.fr</p>
      </LegalSection>
    </LegalDocument>
  );
}
