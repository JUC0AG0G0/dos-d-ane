"""Aggregate three independent detector progress files."""
import json,time
from datetime import datetime,timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'output'/'posture-benchmark-full'
MODELS=['mediapipe','movenet','yolo']
while True:
    statuses={}
    for model in MODELS:
        file=ROOT/f'run-status-{model}.json'
        if file.exists():statuses[model]=json.loads(file.read_text(encoding='utf8'))
    complete=len(statuses)==3 and all(s['phase']=='complete' and s['done']==52500 for s in statuses.values())
    failed=any(s['phase']=='failed' for s in statuses.values())
    status={'phase':'complete' if complete else 'failed' if failed else 'running-parallel','done':sum(s.get('done',0) for s in statuses.values()),'total':157500,'models':statuses,'updated':datetime.now(timezone.utc).isoformat()}
    temp=ROOT/'run-status.json.tmp';temp.write_text(json.dumps(status),encoding='utf8');temp.replace(ROOT/'run-status.json')
    if complete or failed:print(json.dumps(status));break
    time.sleep(10)
