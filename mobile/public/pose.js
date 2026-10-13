// FICHIER GÉNÉRÉ par `npm run build:page` à partir de src/page/ : ne pas éditer à la main.
"use strict";
(() => {
  // src/page/posture.ts
  var CONFIG = {
    // Confiance minimale d'un point MoveNet pour être utilisé.
    // Valeur de départ usuelle des exemples TensorFlow.js pour MoveNet, à régler à l'usage.
    minKeypointScore: 0.3,
    // Lissage : moyenne mobile sur les N dernières positions de chaque point.
    // MoveNet tremble d'une image à l'autre ; 3 suffit à calmer sans ajouter de
    // retard visible. Mettre 1 pour désactiver complètement le lissage.
    lissageFenetre: 3,
    // Verrouillage du côté filmé : une fois choisi, on ne change de côté que si
    // l'autre est nettement mieux vu (confiance moyenne plus haute d'au moins
    // `coteMarge`) pendant `coteImagesPourChanger` images d'affilée. Le test du
    // 13/10/2026 a montré 54 mesures sur 1 378 (4 %) « basculées » un instant
    // sur le côté caché, avec des angles absurdes (cou à -9°, tronc à 40°).
    // Valeurs PROVISOIRES, choisies à la main.
    coteMarge: 0.1,
    coteImagesPourChanger: 10,
    cou: {
      label: "Cou",
      // Angle craniovertébral APPROCHÉ : angle entre l'horizontale passant par
      // l'épaule et la droite épaule -> oreille. Plus grand = mieux.
      sens: "plusGrandEstMieux",
      // Vert au-dessus de 50° : valeur la plus utilisée dans la littérature
      // sur l'angle craniovertébral (aucun seuil validé ; fourchette 44–55°
      // selon les auteurs), et confirmée par notre test du 13/10/2026
      // (3 participants, 1 378 mesures) : passer de 53° à 50° fait passer la
      // détection de la bonne posture de 84 % à 92 %, et la détection globale
      // de 92,9 % à 94,5 %, sans gêner celle de la tête en avant (91 -> 89 %).
      // Voir mobile/README.md, « Test des postures ».
      vertAuDessusDe: 50,
      // Rouge sous 45° : bas de la fourchette de la littérature ; dans le test,
      // 78 % des mesures « tête en avant » et aucune « bien droit » en dessous.
      orangeAuDessusDe: 45,
      // Note 0 à partir de cet angle (voir noteMesure). PROVISOIRE, choisi à la
      // main : 15° sous la borne orange.
      noteZeroEnDessousDe: 30,
      // APPROXIMATION ASSUMÉE : le vrai angle craniovertébral se mesure depuis C7.
      // MoveNet ne donne pas C7, on prend l'épaule à la place : les valeurs
      // absolues ne sont donc PAS comparables à celles de la littérature.
      approximation: "epaule au lieu de C7"
    },
    tronc: {
      label: "Tronc",
      // Angle de la droite épaule -> hanche par rapport à la verticale.
      // Plus petit = mieux (tronc droit).
      sens: "plusPetitEstMieux",
      // Rouge au-delà de 20° : ISO 11226 (inclinaison du tronc acceptable
      // jusqu'à 20°) et palier de RULA. Vert sous 10° : choisi à la main.
      // Confirmés par le test du 13/10/2026 : 90 % des mesures « bien droit »
      // sous 7,9°, 90 % des « penché » et « avachi » au-dessus de 18,6°.
      vertEnDessousDe: 10,
      orangeEnDessousDe: 20,
      // Note 0 à partir de cet angle (voir noteMesure). PROVISOIRE, choisi à la
      // main : 20° au-dessus de la borne orange.
      noteZeroAuDessusDe: 40,
      approximation: "epaule-hanche en 2D, sans correction de perspective"
    }
  };
  var POINTS_PAR_COTE = {
    gauche: { oreille: "left_ear", epaule: "left_shoulder", hanche: "left_hip" },
    droite: { oreille: "right_ear", epaule: "right_shoulder", hanche: "right_hip" }
  };
  var COULEURS = {
    vert: "#2ecc71",
    orange: "#f39c12",
    rouge: "#e74c3c",
    gris: "#9aa0a6"
  };
  var TEXTE_STATUT = {
    vert: "bonne position",
    orange: "légèrement mauvaise",
    rouge: "très mauvaise",
    gris: "non mesurable"
  };
  function indexerPoints(keypoints) {
    const parNom = {};
    for (const kp of keypoints ?? []) {
      if (kp && kp.name) parNom[kp.name] = kp;
    }
    return parNom;
  }
  function pointFiable(kp, seuil) {
    return !!kp && typeof kp.x === "number" && typeof kp.y === "number" && (kp.score || 0) >= seuil;
  }
  function confianceCote(parNom, cote) {
    const p = POINTS_PAR_COTE[cote];
    const cles = [p.oreille, p.epaule, p.hanche];
    let somme = 0;
    for (const cle of cles) {
      const kp = parNom[cle];
      somme += kp && typeof kp.score === "number" ? kp.score : 0;
    }
    return somme / cles.length;
  }
  function choisirCote(parNom) {
    let meilleur = { cote: "gauche", score: -1 };
    for (const cote of Object.keys(POINTS_PAR_COTE)) {
      const moyenne = confianceCote(parNom, cote);
      if (moyenne > meilleur.score) meilleur = { cote, score: moyenne };
    }
    return meilleur;
  }
  function creerSuiveurCote(imagesPourChanger, marge) {
    const n = imagesPourChanger || CONFIG.coteImagesPourChanger;
    const m = marge === void 0 ? CONFIG.coteMarge : marge;
    let actuel = null;
    let compte = 0;
    return {
      choisir(keypoints) {
        const parNom = indexerPoints(keypoints);
        const meilleur = choisirCote(parNom);
        if (!actuel) {
          actuel = meilleur.cote;
          return actuel;
        }
        const nettementMieux = meilleur.cote !== actuel && meilleur.score - confianceCote(parNom, actuel) >= m;
        compte = nettementMieux ? compte + 1 : 0;
        if (compte >= n) {
          actuel = meilleur.cote;
          compte = 0;
        }
        return actuel;
      },
      reinitialiser() {
        actuel = null;
        compte = 0;
      }
    };
  }
  function angleCou(epaule, oreille) {
    const dx = Math.abs(oreille.x - epaule.x);
    const dy = epaule.y - oreille.y;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }
  function angleTronc(epaule, hanche) {
    const dx = Math.abs(hanche.x - epaule.x);
    const dy = Math.abs(hanche.y - epaule.y);
    return Math.atan2(dx, dy) * 180 / Math.PI;
  }
  function sensTronc(epaule, hanche, nez, oreille, seuil = CONFIG.minKeypointScore) {
    if (!pointFiable(epaule, seuil) || !pointFiable(hanche, seuil) || !pointFiable(nez, seuil) || !pointFiable(oreille, seuil)) {
      return null;
    }
    const regard = Math.sign(nez.x - oreille.x);
    const avance = (epaule.x - hanche.x) * regard;
    if (!regard || !avance) return null;
    return avance > 0 ? "avant" : "arriere";
  }
  function classer(angle, regle) {
    if (angle === null || angle === void 0 || !isFinite(angle)) return "gris";
    if (regle.sens === "plusGrandEstMieux") {
      if (angle > regle.vertAuDessusDe) return "vert";
      if (angle >= regle.orangeAuDessusDe) return "orange";
      return "rouge";
    }
    if (angle < regle.vertEnDessousDe) return "vert";
    if (angle <= regle.orangeEnDessousDe) return "orange";
    return "rouge";
  }
  function noteMesure(angle, regle) {
    if (angle === null || angle === void 0 || !isFinite(angle)) return null;
    if (regle.sens === "plusGrandEstMieux") {
      const v2 = regle.vertAuDessusDe;
      const o2 = regle.orangeAuDessusDe;
      const z2 = regle.noteZeroEnDessousDe;
      if (angle >= v2) return 100;
      if (angle >= o2) return 60 + 40 * (angle - o2) / (v2 - o2);
      if (angle <= z2) return 0;
      return 60 * (angle - z2) / (o2 - z2);
    }
    const v = regle.vertEnDessousDe;
    const o = regle.orangeEnDessousDe;
    const z = regle.noteZeroAuDessusDe;
    if (angle <= v) return 100;
    if (angle <= o) return 100 - 40 * (angle - v) / (o - v);
    if (angle >= z) return 0;
    return 60 * (z - angle) / (z - o);
  }
  function scorePosture(angleC, angleT) {
    const notes = [noteMesure(angleC, CONFIG.cou), noteMesure(angleT, CONFIG.tronc)].filter(
      (n) => n !== null
    );
    if (!notes.length) return null;
    return notes.reduce((a, b) => a + b, 0) / notes.length;
  }
  function analyser(keypoints, options) {
    const seuil = options?.minKeypointScore || CONFIG.minKeypointScore;
    const parNom = indexerPoints(keypoints);
    const cote = options?.cote || choisirCote(parNom).cote;
    const noms = POINTS_PAR_COTE[cote];
    const epaule = parNom[noms.epaule];
    const oreille = parNom[noms.oreille];
    const hanche = parNom[noms.hanche];
    const epauleOk = pointFiable(epaule, seuil);
    const angleC = epauleOk && pointFiable(oreille, seuil) ? angleCou(epaule, oreille) : null;
    const angleT = epauleOk && pointFiable(hanche, seuil) ? angleTronc(epaule, hanche) : null;
    const niveauC = classer(angleC, CONFIG.cou);
    const niveauT = classer(angleT, CONFIG.tronc);
    const sensT = angleT === null ? null : sensTronc(epaule, hanche, parNom.nose, oreille, seuil);
    return {
      cote,
      confianceCote: confianceCote(parNom, cote),
      score: scorePosture(angleC, angleT),
      cou: {
        label: CONFIG.cou.label,
        angle: angleC,
        niveau: niveauC,
        couleur: COULEURS[niveauC],
        texte: phrase(CONFIG.cou.label, angleC, niveauC)
      },
      tronc: {
        label: CONFIG.tronc.label,
        angle: angleT,
        niveau: niveauT,
        couleur: COULEURS[niveauT],
        texte: phrase(CONFIG.tronc.label, angleT, niveauT),
        sens: sensT
      }
    };
  }
  function phrase(label, angle, niveau) {
    if (niveau === "gris" || angle === null) {
      return label + " : non mesurable (point absent ou peu fiable)";
    }
    return label + " : " + angle.toFixed(0) + "° — " + TEXTE_STATUT[niveau];
  }
  function couleurPoint(kp, analyse, noms, seuil) {
    if (!pointFiable(kp, seuil)) return COULEURS.gris;
    if (!kp.name) return "#ffffff";
    if (kp.name === noms.oreille) return analyse.cou.couleur;
    if (kp.name === noms.hanche) return analyse.tronc.couleur;
    if (kp.name === noms.epaule) {
      return pireCouleur(analyse.cou.niveau, analyse.tronc.niveau);
    }
    return "#ffffff";
  }
  var ORDRE_GRAVITE = { vert: 0, orange: 1, rouge: 2, gris: -1 };
  function pireCouleur(a, b) {
    const na = ORDRE_GRAVITE[a];
    const nb = ORDRE_GRAVITE[b];
    if (na < 0 && nb < 0) return COULEURS.gris;
    return COULEURS[na >= nb ? a : b];
  }
  function creerLisseur(fenetre2, seuil) {
    const taille = fenetre2 || CONFIG.lissageFenetre;
    const seuilMin = seuil === void 0 ? CONFIG.minKeypointScore : seuil;
    let historique = {};
    return {
      lisser(keypoints) {
        if (taille <= 1 || !keypoints) return keypoints || [];
        return keypoints.map((kp) => {
          const nom = kp?.name;
          if (!kp || !nom) return kp;
          if (!pointFiable(kp, seuilMin)) {
            delete historique[nom];
            return kp;
          }
          const h = historique[nom] || (historique[nom] = []);
          h.push({ x: kp.x, y: kp.y });
          if (h.length > taille) h.shift();
          let sx = 0;
          let sy = 0;
          for (const p of h) {
            sx += p.x;
            sy += p.y;
          }
          return { name: nom, score: kp.score, x: sx / h.length, y: sy / h.length };
        });
      },
      reinitialiser() {
        historique = {};
      }
    };
  }

  // src/page/pose.ts
  var fenetre = window;
  function element(id) {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Élément #${id} absent de pose.html`);
    return el;
  }
  var video = element("video");
  var canvas = element("overlay");
  var scene = element("scene");
  var ctx = canvas.getContext("2d");
  var elEtat = element("etat");
  var elFps = element("fps");
  var elCou = element("cou");
  var elTronc = element("tronc");
  var elCote = element("cote");
  var SEUIL = CONFIG.minKeypointScore;
  var lisseur = creerLisseur();
  var suiveurCote = creerSuiveurCote();
  var MODE_SESSION = /[?&]mode=session\b/.test(location.search);
  if (MODE_SESSION) document.body.classList.add("session");
  var enPause = false;
  var INTERVALLE_ENVOI_MS = 250;
  var dernierEnvoi = 0;
  function envoyer(message) {
    try {
      fenetre.ReactNativeWebView?.postMessage(JSON.stringify(message));
    } catch {
    }
  }
  function envoyerMesure(analyse) {
    const maintenant = performance.now();
    if (maintenant - dernierEnvoi < INTERVALLE_ENVOI_MS) return;
    dernierEnvoi = maintenant;
    if (!analyse) {
      envoyer({ type: "mesure", personne: false });
      return;
    }
    envoyer({
      type: "mesure",
      personne: true,
      cote: analyse.cote,
      score: analyse.score,
      cou: { angle: analyse.cou.angle, niveau: analyse.cou.niveau },
      tronc: {
        angle: analyse.tronc.angle,
        niveau: analyse.tronc.niveau,
        sens: analyse.tronc.sens
      }
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
    }
  };
  function etat(texte, estErreur = false) {
    elEtat.textContent = texte;
    elEtat.className = estErreur ? "etat erreur" : "etat";
    envoyer({ type: estErreur ? "erreur" : "etat", message: texte });
  }
  function echec(etape, err) {
    const msg = etape + " : " + (err instanceof Error ? err.name + " — " + err.message : String(err));
    etat(msg, true);
    throw err;
  }
  async function demarrerCamera() {
    if (!window.isSecureContext) {
      etat(
        "Contexte NON sécurisé (" + location.protocol + "//" + location.host + "). getUserMedia est indisponible : il faut du https. Relance avec « npx expo start --tunnel ».",
        true
      );
      return false;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      etat("navigator.mediaDevices.getUserMedia absent de cette WebView.", true);
      return false;
    }
    etat("Demande d’accès à la caméra…");
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        // Caméra frontale : le téléphone est posé de profil, écran vers soi,
        // pour pouvoir regarder les points. Mettre 'environment' pour l'arrière.
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }
      });
    } catch (err) {
      echec("Caméra refusée ou indisponible", err);
    }
    video.srcObject = stream;
    await new Promise((resolve) => {
      if (video.readyState >= 2) return resolve();
      video.onloadedmetadata = () => resolve();
    });
    await video.play();
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    scene.style.aspectRatio = video.videoWidth + " / " + video.videoHeight;
    etat("Caméra OK (" + video.videoWidth + "×" + video.videoHeight + ").");
    return true;
  }
  async function chargerModele() {
    etat("Chargement du backend WebGL…");
    try {
      await tf.setBackend("webgl");
      await tf.ready();
    } catch (err) {
      echec("Backend WebGL indisponible", err);
    }
    etat("Téléchargement du modèle MoveNet…");
    try {
      return await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
      });
    } catch (err) {
      echec("Chargement de MoveNet", err);
    }
  }
  function dessiner(keypoints, analyse) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const parNom = indexerPoints(keypoints);
    const noms = POINTS_PAR_COTE[analyse.cote];
    segment(parNom[noms.epaule], parNom[noms.oreille], analyse.cou.couleur);
    segment(parNom[noms.epaule], parNom[noms.hanche], analyse.tronc.couleur);
    const rayon = Math.max(5, canvas.width / 70);
    for (const kp of [parNom[noms.oreille], parNom[noms.epaule], parNom[noms.hanche]]) {
      if (!pointFiable(kp, SEUIL)) continue;
      ctx.fillStyle = couleurPoint(kp, analyse, noms, SEUIL);
      ctx.beginPath();
      ctx.arc(kp.x, kp.y, rayon, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.stroke();
    }
  }
  function segment(a, b, couleur) {
    if (!pointFiable(a, SEUIL) || !pointFiable(b, SEUIL)) return;
    ctx.strokeStyle = couleur;
    ctx.lineWidth = Math.max(4, canvas.width / 90);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  function afficherStatut(analyse) {
    elCou.textContent = analyse.cou.texte;
    elCou.style.color = analyse.cou.couleur;
    elTronc.textContent = analyse.tronc.texte;
    elTronc.style.color = analyse.tronc.couleur;
    elCote.textContent = "côté " + analyse.cote + " (confiance " + (analyse.confianceCote || 0).toFixed(2) + ")";
  }
  function statutVide(texte) {
    elCou.textContent = texte;
    elCou.style.color = COULEURS.gris;
    elTronc.textContent = "";
    elCote.textContent = "";
  }
  async function boucle(detecteur) {
    let dernierAffichage = performance.now();
    let frames = 0;
    async function tour() {
      if (enPause) {
        requestAnimationFrame(tour);
        return;
      }
      let poses;
      try {
        poses = await detecteur.estimatePoses(video, { flipHorizontal: false });
      } catch (err) {
        etat("Inférence échouée : " + (err instanceof Error ? err.message : String(err)), true);
        return;
      }
      const brut = poses[0]?.keypoints;
      if (brut) {
        const keypoints = lisseur.lisser(brut);
        const analyse = analyser(keypoints, { cote: suiveurCote.choisir(keypoints) });
        dessiner(keypoints, analyse);
        afficherStatut(analyse);
        envoyerMesure(analyse);
      } else {
        lisseur.reinitialiser();
        suiveurCote.reinitialiser();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        statutVide("Personne détectée : non mesurable");
        envoyerMesure(null);
      }
      frames++;
      const maintenant = performance.now();
      if (maintenant - dernierAffichage >= 500) {
        const fps = frames * 1e3 / (maintenant - dernierAffichage);
        elFps.textContent = fps.toFixed(1) + " FPS";
        frames = 0;
        dernierAffichage = maintenant;
      }
      requestAnimationFrame(tour);
    }
    requestAnimationFrame(tour);
  }
  async function main() {
    try {
      if (typeof tf === "undefined" || typeof poseDetection === "undefined") {
        etat("TensorFlow.js non chargé : vérifie la connexion internet du téléphone.", true);
        return;
      }
      const cameraOk = await demarrerCamera();
      if (!cameraOk) return;
      const detecteur = await chargerModele();
      etat("Modèle prêt — backend " + tf.getBackend() + ".");
      envoyer({ type: "pret", message: "camera + movenet OK" });
      await boucle(detecteur);
    } catch {
    }
  }
  void main();
})();
