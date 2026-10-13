from pathlib import Path
p=Path(__file__).parent
for name in ['mini-pc.html','fenetre-pc.html']:
    f=p/name
    s=f.read_text(encoding='utf-8')
    s=s.replace('<button id="open-web"', '<button id="expand-mini" class="icon expand-mini" aria-label="Déplier la fenêtre vers le haut" aria-expanded="false" aria-controls="mini-details">⌃</button><button id="open-web"')
    s=s.replace('<p id="camera-message"', '''<section id="mini-details" class="mini-details" hidden aria-label="Détails de la session"><div class="detail-heading"><strong>Votre session</strong><time id="mini-elapsed">00:00</time></div><p id="mini-advice">Démarrez une session pour suivre votre posture.</p><dl><div><dt>Tête</dt><dd id="detail-head">—</dd></div><div><dt>Épaules</dt><dd id="detail-shoulders">—</dd></div><div><dt>Buste</dt><dd id="detail-torso">—</dd></div></dl><small>Posture simulée · aperçu caméra en direct lorsqu’elle est active</small></section><p id="camera-message"''')
    f.write_text(s,encoding='utf-8')
