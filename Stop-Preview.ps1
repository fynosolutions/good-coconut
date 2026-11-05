$pidFile = Join-Path $PSScriptRoot '.preview.pid'
$portFile = Join-Path $PSScriptRoot '.preview.port'
if (Test-Path -LiteralPath $pidFile) {
    $previewPid = [int](Get-Content -LiteralPath $pidFile)
    $previewProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $previewPid"
    if ($previewProcess -and $previewProcess.Name -eq 'node.exe' -and $previewProcess.CommandLine -match 'server\.mjs') {
        $previewPort = if (Test-Path -LiteralPath $portFile) { [int](Get-Content -LiteralPath $portFile) } else { 4185 }
        $ownedPort = Get-NetTCPConnection -LocalPort $previewPort -State Listen -ErrorAction SilentlyContinue | Where-Object OwningProcess -eq $previewPid
        if ($ownedPort) { Stop-Process -Id $previewPid }
    }
    Remove-Item -LiteralPath $pidFile
    if (Test-Path -LiteralPath $portFile) { Remove-Item -LiteralPath $portFile }
}
