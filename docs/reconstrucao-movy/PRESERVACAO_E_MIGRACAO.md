# PRESERVAÇÃO DE DADOS E MIGRAÇÃO — MOVY

> Bloco 02 (em andamento). Base: AsyncStorage + MMKV (`storage.get/set` — verificar instância, provável `react-native-mmkv` ou wrapper em `src/utils`).

## Dados do servidor (NÃO recriar)

MySQL de produção (`api.movymob.com`, backend PHP `mobilidade-api-php-master`), Mongo/Redis conforme auditoria (`DOCUMENTACAO_AUDITORIA`). App novo deve apontar para a **mesma API e banco** — proibido backend paralelo.

## Persistência local do app atual (AsyncStorage — chaves observadas)

### Sessão / conta (PRESERVAR na atualização)

- `@Auth:user`, `user`, `account`, `lastLogin`, `lastIdUser`, `biometry_token`, `biometry_switch`, `biometry_enabled`, `biometry_email`

### Configuração / cache (descartável ou re-sincronizável)

- `appConfig`, `generalSettings`, `appSetting`, `configLocal`, `modulesCache`, `@speedmob:CurrentAppConfig`, `@speedmob:datasApplication`, `@speedmob:TypeApp`, `@mobilitypro:theme_app_partner_selected`, `@mobilitypro:appPartnerShow`, `@language`, `logo`

### Corrida em andamento / estado operacional (PRESERVAR — crítico)

- `trip`, `tripDriver`, `tripReference`, `tripSchedule`, `tripPartnerList`, `tripOff`, `tripInWait`, `tripError`, `tripNoDestination`, `preAvailableTrip`, `refusedOffer`, `tripsDeniedDriver`, `customerWaitTime`, `waitingTimer`, `startCounting`, `dateTimeInProgress`, `timePolyline`, `lastGps`, `lastPosition`, `placeSelected`

### UX / cache de conteúdo (descartável)

- `places`, `lastPlaces`, `cardSelected`, `listPrices`, `establishmentCache`, `bagCache`, `ifoodButton`, `deliveryModalVisible`, `modalHorasShownInHome`, `alertLocation`, `lastMessageSendedBot`

### Outros

- `driver-box` (estado do motorista?), chaves `storage.*` (MMKV — mapear arquivo/chaves exatas na sequência).

## Estratégia de atualização (a definir no Bloco 02)

1. Manter `applicationId` e assinatura → update in-place preserva AsyncStorage.
2. Na primeira execução da versão nova: ler chaves legadas acima; sessão (`@Auth:user`/`user`/`account`) deve autenticar sem novo login.
3. Estado de corrida ativo deve ser reconciliado com o servidor (`customerRide/FindActives`, `Driver/searchTrip`) — servidor é autoridade; AsyncStorage é só cache.
4. Chaves novas namespaced (ex.: `@movy:v2:*`) com migração one-shot das chaves críticas; nunca "limpar dados".
5. Testar: instalar build antigo → login → corrida → atualizar APK → verificar sessão, corrida e preferências.

## Servidor

Sem alteração de schema prevista até agora. Qualquer mudança estrutural exige backup + migração versionada (regra do bloco 02).
