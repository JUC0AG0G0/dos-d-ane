"""Exhaustive integrity checks and grouped uncertainty for the full benchmark."""
import collections,csv,json,math,re,statistics
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parents[2]/'output'/'posture-benchmark-full'
MODELS=['mediapipe','movenet','yolo']
LABELS=['01_good','02_slouch','03_chin_rest','04_stretch']
def ratio(a,b):return a/b if b else None
def percentile(x,q):return float(np.quantile(x,q)) if x else None
def main():
    manifests=sorted((ROOT/'manifests').glob('*.json'))
    assert len(manifests)==136,'Download incomplete'
    references={}
    for path in manifests:
        for row in json.loads(path.read_text(encoding='utf8'))['rows']:
            assert row['id'] not in references
            references[row['id']]=row
    assert set(references)==set(range(52500))
    counts=collections.Counter(r['label'] for r in references.values())
    group_for={i:re.sub(r'_var\d+\.[^.]+$','',r.get('source_path') or str(i)) for i,r in references.items()}
    groups=sorted(set(group_for.values()));gindex={g:i for i,g in enumerate(groups)}
    # Per group: correct good, total good, correct slouch, total slouch.
    grouped=np.zeros((3,len(groups),4),dtype=np.int64)
    timing_rows=json.loads((ROOT/'timing-results.json').read_text(encoding='utf8'))['results']
    assert len(timing_rows)==360 and not any(r.get('error') for r in timing_rows)
    timing_by_model={m:{r['id']:r for r in timing_rows if r['model']==m} for m in MODELS}
    assert all(len(rows)==120 for rows in timing_by_model.values())
    summary={};repeated_state_differences=collections.Counter()
    with (ROOT/'results.csv').open('w',newline='',encoding='utf-8-sig') as handle:
        writer=csv.DictWriter(handle,fieldnames=['id','label','model','state','coverage','view','head','neck','shoulders','torso','totalMs','poseMs','backend','error'])
        writer.writeheader()
        for mi,model in enumerate(MODELS):
            seen=set();classes={l:collections.Counter() for l in LABELS};timing=[];pose=[];backends=set();coverage=collections.Counter();errors=0;binary2d=0
            for shard in range(136):
                file=ROOT/'results'/f'{model}-{shard:03d}.json'
                assert file.exists(),f'Missing {file.name}'
                data=json.loads(file.read_text(encoding='utf8'))
                for row in data['results']:
                    i=row['id'];assert i not in seen;seen.add(i)
                    assert row['label']==references[i]['label'] and row['model']==model
                    a=row.get('assessment',{});state=a.get('state','unknown');label=row['label'];classes[label][state]+=1
                    if i in timing_by_model[model]:
                        repeated_state_differences[model]+=state!=timing_by_model[model][i]['assessment']['state']
                    if row.get('error'):errors+=1
                    if label in LABELS[:2]:
                        gi=gindex[group_for[i]];col=0 if label=='01_good' else 2
                        correct=state=='good' if col==0 else state in ['warning','bad']
                        grouped[mi,gi,col]+=correct;grouped[mi,gi,col+1]+=1
                        state2d=row.get('assessment2d',{}).get('state','unknown')
                        binary2d+=int(state2d=='good' if col==0 else state2d in ['warning','bad'])
                    t=row.get('measurements',[{}])[0]
                    if t:
                        timing.append(t['totalMs']);pose.append(t['poseMs']);backends.add(row['backend'])
                        for key,val in a['regions'].items():coverage[key]+=val!='unknown'
                        coverage['neckForward']+=a['measurementCoverage']['neckForward']
                    writer.writerow({'id':i,'label':label,'model':model,'state':state,'coverage':a.get('coverage'),'view':a.get('view'),**a.get('regions',{}),'totalMs':t.get('totalMs'),'poseMs':t.get('poseMs'),'backend':row.get('backend'),'error':row.get('error')})
            assert seen==set(references),f'Incomplete {model}'
            good=classes['01_good'];slouch=classes['02_slouch'];tp=slouch['warning']+slouch['bad'];tn=good['good'];fp=good['warning']+good['bad'];n=counts['01_good']+counts['02_slouch'];abstain=good['unknown']+slouch['unknown'];correct=tn+tp
            summary[model]={'n':52500,'errors':errors,'backends':sorted(backends),'binaryN':n,'correct':correct,'agreementAll':correct/n,'balancedAccuracy':(tn/counts['01_good']+tp/counts['02_slouch'])/2,'decided':n-abstain,'coverageBinary':(n-abstain)/n,'agreementDecided':ratio(correct,n-abstain),'sensitivityAll':tp/counts['02_slouch'],'falseAlertRate':fp/counts['01_good'],'classes':classes,'medianMs':statistics.median(timing),'p95Ms':percentile(timing,.95),'poseMedianMs':statistics.median(pose),'regionCoverage':{k:coverage[k]/52500 for k in ['head','neck','shoulders','torso']},'neckForwardCoverage':coverage['neckForward']/52500,'agreement2d':binary2d/n,'confusion':{'01_good':{'good':tn,'alert':fp,'unknown':good['unknown']},'02_slouch':{'good':slouch['good'],'alert':tp,'unknown':slouch['unknown']}}}
    # Resample source-pose groups within each binary label. Pairing is preserved
    # across models. A filename-derived group is a proxy, not a participant ID.
    rng=np.random.default_rng(20261012);boot=np.zeros((2000,3,2))
    good_groups=np.flatnonzero(grouped[0,:,1]>0);bad_groups=np.flatnonzero(grouped[0,:,3]>0)
    for b in range(2000):
        good_sample=rng.choice(good_groups,len(good_groups),replace=True);bad_sample=rng.choice(bad_groups,len(bad_groups),replace=True)
        for mi in range(3):
            g=grouped[mi,good_sample].sum(axis=0);s=grouped[mi,bad_sample].sum(axis=0)
            boot[b,mi]=[(g[0]+s[2])/(g[1]+s[3]),(g[0]/g[1]+s[2]/s[3])/2]
    for mi,m in enumerate(MODELS):
        summary[m]['agreementCluster95']=np.quantile(boot[:,mi,0],[.025,.975]).tolist()
        summary[m]['balancedCluster95']=np.quantile(boot[:,mi,1],[.025,.975]).tolist()
        summary[m]['bulkTiming']={k:summary[m][k] for k in ['medianMs','p95Ms','poseMedianMs']}
        sequential=[statistics.median(t['totalMs'] for t in r['measurements']) for r in timing_by_model[m].values()]
        sequential_pose=[statistics.median(t['poseMs'] for t in r['measurements']) for r in timing_by_model[m].values()]
        summary[m].update(medianMs=statistics.median(sequential),p95Ms=percentile(sequential,.95),poseMedianMs=statistics.median(sequential_pose),repeatedStateDifferencesOn120=repeated_state_differences[m])
    pairs={f'{MODELS[a]}-minus-{MODELS[b]}':np.quantile(boot[:,a,1]-boot[:,b,1],[.025,.975]).tolist() for a,b in [(2,0),(2,1),(0,1)]}
    report={'counts':dict(counts),'images':52500,'modelImagePairs':157500,'sourcePoseGroups':len(groups),'grouping':'source_path prefix before _varNNNN; proxy for shared source pose, not independent people','bootstrap':{'replicates':2000,'seed':20261012,'method':'paired and stratified cluster bootstrap by filename source pose','pairedBalancedDifferences95':pairs},'uniqueImageHashes':len(set(r['sha256'] for r in references.values())),'models':summary}
    report['timingProtocol']={'images':120,'repeats':3,'aggregation':'median per image, then median and p95 across images','execution':'sequential, after exhaustive parallel inference and download completed','selection':'30 per label, seeded 20261012; original images, independent of pilot JPEG sample'}
    (ROOT/'summary.json').write_text(json.dumps(report,indent=2),encoding='utf8')
    print(json.dumps(report,indent=2))
if __name__=='__main__':main()
