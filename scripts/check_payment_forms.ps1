$userJson = Get-Content -Raw "scripts/test_user.json" | ConvertFrom-Json
$token = $userJson.token

$headers = @{
    "Authorization" = "Bearer $token"
    "Origin" = "https://movymob.com"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

Write-Host "Getting PaymentForms for customer..."
try {
    $resp = Invoke-RestMethod -Uri "https://api.movymob.com/Customer/PaymentForms" -Method Get -Headers $headers
    $resp | ConvertTo-Json -Depth 6
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host "`nGetting PaymentGateway / Acquirer info if available..."
try {
    $acq = Invoke-RestMethod -Uri "https://api.movymob.com/Customer/PaymentGateway" -Method Get -Headers $headers
    $acq | ConvertTo-Json -Depth 6
} catch {
    Write-Host "PaymentGateway endpoint error: $($_.Exception.Message)"
}
