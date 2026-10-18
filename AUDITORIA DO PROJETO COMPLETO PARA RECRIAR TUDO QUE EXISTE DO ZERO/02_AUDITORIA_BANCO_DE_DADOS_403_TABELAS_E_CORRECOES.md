# AUDITORIA PROFUNDA DO BANCO DE DADOS (403 TABELAS) & PLANO DE CORREÇÃO

## 1. INVENTÁRIO COMPLETO E CATEGORIZAÇÃO DAS 403 TABELAS

A análise minuciosa do dump `rota101_2026-10-13_11-00-48.sql` (179.8 MB) revelou um banco relacional legado com **403 tabelas físicas** e **32 views**, distribuídas nos seguintes 10 grandes domínios de negócio:

### Domínio 1: Corridas, Viagens & Modos de Despacho (57 tabelas)
- **Tabelas Centrais:** `trip`, `calculatedTripPrice`, `recalculatedTrip`, `recalculatedTripType`, `chatTrip`, `messagesChatTrip`, `queueFinishedTrip`, `tripAudit`, `tripCancellationCustomerFee`, `tripCashback`, `tripDiscountCoupon`, `tripPaymentForm`, `tripPriceVariation`, `tripRating`, `tripReceipt`, `tripRefused`, `tripReport`, `tripRouteTracing`, `tripTimelineStatus`, `tripType`, `tripItemType`, `tripLongDistance`.
- **Modos Especiais Descobertos:**
  - `get_bid_by_drivers`: Sistema de leilão/oferta direta de motoristas (estilo Indrive).
  - `searching_favorite`: Chamada direta de motoristas favoritados pelo passageiro.
  - `stationId`: Despacho por Ponto Fixo / Bolsão de Cooperativa.
  - `callGroupsTripTypeLinked`: Agrupamento de cooperativas e frotas privadas.

### Domínio 2: Motoristas, Veículos & Frotas (38 tabelas)
- **Tabelas Centrais:** `driver`, `car`, `carType`, `driverAddress`, `driverAppInfo`, `driverAttachmentType`, `driverBlockRequestAvaliation`, `driverCalled`, `driverCommission`, `driverDocument`, `driverFormOfPaymentBlocked`, `driverLocation`, `driverMovement`, `driverNotification`, `driverPlaces`, `driverRating`, `driverStation`, `driverVehicle`, `vehicle`, `vehicleBrand`, `vehicleModel`.
- **Controle Operacional:**
  - `alvara` e `alvaraPicture`: Licença municipal da prefeitura e fiscalização.
  - `criminalRecord` e `criminalRecordPicture`: Certidão negativa de antecedentes criminais.
  - `cnh` e `crlv`: Documentação do condutor e do automóvel.
  - `TempoAoVolante`: Registro de fadiga e horas contínuas de direção.

### Domínio 3: Passageiros & Clientes (36 tabelas)
- **Tabelas Centrais:** `customer`, `user`, `customerPlaces` (endereços salvos como Casa, Trabalho, Academia), `customerIndication` (indicações de novos usuários), `customerNotification`, `customerRegisterStatus`, `dependentUser` (perfis de dependentes/familiares), `docUser`, `militaryUser` (tarifas especiais para servidores militares/policiais), `corporateRouteCustomer` (transporte corporativo).

### Domínio 4: Financeiro, Pagamentos, Cartões & Carteira (45 tabelas)
- **Tabelas Centrais:** `balance`, `balanceFlow`, `balanceFlowPosted`, `balanceFlowReference`, `balanceFlowType`, `balancePosting`, `balanceTransfer`, `bank`, `bankAccount`, `card`, `cardFlag`, `cardInfo`, `cardTripPayment`, `cardType`, `cashier`, `cieloTransaction`, `creditPrepaid`, `creditPrepaidPurchase`, `driverCommissionRate`, `partnerCommissionRate`, `pixPayment`, `tax`, `taxRate`, `transaction`, `withdraw`, `withdrawSummary`.
- **Gateways Integrados:** Cielo, MercadoPago, eRede, Pix manual e dinâmico, Voucher corporativo, Saldo pré-pago em carteira.

### Domínio 5: Central de Despacho & Atendimento Telefônico (22 tabelas)
- **Tabelas Centrais:** `central`, `centralCallType`, `centralCallTypeConfig`, `centralCustomer`, `centralDriver`, `centralFee`, `centralNeighborhood`, `centralTripInfoQuestion`, `centralTripInfoResponse`, `centralUser`, `centralVersion`, `centralVoucherPurchasePayment`, `central_notification_config_wpp`, `central_wpp`, `operator`, `operatorQueue`.

### Domínio 6: Delivery & Encomendas / iFood (49 tabelas)
- **Tabelas Centrais:** `deliveryCharge`, `deliveryCategory`, `deliveryComplement`, `deliveryFinancialIntermediary`, `deliveryNeighborhood`, `deliveryOrder`, `deliveryOrderHistory`, `deliveryOrderItem`, `deliveryRate`, `companyDeliveryArea`, `companyDeliveryMan`, `ifood_keys`, `ifood_orders`, `ifood_settings`.

### Domínio 7: Geolocalização, Zonas de Tarifa Dinâmica & Restrições (32 tabelas)
- **Tabelas Centrais:** `address`, `addressBlacklist`, `city`, `cityArea`, `cityCallConfig`, `cityConfig`, `dynamicArea`, `estate`, `country`, `neighborhood`, `riskArea`, `stationPoint`, `zone`, `zoneDynamic`.

### Domínio 8: Segurança, Auditoria, Pânico & Bloqueios (15 tabelas)
- **Tabelas Centrais:** `audit`, `internalAudit`, `panicLog`, `panicAlert`, `blacklistUser`, `blacklistUserConfig`, `blockReasons`, `blockReasonsType`, `driverBlockRequestAvaliation`, `driverFormOfPaymentBlocked`, `appLogs`, `logLoginSocial`.

### Domínio 9: Marketing, Fidelidade, Cashback & Cupons (15 tabelas)
- **Tabelas Centrais:** `discountCoupon`, `discountCouponDelivery`, `userDiscountCoupon`, `tripDiscountCoupon`, `cashback`, `tripCashback`, `customerIndication`, `userIndication`, `indicationCommissionType`, `rewardCampaignTrip`, `rewardTrip`, `rewardTripType`, `advertising`, `advertisingAppSite`, `routePromotionalBanner`.

### Domínio 10: Configurações do Sistema, SMS & Comunicação (94 tabelas)
- **Tabelas Centrais:** `config`, `appConfig`, `appModules`, `appActiveModules`, `adminNotification`, `chatBotTrip`, `chatBotTripType`, `emailTemplate`, `smsQueue`, `pushNotification`, `roles`, `permissions`, `appDatabaseVersion`.

---

## 2. FALHAS CRÍTICAS IDENTIFICADAS NO BANCO ATUAL

### Falha 1: Inconsistência Catastrófica de Collation e Charset
- No mesmo banco de dados coexistem tabelas em `latin1_swedish_ci`, colunas em `utf8mb4_unicode_ci` e outras em `utf8mb4_0900_ai_ci`.
- **Consequência:** Ao realizar um `JOIN` entre `customer` (latin1) e `user` (utf8mb4), o MySQL 8 no DigitalOcean aborta com:
  `ERROR 1267 (HY000): Illegal mix of collations (latin1_swedish_ci,IMPLICIT) and (utf8mb4_unicode_ci,COERCIBLE) for operation '='`
- **Impacto:** Esta foi a razão pela qual **32 views foram excluídas** em `BANCO DE DADOS MIGRAR PARA OCEAN/extracted_views.sql`, desabilitando relatórios e consultas essenciais de monitoramento.

### Falha 2: Uso Inaceitável de `float` para Dinheiro e Balanço Financeiro
- Na tabela `balance`:
  `tripBalance float NOT NULL DEFAULT '0'`
  `balance float DEFAULT '0'`
- Na tabela `trip`:
  `price float DEFAULT NULL`
- **Consequência:** O tipo `float` é ponto flutuante IEEE-754 de precisão simples. Ele causa imprecisões decimais clássicas (ex: R$ 19,90 vira R$ 19,8999996). Ao somar milhares de corridas, o balanço da carteira do motorista diverge do valor repassado.
- **Correção Mandatória:** Migrar 100% dos campos monetários para `DECIMAL(12,2)` ou `BIGINT` (armazenando em centavos).

### Falha 3: Coordenadas GPS Armazenadas como `varchar(45)`
- Na tabela `address`:
  `latitude varchar(45) ... DEFAULT NULL`
  `longitude varchar(45) ... DEFAULT NULL`
- Na tabela `driver`:
  `last_lat varchar(45) ...`
  `last_lng varchar(45) ...`
- **Consequência:** Consultas de proximidade (ex: "buscar motoristas disponíveis em um raio de 3 km") não podem usar índices espaciais. A consulta atual obriga o MySQL a converter strings para double via fórmula de Haversine em código PHP ou SQL sem índice, causando *Full Table Scan* e travando o banco em alta demanda.
- **Correção Mandatória:** Usar tipo espacial nativo `POINT` com índice `SPATIAL INDEX` ou `DECIMAL(10,8)` / `DECIMAL(11,8)` indexado.

### Falha 4: Ausência de Chaves Estrangeiras e Integridade Referencial
- Diversas tabelas operacionais possuem campos como `establishmentId`, `stationId`, `driverId` sem constraint `FOREIGN KEY` e sem indexação. Isso gerou milhares de registros órfãos no banco de dados.

---

## 3. ESQUEMA NORMALIZADO PARA A RECRIARÇÃO DO ZERO

Para o novo sistema de alta performance, propomos a consolidação e enxugamento dessas 403 tabelas em **48 entidades estritamente normalizadas**, mantendo 100% das regras de negócio:

```
[users] ──┬── [drivers] ─────┬── [driver_vehicles] ─── [vehicles]
          │                  ├── [driver_wallets] ──── [wallet_transactions]
          │                  └── [driver_shifts]
          │
          └── [passengers] ──┬── [saved_places]
                             ├── [passenger_wallets]
                             └── [payment_cards]

[trips] ──┬── [trip_routes] (waypoints, polyline)
          ├── [trip_bids] (leilão / ofertas)
          ├── [trip_payments] (split, taxas, gateway)
          ├── [trip_events] (máquina de estados auditada)
          ├── [trip_messages] (chat em tempo real)
          └── [trip_ratings] (avaliações bidirecionais)

[dispatch_stations] ── [station_queues] (bolsões de motoristas)
[dynamic_pricing_zones] ── [surge_multipliers] (calor dinâmico)
[corporate_accounts] ── [corporate_vouchers]
```

### Script de Migração Limpa:
1. Converter todo o banco para `utf8mb4` e collation `utf8mb4_unicode_ci`.
2. Sanitizar os dados legados, eliminando registros órfãos.
3. Migrar valores monetários para `DECIMAL(12,2)`.
4. Reconstruir as 32 views com sintaxe padronizada e sem DEFINER inválido.
