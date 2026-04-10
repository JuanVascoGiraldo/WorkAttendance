$ErrorActionPreference = "Stop"

Set-Location -Path (Join-Path $PSScriptRoot "Frontend")

if (-not (Test-Path "package.json")) {
  throw "No se encontro package.json en Frontend."
}

npm run dev