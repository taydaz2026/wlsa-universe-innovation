# ONE-TIME SETUP: turns this folder into a git repository and uploads it to GitHub.
# Easiest way to run it: double-click setup-github.bat
# This script never stores a password. GitHub's own sign-in window handles that.
param(
  [string]$RepoUrl,
  [string]$Name,
  [string]$Email,
  [string]$Message = 'Publish WLSA Innovation & Technology Universe'
)

$ErrorActionPreference = 'Continue'      # git writes progress to stderr; do not treat that as an error
Set-Location -LiteralPath $PSScriptRoot

function Fail([string]$text) {
  Write-Host ''
  Write-Host "ERROR: $text" -ForegroundColor Red
  exit 1
}

# https://github.com/<user>/<repo>(.git)  ->  https://<user>.github.io/<repo>/
function Get-SiteUrl([string]$url) {
  if ($url -match 'github\.com[:/]+([^/]+)/([^/]+?)(\.git)?/?$') {
    return ('https://' + $Matches[1] + '.github.io/' + $Matches[2] + '/')
  }
  return $null
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Fail 'git is not installed. Install it from https://git-scm.com/download/win, then run this again.'
}
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'index.html'))) {
  Fail 'index.html was not found next to this script. Run it from inside the website folder.'
}

if ($PSScriptRoot -match 'OneDrive') {
  Write-Host 'WARNING: this folder is inside OneDrive. OneDrive can damage git''s hidden .git folder.' -ForegroundColor Yellow
  Write-Host 'Safer: copy this whole folder to somewhere like C:\Sites\wlsa-innovation-universe and run it there.' -ForegroundColor Yellow
  if (-not $RepoUrl) {
    $go = Read-Host 'Continue anyway? (y/n)'
    if ($go -ne 'y') { exit 0 }
  }
}

if (-not $RepoUrl) {
  Write-Host 'First create an EMPTY repository on github.com (leave "Add a README" unticked), then copy its address.'
  $RepoUrl = Read-Host 'Paste the repository address (like https://github.com/yourname/wlsa-innovation-universe.git)'
}
if (-not $RepoUrl) { Fail 'No repository address was given.' }

if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot '.git'))) {
  git init -b main 2>$null | Out-Null
  if ($LASTEXITCODE -ne 0) {            # older git versions do not know "-b"
    git init 2>$null | Out-Null
    git symbolic-ref HEAD refs/heads/main
  }
}
git config core.autocrlf false          # keep the files exactly as they are (no line-ending warnings)

# Who is making the updates (stored only in this folder's git settings)
$existingName = (git config user.name)
if (-not $existingName) {
  if (-not $Name) { $Name = Read-Host 'Your name (shown next to each update)' }
  git config user.name $Name
}
$existingEmail = (git config user.email)
if (-not $existingEmail) {
  if (-not $Email) { $Email = Read-Host 'Your email address' }
  git config user.email $Email
}

$remotes = @(git remote)
if ($remotes -contains 'origin') { git remote set-url origin $RepoUrl } else { git remote add origin $RepoUrl }

git add -A
$pending = git status --porcelain
if ($pending) {
  git commit -m $Message | Out-Null
  if ($LASTEXITCODE -ne 0) { Fail 'Saving the files (git commit) failed.' }
}

Write-Host ''
Write-Host 'Uploading to GitHub... a sign-in window may appear the first time.'
git push -u origin main
if ($LASTEXITCODE -ne 0) {
  Fail 'The upload failed. Check that the address is right, that the repository on GitHub is EMPTY, and that you signed in.'
}

$site = Get-SiteUrl $RepoUrl
Write-Host ''
Write-Host 'Done. Your files are on GitHub.' -ForegroundColor Green
Write-Host ''
Write-Host 'LAST STEP (once only), in your browser:'
Write-Host '  1. Open the repository on github.com'
Write-Host '  2. Settings -> Pages'
Write-Host '  3. Source: "Deploy from a branch"   Branch: main   Folder: / (root)   -> Save'
if ($site) {
  Write-Host ''
  Write-Host "After 1-3 minutes your site will be live at: $site" -ForegroundColor Cyan
}
Write-Host ''
Write-Host 'To publish changes later, double-click publish-update.bat'
