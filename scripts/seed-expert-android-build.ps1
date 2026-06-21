# =====================================================================
# seed-expert-android-build.ps1  (OPTIONAL — local build only)
# EAS cloud build is the recommended path. Use this only if you
# prefer `npx expo run:android` on this machine after fixing SSL.
# =====================================================================

$ErrorActionPreference = "Stop"

$root = Split-Path $PSScriptRoot -Parent
$expertApp = Join-Path $root "expert-app"
$gradleManual = Join-Path $env:USERPROFILE ".gradle\manual"
$gradleZip = Join-Path $gradleManual "gradle-8.8-all.zip"
$jbr = "C:\Program Files\Android\Android Studio\jbr"
$userTruststore = Join-Path $env:USERPROFILE ".gradle\java-truststore.jks"
$keytool = Join-Path $jbr "bin\keytool.exe"
$sourceCacerts = Join-Path $jbr "lib\security\cacerts"

New-Item -ItemType Directory -Force -Path $gradleManual | Out-Null

# --- 1. Download Gradle 8.8 distribution (skip if present) ---
if (-not (Test-Path $gradleZip)) {
  Write-Host "Downloading Gradle 8.8 (all) via curl -k ..." -ForegroundColor Cyan
  curl.exe -k -L --retry 3 -o $gradleZip "https://services.gradle.org/distributions/gradle-8.8-all.zip"
  if (-not (Test-Path $gradleZip)) { throw "Gradle download failed." }
  Write-Host "Gradle saved to $gradleZip" -ForegroundColor Green
} else {
  Write-Host "Gradle zip already present: $gradleZip" -ForegroundColor Yellow
}

# --- 2. Build user truststore from JBR cacerts + Windows root CAs ---
if (-not (Test-Path $keytool)) { throw "keytool not found at $keytool" }

if (-not (Test-Path $userTruststore)) {
  Write-Host "Creating user Java truststore at $userTruststore ..." -ForegroundColor Cyan
  Copy-Item $sourceCacerts $userTruststore -Force
  $imported = 0
  Get-ChildItem Cert:\LocalMachine\Root | ForEach-Object {
    $alias = "win-$($_.Thumbprint)"
    $tmp = Join-Path $env:TEMP "$alias.cer"
    try {
      Export-Certificate -Cert $_ -FilePath $tmp -Force | Out-Null
      & $keytool -importcert -noprompt -alias $alias -file $tmp -keystore $userTruststore -storepass changeit 2>$null
      if ($LASTEXITCODE -eq 0) { $imported++ }
    } catch { } finally {
      Remove-Item $tmp -ErrorAction SilentlyContinue
    }
  }
  Write-Host "Truststore ready ($imported Windows root CAs imported)." -ForegroundColor Green
} else {
  Write-Host "User truststore already exists: $userTruststore" -ForegroundColor Yellow
}

# --- 3. Point Gradle wrapper at local zip (no HTTPS for Gradle itself) ---
$wrapperProps = Join-Path $expertApp "android\gradle\wrapper\gradle-wrapper.properties"
if (-not (Test-Path $wrapperProps)) {
  Write-Host "android/ not found yet - run npx expo prebuild --platform android first." -ForegroundColor Red
  exit 1
}

$fileUrl = "file:///" + ($gradleZip -replace "\\", "/")
$content = Get-Content $wrapperProps -Raw
$content = $content -replace "distributionUrl=.*", "distributionUrl=$($fileUrl -replace ':', '\:')"
Set-Content $wrapperProps $content.TrimEnd() -NoNewline
Add-Content $wrapperProps "`n"

# --- 4. Inject truststore into expert-app gradle.properties ---
$gradleProps = Join-Path $expertApp "android\gradle.properties"
$trustLine = "org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m -Djavax.net.ssl.trustStore=$($userTruststore -replace '\\','/') -Djavax.net.ssl.trustStorePassword=changeit"
$props = Get-Content $gradleProps -Raw
if ($props -notmatch "trustStore=") {
  $props = $props -replace "org.gradle.jvmargs=.*", $trustLine
  Set-Content $gradleProps $props
  Write-Host "Updated android/gradle.properties with user truststore." -ForegroundColor Green
}

Write-Host ""
Write-Host "Ready. Run: cd expert-app; npx expo run:android" -ForegroundColor Green
