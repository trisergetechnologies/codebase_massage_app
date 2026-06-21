# =====================================================================
# start-all.ps1
# ---------------------------------------------------------------------
# Spins up the whole stack in one go, each service in its own console:
#   - backend    (Node, port 4000)
#   - admin-web  (Next.js, port 3000)
#   - customer-app (Expo, Metro on 8081 -> Android emulator)
#   - expert-app   (Expo, Metro on 8082 -> Android emulator)
#
# Assumes the AVD `pixel_dev` is already running (run-emulator.ps1).
# Uses RN_PACKAGER_PORT to avoid the 8081 collision between two Expo apps.
# =====================================================================

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

function Open([string]$title, [string]$cwd, [string]$cmd) {
  $full = "Set-Location '$cwd'; `$Host.UI.RawUI.WindowTitle = '$title'; $cmd"
  Start-Process -FilePath "powershell.exe" `
    -ArgumentList @("-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $full) `
    -WindowStyle Normal | Out-Null
}

Write-Host "Launching backend..."     -ForegroundColor Cyan
Open "backend"     "$root\backend"      "npm run dev"

Start-Sleep -Seconds 2

Write-Host "Launching admin-web..."   -ForegroundColor Cyan
Open "admin-web"   "$root\admin-web"    "npm run dev"

Start-Sleep -Seconds 2

Write-Host "Launching customer-app on Metro 8081..." -ForegroundColor Cyan
Open "customer-app" "$root\customer-app" "`$env:RCT_METRO_PORT=8081; npx expo start --port 8081"

Start-Sleep -Seconds 2

Write-Host "Launching expert-app on Metro 8082..."   -ForegroundColor Cyan
Open "expert-app"   "$root\expert-app"   "`$env:RCT_METRO_PORT=8082; npx expo start --port 8082"

Write-Host ""
Write-Host "All four windows are starting. In each Expo window, press 'a' to install on the Android emulator." -ForegroundColor Green
Write-Host "Tip: install the customer app first, then the expert app — Expo can install both APKs side by side." -ForegroundColor DarkGray
