$headers = @{
    "token" = "MTc5NDE1Njg0MDg="
    "userid" = "8"
    "cityid" = "5605"
    "platform" = "1"
    "Content-Type" = "application/json"
}
$w = Invoke-WebRequest -Uri "https://api.movymob.com/city" -Headers $headers -TimeoutSec 15
Write-Output "Status: $($w.StatusCode)"
Write-Output "Content length: $($w.Content.Length)"
Write-Output "Content preview: $($w.Content.Substring(0, [Math]::Min(500, $w.Content.Length)))"
