$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptRoot

$mediaDir = Join-Path $scriptRoot 'resources\media'
$output = Join-Path $mediaDir 'media.json'
$allowed = @('.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif')

if (-not (Test-Path $mediaDir)) {
    Write-Host "Folder not found: $mediaDir" -ForegroundColor Red
    exit 1
}

Write-Host 'Building media manifest...'

$files = Get-ChildItem -Path $mediaDir -File |
    Where-Object { $allowed -contains $_.Extension.ToLowerInvariant() } |
    Sort-Object Name

$images = foreach ($file in $files) {
    [ordered]@{
        src = "resources/media/$($file.Name)"
    }
}

$manifest = [ordered]@{
    generated = (Get-Date).ToString('s')
    count = @($images).Count
    images = @($images)
}

$json = $manifest | ConvertTo-Json -Depth 4
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($output, $json, $utf8NoBom)

Write-Host "Done: resources/media/media.json" -ForegroundColor Green
