# =====================================================================
# fix-java-ssl.ps1
# Imports Windows root CA certificates into Android Studio JBR truststore
# so Gradle can download dependencies on networks with SSL inspection.
#
# Usage (run PowerShell as Administrator):
#   powershell -ExecutionPolicy Bypass -File scripts/fix-java-ssl.ps1
# =====================================================================

$ErrorActionPreference = "Stop"

$jbr = "C:\Program Files\Android\Android Studio\jbr"
$cacerts = Join-Path $jbr "lib\security\cacerts"
$keytool = Join-Path $jbr "bin\keytool.exe"

if (-not (Test-Path $keytool)) {
  Write-Host "keytool not found at $keytool — set JBR path manually." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path $cacerts)) {
  Write-Host "cacerts not found at $cacerts" -ForegroundColor Red
  exit 1
}

Write-Host "Importing LocalMachine Root certificates into JBR cacerts..." -ForegroundColor Cyan
Write-Host "Store: $cacerts" -ForegroundColor Gray

$imported = 0
$skipped = 0

Get-ChildItem Cert:\LocalMachine\Root | ForEach-Object {
  $alias = "win-root-$($_.Thumbprint)"
  $tmp = Join-Path $env:TEMP "$alias.cer"
  try {
    Export-Certificate -Cert $_ -FilePath $tmp -Force | Out-Null
    & $keytool -importcert -noprompt -alias $alias -file $tmp -keystore $cacerts -storepass changeit 2>$null
    if ($LASTEXITCODE -eq 0) { $imported++ } else { $skipped++ }
  } catch {
    $skipped++
  } finally {
    Remove-Item $tmp -ErrorAction SilentlyContinue
  }
}

Write-Host "Done. Imported: $imported  Skipped/already present: $skipped" -ForegroundColor Green
Write-Host "Retry: cd expert-app; npx expo run:android" -ForegroundColor Yellow
