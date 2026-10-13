/*
 * Caméra -> MoveNet (TensorFlow.js) -> points dessinés sur un canvas.
 * Aucune image n'est enregistrée ni envoyée : les frames servent au rendu et à
 * l'inférence, puis sont jetées. Seules les librairies et le modèle sont
 * téléchargés (CDN jsDelivr + storage.googleapis.com), au premier chargement.
 */
(function () {
  'use strict';

  var video = document.getElementById('video');
  var canvas = document.getElementById('overlay');
  var scene = document.getElementById('scene');
  var ctx = canvas.getContext('2d');

  var elEtat = document.getElementById('etat');
  var elFps = document.getElementById('fps');
  var elCou = document.getElementById('cou');
  var elTronc = document.getElementById('tronc');
  var elCote = document.getElementById('cote');

  var SEUIL = Posture.CONFIG.minKeypointScore;
  var lisseur = Posture.creerLisseur();
  var suiveurCote = Posture.creerSuiveurCote();

  // Mode « session » (pose.html?mode=session) : la page est intégrée dans
  // l'écran de session de l'app, qui affiche lui-même les mesures. Le panneau
  // de texte est masqué et les mesures sont envoyées à l'app.
  var MODE_SESSION = /[?&]mode=session\b/.test(location.search);
  if (MODE_SESSION) document.body.classList.add('session');

  // En pause, la caméra reste ouverte mais plus aucune image n'est analysée.
  var enPause = false;

  // Les mesures partent vers l'app 4 fois par seconde au plus : assez pour un
  // affichage vivant, sans saturer le pont WebView -> React Native.
  var INTERVALLE_ENVOI_MS = 250;
  var dernierEnvoi = 0;

  /** Envoie un objet à l'app React Native, si la page tourne dans une WebView. */
  function envoyer(objet) {
    try {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(objet));
      }
    } catch (e) {
      /* sans conséquence : la page marche aussi ouverte dans Safari */
    }
  }

  /** Remonte un message d'état ou d'erreur vers l'app (diagnostic). */
  function versApp(type, message) {
    envoyer({ type: type, message: message });
  }

  /** Mesures du moment ; `analyse` à null quand personne n'est détecté. */
  function envoyerMesure(analyse) {
    var maintenant = performance.now();
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
      score: analyse.score,
      cou: { angle: analyse.cou.angle, niveau: analyse.cou.niveau },
      tronc: {
        angle: analyse.tronc.angle,
        niveau: analyse.tronc.niveau,
        sens: analyse.tronc.sens,
      },
    });
  }

  // Commandes appelées par l'app (injectJavaScript) : bouton Pause / Reprendre.
  window.PoseControle = {
    pause: function () {
      enPause = true;
      lisseur.reinitialiser();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    reprendre: function () {
      enPause = false;
    },
  };

  function etat(texte, estErreur) {
    elEtat.textContent = texte;
    elEtat.className = estErreur ? 'etat erreur' : 'etat';
    versApp(estErreur ? 'erreur' : 'etat', texte);
  }

  function echec(etape, err) {
    var msg = etape + ' : ' + ((err && (err.name + ' — ' + err.message)) || String(err));
    etat(msg, true);
    throw err;
  }

  // ---------------------------------------------------------------------------
  // 1. Caméra
  // ---------------------------------------------------------------------------
  async function demarrerCamera() {
    // getUserMedia n'existe que dans un CONTEXTE SÉCURISÉ (https:// ou
    // localhost). Sur une URL http:// en IP locale, l'API est absente.
    if (!window.isSecureContext) {
      etat(
        "Contexte NON sécurisé (" +
          location.protocol +
          '//' +
          location.host +
          "). getUserMedia est indisponible : il faut du https. Relance avec « npx expo start --tunnel ».",
        true
      );
      return false;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      etat('navigator.mediaDevices.getUserMedia absent de cette WebView.', true);
      return false;
    }

    etat('Demande d’accès à la caméra…');
    var stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        // Caméra frontale : le téléphone est posé de profil, écran vers soi,
        // pour pouvoir regarder les points. Mettre 'environment' pour l'arrière.
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
    } catch (err) {
      echec('Caméra refusée ou indisponible', err);
    }

    video.srcObject = stream;
    await new Promise(function (resolve) {
      if (video.readyState >= 2) return resolve();
      video.onloadedmetadata = function () {
        resolve();
      };
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
  async function chargerModele() {
    etat('Chargement du backend WebGL…');
    try {
      await tf.setBackend('webgl');
      await tf.ready();
    } catch (err) {
      echec('Backend WebGL indisponible', err);
    }

    etat('Téléchargement du modèle MoveNet…');
    try {
      return await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      });
    } catch (err) {
      echec('Chargement de MoveNet', err);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. Dessin
  // ---------------------------------------------------------------------------
  function dessiner(keypoints, analyse) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var parNom = Posture.indexerPoints(keypoints);
    var noms = Posture.POINTS_PAR_COTE[analyse.cote] || Posture.POINTS_PAR_COTE.gauche;

    // Seuls les points mesurés sont dessinés, du côté filmé : oreille, épaule,
    // hanche, reliés par la nuque (oreille-épaule) et le tronc (épaule-hanche).
    // Les 14 autres points de MoveNet ne servent à aucune mesure.
    segment(parNom[noms.epaule], parNom[noms.oreille], analyse.cou.couleur);
    segment(parNom[noms.epaule], parNom[noms.hanche], analyse.tronc.couleur);

    var rayon = Math.max(5, canvas.width / 70);
    var mesures = [parNom[noms.oreille], parNom[noms.epaule], parNom[noms.hanche]];
    for (var j = 0; j < mesures.length; j++) {
      var kp = mesures[j];
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

  function segment(a, b, couleur) {
    if (!Posture.pointFiable(a, SEUIL) || !Posture.pointFiable(b, SEUIL)) return;
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
    elCote.textContent =
      'côté ' + analyse.cote + ' (confiance ' + (analyse.confianceCote || 0).toFixed(2) + ')';
  }

  function statutVide(texte) {
    elCou.textContent = texte;
    elCou.style.color = Posture.COULEURS.gris;
    elTronc.textContent = '';
    elCote.textContent = '';
  }

  // ---------------------------------------------------------------------------
  // 4. Boucle
  // ---------------------------------------------------------------------------
  async function boucle(detecteur) {
    var dernierAffichage = performance.now();
    var frames = 0;

    async function tour() {
      if (enPause) {
        requestAnimationFrame(tour);
        return;
      }

      var poses;
      try {
        poses = await detecteur.estimatePoses(video, { flipHorizontal: false });
      } catch (err) {
        etat('Inférence échouée : ' + err.message, true);
        return;
      }

      if (poses && poses.length && poses[0].keypoints) {
        var keypoints = lisseur.lisser(poses[0].keypoints);
        var analyse = Posture.analyser(keypoints, { cote: suiveurCote.choisir(keypoints) });
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
      var maintenant = performance.now();
      if (maintenant - dernierAffichage >= 500) {
        var fps = (frames * 1000) / (maintenant - dernierAffichage);
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
    try {
      if (typeof tf === 'undefined' || typeof poseDetection === 'undefined') {
        etat('TensorFlow.js non chargé : vérifie la connexion internet du téléphone.', true);
        return;
      }
      var cameraOk = await demarrerCamera();
      if (!cameraOk) return;
      var detecteur = await chargerModele();
      etat('Modèle prêt — backend ' + tf.getBackend() + '.');
      versApp('pret', 'camera + movenet OK');
      await boucle(detecteur);
    } catch (err) {
      /* le message est déjà affiché par echec() */
    }
  }

  main();
})();
