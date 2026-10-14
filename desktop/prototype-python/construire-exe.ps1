$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

$python = Join-Path $PSScriptRoot '.venv310\Scripts\python.exe'
$modelNames = @('pose_landmarker_lite.task', 'face_landmarker.task', 'hand_landmarker.task')
if (-not (Test-Path -LiteralPath $python)) {
    throw 'Lancez d’abord .\installer.ps1'
}
$modelArguments = @()
foreach ($modelName in $modelNames) {
    $modelPath = Join-Path $PSScriptRoot ('models\' + $modelName)
    if (-not (Test-Path -LiteralPath $modelPath)) {
        throw "Modèle $modelName absent : lancez d’abord .\installer.ps1"
    }
    $modelArguments += @('--add-data', "${modelPath};models")
}

& $python -m pip install 'pyinstaller==6.22.3'
if ($LASTEXITCODE -ne 0) { throw "L'installation de PyInstaller a échoué." }

& $python -m PyInstaller --noconfirm --clean --onefile --windowed `
    --name DosdAne --specpath build --workpath build\pyinstaller --distpath dist `
    --collect-all mediapipe.tasks.c `
    @modelArguments app.py
if ($LASTEXITCODE -ne 0) { throw "La création de l'exécutable a échoué." }
Write-Host 'Exécutable prêt : dist\DosdAne.exe'
