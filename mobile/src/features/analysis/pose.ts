/*
 * Caméra -> MoveNet (TensorFlow.js) -> points dessinés sur un canvas.
 * L'image est toujours capturée au format 3/4 (portrait), quel que soit l'appareil.
 * Aucune image n'est enregistrée ni envoyée : chaque image sert au rendu et à
 * l'inférence, puis est jetée. Seul le modèle MoveNet est téléchargé (tfhub.dev).
 */
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-converter';
import * as tf from '@tensorflow/tfjs-core';

import { cadrer, type Cadrage } from './cadrage';
import type { EtatTelephone, MessagePage } from './messages';
import * as Posture from './posture';
import type { Analyse, Point } from './posture';

type Detecteur = poseDetection.PoseDetector;

/** Fenêtre de la WebView : pont vers l'app et commandes appelées par l'app (pause/reprise). */
const fenetre = window as Window & {
  ReactNativeWebView?: { postMessage(message: string): void };
  PoseControle?: {
    pause(): void;
    reprendre(): void;
    telephone(inclinaison: number, etat: EtatTelephone): void;
  };
};

function element<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Élément #${id} absent de pose.html`);
  return el as T;
}

const video = element<HTMLVideoElement>('video');
const canvas = element<HTMLCanvasElement>('overlay');
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

/**
 * Format natif des capteurs d'iPhone (4:3), demandé dans le sens du capteur :
 * téléphone tenu droit, iOS le livre en 480×640, soit du 3/4 sans recadrage.
 * 640 px suffisent à MoveNet Lightning, qui travaille en 192 px.
 */
const CAPTURE = { largeur: 640, hauteur: 480 };
/** 4 mesures par seconde au plus : assez pour un affichage vivant, sans saturer le pont WebView. */
const INTERVALLE_ENVOI_MS = 250;

/** Image analysée : le centre de la vidéo, recadré au format 3/4. */
const image = document.createElement('canvas');
const ctxImage = image.getContext('2d') as CanvasRenderingContext2D;
let cadrage: Cadrage = { x: 0, y: 0, largeur: 0, hauteur: 0 };

const SEUIL = Posture.CONFIG.minKeypointScore;
const lisseur = Posture.creerLisseur();
const suiveurCote = Posture.creerSuiveurCote();

let enPause = false;
let dernierEnvoi = 0;
let precedente: Analyse | undefined;
const telephone: { inclinaison: number; etat: EtatTelephone } = { inclinaison: 0, etat: 'inconnu' };

function envoyer(message: MessagePage) {
  fenetre.ReactNativeWebView?.postMessage(JSON.stringify(message));
}

/** Mesures du moment, envoyées à l'app ; `analyse` à null quand personne n'est détecté. */
function envoyerMesure(analyse: Analyse | null) {
  const maintenant = performance.now();
  if (maintenant - dernierEnvoi < INTERVALLE_ENVOI_MS) return;
  dernierEnvoi = maintenant;
  if (!analyse) {
    envoyer({ type: 'mesure', personne: false, telephone: telephone.etat });
    return;
  }
  envoyer({
    type: 'mesure',
    personne: true,
    telephone: telephone.etat,
    inclinaison: Math.round(telephone.inclinaison),
    cote: analyse.cote,
    cou: { angle: analyse.cou.angle, niveau: analyse.cou.niveau },
    tronc: {
      angle: analyse.tronc.angle,
      niveau: analyse.tronc.niveau,
      sens: analyse.tronc.sens,
    },
  });
}

fenetre.PoseControle = {
  pause() {
    enPause = true;
    lisseur.reinitialiser();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },
  reprendre() {
    enPause = false;
  },
  telephone(inclinaison, etat) {
    telephone.inclinaison = inclinaison;
    telephone.etat = etat;
  },
};

function etat(texte: string, estErreur = false) {
  envoyer({ type: estErreur ? 'erreur' : 'etat', message: texte });
}

function signalerEchec(etape: string, err: unknown) {
  etat(etape + ' : ' + (err instanceof Error ? err.name + ' — ' + err.message : String(err)), true);
}

/**
 * Ouvre la caméra frontale (téléphone posé de profil, écran vers soi), puis
 * recadre en 3/4 si l'appareil fournit un autre format.
 */
async function demarrerCamera(): Promise<boolean> {
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
      video: {
        facingMode: 'user',
        width: { ideal: CAPTURE.largeur },
        height: { ideal: CAPTURE.hauteur },
      },
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

  cadrage = cadrer(video.videoWidth, video.videoHeight);
  image.width = canvas.width = cadrage.largeur;
  image.height = canvas.height = cadrage.hauteur;

  etat(
    `Caméra OK (${video.videoWidth}×${video.videoHeight}, analysée en ${cadrage.largeur}×${cadrage.hauteur}).`,
  );
  return true;
}

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

/** Copie la zone 3/4 de l'image vidéo courante dans le canvas analysé. */
function capturer(): HTMLCanvasElement {
  ctxImage.drawImage(
    video,
    cadrage.x,
    cadrage.y,
    cadrage.largeur,
    cadrage.hauteur,
    0,
    0,
    image.width,
    image.height,
  );
  return image;
}

/**
 * Dessine les 3 points mesurés (oreille, épaule, hanche du côté filmé), reliés
 * par la nuque et le tronc. Un point peu fiable n'est pas dessiné.
 */
function dessiner(keypoints: Point[], analyse: Analyse) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const parNom = Posture.indexerPoints(keypoints);
  const noms = Posture.POINTS_PAR_COTE[analyse.cote];

  segment(parNom[noms.epaule], parNom[noms.oreille], analyse.cou.couleur);
  segment(parNom[noms.epaule], parNom[noms.hanche], analyse.tronc.couleur);

  const rayon = Math.max(5, canvas.width / 70);
  for (const kp of [parNom[noms.oreille], parNom[noms.epaule], parNom[noms.hanche]]) {
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

/**
 * Une image par tour d'affichage : détection, lissage, analyse, dessin et envoi.
 * Quand personne n'est détecté, le lissage repart de zéro pour que les points
 * ne réapparaissent pas en glissant depuis leur ancienne position.
 */
async function boucle(detecteur: Detecteur) {
  async function tour() {
    if (enPause) {
      requestAnimationFrame(tour);
      return;
    }

    let poses: poseDetection.Pose[];
    try {
      poses = await detecteur.estimatePoses(capturer(), { flipHorizontal: false });
    } catch (err) {
      etat('Inférence échouée : ' + (err instanceof Error ? err.message : String(err)), true);
      return;
    }

    const brut = poses[0]?.keypoints;
    if (brut) {
      const keypoints = lisseur.lisser(brut);
      const analyse = Posture.analyser(keypoints, {
        cote: suiveurCote.choisir(keypoints),
        rotation: Posture.CONFIG.correctionInclinaison * telephone.inclinaison,
        precedente,
      });
      precedente = analyse;
      dessiner(keypoints, analyse);
      envoyerMesure(analyse);
    } else {
      lisseur.reinitialiser();
      suiveurCote.reinitialiser();
      precedente = undefined;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      envoyerMesure(null);
    }

    requestAnimationFrame(tour);
  }

  requestAnimationFrame(tour);
}

async function main() {
  if (!(await demarrerCamera())) return;
  const detecteur = await chargerModele();
  if (!detecteur) return;
  etat('Modèle prêt — backend ' + tf.getBackend() + '.');
  envoyer({ type: 'pret', message: 'camera + movenet OK' });
  await boucle(detecteur);
}

void main();
