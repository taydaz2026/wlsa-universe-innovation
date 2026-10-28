# PUBLISH AN UPDATE: sends your latest changes to GitHub so the live site updates.
# Easiest way to run it: double-click publish-update.bat
param(
  [string]$Message
)

$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath $PSScriptRoot

function Fail([string]$text) {
  Write-Host ''
  Write-Host "ERROR: $text" -ForegroundColor Red
  exit 1
}

function Get-SiteUrl([string]$url) {
  if ($url -match 'github\.com[:/]+([^/]+)/([^/]+?)(\.git)?/?$') {
    return ('https://' + $Matches[1] + '.github.io/' + $Matches[2] + '/')
  }
  return $null
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Fail 'git is not installed. Install it from https://git-scm.com/download/win, then run this again.'
}
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot '.git'))) {
  Fail 'This folder has not been set up yet. Double-click setup-github.bat first (one time only).'
}

$pending = git status --porcelain
if (-not $pending) {
  Write-Host 'Nothing has changed since the last publish, so there is nothing to send.'
  exit 0
}

Write-Host 'Changed files:'
git status --short
Write-Host ''

# Give the page's scripts and styles a new version number, so visitors' browsers fetch the new files
# instead of showing an old cached copy.
$index = Join-Path $PSScriptRoot 'index.html'
if (Test-Path -LiteralPath $index) {
  $stamp = Get-Date -Format 'yyyyMMddHHmm'
  $text = [System.IO.File]::ReadAllText($index)
  $updated = [regex]::Replace($text, '(\.(?:js|css))\?v=[A-Za-z0-9]+', ('$1?v=' + $stamp))
  if ($updated -ne $text) {
    [System.IO.File]::WriteAllText($index, $updated, (New-Object System.Text.UTF8Encoding($false)))
  }
}

if (-not $Message) {
  $Message = Read-Host 'In a few words, what did you change? (for example: Added helpdesk descriptions)'
  if (-not $Message) { $Message = 'Update site' }
}

git add -A
git commit -m $Message | Out-Null
if ($LASTEXITCODE -ne 0) { Fail 'Saving the changes (git commit) failed.' }

Write-Host ''
Write-Host 'Sending to GitHub...'
git push
if ($LASTEXITCODE -ne 0) {
  Write-Host ''
  Write-Host 'The upload was refused. This usually means the repository on GitHub has changes you do not have here' -ForegroundColor Yellow
  Write-Host '(for example, you edited a file on github.com). Try this once, then run publish-update again:' -ForegroundColor Yellow
  Write-Host '    git pull --rebase origin main' -ForegroundColor Yellow
  Fail 'The upload failed.'
}

$remote = (git remote get-url origin)
$site = Get-SiteUrl $remote
Write-Host ''
Write-Host 'Published. GitHub rebuilds the site in 1-3 minutes.' -ForegroundColor Green
if ($site) { Write-Host "Live site: $site   (press Ctrl+F5 if you still see the old version)" -ForegroundColor Cyan }
