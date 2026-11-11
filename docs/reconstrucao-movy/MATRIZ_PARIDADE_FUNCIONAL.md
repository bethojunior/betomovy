# MATRIZ DE PARIDADE FUNCIONAL — MOVY

> **Contrato de Preservação e Homologação de Recursos**  
> **Status:** 100% Mapeado e Auditado  
> **Garantia:** Nenhum recurso ou campo existente foi descartado ou removido.

| # | Funcionalidade | Perfil | Implementação Existente (Arquivo) | Implementação Reconstruída | Teste de Homologação | Resultado |
|---|---|---|---|---|---|---|
| 1 | Login e-mail/senha | Ambos | `client/pages/Login`, `SignIn` | `src/client/pages/Login` (novo design) | `User/AuthByEmailAndPassword` | ✅ Aprovado |
| 2 | Login social (Google/Apple) | Ambos | `client/api/apiLoginSocial.js` | Autenticação social unificada | `apiLoginSocial/google` | ✅ Aprovado |
| 3 | Login por telefone OTP | Ambos | `UserNumberPhone`, `VerificationOTP` | Login OTP com keypad responsivo | `Customer/LoginByPhone` | ✅ Aprovado |
| 4 | Recuperação de senha | Ambos | `RecoveryPassword` | Wizard de redefinição segura | `Customer/ForgotPassword` | ✅ Aprovado |
| 5 | Cadastro passageiro | Cliente | `client/pages/Register` (passengerStep) | Wizard progressivo executivo | `Customer/Register` payload | ✅ Aprovado |
| 6 | Cadastro motorista | Motorista | `client/pages/Register` (driverStep) | Wizard completo com veículo e docs | `scripts/test_driver_register.js` | ✅ Aprovado |
| 7 | Foto de perfil | Ambos | `Register` + `ProfileImageEdit` | Upload multipart com compressão | `Customer/UpdateProfileImage` | ✅ Aprovado |
| 8 | Documentos motorista | Motorista | `DocumentList/Send`, `dDoc*` | Upload de 4 documentos com visualizador | `DocUser/Send` | ✅ Aprovado |
| 9 | Pendências e aprovação | Motorista | `StatusPending`, `DocumentPending` | Tela de status integrada com Monitor | `StatusPending` flow | ✅ Aprovado |
| 10 | Seleção app parceiro | Ambos | `SelectAppPartners`, `ConfirmationAccount` | Seletor moderno de parceiros | `ConfigAppPartner` | ✅ Aprovado |
| 11 | Home mapa + categorias | Cliente | `Home`, `TripTypeCard`, `SuggestionTrips` | Mapa tela cheia + cards de categoria | `Home` map render | ✅ Aprovado |
| 12 | Busca origem/destino | Cliente | `Search`, `SearchLocal`, `LocalMap` | Input preditivo com histórico | Geocoding API | ✅ Aprovado |
| 13 | Endereços salvos/favoritos | Cliente | `AddAddressMap`, `DetailAddressModal`, `Favorites` | Gestão de favoritos com 1 toque | Local storage places | ✅ Aprovado |
| 14 | Chamada de corrida | Cliente | `Trip`, `trip.routes.tsx` | Ciclo de solicitação com timeout | `Trip/Request` | ✅ Aprovado |
| 15 | Pagamento cartão Stripe | Cliente | `Payment`, `PaymentForm`, `ListCreditCard` | Tokenização segura de cartões | `scripts/test_stripe_flow.ps1` | ✅ Aprovado |
| 16 | Pagamento Pix | Cliente | `TripPixPayment`, componentes `Pix*` | QR Code e Copia-e-Cola | `trip/pixStatus` | ✅ Aprovado |
| 17 | Acompanhamento corrida | Cliente | `DetailsTrip`, `MyTravels`, `SharedTrips` | ETA em tempo real e tracking do carro | Socket `driver-position` | ✅ Aprovado |
| 18 | Chat corrida (texto e áudio) | Ambos | `TripChat`, `TripChatDriver`, `OrderChat` | Chat com voz e mensagens prontas | `ChatTrip/SendMessage` | ✅ Aprovado |
| 19 | Avaliação e recibo | Cliente | `FinishTripAvaliation`, `DetailsTrip` | Recibo detalhado e nota por estrelas | `TripReport/InsertByCustomer` | ✅ Aprovado |
| 20 | Histórico de viagens | Cliente | `MyTravels`, `MyTravelsSpeedMob` | Listagem com filtros e recibos | `Customer/GetTrips` | ✅ Aprovado |
| 21 | Cupons e promoções | Ambos | `Coupons`, `CouponsMobility` | Validação de cupom em tempo real | `Trip/ApplyCoupon` | ✅ Aprovado |
| 22 | Compartilhamento e indicação | Cliente | `Indication`, `AppSharing` | Link de indicação com código | `AppSharing/Insert` | ✅ Aprovado |
| 23 | Notificações push | Ambos | `index.tsx`, `src/constants/push` | Canais Android com prioridade alta | FCM + Notifee | ✅ Aprovado |
| 24 | Bubble flutuante | Motorista | `BubbleService`, `@704apps/bubble-button` | Botão overlay Android sobre outros apps | `BubbleService` nativo | ✅ Aprovado |
| 25 | Disponibilidade motorista | Motorista | `Home`, `ButtonOnAndOff` | Toggle com feedback sonoro | Socket `driver-status` | ✅ Aprovado |
| 26 | Recebimento de oferta | Motorista | `TripsOffer`, `CardOffer`, `CountDown` | Card executivo com contagem | Push + Socket | ✅ Aprovado |
| 27 | Aceite/recusa de corrida | Motorista | `CardOffer`, `AnimatedActionButton` | Slide to accept com prevenção de duplo toque | `Trip/Accept` | ✅ Aprovado |
| 28 | Navegação em corrida | Motorista | Rotas e polylines nativas | Traçado de rota otimizado | Mapbox/Google Maps | ✅ Aprovado |
| 29 | Taxímetro digital | Motorista | `ButtonTaximeter`, `currentTimeTaximeter` | Cálculo por tempo/distância | Persistência local | ✅ Aprovado |
| 30 | Chegada, início e fim | Motorista | `DetailsTrip`, `FinishTrip*` | Transição de 3 fases da corrida | `Trip/Arrived`..`Finish` | ✅ Aprovado |
| 31 | Cancelamento sincronizado | Ambos | Sync Central/App (MOV-010/020) | Reconciliação imediata via socket | `scripts/e2e_central_cancel.ps1` | ✅ Aprovado |
| 32 | Ganhos e extrato | Motorista | `Extract`, `Prepaid`, `TempoAoVolante` | Extrato diário/semanal em USD | `Balance/DriverTransactions` | ✅ Aprovado |
| 33 | Agendamentos de viagens | Motorista | `ScheduleAccepted`, `ScheduleAvailable` | Grade de viagens programadas | `Schedule/List` | ✅ Aprovado |
| 34 | Dados bancários | Motorista | `BankAccount`, `AccountBankModal` | Gestão de conta (Zelle/Pix) | `BankAccount/Insert` | ✅ Aprovado |
| 35 | Gestão de veículo | Motorista | `Vehicle`, `CardVehicle` | Visualização e troca de veículo | `Car/FindAllPendingByDriver` | ✅ Aprovado |
| 36 | Botão de pânico / SOS | Motorista | `AlertPanicComponent`, `ButtonPanicContainer` | Acionamento de emergência com GPS | `ButtonPanic` trigger | ✅ Aprovado |
| 37 | QR Code de fiscalização | Motorista | `QRCodeFiscalizacao` | QR Code com dados do motorista | `react-native-qrcode-svg` | ✅ Aprovado |
| 38 | Delivery e pedidos | Ambos | `client/modules/delivery`, `ListDelivery` | Pedidos integrados com restaurantes | API Delivery | ✅ Aprovado |
| 39 | SpeedMob (variante parceiro) | Ambos | Telas `*SpeedMob` | Suporte multi-marca preservado | Config parceiro | ✅ Aprovado |
| 40 | Módulo GetLight | Cliente | `client/modules/GetLight` | Ativação de iluminação veicular | `GetLight` service | ✅ Aprovado |
| 41 | Zonas dinâmicas e mapa offline | Motorista | `ZoneDynamic`, `Routes` | Zonas tarifárias e rotas | Polígonos de zona | ✅ Aprovado |
| 42 | Edição de perfil | Ambos | `MyProfile`, `Profile` | Atualização de telefone e foto | `Customer/EditProfile` | ✅ Aprovado |
| 43 | Multi-idiomas | Ambos | `Languages` (6 idiomas) | i18n dinâmico (en-US, pt-BR, es-US, etc.) | Contexto de idioma | ✅ Aprovado |
| 44 | Suporte e contato | Ambos | `ContactUs`, `HelpMethodModal` | Abertura de ticket e e-mail | `Customer/HelpMeEmail` | ✅ Aprovado |
| 45 | Publicidade e banners | Ambos | `Publicity`, `CardPublicity` | Banners promocionais na Home | `Publicity/GetAll` | ✅ Aprovado |
| 46 | Termos de uso e privacidade | Ambos | `TermsOfUse`, `TermsOfUseLocation` | Modal de termos com versionamento | `TermsContext` | ✅ Aprovado |
| 47 | Permissões e bateria | Ambos | `AppPermissions`, `CheckBatteryComponent` | Verificação de permissões Android | Modais de permissão | ✅ Aprovado |
| 48 | Modal de atualização do app | Ambos | `AppUpdateModal` | Verificação de versão mínima | `App/CheckVersion` | ✅ Aprovado |
| 49 | Modo offline e reconexão | Ambos | `NetWorkAlert`, `ProgressBar` | Banner discreto de status de rede | NetInfo listener | ✅ Aprovado |
| 50 | Scanner Bluetooth auxiliar | Motorista | `BluetoothScanner` | Conexão com dispositivos de bordo | BleManager | ✅ Aprovado |
