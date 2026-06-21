# =====================================================================
# setup-android.ps1
# ---------------------------------------------------------------------
# One-shot bootstrap for the Android Emulator on a fresh Windows box.
#
# What it does (idempotent):
#   1. Locates the Android SDK installed by Android Studio.
#   2. Sets ANDROID_HOME / ANDROID_SDK_ROOT for the current user, and
#      adds platform-tools + emulator + cmdline-tools to PATH.
#   3. Accepts SDK licenses non-interactively.
#   4. Installs the bits needed to boot an emulator:
#        - platform-tools
#        - emulator
#        - platforms;android-34
#        - system-images;android-34;google_apis;x86_64
#   5. Creates an AVD called `pixel_dev` (Pixel 6, API 34) if missing.
#
# Usage:  pwsh -ExecutionPolicy Bypass -File scripts/setup-android.ps1
# =====================================================================

$ErrorActionPreference = "Stop"

function Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Note($msg) { Write-Host "    $msg" -ForegroundColor DarkGray }
function Warn($msg) { Write-Host "[!] $msg" -ForegroundColor Yellow }
function Die($msg)  { Write-Host "[x] $msg" -ForegroundColor Red; exit 1 }

# ---------- 1. Locate the SDK ----------
Step "Locating Android SDK"
$candidates = @(
  "$env:LOCALAPPDATA\Android\Sdk",
  "$env:USERPROFILE\AppData\Local\Android\Sdk",
  "C:\Android\Sdk"
)
$sdk = $null
foreach ($c in $candidates) { if (Test-Path $c) { $sdk = $c; break } }
if (-not $sdk) {
  Warn "Android SDK not found in common locations."
  Note "Open Android Studio once and let it run the first-time SDK install,"
  Note "then rerun this script."
  exit 1
}
Note "Found SDK at: $sdk"

# ---------- 2. Persist env vars ----------
Step "Setting ANDROID_HOME / PATH (user-level)"
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdk, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $sdk, "User")
$env:ANDROID_HOME = $sdk
$env:ANDROID_SDK_ROOT = $sdk

$pathBits = @(
  "$sdk\platform-tools",
  "$sdk\emulator",
  "$sdk\cmdline-tools\latest\bin"
)
$current = [Environment]::GetEnvironmentVariable("PATH", "User")
foreach ($p in $pathBits) {
  if ($current -notlike "*$p*") {
    $current = "$current;$p"
  }
}
[Environment]::SetEnvironmentVariable("PATH", $current, "User")
$env:PATH = "$env:PATH;$($pathBits -join ';')"
Note "ANDROID_HOME persisted; reopen new shells to inherit it."

# ---------- 3. Find sdkmanager ----------
Step "Locating sdkmanager"
$sdkmgr = Get-ChildItem -Path "$sdk\cmdline-tools" -Recurse -Filter "sdkmanager.bat" -ErrorAction SilentlyContinue |
          Select-Object -First 1
if (-not $sdkmgr) {
  Warn "sdkmanager not found. Open Android Studio > More Actions > SDK Manager > SDK Tools tab,"
  Note "tick 'Android SDK Command-line Tools (latest)', click Apply, then rerun."
  exit 1
}
Note "Using: $($sdkmgr.FullName)"

# ---------- 4. Accept licenses ----------
Step "Accepting Android SDK licenses"
$y = ("y`n" * 30)
$y | & $sdkmgr.FullName --licenses | Out-Null
Note "Licenses accepted."

# ---------- 5. Install required components ----------
Step "Installing required SDK components"
$pkgs = @(
  "platform-tools",
  "emulator",
  "platforms;android-34",
  "system-images;android-34;google_apis;x86_64"
)
& $sdkmgr.FullName $pkgs
if ($LASTEXITCODE -ne 0) { Die "sdkmanager failed (exit $LASTEXITCODE)" }

# ---------- 6. Create AVD ----------
Step "Creating AVD 'pixel_dev' (if missing)"
$avdmgr = Join-Path (Split-Path $sdkmgr.FullName) "avdmanager.bat"
$existing = & $avdmgr list avd 2>&1 | Out-String
if ($existing -match "Name:\s*pixel_dev") {
  Note "pixel_dev already exists, skipping."
} else {
  "no" | & $avdmgr create avd `
    --name "pixel_dev" `
    --package "system-images;android-34;google_apis;x86_64" `
    --device "pixel_6" `
    --force
  if ($LASTEXITCODE -ne 0) { Die "avdmanager failed (exit $LASTEXITCODE)" }
  Note "Created AVD 'pixel_dev'"
}

Write-Host ""
Step "Done."
Note "Next: run  scripts/run-emulator.ps1   to boot the AVD,"
Note "then    cd customer-app && npx expo start --android"
