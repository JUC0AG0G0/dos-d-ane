"""Bundle exactly the evaluated images, references and reproducible results."""
import hashlib,json,zipfile,shutil
from pathlib import Path
repo=Path(__file__).resolve().parents[1]
root=repo/'output'/'posture-benchmark'
manifest=json.loads((root/'dataset'/'manifest.json').read_text(encoding='utf8'))
assert len(manifest['rows'])==120
assert len({r['sha256'] for r in manifest['rows']})==120
shutil.copyfile(repo/'benchmark-README.txt',root/'LIRE-MOI.txt')
with zipfile.ZipFile(root/'Donnees-et-resultats.zip','w',zipfile.ZIP_DEFLATED) as z:
    for row in manifest['rows']:
        p=root/'dataset'/row['file']
        assert hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256']
        z.write(p,'dataset/'+row['file'])
    for file in ['dataset/manifest.json','raw-results.json','summary.json','summary-2d.json','results.csv','sha256-code-models.json','LIRE-MOI.txt']:
        z.write(root/file,file)
    for file in sorted((repo/'scripts').iterdir()):
        if file.is_file():z.write(file,'scripts/'+file.name)
    for file in sorted((repo/'src').rglob('*')):
        if file.is_file():z.write(file,file.relative_to(repo).as_posix())
    for name in ['Taskfile.yml','package.json','package-lock.json','vite.config.js','vite.benchmark.config.js','benchmark.html']:
        z.write(repo/name,name)
print('Packaged 120 verified distinct images and results')
