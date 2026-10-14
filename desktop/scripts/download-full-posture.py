"""Acquire every row of a pinned dataset revision, with shard checkpoints."""
import collections, hashlib, io, json, time, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import pyarrow.parquet as pq
from huggingface_hub import hf_hub_download
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]/'output'/'posture-benchmark-full'
DATASET='SeiyaCM/KandenAiHackathonPosture2'
REVISION='4a2d8a14a3b3fac0835d503db86e83abcfd703ea'
for folder in ['dataset','manifests','downloads']: (ROOT/folder).mkdir(parents=True,exist_ok=True)
def atomic(path,data):
    temp=path.with_suffix(path.suffix+'.tmp');temp.write_text(json.dumps(data,ensure_ascii=False),encoding='utf8');temp.replace(path)
def main():
    index=ROOT/'source-index.json'
    if index.exists(): files=json.loads(index.read_text())
    else:
        files=json.load(urllib.request.urlopen(f'https://huggingface.co/api/datasets/{DATASET}/tree/{REVISION}/data?limit=1000'))
        atomic(index,files)
    files=sorted(files,key=lambda x:x['path'])
    def fetch_shard(entry):
        for attempt in range(8):
            try:return Path(hf_hub_download(DATASET,entry['path'],repo_type='dataset',revision=REVISION,local_dir=str(ROOT/'downloads')))
            except Exception as e:
                if attempt==7:raise
                print(type(e).__name__,'download retry in 60s',flush=True);time.sleep(60)
    pool=ThreadPoolExecutor(max_workers=3);pending={}
    def queue_from(index):
        for j in range(index,min(index+3,len(files))):
            if j not in pending and not (ROOT/'manifests'/f'{j:03d}.json').exists():pending[j]=pool.submit(fetch_shard,files[j])
    offset=0;counts=collections.Counter()
    for shard,entry in enumerate(files):
        checkpoint=ROOT/'manifests'/f'{shard:03d}.json'
        if checkpoint.exists():
            saved=json.loads(checkpoint.read_text(encoding='utf8'));offset+=len(saved['rows']);counts.update(r['label'] for r in saved['rows']);continue
        print('DOWNLOAD',shard,entry['path'],flush=True)
        queue_from(shard);local=pending.pop(shard).result()
        digest=hashlib.file_digest(local.open('rb'),'sha256').hexdigest() if hasattr(hashlib,'file_digest') else None
        if digest is None:
            h=hashlib.sha256()
            with local.open('rb') as f:
                for chunk in iter(lambda:f.read(8*1024*1024),b''):h.update(chunk)
            digest=h.hexdigest()
        expected=entry.get('lfs',{}).get('oid')
        if expected and digest!=expected:raise RuntimeError('Shard SHA-256 mismatch')
        rows=[];parquet=pq.ParquetFile(local)
        for batch in parquet.iter_batches(batch_size=8):
            for row in batch.to_pylist():
                payload=row['image']['bytes'];img=Image.open(io.BytesIO(payload));ext='png' if img.format=='PNG' else 'jpg'
                filename=f'{offset:05d}.{ext}';target=ROOT/'dataset'/filename
                if not target.exists() or hashlib.sha256(target.read_bytes()).digest()!=hashlib.sha256(payload).digest():
                    temp=target.with_suffix('.tmp');temp.write_bytes(payload);temp.replace(target)
                rows.append({'id':offset,'file':filename,'label':row['label'],'prompt':row.get('prompt',''),'width':img.width,'height':img.height,'sha256':hashlib.sha256(payload).hexdigest(),'source_path':row['image'].get('path')})
                offset+=1;counts[row['label']]+=1
        parquet.close()
        atomic(checkpoint,{'dataset':DATASET,'revision':REVISION,'shard':shard,'source':entry['path'],'sha256':digest,'rows':rows})
        atomic(ROOT/'download-status.json',{'phase':'downloading','shards':shard+1,'images':offset,'expected':52500,'counts':dict(counts)})
        # Only remove the verified temporary shard created by this downloader.
        if not local.resolve().is_relative_to((ROOT/'downloads').resolve()):raise RuntimeError('Unsafe temporary path')
        local.unlink()
        print('READY',shard,offset,dict(counts),flush=True)
    if offset!=52500:raise RuntimeError(f'Unexpected dataset count: {offset}')
    pool.shutdown()
    atomic(ROOT/'download-status.json',{'phase':'complete','shards':len(files),'images':offset,'expected':52500,'counts':dict(counts),'revision':REVISION})
if __name__=='__main__':main()
