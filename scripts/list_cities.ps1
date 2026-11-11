$headers = @{
    "token" = "MTc5NDE1Njg0MDg="
    "userid" = "8"
    "cityid" = "5605"
    "platform" = "1"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

Write-Host "Getting active cities..."
try {
    $cities = Invoke-RestMethod -Uri "https://api.movymob.com/city" -Method GET -Headers $headers
    $cities.data | Select-Object idCity, name, state, active | Format-Table
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
