$ErrorActionPreference = "Stop"

Set-Location -Path (Join-Path $PSScriptRoot "Backend")

$pythonExe = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"

if (-not (Test-Path $pythonExe)) {
  throw "No se encontro el entorno virtual en .venv."
}

& $pythonExe server.py