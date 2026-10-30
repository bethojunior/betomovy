# Correções MOVY — chamadas de corrida

Data da análise: 2026-10-30.

## Evidência no banco (somente leitura)

As corridas 15912 a 15916 ficaram `not_answered`. Em todas, `callingDriver` era o motorista 1037, que estava `disponivel`, a cerca de 9 metros, com token Expo. `enable_realtime_socket` = 1 e `fast_finger_call` = 0. O backend escolheu o motorista. O aplicativo não aceitou a chamada.

## Causa que apagava a chamada

`TripCallDriverCommand::verifyTripIsSearching` lia a tabela `tripDrivers`, não a corrida. Esse registro não tem o status `searching`. O comando republicava o evento em tempo real sem status. A API Node, ao ver a corrida sair de `searching`, emitia `trip-available` com tipo `removed` para o motorista. A chamada some no mesmo instante em que é criada.

O push Expo ia para o canal `default`. O som do aplicativo está no canal `tripCall`. No iOS, `assobio.mp3` não é formato aceito pelo APNs.

## Causa raiz comprovada no código

O cliente cria a corrida em `CustomerDao::newTrip`. Os motoristas elegíveis entram em `driverCalled` e em `trip.callingDriver`. A entrega ao aplicativo do motorista dependia de três caminhos, e os três falhavam de formas independentes:

1. **Push.** `Push::buildDataPayload` aplicava `strval` em `additionalData`, que é um array (`tripReference`, `userId`, `tripCallTypeId`). No PHP 8 isso lança `TypeError` e a notificação não sai. Quando o envio passava, o FCM de chamada não usava o canal de som do aplicativo e o app exigia `userId` já parseado para abrir a tela. Sem `userId`, o toque e o modal não eram disparados.
2. **Tela e som no aplicativo.** `TripRealtimeComponent` não gravava o modal nem o toque quando o app não estava `active`/`background`, e não retomava o alerta ao voltar para primeiro plano. Uma resposta duplicada ou vazia de `Driver/searchTrip` fechava a chamada que já estava na tela.
3. **Firestore.** A consulta `callingDriver array-contains` exigia o mesmo tipo do id. Documento com string e consulta com número (ou o inverso) não entrega a corrida. O campo `driver == null` também descartava documentos em que o motorista ainda não existia no documento.
4. **Processo `trip-call`.** O disparo usava `/usr/bin/php` fixo. Se esse binário não existir no container, o revezamento e o push individual do comando não rodam. O push imediato agora sai no próprio request, depois do commit.

O aceite concorrente já está protegido: `TripDao::acceptTrip` atualiza somente com `driverId IS NULL` e `sqlUpdate` falha quando nenhuma linha muda.

## Alterações

| Arquivo | Correção |
|---|---|
| `mobilidade-api-php-master/app/utils/PushData.php` | Serializa arrays do push como JSON string |
| `mobilidade-api-php-master/app/utils/Push.php` | Usa essa serialização e envia alerta visível no canal `tripCall` |
| `mobilidade-api-php-master/app/services/CustomerTripCallService.php` | `notifyFoundDrivers` envia o push dos motoristas já escolhidos |
| `mobilidade-api-php-master/app/dao/CustomerDao.php` | Push depois do commit e `trip-call` via `PHP_BINARY` |
| `mobilidade-api-php-master/app/dao/TripDao.php` | Mesmo fluxo no caminho alternativo de criação |
| `mobilidade-api-php-master/app/services/PartnerTripService.php` | Mesmo fluxo para corrida de parceiro |
| `mobilidade-api-php-master/app/services/NewFreightService.php` | Mesmo fluxo para frete |
| `mobilidade-api-php-master/app/helpers/Job.php` | Processo em background usa o PHP que está executando a API |
| `TripCallDriverCommand.php` | O revezamento passa a publicar a corrida real, com status `searching` |
| `TripRealtime.php` | Id numérico de motorista não zera mais `callingDriver` |
| `Push.php` | Push Android usa o canal `tripCall`; APNs e Expo usam som `default` para o alerta não ser descartado |
| `events.gateway.ts` | Sala do motorista é inscrita mesmo quando o cliente também envia `userId` |
| `public/index.php` e `public/db-migrate.php` | Console SQL público desativado no código. Continua no ar até o deploy |
| `mobilidade-api-php-master/app/realtime/TripRealtime.php` | `callingDriver` vira lista de strings sem estourar se já for array |
| Apps Android e iOS `TripRealtimeComponent` | Modal permanece, som retoma ao abrir o app, busca a cada 5 s enquanto o motorista está online |
| Apps `Trip/index.tsx` e `Trip/service.ts` | `searchTrip` distingue corrida encontrada, ausência e consulta ignorada |
| Apps `firebase/collection/TripCollection.ts` | Escuta id string e número, sem filtrar documento sem motorista |
| Apps `rideCallNotification.ts` e listeners | Abrem a chamada mesmo quando `additionalData` chega como JSON |
| Apps `index.tsx` e `push.ts` | Canal Android `tripCall` com `assobio.mp3`, sem furar o Não Perturbe |
| Apps `SocketConnection.ts` | Reconexão do socket deixa de parar após 5 tentativas |

## O que esta correção não faz

Não publica na DigitalOcean, não gera APK/IPA nesta sessão e não prova o toque em aparelho físico. O modo silencioso e o Não Perturbe continuam sendo respeitados.
