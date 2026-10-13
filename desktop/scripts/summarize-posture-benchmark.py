"""Metrics against dataset labels, with abstentions explicitly counted."""
import csv,json,math,statistics,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]/'output'/'posture-benchmark'
def percentile(values,q):
    x=sorted(values); p=(len(x)-1)*q; lo=math.floor(p); hi=math.ceil(p)
    return x[lo]+(x[hi]-x[lo])*(p-lo) if x else None
def wilson(k,n):
    if not n:return [None,None]
    z=1.96;p=k/n;d=1+z*z/n;c=(p+z*z/(2*n))/d;r=z*math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d
    return [c-r,c+r]
def summarize(raw):
    output={}
    for model in ['mediapipe','movenet','yolo']:
        rows=[r for r in raw['results'] if r['model']==model]
        usable=[r for r in rows if 'error' not in r]
        binary=[r for r in rows if r['label'] in ['01_good','02_slouch']]
        confusion={label:{key:0 for key in ['good','alert','unknown']} for label in ['01_good','02_slouch']}
        classes={label:{key:0 for key in ['good','warning','bad','unknown']} for label in ['01_good','02_slouch','03_chin_rest','04_stretch']}
        for r in rows:
            state=r.get('assessment',{}).get('state','unknown');classes[r['label']][state]+=1
            if r in binary:confusion[r['label']]['alert' if state in ['warning','bad'] else state]+=1
        correct=confusion['01_good']['good']+confusion['02_slouch']['alert']
        decided=sum(sum(v[k] for k in ['good','alert']) for v in confusion.values())
        total=[statistics.median(t['totalMs'] for t in r['measurements']) for r in usable]
        pose=[statistics.median(t['poseMs'] for t in r['measurements']) for r in usable]
        output[model]={'n':len(rows),'errors':len(rows)-len(usable),'backends':sorted(set(r['backend'] for r in usable)),
          'binaryN':len(binary),'correct':correct,'agreementAll':correct/len(binary),'agreementWilson95':wilson(correct,len(binary)),
          'decided':decided,'agreementDecided':correct/decided if decided else None,'coverageBinary':decided/len(binary),
          'sensitivityAll':confusion['02_slouch']['alert']/sum(confusion['02_slouch'].values()),
          'falseAlertRate':confusion['01_good']['alert']/sum(confusion['01_good'].values()),
          'confusion':confusion,'classes':classes,'medianMs':statistics.median(total) if total else None,'p95Ms':percentile(total,.95),
          'poseMedianMs':statistics.median(pose) if pose else None,
          'regionCoverage':{key:sum(r['assessment']['regions'][key]!='unknown' for r in usable)/len(rows) for key in ['head','neck','shoulders','torso']},
          'neckForwardCoverage':sum(r['assessment']['measurementCoverage']['neckForward'] for r in usable)/len(rows)}
    return output
if __name__=='__main__':
    raw=json.loads((ROOT/'raw-results.json').read_text(encoding='utf8')); summary=summarize(raw)
    (ROOT/'summary.json').write_text(json.dumps(summary,indent=2),encoding='utf8')
    repo=Path(__file__).resolve().parents[2]
    paths=[repo/'desktop'/p for p in ['src/models.js','src/pose.js','src/benchmark.js','package-lock.json','public/models/pose_landmarker_lite.task','public/models/face_landmarker.task','public/models/yolov8n-pose.onnx']]
    provenance={str(p.relative_to(repo)):hashlib.sha256(p.read_bytes()).hexdigest() for p in paths if p.exists()}
    (ROOT/'sha256-code-models.json').write_text(json.dumps(provenance,indent=2),encoding='utf8')
    ablated={**raw,'results':[{**r,'assessment':r.get('assessment2d',r.get('assessment',{}))} for r in raw['results']]}
    (ROOT/'summary-2d.json').write_text(json.dumps(summarize(ablated),indent=2),encoding='utf8')
    with (ROOT/'results.csv').open('w',newline='',encoding='utf-8-sig') as f:
        fields=['id','label','model','state','coverage','view','head','neck','shoulders','torso','medianMs','backend','error']
        writer=csv.DictWriter(f,fieldnames=fields);writer.writeheader()
        for r in raw['results']:
            a=r.get('assessment',{});writer.writerow({**{k:r.get(k,'') for k in ['id','label','model','backend','error']},**{k:a.get(k,'') for k in ['state','coverage','view']},**a.get('regions',{}),'medianMs':statistics.median(t['totalMs'] for t in r['measurements']) if r.get('measurements') else ''})
    print(json.dumps(summary,indent=2))
