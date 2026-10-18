# AUDITORIA COMPLETA: APLICATIVO DO MOTORISTA (DRIVER APP) & DIAGNÓSTICO DE CRASH NO IOS

## 1. VISÃO GERAL DO APLICATIVO DO MOTORISTA

O aplicativo do motorista é a ferramenta de trabalho e captação de renda dos motoristas parceiros da **MOVY**. Ele contém recursos avançados de telemetria em segundo plano, gestão de fila de despacho, leilão de corridas, conferência de documentos e integração fiscal municipal.

---

## 2. INVENTÁRIO COMPLETO DAS 38 TELAS DO MOTORISTA

A inspeção em `src/driver/src/pages` identificou todas as funcionalidades nativas:

| Nº | Tela / Componente | Arquivo de Origem | Função & Regra de Negócio |
| :--- | :--- | :--- | :--- |
| 1 | `AnimatedSplashScreen` | `pages/AnimatedSplashScreen` | Abertura com animação fluida e validação de token do motorista |
| 2 | `Home` | `pages/Home` | Tela de trabalho: Mapa, botão Ficar Online/Offline, ganhos do dia |
| 3 | `TripsOffer` | `pages/TripsOffer` | Modal de Chamada Recebida com contagem regressiva de 15s e áudio |
| 4 | `DetailsTrip` | `pages/DetailsTrip` | Detalhes do passageiro, endereço de embarque e botão "Cheguei" |
| 5 | `TripCalculationDetails`| `pages/TripCalculationDetails` | Detalhamento da rota, km rodados, minutos e pedágios |
| 6 | `FinishTripResume` | `pages/FinishTripResume` | Resumo financeiro do valor total recebido e taxa da plataforma |
| 7 | `FinishTripAvaliation` | `pages/FinishTripAvaliation` | Avaliação do passageiro (estrelas, conduta, problemas) |
| 8 | `TripChat` | `pages/TripChat` | Mensagens de texto e áudio direto com o passageiro |
| 9 | `MyTrips` | `pages/MyTrips` | Histórico de todas as corridas realizadas pelo motorista |
| 10 | `Extract` | `pages/Extract` | Extrato financeiro detalhado por dia, semana e mês |
| 11 | `Prepaid` | `pages/Prepaid` | Saldo pré-pago para liberação de chamadas (modelo cooperativa) |
| 12 | `PaymentOptionsPrepaid`| `pages/PaymentOptionsPrepaid` | Recarga de créditos de trabalho via Pix ou Cartão |
| 13 | `BankAccount` | `pages/BankAccount` | Cadastro de chave Pix e conta bancária para recebimento |
| 14 | `StationPointReturn` | `pages/StationPointReturn` | Fila virtual em Pontos Fixos / Bolsões de Espera (Cooperativas) |
| 15 | `ScheduleAvailable` | `pages/ScheduleAvailable` | Mural de corridas agendadas disponíveis para aceite futuro |
| 16 | `ScheduleAccepted` | `pages/ScheduleAccepted` | Lista de corridas agendadas que o motorista já assumiu |
| 17 | `ZoneDynamic` | `pages/ZoneDynamic` | Mapa de calor com polígonos de Tarifa Dinâmica (Surge Pricing) |
| 18 | `TempoAoVolante` | `pages/TempoAoVolante` | Monitoramento de jornada contínua e aviso de fadiga (Lei 13.103) |
| 19 | `QRCodeFiscalizacao` | `pages/QRCodeFiscalizacao` | QR Code para agentes da Prefeitura e trânsito consultarem alvará |
| 20 | `Vehicle` | `pages/Vehicle` | Cadastro e seleção de veículos vinculados ao motorista |
| 21 | `DocumentList` | `pages/DocumentList` | Status de aprovação de documentos (CNH, CRLV, Alvará, Antecedentes) |
| 22 | `DocumentSend` | `pages/DocumentSend` | Envio de fotos de documentos com validação por câmera |
| 23 | `StatusPending` | `pages/StatusPending` | Tela de bloqueio quando o cadastro aguarda análise da central |
| 24 | `Profile` | `pages/Profile` | Perfil do condutor com nota média, número de viagens e dados |
| 25 | `Account` | `pages/Account` | Gestão de dados cadastrais e veículos |
| 26 | `ButtonTestPanic` | `pages/ButtonTestPanic` | Teste de funcionamento do Botão de Pânico silencioso |
| 27 | `OverlayPermission` | `pages/OverlayPermission` | Solicitação de permissão no Android para Botão Flutuante |
| 28 | `BackgroundLocationPermission`| `pages/BackgroundLocationPermission`| Permissão para rastreamento em 2º plano mesmo com app fechado |
| 29 | `Routes` | `pages/Routes` | Integração nativa com Waze, Google Maps ou Apple Maps |
| 30 | `ListClient` | `pages/ListClient` | Lista de clientes habituais ou corporativos atendidos |
| 31 | `ListDelivery` | `pages/ListDelivery` | Painel de pedidos de entrega e encomendas aceitos |
| 32 | `ListIndicator` | `pages/ListIndicator` | Extrato de bonificações por indicação de novos motoristas |
| 33 | `Menu` | `pages/Menu` | Menu lateral de navegação e atalhos rápidos |
| 34 | `SpeedMob` | `pages/SpeedMob` | Modo de alta demanda para entregas rápidas de moto |
| 35 | `Publicity` | `pages/Publicity` | Parcerias da plataforma (desconto em combustível, oficinas) |
| 36 | `Languages` | `pages/Languages` | Troca de idioma da interface |
| 37 | `Config` | `pages/Config` | Ajustes de alertas sonoros, tipo de mapa e navegação automática |
| 38 | `DevMenu` | `pages/DevMenu` | Menu de diagnóstico de telemetria e rede |

---

## 3. DIAGNÓSTICO CONCLUSIVO DOS CRASH LOGS NO IOS (PASTA `ERRO LOGS APLICATIVO CORRIGIR IOS`)

Foram auditados os três arquivos de crash real enviados pelo usuário:
- `crashlog-1E51AADE-A5A0-4B93-BA4F-104DFA48E72E.ips` (14/10/2026)
- `crashlog-71E7B827-5673-46F2-A69F-5032939F38D4.ips` (14/10/2026)
- `crashlog-8A9D7F5A-4D91-45F4-A065-6B423124FEC2.ips` (14/10/2026)

### Dados Extraídos da Falha:
- **Dispositivo:** iPad / iPhone rodando `iPhone OS 26.6.1 (23G83)`
- **Bundle ID:** `br.com.client.rota101`
- **Sinal de Morte:** `Abort trap: 6 (SIGABRT)`
- **Pilha de Execução (Stack Trace):**
  1. `__exceptionPreprocess` (CoreFoundation)
  2. `objc_exception_throw` (libobjc)
  3. `-[NSInvocation invokeWithTarget:]` (CoreFoundation)
  4. `_dispatch_call_block_and_release` (libdispatch)

### Causa Raiz Revelada:
1. **Injeção de Módulo Nativo Android em Compilação iOS:**
   No arquivo `app.json` e no pacote de dependências, foi incluído o plugin nativo:
   `["./plugins/addServiceToMainApplication", ["com.bubblebutton.BubbleService"]]` e o pacote `@704apps/react-native-bubble-button`.
   O `BubbleButton` é uma biblioteca desenvolvida exclusivamente para a API `android.view.WindowManager` (botão flutuante na tela do Android). No iOS, essa API não existe no sistema operacional.
2. Ao inicializar o aplicativo no iOS, o React Native Bridge executou `NSInvocation` procurando pelos seletores nativos do módulo registrado. Por não encontrar a implementação correspondente no binário Objective-C/Swift do iOS, o sistema lançou um `NSInvalidArgumentException: unrecognized selector sent to instance`, provocando o **SIGABRT imediato**.
3. **Conflito de Versões Expo 46 vs Expo 54:** O projeto `mobility-pro-app-rota101-pro-ios` possui dependências legadas do Expo 46 misturadas com código e pods modernos do Expo 54, gerando ponte de execução instável.

### Correção Definitiva para a Recriação do Zero:
- Isolar módulos nativos com flags de plataforma (`Platform.OS === 'android' ? NativeBubble : null`).
- Unificar o código do passageiro e do motorista em um único codebase limpo Expo SDK 54+ com compilação limpa tanto para Android (Play Store) quanto para iOS (App Store) sem nenhuma biblioteca não-compatível.
