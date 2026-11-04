param([ValidateSet('/', '/menu/')][string]$Page = '/')
$ErrorActionPreference = 'Stop'
$previewRoot = $PSScriptRoot
$nodeCommand = (Get-Command node -ErrorAction Stop).Source
Push-Location -LiteralPath $previewRoot
try {
    & $nodeCommand 'build.mjs'
    if ($LASTEXITCODE -ne 0) { throw 'Could not rebuild the preview pages.' }
} finally { Pop-Location }
$previewPort = 4185
$env:PORT = "$previewPort"
$previewUrl = "http://127.0.0.1:$previewPort"
$existing = $null
try { $existing = Invoke-WebRequest -UseBasicParsing -Uri $previewUrl -TimeoutSec 2 } catch {}
if ($existing) {
    if ($existing.Content -notmatch 'Good days\.') { throw 'Port 4185 is occupied by another service.' }
} else {
    $nodeCommand = (Get-Command node -ErrorAction Stop).Source
    $previewProcess = Start-Process -FilePath $nodeCommand -ArgumentList '--env-file-if-exists=.env', 'server.mjs' -WorkingDirectory $previewRoot -WindowStyle Hidden -PassThru
    Set-Content -LiteralPath (Join-Path $previewRoot '.preview.pid') -Value $previewProcess.Id
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Milliseconds 200
        try { $response = Invoke-WebRequest -UseBasicParsing -Uri $previewUrl -TimeoutSec 1; if ($response.StatusCode -eq 200) { $ready = $true; break } } catch {}
    }
    if (-not $ready) { throw 'Preview did not start. Run npm start in this folder to inspect the error.' }
}
Start-Process ($previewUrl + $Page)

