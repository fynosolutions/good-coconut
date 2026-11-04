$pidFile = Join-Path $PSScriptRoot '.preview.pid'
if (Test-Path -LiteralPath $pidFile) {
    $previewPid = [int](Get-Content -LiteralPath $pidFile)
    $previewProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $previewPid"
    if ($previewProcess -and $previewProcess.Name -eq 'node.exe' -and $previewProcess.CommandLine -match 'server\.mjs') {
        $ownedPort = Get-NetTCPConnection -LocalPort 4185 -State Listen -ErrorAction SilentlyContinue | Where-Object OwningProcess -eq $previewPid
        if ($ownedPort) { Stop-Process -Id $previewPid }
    }
    Remove-Item -LiteralPath $pidFile
}
