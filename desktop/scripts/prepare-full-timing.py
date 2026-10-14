"""Choose a reproducible, class-balanced subset of original images for timing."""
import json,random
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'output'/'posture-benchmark-full'
rows=[]
for shard in range(136):rows.extend(json.loads((ROOT/'manifests'/f'{shard:03d}.json').read_text(encoding='utf8'))['rows'])
assert len(rows)==52500
rng=random.Random(20261012)
selected=[]
for label in ['01_good','02_slouch','03_chin_rest','04_stretch']:
    selected.extend(rng.sample([r for r in rows if r['label']==label],30))
manifest={'dataset':'SeiyaCM/KandenAiHackathonPosture2','revision':'4a2d8a14a3b3fac0835d503db86e83abcfd703ea','selection':'30 original images per class, random.Random(20261012), after complete download','rows':selected}
(ROOT/'timing-manifest.json').write_text(json.dumps(manifest),encoding='utf8')
print('Prepared',len(selected),'original images')
