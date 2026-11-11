$ErrorActionPreference = "Continue"
$lat = "-9.369876303963066"
$lon = "-40.51293408594943"
$lat2 = "-9.375"
$lon2 = "-40.520"

function PostJson($url, $headers, $bodyObj) {
  $body = if ($bodyObj -is [string]) { $bodyObj } else { $bodyObj | ConvertTo-Json -Depth 10 }
  return Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body -TimeoutSec 90
}

Write-Output "=== 1. LOGIN ==="
$cust = PostJson "https://api.movymob.com/Customer/login" @{ "Content-Type" = "application/json" } @{
  email = "alexmoura-2015@hotmail.com"
  password = "12345678"
  deviceToken = "e2e-cancel"
  generateToken = $false
}
$c = $cust.data

$drv = PostJson "https://api.movymob.com/Driver/Authenticate" @{ "Content-Type" = "application/json" } @{
  stdObject = @(@{
    email = "denvdeveloper@gmail.com"
    password = "12345678"
    deviceToken = "e2e-cancel"
  })
}
$d = $drv.data
Write-Output "CUSTOMER ok idUser=$($c.idUser)"
Write-Output "DRIVER ok idDriver=$($d.idDriver) idUser=$($d.idUser)"
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
Write-Output "DRIVER status=$($tog.data.status)"

Write-Output "=== 3. CALCULAR PRECO E CRIAR CORRIDA ==="
$calc = PostJson "https://api.movymob.com/price/calculateAll" $ch @{
  origin = @{ latitude = $lat; longitude = $lon; address = "Origem Cancel Test" }
  destiny = @{ latitude = $lat2; longitude = $lon2; address = "Destino Cancel Test" }
  waypoints = @()
  timeCurrent = (Get-Date).ToString("HH:mm:ss")
}
$p = @($calc.data.prices)[0]

$trip = PostJson "https://api.movymob.com/Customer/NewTrip" $ch @{
  stdObject = @(@{
    origin = @{ latitude = $lat; longitude = $lon; address = "Origem Cancel Test" }
    destination = @{ latitude = $lat2; longitude = $lon2; address = "Destino Cancel Test" }
    userId = $c.idUser
    tripTypeId = [int]$p.tripTypeId
    tripPaymentFormId = 16
    price = [double]$p.price
    priceId = [int]$p.idPrice
    distance = [double]$calc.data.distance
    estimatedTripTime = [int]$calc.data.duration
    isOffer = $false
  })
}
$ref = $trip.data.tripReference
Write-Output "NEWTRIP ok ref=$ref idTrip=$($trip.data.idTrip) status=$($trip.data.status)"

Write-Output "=== 4. MOTORISTA ACEITA ==="
Start-Sleep -Seconds 2
$accept = PostJson "https://api.movymob.com/Driver/AcceptTrip" $dh @{
  stdObject = @(@{
    driverId = $d.idDriver
    tripReference = $ref
    estimatedTimeDriverArrival = 3
    distanceDriverArrival = 0.2
  })
}
Write-Output "ACCEPT status=$($accept.status) msg=$($accept.message)"

$getBefore = PostJson "https://api.movymob.com/Trip/Get" $dh @{ stdObject = @(@{ tripReference = $ref }) }
Write-Output "TRIP BEFORE CANCEL status=$($getBefore.data.status) driverId=$($getBefore.data.driverId)"

Write-Output "=== 5. CANCELAMENTO PELA CENTRAL ==="
$cancelRes = PostJson "https://api.movymob.com/trip/cancel" $dh @{
  tripReference = $ref
  canceledBy = "central"
  cancellationReasonsId = 1
}
Write-Output "CANCEL RESPONSE: status=$($cancelRes.status) msg=$($cancelRes.message)"

Write-Output "=== 6. VERIFICAR ESTADO DA CORRIDA E MOTORISTA APOS CANCELAMENTO ==="
$getAfter = PostJson "https://api.movymob.com/Trip/Get" $dh @{ stdObject = @(@{ tripReference = $ref }) }
Write-Output "TRIP AFTER CANCEL status=$($getAfter.data.status) canceledBy=$($getAfter.data.canceledBy)"

# Consultar status do motorista
$driverActive = PostJson "https://api.movymob.com/Driver/Find" $dh @{
  stdObject = @(@{ driverId = $d.idDriver })
}
Write-Output "DRIVER AFTER CANCEL status=$($driverActive.data.status) appIsOpen=$($driverActive.data.appIsOpen)"

# Desligar motorista
$off = PostJson "https://api.movymob.com/Driver/ToggleStatus" $dh @{
  stdObject = @(@{
    driverId = $d.idDriver
    status = "desligado"
    cityId = 5695
    location = @{ latitude = $lat; longitude = $lon }
  })
}
Write-Output "DRIVER final status=$($off.data.status)"
Write-Output "=== FIM TESTE CANCELAMENTO ref=$ref ==="
