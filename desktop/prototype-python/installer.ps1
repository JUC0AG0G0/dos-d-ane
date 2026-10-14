$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

py -3.10 -m venv .venv310
if ($LASTEXITCODE -ne 0) { throw 'Python 3.10 est nécessaire.' }
& .\.venv310\Scripts\python.exe -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) { throw "L'installation des dépendances a échoué." }

New-Item -ItemType Directory -Force -Path models | Out-Null
$models = @(
    @{
        Name = 'pose_landmarker_lite.task'
        Url = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
        Sha256 = '59929e1d1ee95287735ddd833b19cf4ac46d29bc7afddbbf6753c459690d574a'
    },
    @{
        Name = 'face_landmarker.task'
        Url = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
        Sha256 = '64184e229b263107bc2b804c6625db1341ff2bb731874b0bcc2fe6544e0bc9ff'
    },
    @{
        Name = 'hand_landmarker.task'
        Url = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'
        Sha256 = 'fbc2a30080c3c557093b5ddfc334698132eb341044ccee322ccf8bcf3607cde1'
    }
)
function Get-ModelHash([string]$path) {
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        return [System.BitConverter]::ToString($sha.ComputeHash($bytes)).Replace('-', '').ToLowerInvariant()
    } finally {
        $sha.Dispose()
    }
}
foreach ($model in $models) {
    $destination = Join-Path $PSScriptRoot ('models\' + $model.Name)
    if ((-not (Test-Path -LiteralPath $destination)) -or ((Get-ModelHash $destination) -ne $model.Sha256)) {
        $temporary = "$destination.$([System.Guid]::NewGuid().ToString('N')).download"
        $backup = "$temporary.previous"
        try {
            Write-Host "Téléchargement de $($model.Name)..."
            Invoke-WebRequest -UseBasicParsing -Uri $model.Url -OutFile $temporary
            if ((Get-ModelHash $temporary) -ne $model.Sha256) {
                throw "Le modèle $($model.Name) ne correspond pas à la version attendue."
            }
            if (Test-Path -LiteralPath $destination) {
                [System.IO.File]::Replace($temporary, $destination, $backup)
            } else {
                [System.IO.File]::Move($temporary, $destination)
            }
        } finally {
            if (Test-Path -LiteralPath $temporary) { Remove-Item -LiteralPath $temporary }
            if (Test-Path -LiteralPath $backup) { Remove-Item -LiteralPath $backup }
        }
    }
}
Write-Host 'Installation terminée. Lancez .\demarrer.ps1'
