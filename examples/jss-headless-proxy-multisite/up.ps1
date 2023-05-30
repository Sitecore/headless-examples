$ErrorActionPreference = "Stop";

# Double check whether init has been run
$envCheckVariable = "HOST_LICENSE_FOLDER"
$envCheck = Get-Content .env -Encoding UTF8 | Where-Object { $_ -imatch "^$envCheckVariable=.+" }
if (-not $envCheck) {
    throw "$envCheckVariable does not have a value. Did you run 'init.ps1 -InitEnv'?"
}

# Build all containers in the Sitecore instance, forcing a pull of latest base containers
Write-Host "Building containers... lots of npm so this may take a moment..." -ForegroundColor Green
docker compose build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Container build failed, see errors above."
}

# Start the Sitecore instance
Write-Host "Starting Sitecore environment..." -ForegroundColor Green
docker compose up -d

# Wait for Traefik to expose CM route
Write-Host "Waiting for CM to become available..." -ForegroundColor Green
$startTime = Get-Date
do {
    Start-Sleep -Milliseconds 100
    try {
        $status = Invoke-RestMethod "http://localhost:8079/api/http/routers/cm-secure@docker"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -ne "404") {
            throw
        }
    }
} while ($status.status -ne "enabled" -and $startTime.AddSeconds(15) -gt (Get-Date))
if (-not $status.status -eq "enabled") {
    $status
    Write-Error "Timeout waiting for Sitecore CM to become available via Traefik proxy. Check CM container logs."
}

dotnet sitecore login --cm https://cm.jssheadlessproxymultisite.localhost/ --auth https://id.jssheadlessproxymultisite.localhost/ --allow-write true
if ($LASTEXITCODE -ne 0) {
    Write-Error "Unable to log into Sitecore, did the Sitecore environment start correctly? See logs above."
}

# Populate Solr managed schemas to avoid errors during item deploy
Write-Host "Populating Solr managed schema..." -ForegroundColor Green
dotnet sitecore index schema-populate

# JSS samples have already been serialized, push the serialized items
Write-Host "Pushing items to Sitecore..." -ForegroundColor Green
dotnet sitecore ser push --publish
if ($LASTEXITCODE -ne 0) {
    Write-Error "Serialization push failed, see errors above."
}

Write-Host "Opening site..." -ForegroundColor Green

Start-Process https://site-one.jssheadlessproxymultisite.localhost/
Start-Process https://site-two.jssheadlessproxymultisite.localhost/
Start-Process https://site-two-b.jssheadlessproxymultisite.localhost/

Write-Host ""
Write-Host "Use the following command to monitor the Headless Proxy:" -ForegroundColor Green
Write-Host "docker compose logs -f jss"
Write-Host ""