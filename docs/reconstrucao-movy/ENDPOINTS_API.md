# ENDPOINTS DA API consumidos pelo app

> Extraído por grep dos call sites `apiMain/apiMainDriver/apiDelivery/apiIfood/apiCentral/apiSpeedMob` em `src/` (2026-11-10). Base: `https://api.movymob.com/` salvo indicação. Revisar paths com `${}` interpolados no código ao implementar.

## Cliente / conta

- `Customer/login`, `Customer/LoginByPhone`, `Customer/newSocialLogin`, `Customer/CheckPassword`, `Customer/ChangePassword`, `Customer/UpdatePassword`, `customer/forgotpasswordpro`, `Customer/SendConfirmationCode`
- `Customer/Register`, `Customer/RegisterWithPictures`, `Customer/EditProfile`, `Customer/UpdateProfileImage`, `Customer/Find`, `user/checkaccountapppartner`, `Partner/FindByUser`
- `CustomerCard/Get|Insert|Delete` (cartões Stripe)
- `CustomerPlace/getAll|Insert` (endereços salvos), `FavoriteDriver/list|Insert|Delete`, `AddressBlacklist/Insert`, `listcontacts/savelistcontactgeneral`

## Corrida — cliente

- `Customer/NewTrip`, `Ride/New`, `Ride/cancel`, `Customer/CancelTrip`, `customerRide/Request|Cancel|FindActives|FindByUser`, `Partner/NewTrip`, `KnobTrip/Init`
- `Trip/Get`, `trip/get`, `Trip/RecalculatePrice`, `trip/changeRoute`, `Price/Calculate`, `price/calculateAll`, `Price/PreviewNewPriceInChangeRoute`, `price/getWaitingTimeFees`, `customer/checkcancellationfee`, `Trip/Report`, `TripReport/InsertByCustomer`, `TripReportType/GetAll`, `/cancellationReasons/getReports`, `CancellationReasons/GetAll|GetAllCustomer`
- `TripRating/Rate`, `TripPaymentForm/GetAll`, `/trip/payWithPixAtEnd`, `/trip/pix`
- `VoucherPurchase/CustomerInsert|PurchaseByPix|Show`, `DiscountCoupon/Activate`, `/CreditPrepaid/Show|Purchase`, `Adquirer/CurrentAdquirer`, `KEY_MERCADOPAGO`, `disable_mercado_pago_app`

## Corrida — motorista

- `Driver/Register`, `Driver/Find`, `Driver/FindWithAccountInfo`, `Driver/FindWithPendencies`, `driver/edit`, `Driver/EditProfileImage`, `Driver/CheckPassword`
- `Driver/ToggleStatus` (disponibilidade), `Driver/PutPreAvailable`, `Driver/searchTrip`, `Driver/AcceptTrip`, `Driver/AcceptScheduled`, `driver/refuseTrip`, `RefusedDriver/Insert|Delete|list`, `Driver/CancelTrip`, `Driver/ConfirmWaypoint`
- `Driver/InformArrival`, `Driver/InitTrip`, `Driver/PutTripInWaiting`, `Driver/FinishWaitingTime`, `driver/saveTimeWaiting`, `taximeterTrip/start|update|finalize`, `TaximeterTrip/finalize|update`
- `Driver/GetTrips`, `Customer/GetTrips`, `Trip/Get`, `Driver/WeeklyEarnings`, `Balance/DriverTransactions|GetTypes|LastDriverTransactions`, `DriverCredit/AddViaPix|ShowCreditPix`
- `tripbid/create`, `tripbid/acceptOfferByDriver` (negociação/contraoferta)
- `DriverAppInfo/SendDriverAppInfo`, `driver/GetDriverHours`

## Documentos e veículos

- `DocUser/Send`, `DocUserType/FindByUserType`, `Car/InsertSecondCar`
- `Bank/GetAll`, `BankAccount/Insert|Edit`, `Withdraw/New|new`
- `Station/GetByDriver|InsertByDriver|Edit`, `StationType/Get`, `Driver/DefaultStation`, `StationPointReturn` (telas)

## Chat / suporte / risco

- `ChatTrip/SendMessage|SendMessageAudio`, `ChatBotTrip/SendMessage`, `Support/SendAlertHelpWithData`, `Customer/HelpMeEmail`, `riskArea/store`

## Config / catálogos

- `App/CheckVersion`, `appconfig/findbyapp`, `appactivemodule/getallactivemodules`, `config/general`, `config/getapppartner`, `configmenuapp/search`, `menuApp/addAds`, `city/getactives`, `usertype/drivers|driversbyapppartners`, `DriverFormOfPayment/Insert`, `/RefusedDriver/list`

## Delivery / parceiros

- `apiDelivery` (base `delivery-api-<app>.prod.704apps.com.br`): endpoints a detalhar em `client/api/apiDelivery.js` e rotas delivery.
- `apiIfood`, `apiCentral`, `apiSpeedMob` (drivers): idem — próximos da fila de inventário.
