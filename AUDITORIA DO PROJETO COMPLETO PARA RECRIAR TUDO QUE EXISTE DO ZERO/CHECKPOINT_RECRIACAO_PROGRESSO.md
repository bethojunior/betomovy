# 📌 CHECKPOINT & REGISTRO DE CONTINUIDADE: RECRIARÇÃO DO ZERO MOVY

> **Aviso para Qualquer Agente / Próxima IA:**
> Este documento é o **registro oficial de progresso, estado atual, decisões de arquitetura e próximos passos**. Caso uma nova instância de IA continue o trabalho, leia este arquivo antes de qualquer ação para saber exatamente onde o projeto parou e dar sequência imediata sem retrabalho.

---

## 1. DIRETRIZES FUNDAMENTAIS DO PROJETO (DEFINIDAS PELO CLIENTE)

1. **Recriação 100% do Zero:** NADA de remendos sobre o código legado. Toda a base antiga será gradualmente substituída pelos novos módulos.
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
   - Causa raiz do erro no iPhone (`SIGABRT` / `-[NSInvocation invokeWithTarget:]`) já identificada: injeção indevida do módulo Android `BubbleButton`. Na nova base, módulos de Android possuem *Platform-Specific Guards* (`Platform.OS === 'android' ? ... : null`).

---

## 2. STATUS ATUAL DAS FASES DE EXECUÇÃO

| Fase | Descrição | Status | Detalhes / Entregáveis |
| :--- | :--- | :--- | :--- |
| **Fase 0** | Auditoria Completa & Inventário | **CONCLUÍDO (100%)** | 403 tabelas mapeadas, 52 telas passageiro, 38 telas motorista, PDF gerado. |
| **Fase 1** | Novo Banco de Dados & Schema Normalizado | **EM ANDAMENTO** | Criação do schema MySQL 8 / PostgreSQL com `DECIMAL(12,2)`, suporte USD/BRL, Zelle/Pix. |
| **Fase 2** | Novo Core Backend & Socket Cluster | **PENDENTE** | NestJS + Fastify + Redis 7 Cluster para DigitalOcean App Platform. |
| **Fase 3** | Novo App Passageiro (iOS & Android) | **PENDENTE** | React Native Expo 54 nas cores MOVY, sem CPF nos EUA, MOVY Negocia. |
| **Fase 4** | Novo App Motorista (iOS & Android) | **PENDENTE** | Cockpit automotivo HUD, Zelle Cashout, sem crash no iOS. |
| **Fase 5** | Nova Central & Monitor Web (Next.js 15) | **PENDENTE** | Painel com chaves de login/fiscalização e mapa de frotas ao vivo. |
| **Fase 6** | Testes Finais, Homologação & Virada | **PENDENTE** | Substituição em produção nos domínios oficiais da DigitalOcean. |

---

## 3. HISTÓRICO DE COMMITS NO GIT

- *Iniciando agora o fluxo contínuo de commits na branch `main`.*
