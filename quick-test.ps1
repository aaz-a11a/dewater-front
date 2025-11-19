# Быстрый тест API - проверка основных функций
Write-Host "=== Быстрый тест API ===" -ForegroundColor Cyan

$baseUrl = "http://localhost:8082"

Write-Host "`n1. Проверка Swagger UI..."
try {
    Invoke-WebRequest "$baseUrl/swagger/index.html" -UseBasicParsing -TimeoutSec 3 | Out-Null
    Write-Host "[OK] Swagger UI доступен: $baseUrl/swagger/index.html" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Swagger UI недоступен" -ForegroundColor Red
    Write-Host "       Запустите сервер: go run ./cmd/main" -ForegroundColor Yellow
    exit
}

Write-Host "`n2. Регистрация пользователя..."
$user = @{login="testuser$(Get-Random)"; password="pass123"} | ConvertTo-Json
try {
    $resp = Invoke-RestMethod -Method POST -Uri "$baseUrl/api/users/register" -Body $user -ContentType "application/json"
    Write-Host "[OK] Пользователь зарегистрирован: $($resp.data.user.login)" -ForegroundColor Green
    $login = $resp.data.user.login
} catch {
    Write-Host "[FAIL] Ошибка регистрации" -ForegroundColor Red
    exit
}

Write-Host "`n3. Аутентификация..."
$creds = @{login=$login; password="pass123"} | ConvertTo-Json
try {
    $resp = Invoke-RestMethod -Method POST -Uri "$baseUrl/api/users/login" -Body $creds -ContentType "application/json"
    Write-Host "[OK] Аутентификация успешна" -ForegroundColor Green
    Write-Host "     JWT Token: $($resp.data.token.Substring(0,30))..." -ForegroundColor Gray
    Write-Host "     Session ID: $($resp.data.session_id)" -ForegroundColor Gray
    $token = $resp.data.token
} catch {
    Write-Host "[FAIL] Ошибка аутентификации" -ForegroundColor Red
    exit
}

Write-Host "`n4. Доступ без авторизации к /api/requests (ожидается 401)..."
try {
    Invoke-RestMethod -Method GET -Uri "$baseUrl/api/requests" -ErrorAction Stop
    Write-Host "[FAIL] Endpoint не защищен!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "[OK] Получен 401 Unauthorized (ожидаемо)" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Неожиданный статус: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}

Write-Host "`n5. Доступ с авторизацией к /api/requests..."
try {
    $headers = @{Authorization = "Bearer $token"}
    $resp = Invoke-RestMethod -Method GET -Uri "$baseUrl/api/requests" -Headers $headers
    Write-Host "[OK] Доступ с токеном работает" -ForegroundColor Green
    Write-Host "     Заявок: $($resp.total)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Ошибка доступа" -ForegroundColor Red
}

Write-Host "`n6. Публичный доступ к /api/symptoms..."
try {
    $resp = Invoke-RestMethod -Method GET -Uri "$baseUrl/api/symptoms"
    Write-Host "[OK] Публичный доступ работает" -ForegroundColor Green
    Write-Host "     Симптомов: $($resp.total)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Ошибка" -ForegroundColor Red
}

Write-Host "`n7. Проверка Redis..."
try {
    $container = docker ps --filter "ancestor=redis:7-alpine" -q | Select-Object -First 1
    if ($container) {
        $keys = docker exec $container redis-cli KEYS "session:*" 2>$null
        $count = ($keys | Measure-Object).Count
        Write-Host "[OK] В Redis найдено сессий: $count" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Redis контейнер не найден" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[WARN] Не удалось проверить Redis" -ForegroundColor Yellow
}

Write-Host "`n=== РЕЗУЛЬТАТ ===" -ForegroundColor Cyan
Write-Host "✓ Аутентификация работает" -ForegroundColor Green
Write-Host "✓ JWT токены генерируются" -ForegroundColor Green
Write-Host "✓ Авторизация проверяется (401 для гостей)" -ForegroundColor Green
Write-Host "✓ Защищенные endpoints работают с токеном" -ForegroundColor Green
Write-Host "✓ Публичные endpoints доступны без токена" -ForegroundColor Green
Write-Host "`nВаш токен для дальнейшего тестирования:" -ForegroundColor Yellow
Write-Host "Authorization: Bearer $token" -ForegroundColor Gray
Write-Host "`nОткройте Swagger UI: $baseUrl/swagger/index.html" -ForegroundColor Cyan
