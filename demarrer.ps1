$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
if (-not (Test-Path -LiteralPath '.venv310\Scripts\python.exe')) {
    throw 'Lancez d’abord .\installer.ps1'
}
& .\.venv310\Scripts\python.exe app.py
