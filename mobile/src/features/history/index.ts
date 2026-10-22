export { EcranResultats } from './components/EcranResultats';
export { Repartition } from './components/Repartition';
export { chargerHistorique, enregistrer } from './services/stockage';
export {
  ajouterEchantillon,
  bilanSession,
  libellePeriode,
  resumer,
  situation,
  situationSession,
  texteEcart,
} from './statistiques';
export type { BilanSession, SessionEnregistree, Situation, Tranche } from './statistiques';
