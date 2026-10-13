"""Package the exhaustive results without duplicating 69 GB of source images."""
import json
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

REPO=Path(__file__).resolve().parents[2]
ROOT=REPO/'output'/'posture-benchmark-full'

def main():
    report=json.loads((ROOT/'summary.json').read_text(encoding='utf8'))
    status=json.loads((ROOT/'run-status.json').read_text(encoding='utf8'))
    assert status['phase']=='complete' and status['done']==157500
    assert report['images']==52500 and report['modelImagePairs']==157500
    result_files=sorted((ROOT/'results').glob('*.json'))
    assert len(result_files)==408
    target=ROOT/'Resultats-complets.zip'
    with ZipFile(target.with_suffix('.zip.tmp'),'w',ZIP_DEFLATED,compresslevel=6) as archive:
        for name in ['summary.json','results.csv','run-metadata.json','run-metadata-initial.json','run-status.json','download-status.json','source-index.json','model-hashes.json','timing-manifest.json','timing-results.json']:
            archive.write(ROOT/name,name)
        for folder in ['manifests','results']:
            for file in sorted((ROOT/folder).glob('*.json')):archive.write(file,str(file.relative_to(ROOT)))
        archive.write(REPO/'desktop'/'full-benchmark-README.txt','LISEZ-MOI.txt')
        for name in ['download-full-posture.py','run-full-posture.cjs','summarize-full-posture.py','package-full-posture.py','monitor-full-posture.py','prepare-full-timing.py','run-full-timing.cjs']:
            archive.write(REPO/'desktop'/'scripts'/name,'scripts/'+name)
        for name in ['models.js','pose.js','benchmark.js']:
            archive.write(REPO/'desktop'/'src'/name,'src/'+name)
        archive.writestr('IMAGES.txt','Les images originales sont dans output/posture-benchmark-full/dataset sur cet ordinateur.\nLe script de téléchargement récupère la révision exacte indiquée dans les manifestes.\nL’archive contient toutes les sorties par image, sans dupliquer les images sources.\n')
    target.with_suffix('.zip.tmp').replace(target)
    with ZipFile(target) as archive:
        assert archive.testzip() is None
        assert len([n for n in archive.namelist() if n.startswith('results/')])==408
    print(str(target),target.stat().st_size)

if __name__=='__main__':main()
