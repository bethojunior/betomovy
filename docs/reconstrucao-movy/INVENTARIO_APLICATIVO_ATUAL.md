# INVENTÁRIO DO APLICATIVO ATUAL — MOVY (`mobility-pro-app-rota101-pro`)

> **Bloco 00 + Bloco 01 da Reconstrução MOVY**  
> **Data:** 2026-11-10  
> **Versão analisada:** `versionName: "8.3.8"` · `versionCode: 80308` · `applicationId: "br.com.client.rota101"`  
> **Repositório oficial:** `mobility-pro-app-rota101-pro`

---

## 1. Visão Técnica e Stack de Tecnologia

| Item | Implementação Real Confirmada |
|---|---|
| **Tecnologia Principal** | **Expo SDK 54** + **React Native 0.81.5** + **React 19.1.0** (Hermes ativado) |
| **Linguagem** | TypeScript 5.9.2 + JavaScript (misto a ser padronizado em TypeScript) |
| **Navegação** | `@react-navigation/native` (6.1.10), `@react-navigation/stack` (6.3.21), `@react-navigation/bottom-tabs` (6.5.12) |
| **Gerenciamento de Estado** | Context API React (`src/context/`, `src/client/contexts/`, `src/driver/src/context/`) + `use-context-selector` + Store (`src/driver/src/store/`) |
| **Estilização e Design** | `styled-components/native` (6.1.19) + `StyleSheet` + `polished` + `react-native-responsive-fontsize` |
| **Comunicação HTTP / API** | `axios` (0.21.1) via wrappers `apiMain.js` (cliente) e `apiMainDriver.js` (motorista), com baseURL configurado em `src/constantBuild/config.ts` |
| **Comunicação Realtime** | Socket.IO Client (2.3.0) via `context/SocketIO` conectado a `socket.movymob.com` |
| **Push Notifications** | Firebase Cloud Messaging (`firebase 12.11.0`, `google-services.json`), `@notifee/react-native` (7.8.2), `expo-notifications` (0.32.11) |
| **Background Services** | `expo-task-manager`, `expo-background-fetch`, plugin nativo `@704apps/react-native-bubble-button` (`BubbleService`) |
| **Mapas e Geolocalização** | `react-native-maps` (1.26.20 com Google Maps SDK), Mapbox API (`apiMapBox.js`), `@googlemaps/polyline-codec`, `expo-location` (19.0.7) |
| **Pagamentos** | Stripe (cartão de crédito/débito com tokenização), Pix (cópia/cola e QR code), Voucher/Prepaid corporativo |
| **Recursos Nacionais / Voz** | `expo-camera`, `expo-speech-recognition`, `expo-av` (reprodução de alertas de áudio: `assobio.mp3`), `react-native-qrcode-svg` |
| **Persistência Local** | `@react-native-async-storage/async-storage` (2.2.0) + `react-native-mmkv` (3.3.3) |

---

## 2. Identidade Android e Parâmetros de Instalação (Imutáveis)

Para garantir atualização contínua e ininterrupta nos dispositivos dos usuários atuais:

- **Package / Application ID:** `br.com.client.rota101` (definido em `app.json` e `android/app/build.gradle`).
- **Versão Atual:** `versionCode: 80308`, `versionName: "8.3.8"`. A versão reconstruída avança para `versionCode: 80309` (`versionName: "8.4.0"`).
- **Assinatura de Release:** Keystore upload oficial configurado em `android/app/build.gradle` (`movy_upload_keystore.jks`, alias `movy`).
- **URL Scheme:** `rota101pro://`.
- **Serviços Ativos em Manifesto Nativo:**
  - `com.bubblebutton.BubbleService` (botão flutuante Android sobre outros apps para motoristas).
  - Canais de notificação: `tripCall` (chamadas de viagem), `chat` (mensagens), `default` (geral).

---

## 3. Ambientes e Integrações de Produção

| Serviço | Endpoint / Host | Papel no Ecossistema |
|---|---|---|
| **Backend Principal** | `https://api.movymob.com/` | API REST PHP (`mobilidade-api-php-master`), gestão de viagens, autenticação, cadastro, dispatch |
| **Socket Realtime** | `https://socket.movymob.com/` | Troca de mensagens, localização do motorista em tempo real, despachos e status de corrida |
| **Login Social** | `https://api.movymob.com/login-social/` | Autenticação Google e Apple |
| **API Delivery** | `https://delivery-api-movy.prod.704apps.com.br/` | Módulo integrado de delivery/estabelecimentos parceiros |
| **Mapbox API** | `https://api.mapbox.com/` | Geocodificação reversa e rotas poliline |
| **Google Maps SDK** | Chave ativa em `app.json` | Renderização nativa do mapa no Android e iOS |
| **Stripe** | SDK Stripe / Webhook Backend | Processamento seguro de pagamentos com cartão |

---

## 4. Classificação Integral de Pastas e Arquivos

| Diretório / Arquivo | Classificação | Descrição e Finalidade |
|---|---|---|
| `index.tsx` | Código-fonte (Root) | Entrypoint Expo; inicialização de background tasks e canais Android |
| `src/App.tsx` | Código-fonte | Provedor raiz com pilha de providers (Auth, Theme, Config, FlashMessage) |
| `src/routes/` | Código-fonte | Decisor de rotas com base em autenticação e tipo de perfil (Passageiro vs Motorista) |
| `src/client/pages/` | Código-fonte | 43 telas do fluxo de passageiro e cadastros |
| `src/client/routes/` | Código-fonte | Definições de rotas (`auth`, `guest`, `app`, `tab`, `trip`, `orderservice`) |
| `src/client/api/` | Código-fonte | Clientes HTTP (`apiMain.js`, `apiLoginSocial.js`, `apiMapBox.js`) |
| `src/client/contexts/` | Código-fonte | Contextos de autenticação, geolocalização e viagens do cliente |
| `src/client/styles/` | Código-fonte | Temas do cliente (`theme.ts`, `loginTheme.ts`) |
| `src/client/locales/` | Traduções | Arquivos i18n (`en-US`, `pt-BR`, `es-US`, `fr-FR`, `pt-AO`, `pt-PT`) |
| `src/client/modules/` | Código-fonte | Módulos `mobility`, `delivery` e `GetLight` |
| `src/driver/src/pages/` | Código-fonte | 33 telas do fluxo operacional do motorista |
| `src/driver/src/components/` | Código-fonte | ~100 componentes especializados (taxímetro, ofertas, mapa, chat, pânico) |
| `src/driver/src/routes/` | Código-fonte | Pilha de rotas de navegação do motorista (`app.routes.tsx`) |
| `src/driver/src/context/` | Código-fonte | Contextos do motorista (sessão, corrida ativa, taxímetro) |
| `src/driver/src/styles/` | Código-fonte | Tema e tokens de design do motorista (`theme.ts`) |
| `src/common/` | Código-fonte | Componentes compartilhados (`AlertRecording`, `ModalAlert`, `NetWorkAlert`, `ProgressBar`, `Skeleton`) |
| `src/components/` | Código-fonte | Componentes transversais (`AppUpdateModal`, `Pix*`, `TripTypeCard`, `ui/`) |
| `src/context/` | Código-fonte | Contextos globais (`AuthContext`, `ConfigGlobal`, `ConfigAppPartner`, `SocketIO`) |
| `src/constants/` | Configuração | Constantes de push (`push.ts`), endpoints e tags de notificação |
| `src/constantBuild/` | Configuração | Configuração dinâmica de builds e hosts (`config.ts`) |
| `assets/` | Recursos visuais | Logos, ícones, splash screen, imagens de layout |
| `src/driver/src/assets/songs/` | Recursos multimídia | Alertas de áudio (`assobio.mp3`) |
| `plugins/` | Código nativo Expo | Config plugins locais (`addServiceToMainApplication`, `addVolumeToMainActivity`, `fixFirebaseDuplicateClasses`) |
| `android/` | Configuração nativa | Diretório Gradle do Android (`app/build.gradle`, `AndroidManifest.xml`, recursos nativos) |
| `ios/` | Configuração nativa | Diretório nativo iOS |
| `scripts/` | Ferramental | Scripts de auditoria, verificação de dados e geração de pacotes |
| `docs/reconstrucao-movy/` | Documentação | Documentação oficial de contrato e homologação da reconstrução |

---

## 5. Mapeamento de Endpoints de API (168 Endpoints Identificados)

Os 168 endpoints foram auditados no código e agrupados por domínio operacional:

1. **Autenticação e Sessão:**
   - `Customer/LoginByPhone`, `Customer/ForgotPassword`, `Customer/ChangePassword`, `Customer/CheckPassword`
   - `User/AuthByEmailAndPassword`, `User/CheckToken`, `apiLoginSocial/google`, `apiLoginSocial/apple`
2. **Cadastro (Contrato Autorizado):**
   - `Customer/Register` (Passageiro)
   - `Driver/Register` (Motorista)
   - `Customer/UpdateProfileImage`, `Driver/EditProfileImage`, `DocUser/Send`
3. **Gestão de Perfil e Documentos:**
   - `Customer/EditProfile`, `Customer/Find`, `Driver/GetProfile`, `Car/FindAllPendingByDriver`, `Car/InsertSecondCar`
   - `DocUser/GetPendingDocs`, `DocUser/Send`
4. **Ciclo de Viagem (Mobilidade):**
   - `Trip/GetPrices`, `Trip/Estimate`, `Trip/Request`, `Customer/CancelTrip`, `Trip/Cancel`
   - `TripsOffer/Get`, `Trip/Accept`, `Trip/Refuse`, `Trip/Arrived`, `Trip/Start`, `Trip/Finish`
   - `KnobTrip/Init`, `trip/payWithPixAtEnd`, `trip/pix`, `trip/pixStatus`
5. **Comunicação e Chat:**
   - `ChatTrip/SendMessage`, `ChatTrip/SendMessageAudio`, `ChatBotTrip/SendMessage`
6. **Financeiro e Carteira:**
   - `Balance/DriverTransactions`, `Balance/LastDriverTransactions`, `Balance/GetTypes`
   - `BankAccount/GetByUser`, `BankAccount/Insert`, `BankAccount/Edit`, `Bank/GetAll`
   - `CreditPrepaid/Purchase`, `CreditPrepaid/Show`
7. **Configurações e Suporte:**
   - `App/CheckVersion`, `CancellationReasons/GetAll`, `CancellationReasons/GetAllCustomer`
   - `TripReport/InsertByCustomer`, `Customer/HelpMeEmail`

---

## 6. Persistência Local (91 Chaves Auditadas)

Categorização das chaves locais essenciais:

- **Sessão e Identidade (Preservação Obrigatória):**
  `@Auth:user`, `@Auth:userDriver`, `user`, `lastLogin`, `deviceToken`, `biometry_token`, `biometry_enabled`.
- **Estado de Viagem (Recuperação após reinício do app):**
  `trip`, `tripDriver`, `currentTimeTaximeter`, `taximetersDetails`, `startTaximetro`, `lastTripFinished`, `orderPrices`.
- **Preferências do Usuário:**
  `@language`, `cardSelected`, `lastSelectedPaymentMethod`, `places`, `placeSelected`.
- **Rastreamento Operacional:**
  `lastPosition`, `lastPositionSync`, `routeTraveled`, `routeTraveledTaximeter`.

---

## 7. Problemas Iniciais Identificados na Versão Anterior

1. **Identidade Visual Conflitante:** `app.json` configurava fundo rosa (`#CF227B`) herdado de projeto anterior, destoando da identidade executiva MOVY (Navy `#070A1A`, Royal `#00349A` e Cyan `#04F3FA`).
2. **Ambiente Jest Desajustado:** `semver` ausente em subdependência do snapshot no `node_modules` local, requerendo correção na suite de testes.
3. **Código Legado Inativo:** Pastas `DataUserSignUp` e `DataDriverSingUp` continham telas abandonadas que foram substituídas por `Register/index.tsx`, gerando ambiguidade sem utilidade.
4. **Cancelamento da Central:** Falha histórica de sincronização onde o motorista continuava preso à viagem cancelada pela Central de Operações (resolvida pelo evento Socket `trip-canceled` e push `RIDE_CANCELLED`).
