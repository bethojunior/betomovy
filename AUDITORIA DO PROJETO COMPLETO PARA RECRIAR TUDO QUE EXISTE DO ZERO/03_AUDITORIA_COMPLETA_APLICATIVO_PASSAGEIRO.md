# AUDITORIA COMPLETA: APLICATIVO DO PASSAGEIRO (CLIENT APP)

## 1. VISÃO GERAL DO APLICATIVO DO PASSAGEIRO

O aplicativo do passageiro é responsável pela experiência completa de mobilidade urbana da plataforma **MOVY**. Ele existe em duas versões no ecossistema:
1. **Versão Moderna:** Desenvolvida em **React Native / Expo SDK** (`mobility-pro-app-rota101-pro/src/client`), utilizando TypeScript, Hermes Engine, React Navigation e Styled Components.
2. **Versão Legada:** Desenvolvida em **Apache Cordova** (`mobilidade-appclient-cordova-rota101`), baseada em WebViews HTML5/JS (descontinuada, mas contendo regras de negócio originais).

---

## 2. INVENTÁRIO COMPLETO DAS 52 TELAS DO PASSAGEIRO

A análise estrita de `src/client/pages` identificou todas as telas e fluxos existentes:

| Nº | Tela / Componente | Arquivo de Origem | Função & Regra de Negócio |
| :--- | :--- | :--- | :--- |
| 1 | `SplashPage` | `pages/SplashPage` | Carregamento inicial, checagem de sessão e conexão com API |
| 2 | `SignIn` / `Login` | `pages/SignIn`, `pages/Login` | Autenticação por e-mail/senha ou celular com token JWT |
| 3 | `Register` | `pages/Register` | Cadastro inicial com dados pessoais básicos |
| 4 | `UserNumberPhone` | `pages/UserNumberPhone` | Captura do número de telefone com máscara internacional |
| 5 | `VerificationOTP` | `pages/VerificationOTP` | Validação de código de segurança SMS (6 dígitos) |
| 6 | `RecoveryPassword` | `pages/RecoveryPassword` | Recuperação de acesso e redefinição de credenciais |
| 7 | `TermsOfUse` | `pages/TermsOfUse` | Exibição e aceite dos Termos de Uso e Política de Privacidade |
| 8 | `TermsOfUseLocation` | `pages/TermsOfUseLocation` | Solicitação de consentimento estrito para rastreamento GPS |
| 9 | `PermissionLocal` | `pages/PermissionLocal` | Diálogo nativo de permissão de geolocalização |
| 10 | `Home` | `pages/Home` | Tela principal com mapa Mapbox/Google, carrinho animado e busca |
| 11 | `Search` | `pages/Search` | Barra de busca rápida "Para onde vamos?" |
| 12 | `SearchLocal` | `pages/SearchLocal` | Input de origem e destino com histórico de buscas |
| 13 | `SearchLocalModal` | `pages/SearchLocalModal` | Modal de seleção e sugestões de pontos de embarque |
| 14 | `DetailAddressModal` | `pages/DetailAddressModal` | Ajuste fino do número predial, complemento e ponto de referência |
| 15 | `Local` / `LocalMap` | `pages/Local`, `pages/LocalMap` | Ajuste de pino no mapa com botão "Confirmar Ponto de Encontro" |
| 16 | `Address` / `Addresses` | `pages/Addresses` | Gerenciamento de endereços salvos (Casa, Trabalho, Favoritos) |
| 17 | `Trip` (Seleção de Categoria) | `pages/Trip` | Lista de categorias (Econômico, Conforto, Moto, Entrega, Executivo) |
| 18 | `Payment` | `pages/Payment` | Escolha da forma de pagamento antes de solicitar a corrida |
| 19 | `PaymentForm` | `pages/PaymentForm` | Configuração de métodos (Dinheiro, Cartão na Máquina, Cartão App) |
| 20 | `ListCreditCard` | `pages/ListCreditCard` | Listagem de cartões de crédito tokenizados salvos pelo usuário |
| 21 | `CardList` | `pages/CardList` | Cadastro de novo cartão com validação de CVV e bandeira |
| 22 | `TripPixPayment` | `pages/TripPixPayment` | Geração de chave Pix Copia-e-Cola e QR Code dinâmico |
| 23 | `VoucherPayment` | `pages/VoucherPayment` | Pagamento corporativo via Voucher faturado da empresa |
| 24 | `Transfer` / `AddTransfer` | `pages/Transfer`, `pages/AddTransfer` | Transferência de saldo entre carteiras de usuários |
| 25 | `Coupons` / `CouponsMobility` | `pages/Coupons` | Listagem e aplicação de cupons de desconto promocionais |
| 26 | `CouponCompany` | `pages/CouponCompany` | Cupons exclusivos concedidos por estabelecimentos parceiros |
| 27 | `ClientWaitTrip` | `pages/ClientWaitTrip` | Radar de busca de motoristas com animação de pulsos de ondas |
| 28 | `OrderMessageOption` | `pages/OrderMessageOption` | Instruções especiais ao motorista (ex: "estou de camisa azul") |
| 29 | `DetailsTrip` | `pages/DetailsTrip` | Visualização do motorista a caminho (foto, carro, placa, nota) |
| 30 | `TripChat` / `OrderChat` | `pages/TripChat`, `pages/OrderChat` | Chat em tempo real passageiro-motorista com envio de áudio |
| 31 | `SharedTrips` | `pages/SharedTrips` | Compartilhamento da viagem ao vivo com link web para contatos |
| 32 | `SharedTripsChat` | `pages/SharedTripsChat` | Canal de comunicação específico para viagens compartilhadas |
| 33 | `Freight` | `pages/Freight` | Módulo de fretes e carretos com especificação de carga |
| 34 | `SpeedMob` | `pages/SpeedMob` | Módulo de entrega ultrarrápida por motos |
| 35 | `SuggestionTrips` | `pages/SuggestionTrips` | Sugestões automáticas baseadas nos hábitos do passageiro |
| 36 | `MyTravels` | `pages/MyTravels` | Histórico completo de viagens realizadas e canceladas |
| 37 | `AppRating` | `pages/AppRating` | Avaliação da viagem (1 a 5 estrelas) e gorjeta para o motorista |
| 38 | `Profile` / `MyProfile` | `pages/Profile`, `pages/MyProfile` | Edição de foto de perfil, telefone, e-mail e documento CPF |
| 39 | `DocumentList` | `pages/DocumentList` | Lista de documentos de identificação exigidos |
| 40 | `DocumentSend` | `pages/DocumentSend` | Upload de documentos com captura via câmera e galeria |
| 41 | `Indication` | `pages/Indication` | Indique e Ganhe (código de indicação com recompensas) |
| 42 | `ContactUs` | `pages/ContactUs` | Suporte, abertura de chamados e FAQ integrado |
| 43 | `Publicity` | `pages/Publicity` | Banners promocionais e ofertas da cidade |
| 44 | `Languages` | `pages/Languages` | Seleção de idioma (Português, Inglês, Espanhol) |
| 45 | `Config` | `pages/Config` | Configurações de notificações push, som e tema |
| 46 | `ChangePassword` | `pages/ChangePassword` | Alteração de senha de segurança |
| 47 | `ChatList` | `pages/ChatList` | Histórico de conversas de suporte |
| 48 | `DataDriverSingUp` | `pages/DataDriverSingUp` | Atalho para o passageiro iniciar transição para ser motorista |
| 49 | `DataUserSignUp` | `pages/DataUserSignUp` | Complementação de dados cadastrais |
| 50 | `Sections` | `pages/Sections` | Hub de serviços adicionais |
| 51 | `SelectAppPartners` | `pages/SelectAppPartners` | Escolha de empresas parceiras integradas |
| 52 | `DevMenu` | `pages/DevMenu` | Menu oculto de debug e troca dinâmica de ambiente |

---

## 3. MÁQUINA DE ESTADOS DA VIAGEM NO PASSAGEIRO

O ciclo de vida da corrida no aplicativo segue uma máquina de estados estrita:
```
[Definição de Rota] ──> [Cálculo de Preço] ──> [Seleção de Pagamento]
         │
         v
[searching / Radar de Busca] ──(Timeout)──> [not_answered / Tentar Novamente]
         │
         ├──(Motorista Aceitou)──> [accepted / Motorista a Caminho]
         │                                    │
         ├──(Embarque)──────────────────────> [boarding / Motorista no Local]
         │                                    │
         ├──(Início da Corrida)─────────────> [in_progress / Em Viagem]
         │                                    │
         ├──(Chegada ao Destino)────────────> [finished / Pagamento & Recibo]
         │                                    │
         └──(Avaliação)─────────────────────> [Rating & Gorjeta]
```

### Funcionalidades de Segurança Existentes:
- **Compartilhamento de Rota em Tempo Real:** Envio de SMS ou WhatsApp com link web para acompanhamento por terceiros.
- **Botão de Pânico (SOS):** Disparo de coordenadas imediatas para a Central de Despacho e contatos de emergência cadastrados.
- **Chat com Mensagem de Áudio Gravada:** Envio de gravações de voz sem necessidade de telefonemas.
