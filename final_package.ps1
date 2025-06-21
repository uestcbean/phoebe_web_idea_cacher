# Phoebe Chrome Extension Final Package Script
# Create release version ZIP package

Write-Host "Creating Phoebe Chrome Extension package..." -ForegroundColor Green

# Set output filename
$outputFile = "phoebe-v1.0.3.zip"

# Remove existing file if exists
if (Test-Path $outputFile) {
    Remove-Item $outputFile -Force
    Write-Host "Removed old package" -ForegroundColor Yellow
}

# Files to include
$includeFiles = @(
    "manifest.json",
    "background_script.js",
    "popup_page.html",
    "popup_script.js",
    "options_page.html",
    "options_script.js",
    "content_script.js",
    "i18n.js",
    "_locales",
    "icons"
)

# Create temp directory
$tempDir = "temp_package"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy files to temp directory
foreach ($file in $includeFiles) {
    Write-Host "Checking: $file" -ForegroundColor Cyan
    if (Test-Path $file) {
        if (Test-Path $file -PathType Container) {
            # Directory
            Copy-Item $file -Destination $tempDir -Recurse
            Write-Host "✓ Copied directory: $file" -ForegroundColor Green
        } else {
            # File
            Copy-Item $file -Destination $tempDir
            Write-Host "✓ Copied file: $file" -ForegroundColor Green
        }
    } else {
        Write-Host "✗ File or directory not found: $file" -ForegroundColor Red
    }
}

# Create ZIP file
try {
    Compress-Archive -Path "$tempDir\*" -DestinationPath $outputFile -Force
    Write-Host "Package created successfully: $outputFile" -ForegroundColor Green
    
    # Show file size
    $fileSize = (Get-Item $outputFile).Length
    $fileSizeKB = [math]::Round($fileSize / 1024, 2)
    Write-Host "Package size: $fileSizeKB KB" -ForegroundColor Cyan
    
    # Clean up temp directory
    Remove-Item $tempDir -Recurse -Force
    Write-Host "Cleaned up temp files" -ForegroundColor Gray
    
    Write-Host "`nPhoebe Chrome Extension package created successfully!" -ForegroundColor Magenta
    Write-Host "You can now upload $outputFile to Chrome Web Store" -ForegroundColor Green
    
} catch {
    Write-Host "Package creation failed: $_" -ForegroundColor Red
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force
    }
} 