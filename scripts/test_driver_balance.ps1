$ErrorActionPreference = "Continue"

function PostJson($url, $headers, $bodyObj) {
    $body = if ($bodyObj -is [string]) { $bodyObj } else { $bodyObj | ConvertTo-Json -Depth 10 }
    return Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body -TimeoutSec 90
}

Write-Output "=== 1. DRIVER LOGIN ==="
$drv = PostJson "https://api.movymob.com/Driver/Authenticate" @{ "Content-Type" = "application/json" } @{
    stdObject = @(@{
        email = "denvdeveloper@gmail.com"
        password = "12345678"
        deviceToken = "e2e-balance"
    })
}
$d = $drv.data
$dh = @{
    token = $d.api_token
    userid = [string]$d.idUser
    platform = "android"
    version = "1.10.0"
    "Content-Type" = "application/json"
}
Write-Output "Driver: idDriver=$($d.idDriver) idUser=$($d.idUser)"

Write-Output "`n=== 2. Balance/LastDriverTransactions ==="
try {
    $last = PostJson "https://api.movymob.com/Balance/LastDriverTransactions" $dh @{
        driverId = $d.idDriver
    }
    $last | ConvertTo-Json -Depth 6
} catch {
    Write-Output "Error: $($_.Exception.Message)"
}

Write-Output "`n=== 3. Driver Info Balance in Authenticate ==="
Write-Output "Balance: $($d.balance | ConvertTo-Json -Depth 4)"
