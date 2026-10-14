/*
 * Caméra -> MoveNet (TensorFlow.js) -> points dessinés sur un canvas.
 * Aucune image n'est enregistrée ni envoyée : les frames servent au rendu et à
 * l'inférence, puis sont jetées. TensorFlow.js est inclus dans la page ; seul
 * le modèle MoveNet est téléchargé (tfhub.dev), au premier chargement.
 */
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-converter';
import * as tf from '@tensorflow/tfjs-core';

import type { MessagePage } from './messages';
import * as Posture from './posture';
import type { Analyse, Point } from './posture';

type Detecteur = poseDetection.PoseDetector;

/** Fenêtre de la WebView : pont vers l'app et commandes appelées par l'app. */
const fenetre = window as Window & {
  ReactNativeWebView?: { postMessage(message: string): void };
  PoseControle?: { pause(): void; reprendre(): void };
};

/** Élément obligatoire de la page (voir public/pose.html). */
function element<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Élément #${id} absent de pose.html`);
  return el as T;
}

const video = element<HTMLVideoElement>('video');
const canvas = element<HTMLCanvasElement>('overlay');
const scene = element('scene');
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const elEtat = element('etat');
const elFps = element('fps');
const elCou = element('cou');
const elTronc = element('tronc');
const elCote = element('cote');

const SEUIL = Posture.CONFIG.minKeypointScore;
const lisseur = Posture.creerLisseur();
const suiveurCote = Posture.creerSuiveurCote();

// pose.html?mode=session : page intégrée à l'écran de session de l'app, qui
// affiche elle-même les mesures ; le panneau de texte de la page est masqué.
const MODE_SESSION = /[?&]mode=session\b/.test(location.search);
if (MODE_SESSION) document.body.classList.add('session');

// En pause, la caméra reste ouverte mais plus aucune image n'est analysée.
let enPause = false;

// 4 mesures par seconde au plus : assez pour un affichage vivant, sans saturer
// le pont WebView -> React Native.
const INTERVALLE_ENVOI_MS = 250;
let dernierEnvoi = 0;

/** Envoie un message à l'app React Native, si la page tourne dans une WebView. */
function envoyer(message: MessagePage) {
  fenetre.ReactNativeWebView?.postMessage(JSON.stringify(message));
}

/** Mesures du moment ; `analyse` à null quand personne n'est détecté. */
function envoyerMesure(analyse: Analyse | null) {
  const maintenant = performance.now();
  if (maintenant - dernierEnvoi < INTERVALLE_ENVOI_MS) return;
  dernierEnvoi = maintenant;
  if (!analyse) {
    envoyer({ type: 'mesure', personne: false });
    return;
  }
  envoyer({
    type: 'mesure',
    personne: true,
    cote: analyse.cote,
    score: analyse.score === null ? null : Math.round(analyse.score),
    cou: { angle: analyse.cou.angle, niveau: analyse.cou.niveau },
    tronc: {
      angle: analyse.tronc.angle,
      niveau: analyse.tronc.niveau,
      sens: analyse.tronc.sens,
    },
  });
}

// Commandes appelées par l'app (injectJavaScript) : bouton Pause / Reprendre.
fenetre.PoseControle = {
  pause() {
    enPause = true;
    lisseur.reinitialiser();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },
  reprendre() {
    enPause = false;
  },
};

function etat(texte: string, estErreur = false) {
  elEtat.textContent = texte;
  elEtat.className = estErreur ? 'etat erreur' : 'etat';
  envoyer({ type: estErreur ? 'erreur' : 'etat', message: texte });
}

function signalerEchec(etape: string, err: unknown) {
  etat(etape + ' : ' + (err instanceof Error ? err.name + ' — ' + err.message : String(err)), true);
}

// ---------------------------------------------------------------------------
// 1. Caméra
// ---------------------------------------------------------------------------
async function demarrerCamera(): Promise<boolean> {
  // getUserMedia n'existe qu'en contexte sécurisé (https:// ou localhost).
  if (!window.isSecureContext) {
    etat(
      'Contexte NON sécurisé (' +
        location.protocol +
        '//' +
        location.host +
        '). getUserMedia est indisponible : la page doit être servie en https (tunnel).',
      true,
    );
    return false;
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    etat('navigator.mediaDevices.getUserMedia absent de cette WebView.', true);
    return false;
  }

  etat('Demande d’accès à la caméra…');
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      // Caméra frontale : le téléphone est posé de profil, écran vers soi,
      // pour pouvoir regarder les points. Mettre 'environment' pour l'arrière.
      video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
    });
  } catch (err) {
    signalerEchec('Caméra refusée ou indisponible', err);
    return false;
  }

  video.srcObject = stream;
  await new Promise<void>((resolve) => {
    if (video.readyState >= 2) return resolve();
    video.onloadedmetadata = () => resolve();
  });
  await video.play();

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  // Le canvas et la vidéo remplissent la même boîte, à laquelle on donne le
  // rapport d'aspect de la vidéo : les points tombent donc pile sur l'image.
  scene.style.aspectRatio = video.videoWidth + ' / ' + video.videoHeight;

  etat('Caméra OK (' + video.videoWidth + '×' + video.videoHeight + ').');
  return true;
}

// ---------------------------------------------------------------------------
// 2. Modèle
// ---------------------------------------------------------------------------
async function chargerModele(): Promise<Detecteur | null> {
  etat('Chargement du backend WebGL…');
  try {
    await tf.setBackend('webgl');
    await tf.ready();
  } catch (err) {
    signalerEchec('Backend WebGL indisponible', err);
    return null;
  }

  etat('Téléchargement du modèle MoveNet…');
  try {
    return await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    });
  } catch (err) {
    signalerEchec('Chargement de MoveNet', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 3. Dessin
// ---------------------------------------------------------------------------
function dessiner(keypoints: Point[], analyse: Analyse) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const parNom = Posture.indexerPoints(keypoints);
  const noms = Posture.POINTS_PAR_COTE[analyse.cote];

  // Seuls les 3 points mesurés (oreille, épaule, hanche du côté filmé) sont
  // dessinés, reliés par la nuque et le tronc.
  segment(parNom[noms.epaule], parNom[noms.oreille], analyse.cou.couleur);
  segment(parNom[noms.epaule], parNom[noms.hanche], analyse.tronc.couleur);

  const rayon = Math.max(5, canvas.width / 70);
  for (const kp of [parNom[noms.oreille], parNom[noms.epaule], parNom[noms.hanche]]) {
    // Un point peu fiable n'est pas dessiné : sa position serait fausse.
    if (!Posture.pointFiable(kp, SEUIL)) continue;
    ctx.fillStyle = Posture.couleurPoint(kp, analyse, noms, SEUIL);
    ctx.beginPath();
    ctx.arc(kp.x, kp.y, rayon, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.stroke();
  }
}

function segment(a: Point | undefined, b: Point | undefined, couleur: string) {
  if (!Posture.pointFiable(a, SEUIL) || !Posture.pointFiable(b, SEUIL)) return;
  ctx.strokeStyle = couleur;
  ctx.lineWidth = Math.max(4, canvas.width / 90);
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function afficherStatut(analyse: Analyse) {
  elCou.textContent = analyse.cou.texte;
  elCou.style.color = analyse.cou.couleur;
  elTronc.textContent = analyse.tronc.texte;
  elTronc.style.color = analyse.tronc.couleur;
  elCote.textContent =
    'côté ' + analyse.cote + ' (confiance ' + (analyse.confianceCote || 0).toFixed(2) + ')';
}

function statutVide(texte: string) {
  elCou.textContent = texte;
  elCou.style.color = Posture.COULEURS.gris;
  elTronc.textContent = '';
  elCote.textContent = '';
}

// ---------------------------------------------------------------------------
// 4. Boucle
// ---------------------------------------------------------------------------
async function boucle(detecteur: Detecteur) {
  let dernierAffichage = performance.now();
  let frames = 0;

  async function tour() {
    if (enPause) {
      requestAnimationFrame(tour);
      return;
    }

    let poses: poseDetection.Pose[];
    try {
      poses = await detecteur.estimatePoses(video, { flipHorizontal: false });
    } catch (err) {
      etat('Inférence échouée : ' + (err instanceof Error ? err.message : String(err)), true);
      return;
    }

    const brut = poses[0]?.keypoints;
    if (brut) {
      const keypoints = lisseur.lisser(brut);
      const analyse = Posture.analyser(keypoints, { cote: suiveurCote.choisir(keypoints) });
      dessiner(keypoints, analyse);
      afficherStatut(analyse);
      envoyerMesure(analyse);
    } else {
      // Plus personne dans le cadre : on oublie l'historique, sinon les points
      // réapparaîtraient en glissant depuis leur ancienne position.
      lisseur.reinitialiser();
      suiveurCote.reinitialiser();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      statutVide('Personne détectée : non mesurable');
      envoyerMesure(null);
    }

    frames++;
    const maintenant = performance.now();
    if (maintenant - dernierAffichage >= 500) {
      const fps = (frames * 1000) / (maintenant - dernierAffichage);
      elFps.textContent = fps.toFixed(1) + ' FPS';
      frames = 0;
      dernierAffichage = maintenant;
    }

    requestAnimationFrame(tour);
  }

  requestAnimationFrame(tour);
}

// ---------------------------------------------------------------------------
async function main() {
  if (!(await demarrerCamera())) return;
  const detecteur = await chargerModele();
  if (!detecteur) return;
  etat('Modèle prêt — backend ' + tf.getBackend() + '.');
  envoyer({ type: 'pret', message: 'camera + movenet OK' });
  await boucle(detecteur);
}

void main();
