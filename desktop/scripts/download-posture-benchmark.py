"""Download a reproducible public synthetic evaluation sample, never train on it."""
import hashlib, json, random, time, urllib.parse, urllib.request, urllib.error
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]/'output'/'posture-benchmark'/'dataset'
ROOT.mkdir(parents=True,exist_ok=True)
DATASET='SeiyaCM/KandenAiHackathonPosture2'
def get_json(params,endpoint='rows'):
    url='https://datasets-server.huggingface.co/'+endpoint+'?'+urllib.parse.urlencode({'dataset':DATASET,'config':'default','split':'train',**params})
    for attempt in range(8):
        try: return json.load(urllib.request.urlopen(url,timeout=60))
        except urllib.error.HTTPError as e:
            if e.code!=429 or attempt==7: raise
            print('API rate limit: waiting 60 seconds',flush=True);time.sleep(60)
if __name__=='__main__':
    if (ROOT/'manifest.json').exists():
        saved=json.loads((ROOT/'manifest.json').read_text(encoding='utf8'))
        if len(saved['rows'])==120 and all((ROOT/r['file']).exists() and hashlib.sha256((ROOT/r['file']).read_bytes()).hexdigest()==r['sha256'] for r in saved['rows']):
            print('120 cached images verified by SHA-256');raise SystemExit(0)
    # Four fixed, widely separated windows limit API requests. This is a pilot
    # sample, not a representative random sample of the complete dataset.
    rows=[]; counts={k:0 for k in ['01_good','02_slouch','03_chin_rest','04_stretch']}
    rng=random.Random(20261012)
    for start in [2000,17000,32000,47000]:
        window=get_json({'offset':start,'length':100})['rows']
        rng.shuffle(window)
        for item in window:
            row=item['row']; label=row['label']
            if counts[label]>=30: continue
            path=ROOT/f"{item['row_idx']:05d}.jpg"
            if not path.exists(): path.write_bytes(urllib.request.urlopen(row['image']['src'],timeout=60).read())
            rows.append({'id':item['row_idx'],'file':path.name,'label':label,'prompt':row['prompt'],'width':row['image']['width'],'height':row['image']['height'],'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
            counts[label]+=1
        print(counts,flush=True)
    if min(counts.values())!=30: raise RuntimeError('Dataset class layout changed. Review sampling before proceeding.')
    manifest={'dataset':DATASET,'source':'https://huggingface.co/datasets/'+DATASET,'license':'MIT (dataset card)','synthetic':True,'seed':20261012,'selection':'30 shuffled rows per class from fixed 100-row windows at 2000,17000,32000,47000; convenience pilot, not representative','rows':rows}
    (ROOT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8')
    print('Downloaded',len(rows),flush=True)
