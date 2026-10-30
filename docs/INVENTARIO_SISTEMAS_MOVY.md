# Inventário dos sistemas MOVY

Levantamento feito no diretório `D:\APLICATIVO MOVY` em 2026-10-30. Nomes abaixo são os diretórios e arquivos encontrados, não suposições de deploy.

## Aplicativos

| Diretório | Papel |
|---|---|
| `mobility-pro-app-rota101-pro` | App React Native/Expo usado no Android. Cliente e motorista no mesmo projeto (`src/client`, `src/driver`). Versão já configurada: 8.2.2, `versionCode` 80202 |
| `mobility-pro-app-rota101-pro-ios` | Cópia do app para iOS. `CFBundleShortVersionString` 8.2.2 em `ios/Route95Pro/Info.plist` |
| `mobilidade-appclient-cordova-rota101` | Cliente Cordova legado |
| `mobilidade-driverapp-cordova-rota101` | Motorista Cordova legado |

## Backend e tempo real

| Diretório | Papel |
|---|---|
| `mobilidade-api-php-master` | API principal. Criação da corrida em `app/dao/CustomerDao.php`. Distribuição em `CustomerTripCallService` e comando `trip-call` |
| `mobilidade-api-node-main` | NestJS. Webhook `POST /webhook/trip` e Socket.IO em `src/modules/events/events.gateway.ts` |
| `delivery-realtimeapi-master` | Socket legado de chat/entrega |
| `delivery-api-master` | API de delivery |
| `mobilidade-central-api-master` | API da Central |
| `mobilidade-monitorapiv2-master` | API do Monitor |

## Painéis

| Diretório | Papel |
|---|---|
| `mobilidade-monitor-new-main` | Monitor atual. Rota `/config/rates` aponta para `TypesTravels` em `LoggedRoutes.tsx` (134 rotas `<Route path=` nesse arquivo) |
| `mobilidade-monitor-master` | Monitor anterior |
| `mobilidade-central-master` | Central PHP. Controladores em `src/controller`, incluindo `TripController`, `DriverController`, `CustomerController`, `RateController` |
| `mobilidade-site-novo-main` e `mobilidade-site-master` | Sites |

## Fluxo real da chamada

1. App do cliente: `src/client/contexts/Trip/index.tsx` → `newTrip`.
2. API PHP: `CustomerDao` grava a trip, chama `CustomerTripCallService::callDrivers`.
3. Motoristas saem da view `drivers_close_the_trip_view`.
4. `TripRealtime` publica `trip-created` no socket (`TripSocketService`) ou no Firestore, conforme `enable_realtime_socket`.
5. API Node emite `trip-available` para a sala `driver:{id}`.
6. App do motorista: `TripRealtimeComponent` chama `Driver/searchTrip` e abre `ModalCallTripComponent`.
7. Aceite: `Driver/AcceptTrip` → `DriverDao::acceptTrip`.

## Banco e infraestrutura

Não houve conexão com o MySQL `movy-mysql` nem com o painel da DigitalOcean nesta sessão. Não existe, no workspace, a definição SQL da view `drivers_close_the_trip_view`. Credenciais de produção não foram lidas nem impressas.

## Pagamentos localizados

A API PHP tem controladores de cartão, saldo, saque, voucher e webhook (`CardController`, `BalanceController`, `WithdrawController`, `PaymentWebhookController`). Não foi executada transação.
