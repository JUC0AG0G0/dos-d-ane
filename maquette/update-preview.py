from pathlib import Path
p=Path(__file__).parent
html=(p/'mini-pc.html').read_text(encoding='utf-8')
html=html.replace('Maquette interactive · Sans caméra','Maquette interactive · Posture simulée')
html=html.replace('<i id="dot"></i>', '''<div class="head-preview" id="head-preview"><video id="head-video" autoplay playsinline muted aria-label="Aperçu de votre caméra"></video><svg id="head-placeholder" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="29" r="13"/><path d="M15 75v-9c0-15 50-15 50 0v9"/></svg><span id="preview-label">Caméra</span><i id="dot"></i></div>''')
html=html.replace('<div id="menu"', '<p id="camera-message" class="camera-message" role="status" hidden></p><div id="menu"')
for name in ['mini-pc.html','fenetre-pc.html']:(p/name).write_text(html,encoding='utf-8')
