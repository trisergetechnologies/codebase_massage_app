# =====================================================================
# run-emulator.ps1
# ---------------------------------------------------------------------
# Boots an Android Virtual Device in the background and waits until
# the system is fully booted (PackageManager up).
#
# Usage:  pwsh -ExecutionPolicy Bypass -File scripts/run-emulator.ps1
# Optional: -Avd <name>   (defaults to pixel_dev)
#           -ColdBoot     (wipe + cold boot, slower but resets state)
# =====================================================================

param(
  [string]$Avd = "pixel_dev",
  [switch]$ColdBoot
)

$ErrorActionPreference = "Stop"

$sdk = $env:ANDROID_HOME
if (-not $sdk) { $sdk = "$env:LOCALAPPDATA\Android\Sdk" }
if (-not (Test-Path $sdk)) {
  Write-Host "ANDROID_HOME not set and SDK not at default location. Run setup-android.ps1 first." -ForegroundColor Red
  exit 1
}

$emulator = Join-Path $sdk "emulator\emulator.exe"
$adb      = Join-Path $sdk "platform-tools\adb.exe"

if (-not (Test-Path $emulator)) { Write-Host "emulator.exe not found at $emulator" -ForegroundColor Red; exit 1 }
if (-not (Test-Path $adb))      { Write-Host "adb.exe not found at $adb" -ForegroundColor Red; exit 1 }

# Already running?
$running = & $adb devices | Select-String "emulator-"
if ($running) {
  Write-Host "An emulator is already running:" -ForegroundColor Yellow
  $running | ForEach-Object { Write-Host "  $_" }
  exit 0
}

$args = @("-avd", $Avd, "-netdelay", "none", "-netspeed", "full")
if ($ColdBoot) { $args += @("-no-snapshot-load", "-wipe-data") }

Write-Host "Booting AVD: $Avd ..." -ForegroundColor Cyan
Start-Process -FilePath $emulator -ArgumentList $args -WindowStyle Minimized

# Wait for adb to see it.
Write-Host "Waiting for emulator to become reachable..." -ForegroundColor DarkGray
& $adb wait-for-device

# Wait for full boot.
Write-Host "Waiting for sys.boot_completed..." -ForegroundColor DarkGray
$attempt = 0
do {
  Start-Sleep -Seconds 2
  $boot = & $adb shell getprop sys.boot_completed 2>$null
  $attempt++
  if ($attempt -gt 90) { Write-Host "Gave up waiting after 3min." -ForegroundColor Red; exit 1 }
} while ($boot.Trim() -ne "1")

Write-Host ""
Write-Host "Emulator is booted." -ForegroundColor Green
Write-Host "Next:" -ForegroundColor Cyan
Write-Host "  cd customer-app  ;  npx expo start --android"
Write-Host "  cd expert-app    ;  npx expo start --android   (in another terminal, different port)"
