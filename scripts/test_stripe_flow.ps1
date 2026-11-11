$ErrorActionPreference = "Continue"

function PostJson($url, $headers, $bodyObj) {
    $body = if ($bodyObj -is [string]) { $bodyObj } else { $bodyObj | ConvertTo-Json -Depth 10 }
    return Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body -TimeoutSec 90
}

function GetJson($url, $headers) {
    return Invoke-RestMethod -Uri $url -Method GET -Headers $headers -TimeoutSec 90
}

Write-Output "=== 1. CUSTOMER LOGIN ==="
$cust = PostJson "https://api.movymob.com/Customer/login" @{ "Content-Type" = "application/json" } @{
    email = "alexmoura-2015@hotmail.com"
    password = "12345678"
    deviceToken = "e2e-stripe"
    generateToken = $false
}
$c = $cust.data
$ch = @{
    token = $c.api_token
    userid = [string]$c.idUser
    platform = "android"
    version = "1.10.0"
    "Content-Type" = "application/json"
}
Write-Output "Customer Logged In: idUser=$($c.idUser)"

Write-Output "`n=== 2. CUSTOMER CARDS (CustomerCard/Get) ==="
try {
    $cards = GetJson "https://api.movymob.com/CustomerCard/Get" $ch
    $cards | ConvertTo-Json -Depth 6
} catch {
    Write-Output "Error: $($_.Exception.Message)"
}

Write-Output "`n=== 3. ACQUIRER INFO (CustomerCard/Acquirer) ==="
try {
    $acq = GetJson "https://api.movymob.com/CustomerCard/Acquirer" $ch
    $acq | ConvertTo-Json -Depth 6
} catch {
    Write-Output "Error: $($_.Exception.Message)"
}
