"""Package the exhaustive results without duplicating 69 GB of source images."""
import json
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

REPO=Path(__file__).resolve().parents[1]
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
        for name in ['summary.json','results.csv','run-metadata.json','run-status.json','download-status.json','source-index.json','model-hashes.json','timing-manifest.json','timing-results.json']:
            archive.write(ROOT/name,name)
        if (ROOT/'run-metadata-initial.json').exists():
            archive.write(ROOT/'run-metadata-initial.json','run-metadata-initial.json')
        for folder in ['manifests','results']:
            for file in sorted((ROOT/folder).glob('*.json')):archive.write(file,str(file.relative_to(ROOT)))
        archive.write(REPO/'full-benchmark-README.txt','LISEZ-MOI.txt')
        for file in sorted((REPO/'scripts').iterdir()):
            if file.is_file():archive.write(file,'scripts/'+file.name)
        for file in sorted((REPO/'src').rglob('*')):
            if file.is_file():archive.write(file,file.relative_to(REPO).as_posix())
        for name in ['Taskfile.yml','package.json','package-lock.json','vite.config.js','vite.full-benchmark.config.js','benchmark.html']:
            archive.write(REPO/name,name)
        archive.writestr('IMAGES.txt','Les images originales sont dans desktop/output/posture-benchmark-full/dataset sur cet ordinateur.\nLe script de téléchargement récupère la révision exacte indiquée dans les manifestes.\nL’archive contient toutes les sorties par image, sans dupliquer les images sources.\n')
    target.with_suffix('.zip.tmp').replace(target)
    with ZipFile(target) as archive:
        assert archive.testzip() is None
        assert len([n for n in archive.namelist() if n.startswith('results/')])==408
    print(str(target),target.stat().st_size)

if __name__=='__main__':main()
