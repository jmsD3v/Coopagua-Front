Write-Host "🔄 Iniciando servicio cooperativa-db..." -ForegroundColor Cyan
docker-compose up -d

Start-Sleep -Seconds 3

Write-Host "🔍 Verificando disponibilidad de PostgreSQL..." -ForegroundColor Yellow
$ready = docker exec cooperativa-db pg_isready -U suadmin

if ($ready -like "*accepting connections*") {
    Write-Host "✅ PostgreSQL está listo. Ejecutando seeding..." -ForegroundColor Green
    try {
        pnpm db:seed
        Write-Host "🌱 Seeding completado correctamente." -ForegroundColor Green
    } catch {
        Write-Host "❌ Error durante el seeding:" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
} else {
    Write-Host "⚠️ PostgreSQL no está listo. Abortando seeding." -ForegroundColor Red
    Write-Host $ready
}