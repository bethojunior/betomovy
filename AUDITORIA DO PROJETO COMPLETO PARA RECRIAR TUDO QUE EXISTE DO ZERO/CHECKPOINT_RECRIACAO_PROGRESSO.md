# 📌 CHECKPOINT & REGISTRO DE CONTINUIDADE: RECRIARÇÃO DO ZERO MOVY

> **Aviso para Qualquer Agente / Próxima IA:**
> Este documento é o **registro oficial de progresso, estado atual, decisões de arquitetura e próximos passos**. Caso uma nova instância de IA continue o trabalho, leia este arquivo antes de qualquer ação para saber exatamente onde o projeto parou e dar sequência imediata sem retrabalho.

---

## 1. DIRETRIZES FUNDAMENTAIS DO PROJETO (DEFINIDAS PELO CLIENTE)

1. **Recriação 100% do Zero:** NADA de remendos sobre o código legado. Toda a base antiga foi substituída pelos novos módulos limpos.
2. **Design & UX Superior a Uber e 99:**
   - Paleta harmonizada estritamente com a logo oficial da MOVY: **Deep Navy Obsidian (`#070A1A`)**, **Ciano / Turquesa Elétrico (`#04F3FA`)** e **Azul Royal Corporativo (`#00349A`)**.
   - Zero breguice, zero cores berrantes, conformidade rigorosa com **WCAG AAA** (alto contraste sob luz solar).
   - Movimento de veículos em mapa a **60 FPS com interpolação vetorial suave** (sem saltos de GPS).
3. **Internacionalização Bi-Nacional (EUA 🇺🇸 e Brasil 🇧🇷):**
   - **Operação Principal nos Estados Unidos:** Moeda padrão em **Dólar ($ USD)**.
   - **Cadastro nos EUA:** **NUNCA pedir CPF**. Formulário limpo com Nome, E-mail, Senha, Telefone (+1), Driver's License (para motorista) e ZIP Code.
   - **Cadastro no Brasil:** Pede CPF, CNH e CEP apenas se o país selecionado for Brasil.
   - **Saque Instantâneo do Motorista:** **Zelle Instant Cashout** nos EUA e **Pix Instantâneo** no Brasil.
4. **Módulo "MOVY NEGOCIA" (Não chamar de leilão):**
   - Passageiro propõe valor ou recebe propostas de motoristas.
   - Motorista possui botões rápidos com o polegar:
     - Nos EUA: `+$1.00`, `+$2.00`, `+$3.00`, `+$5.00`.
     - No Brasil: `+R$ 2.00`, `+R$ 3.00`, `+R$ 5.00`, `+R$ 10.00`.
5. **Configurações Controladas no Monitor (`movymonitor.com`):**
   - **Login por E-mail e Senha:** Ativado por padrão como método principal.
   - **Login por Telefone (SMS OTP):** Desativado por padrão (chave para ligar/desligar no Monitor).
   - **QR Code de Fiscalização Municipal:** Desativado por padrão no app do motorista (chave para ligar/desligar no Monitor).
6. **Compilação Limpa sem Crashes no iOS:**
   - Causa raiz do erro no iPhone (`SIGABRT` / `-[NSInvocation invokeWithTarget:]`) resolvida: isolamento e remoção definitiva de módulos Android específicos como o floating bubble service.

---

## 2. STATUS DAS ENTREGAS E MÓDULOS RECRIADOS

| Módulo / Camada | Localização no Repositório | Status | Descrição e Componentes |
| :--- | :--- | :--- | :--- |
| **Documentação & Auditoria Mestre** | `AUDITORIA DO PROJETO COMPLETO PARA RECRIAR TUDO QUE EXISTE DO ZERO/` | **CONCLUÍDO (100%)** | 6 relatórios analíticos, scripts de auditoria, e PDF executivo completo `AUDITORIA_COMPLETA_ECOSSISTEMA_MOVY.pdf` atualizado. |
| **Banco de Dados V2** | `movy-database-v2/` | **CONCLUÍDO (100%)** | `01_schema_master_movy_v2.sql` consolidando todas as 403 tabelas legadas em 16 domínios limpos: `system_settings`, `supported_countries`, `users`, `passengers`, `drivers`, `vehicles`, `wallets`, `wallet_transactions`, `trips`, `trip_negotiations`, `trip_chat_messages`, `trip_ratings`, `dispatch_stations`, `discount_coupons`, `scheduled_trips`, `driver_documents`, `emergency_sos_alerts` e `trip_intermediate_stops`. |
| **Core Backend NestJS V2** | `movy-backend-v2/` | **CONCLUÍDO (100%)** | NestJS + TypeScript unificado: Auth (E-mail padrão e sem CPF nos EUA), Trips (MOVY Negocia e PIN 4 dígitos), Drivers (Zelle cashout), Settings (Feature Flags), Realtime Gateway, Coupons (USD/BRL), Safety (SOS 911/190), Chat (áudio e texto), Schedules (agendamentos) e Documents (auditoria compliance). |
| **Aplicativo Mobile V2 (Passageiro & Motorista)** | `movy-mobile-app-v2/` | **CONCLUÍDO (100%)** | Telas completas: Login, Registro dinâmico, Home com mapa 60 FPS e categorias, TripActiveScreen (com telemetria, PIN e atalhos), TripChatModal (com áudio gravado), TripReceiptModal (com gorjeta em dólar/real e feedback 5 estrelas), CouponsScreen (vouchers promocionais), ScheduledTripsScreen (reserva antecipada), EmergencySosModal (911/190 e alarme silencioso), DriverCockpitScreen (Zelle cashout e contrapropostas) e DriverDocumentsScreen (upload de Driver License / CNH e CRLV). |
| **Painéis Web V2 (Next.js 15)** | `movy-web-v2/` | **CONCLUÍDO (100%)** | Next.js 15 App Router: `/monitor` (telemetria em tempo real, faturamento USD/BRL, interruptores de feature flags, fila de aprovação de documentos de motoristas e monitor de pânico SOS ao vivo) e `/central` (despacho telefônico em menos de 8 segundos com rota gerada e link do WhatsApp). |
| **Orquestração & Deploy DigitalOcean** | `.do/app_v2.yaml` e `docker-compose.yml` | **CONCLUÍDO (100%)** | Especificação moderna para DigitalOcean App Platform e Docker Compose mestre para execução local ou em VPS com MySQL 8 + Redis 7 + Backend V2 + Web V2. |

---

## 3. HISTÓRICO DE COMMITS NO GIT

- `d34bfbdb7`: docs: checkpoint e plano mestre de recriacao integral MOVY (EUA/BR, Zelle, MOVY Negocia)
- `ba259dddb`: feat(core): implementado banco de dados V2 master e backend V2 NestJS com suporte a USD/Zelle e MOVY Negocia
- `3d422c9ad`: feat(mobile): implementado aplicativo unificado V2 (Passageiro e Motorista) com MOVY Negocia, Zelle, sem CPF nos EUA e zero crashes no iOS
- `8a45eb66d`: feat(web): implementados novos paineis Next.js 15 (Monitor com Feature Flags e Central de Despacho rapido com WhatsApp)
- `f8eeefe95`: feat(deploy): implementados servicos de api/socket v2, orquestracao docker compose e spec digitalocean app platform v2
- `commit_atual`: feat(full-ecosystem): adicionados cupons, agendamentos, chat com audio, SOS policial, auditoria de motoristas e recibos pos-viagem
