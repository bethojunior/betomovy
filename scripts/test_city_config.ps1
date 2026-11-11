$headers = @{
    "token" = "MTc5NDE1Njg0MDg="
    "userid" = "8"
    "cityid" = "5605"
    "platform" = "1"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

Write-Host "Getting City 5605 config..."
try {
    $resp = Invoke-RestMethod -Uri "https://api.movymob.com/city/5605/config" -Method GET -Headers $headers
    Write-Host "Status: $($resp.status)"
    $configs = $resp.data
    $typeMoneyItem = $configs | Where-Object { $_.attribute -eq "typeMoney" }
    Write-Host "typeMoney item: $($typeMoneyItem | ConvertTo-Json -Depth 2)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
