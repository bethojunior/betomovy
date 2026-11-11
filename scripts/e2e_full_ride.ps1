$ErrorActionPreference = "Continue"
$lat = "-9.369876303963066"
$lon = "-40.51293408594943"
$lat2 = "-9.375"
$lon2 = "-40.520"

function Show($label, $obj) {
  $s = if ($null -eq $obj) { "null" } else { ($obj | ConvertTo-Json -Depth 6 -Compress) }
  if ($s.Length -gt 900) { $s = $s.Substring(0, 900) + "..." }
  Write-Output "[$label] $s"
}

function PostJson($url, $headers, $bodyObj) {
  $body = if ($bodyObj -is [string]) { $bodyObj } else { $bodyObj | ConvertTo-Json -Depth 10 }
  return Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body -TimeoutSec 90
}

Write-Output "=== 1. LOGIN ==="
$cust = PostJson "https://api.movymob.com/Customer/login" @{ "Content-Type" = "application/json" } @{
  email = "alexmoura-2015@hotmail.com"
  password = "12345678"
  deviceToken = "e2e-full"
  generateToken = $false
}
$c = $cust.data
$drv = PostJson "https://api.movymob.com/Driver/Authenticate" @{ "Content-Type" = "application/json" } @{
  stdObject = @(@{
    email = "denvdeveloper@gmail.com"
    password = "12345678"
    deviceToken = "e2e-full"
  })
}
$d = $drv.data
Write-Output "CUSTOMER ok idUser=$($c.idUser) token=$([bool]$c.api_token)"
Write-Output "DRIVER ok idDriver=$($d.idDriver) idUser=$($d.idUser) status=$($d.status)"
$ch = @{ token = $c.api_token; userid = [string]$c.idUser; platform = "android"; version = "1.10.0"; "Content-Type" = "application/json" }
$dh = @{ token = $d.api_token; userid = [string]$d.idUser; platform = "android"; version = "1.10.0"; "Content-Type" = "application/json" }

Write-Output "=== 2. MOTORISTA ONLINE ==="
$tog = PostJson "https://api.movymob.com/Driver/ToggleStatus" $dh @{
  stdObject = @(@{
    driverId = $d.idDriver
    status = "disponivel"
    cityId = 5695
    location = @{
      latitude = $lat
      longitude = $lon
      date = (Get-Date).ToUniversalTime().ToString("o")
    }
  })
}
Write-Output "TOGGLE status=$($tog.status) driver=$($tog.data.status) lat=$($tog.data.last_lat)"

Write-Output "=== 3. CALCULAR PRECO ==="
$calc = PostJson "https://api.movymob.com/price/calculateAll" $ch @{
  origin = @{
    latitude = $lat; longitude = $lon; address = "Origem E2E Full"
    street = "Rua A"; neighborhood = "Centro"; city = "Petrolina"; state = "PE"; country = "BR"
  }
  destiny = @{
    latitude = $lat2; longitude = $lon2; address = "Destino E2E Full"
    street = "Rua B"; neighborhood = "Centro"; city = "Petrolina"; state = "PE"; country = "BR"
  }
  waypoints = @()
  timeCurrent = (Get-Date).ToString("HH:mm:ss")
}
$p = @($calc.data.prices)[0]
Write-Output "PRICE ok idPrice=$($p.idPrice) tripTypeId=$($p.tripTypeId) price=$($p.price) dist=$($calc.data.distance)"

Write-Output "=== 4. CRIAR CORRIDA ==="
$trip = PostJson "https://api.movymob.com/Customer/NewTrip" $ch @{
  stdObject = @(@{
    origin = @{
      latitude = $lat; longitude = $lon; address = "Origem E2E Full"
      street = "Rua A"; neighborhood = "Centro"; city = "Petrolina"; state = "PE"; country = "BR"
    }
    destination = @{
      latitude = $lat2; longitude = $lon2; address = "Destino E2E Full"
      street = "Rua B"; neighborhood = "Centro"; city = "Petrolina"; state = "PE"; country = "BR"
    }
    userId = $c.idUser
    tripTypeId = [int]$p.tripTypeId
    tripPaymentFormId = 16
    waypoints = $null
    tolls = $null
    cardId = $null
    schedule = $null
    scheduleISO = $null
    price = [double]$p.price
    priceId = [int]$p.idPrice
    favorites = $null
    multiplierDynamic = ([double]($p.priceDynamicValue))
    tripDiscountCoupon = $null
    distance = [double]$calc.data.distance
    estimatedTripTime = [int]$calc.data.duration
    isOffer = $false
    cashback = ""
  })
}
$ref = $trip.data.tripReference
Write-Output "NEWTRIP status=$($trip.status) ref=$ref idTrip=$($trip.data.idTrip) tripStatus=$($trip.data.status) callingDriver=$($trip.data.callingDriver)"
if (-not $trip.status) {
  Show "NEWTRIP_FAIL" $trip
  exit 1
}

Write-Output "=== 5. SEARCHTRIP ==="
Start-Sleep -Seconds 2
$search = PostJson "https://api.movymob.com/Driver/searchTrip" $dh @{
  stdObject = @(@{
    driverId = $d.idDriver
    location = @{ latitude = $lat; longitude = $lon }
    listTripsDenied = @()
  })
}
Write-Output "SEARCH status=$($search.status) isCalling=$($search.data.isCalling) callingDriver=$($search.data.callingDriver) ref=$($search.data.tripReference) tripStatus=$($search.data.status)"

Write-Output "=== 6. ACEITAR ==="
$accept = PostJson "https://api.movymob.com/Driver/AcceptTrip" $dh @{
  stdObject = @(@{
    driverId = $d.idDriver
    tripReference = $ref
    estimatedTimeDriverArrival = 3
    distanceDriverArrival = 0.2
  })
}
Write-Output "ACCEPT status=$($accept.status) msg=$($accept.message)"
Show "ACCEPT.data" $accept.data
$get1 = PostJson "https://api.movymob.com/Trip/Get" $dh @{ stdObject = @(@{ tripReference = $ref }) }
Write-Output "GET_AFTER_ACCEPT status=$($get1.data.status) driverId=$($get1.data.driverId)"

Write-Output "=== 7. CHEGADA ==="
$arr = PostJson "https://api.movymob.com/Driver/InformArrival" $dh @{
  stdObject = @(@{ tripReference = $ref })
}
Write-Output "ARRIVAL status=$($arr.status) msg=$($arr.message)"
$get2 = PostJson "https://api.movymob.com/Trip/Get" $dh @{ stdObject = @(@{ tripReference = $ref }) }
Write-Output "GET_AFTER_ARRIVAL status=$($get2.data.status) driverId=$($get2.data.driverId)"

Write-Output "=== 8. INICIAR ==="
$init = PostJson "https://api.movymob.com/Driver/InitTrip" $dh @{
  stdObject = @(@{ tripReference = $ref })
}
Write-Output "INIT status=$($init.status) msg=$($init.message)"
$get3 = PostJson "https://api.movymob.com/Trip/Get" $dh @{ stdObject = @(@{ tripReference = $ref }) }
Write-Output "GET_AFTER_INIT status=$($get3.data.status) driverId=$($get3.data.driverId)"

Write-Output "=== 9. FINALIZAR ==="
$sw = [Diagnostics.Stopwatch]::StartNew()
try {
  $fin = PostJson "https://api.movymob.com/Driver/FinishTrip" $dh @{
    stdObject = @(@{ tripReference = $ref })
  }
  Write-Output "FINISH status=$($fin.status) msg=$($fin.message) ms=$($sw.ElapsedMilliseconds)"
} catch {
  Write-Output "FINISH ERR ms=$($sw.ElapsedMilliseconds) :: $($_.Exception.Message)"
  $fin = $null
}
Show "FINISH.data" $fin.data
$get4 = PostJson "https://api.movymob.com/Trip/Get" $dh @{ stdObject = @(@{ tripReference = $ref }) }
Write-Output "GET_AFTER_FINISH status=$($get4.data.status) driverId=$($get4.data.driverId) price=$($get4.data.price) endDate=$($get4.data.endDate)"

Write-Output "=== 10. MOTORISTA OFF ==="
$off = PostJson "https://api.movymob.com/Driver/ToggleStatus" $dh @{
  stdObject = @(@{
    driverId = $d.idDriver
    status = "desligado"
    cityId = 5695
    location = @{
      latitude = $lat
      longitude = $lon
      date = (Get-Date).ToUniversalTime().ToString("o")
    }
  })
}
Write-Output "DRIVER now=$($off.data.status)"
Write-Output "=== FIM E2E FULL ref=$ref ==="
