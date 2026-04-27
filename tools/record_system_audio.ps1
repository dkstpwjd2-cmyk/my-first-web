param(
    [string]$OutputPath,
    [int]$SampleRate = 16000,
    [int]$Channels = 1,
    [int]$DurationSec = 0
)

$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ffmpeg) {
    Write-Error "ffmpeg is not installed or not in PATH."
    exit 1
}

if (-not $OutputPath) {
    $desktop = [Environment]::GetFolderPath('Desktop')
    $stamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $OutputPath = Join-Path $desktop "lms_audio_$stamp.wav"
}

$OutputDir = Split-Path -Path $OutputPath -Parent
if (-not (Test-Path $OutputDir)) {
    New-Item -Path $OutputDir -ItemType Directory -Force | Out-Null
}

Write-Host "Recording system audio to: $OutputPath"
Write-Host "Start LMS lecture playback in Firefox, then return here."
if ($DurationSec -gt 0) {
    Write-Host "Recording will stop automatically after $DurationSec seconds."
} else {
    Write-Host "Press 'q' in this terminal to stop recording."
}

$deviceList = ffmpeg -hide_banner -list_devices true -f dshow -i dummy 2>&1 | Out-String
$deviceAltName = [regex]::Match($deviceList, '@device_cm_\{[^\}]+\}\\wave_\{[^\}]+\}').Value
$deviceAltName = $deviceAltName -replace '\s', ''

if (-not $deviceAltName) {
    Write-Error "No DirectShow audio input device was detected by ffmpeg."
    exit 1
}

Write-Host "Using audio device: $deviceAltName"

$ffmpegArgs = @(
    '-y',
    '-hide_banner',
    '-f', 'dshow',
    '-i', "audio=$deviceAltName",
    '-ac', "$Channels",
    '-ar', "$SampleRate",
    '-c:a', 'pcm_s16le'
)

if ($DurationSec -gt 0) {
    $ffmpegArgs += @('-t', "$DurationSec")
}

$ffmpegArgs += "$OutputPath"

& ffmpeg @ffmpegArgs

if ($LASTEXITCODE -eq 0 -and (Test-Path $OutputPath) -and ((Get-Item $OutputPath).Length -gt 0)) {
    Write-Host "Saved: $OutputPath"
} else {
    Write-Error "Recording failed. Exit code: $LASTEXITCODE"
    exit $LASTEXITCODE
}