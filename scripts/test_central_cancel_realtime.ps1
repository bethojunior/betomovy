$ErrorActionPreference = "Continue"
$lat = "-9.369876303963066"
$lon = "-40.51293408594943"
$lat2 = "-9.375"
$lon2 = "-40.520"

function PostJson($url, $headers, $bodyObj) {
  $body = if ($bodyObj -is [string]) { $bodyObj } else { $bodyObj | ConvertTo-Json -Depth 10 }
  return Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body -TimeoutSec 60
}

function PutJson($url, $headers, $bodyObj) {
  $body = if ($bodyObj -is [string]) { $bodyObj } else { $bodyObj | ConvertTo-Json -Depth 10 }
  return Invoke-RestMethod -Uri $url -Method PUT -Headers $headers -Body $body -TimeoutSec 60
}

Write-Output "=================================================="
Write-Output " TESTE: CENTRAL CANCELAMENTO EM TEMPO REAL"
Write-Output "=================================================="

# 1. Login Passageiro e Motorista
$cust = PostJson "https://api.movymob.com/Customer/login" @{ "Content-Type" = "application/json" } @{
  email = "alexmoura-2015@hotmail.com"
  password = "12345678"
  deviceToken = "test-sync-central"
  generateToken = $false
}
$c = $cust.data

$drv = PostJson "https://api.movymob.com/Driver/Authenticate" @{ "Content-Type" = "application/json" } @{
  stdObject = @(@{
    email = "denvdeveloper@gmail.com"
    password = "12345678"
    deviceToken = "test-sync-driver"
  })
}
$d = $drv.data
Write-Output "[LOGIN] Cliente ID: $($c.idUser), Motorista ID: $($d.idDriver)"

$ch = @{ token = $c.api_token; userid = [string]$c.idUser; platform = "android"; version = "1.10.0"; "Content-Type" = "application/json" }
$dh = @{ token = $d.api_token; userid = [string]$d.idUser; platform = "android"; version = "1.10.0"; "Content-Type" = "application/json" }

# 2. Deixar Motorista Disponivel
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
Write-Output "[STATUS] Motorista status alterado: $($tog.data.status)"

# 3. Calcular Preco
$calc = PostJson "https://api.movymob.com/price/calculateAll" $ch @{
  origin = @{
    latitude = $lat; longitude = $lon; address = "Origem Teste Central"
    street = "Rua A"; neighborhood = "Centro"; city = "Petrolina"; state = "PE"; country = "BR"
  }
  destiny = @{
    latitude = $lat2; longitude = $lon2; address = "Destino Teste Central"
    street = "Rua B"; neighborhood = "Centro"; city = "Petrolina"; state = "PE"; country = "BR"
  }
  waypoints = @()
  timeCurrent = (Get-Date).ToString("HH:mm:ss")
}
$p = @($calc.data.prices)[0]
Write-Output "[PRECO] Tipo Viagem: $($p.tripTypeId) - R$ $($p.price), PrecoID: $($p.idPrice)"

# 4. Criar Chamada de Corrida
$trip = PostJson "https://api.movymob.com/Customer/NewTrip" $ch @{
  stdObject = @(@{
    origin = @{
      latitude = $lat; longitude = $lon; address = "Origem Teste Central"
      street = "Rua A"; neighborhood = "Centro"; city = "Petrolina"; state = "PE"; country = "BR"
    }
    destination = @{
      latitude = $lat2; longitude = $lon2; address = "Destino Teste Central"
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
  })
}
$ref = $trip.data.tripReference
Write-Output "[CHAMADA] Corrida Criada: $ref (status: $($trip.data.status))"

# 5. Motorista pesquisa corrida (deve receber a chamada)
Start-Sleep -Seconds 2
$search = PostJson "https://api.movymob.com/Driver/searchTrip" $dh @{
  stdObject = @(@{
    driverId = [int]$d.idDriver
    userId = [int]$d.idUser
    location = @{ latitude = [double]$lat; longitude = [double]$lon }
    listTripsDenied = @()
  })
}
Write-Output "[MOTORISTA RECEBENDO CHAMADA] isCalling=$($search.data.isCalling), Ref=$($search.data.tripReference)"

# 6. Central executa o cancelamento da corrida em tempo real
Write-Output "[CENTRAL] Central executando cancelamento: PUT /trip/$ref/cancel..."
$cancelRes = PutJson "https://api.movymob.com/trip/$ref/cancel" $ch @{
  scope = "single"
  dateEnd = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
}
Write-Output "[CENTRAL] Resposta Cancelamento: status=$($cancelRes.status), msg=$($cancelRes.message)"

# 7. Motorista pesquisa corrida imediatamente apos o cancelamento da Central
Start-Sleep -Seconds 1
$searchAfterCancel = PostJson "https://api.movymob.com/Driver/searchTrip" $dh @{
  stdObject = @(@{
    driverId = [int]$d.idDriver
    userId = [int]$d.idUser
    location = @{ latitude = [double]$lat; longitude = [double]$lon }
    listTripsDenied = @()
  })
}
Write-Output "[MOTORISTA APOS CANCEL] isCalling=$($searchAfterCancel.data.isCalling), tripRef=$($searchAfterCancel.data.tripReference)"

# 8. Se o motorista tentar aceitar corrida que a Central acabou de cancelar
$tryAccept = PostJson "https://api.movymob.com/Driver/AcceptTrip" $dh @{
  stdObject = @(@{
    driverId = [string]$d.idDriver
    tripReference = $ref
    estimatedTimeDriverArrival = 5
    distanceDriverArrival = 1000
  })
}
Write-Output "[MOTORISTA TENTATIVA ACEITE] status=$($tryAccept.status), msg=$($tryAccept.message)"

# 9. Verificar status final do motorista
$driverStatus = PostJson "https://api.movymob.com/Driver/Find" $dh @{
  driverId = [int]$d.idDriver
  showStatistics = $false
}
Write-Output "[MOTORISTA FINAL] Status: $($driverStatus.data.status)"

if ($searchAfterCancel.data.isCalling -eq 0 -or $null -eq $searchAfterCancel.data.isCalling) {
  Write-Output ">>> SUCESSO COMPLETO: Corrida cancelada pela Central limpou a chamada do motorista imediatamente!"
} else {
  Write-Output ">>> FALHA: Chamada ainda ativa para o motorista."
}
