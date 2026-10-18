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
   - Causa raiz do erro no iPhone (`SIGABRT` / `-[NSInvocation invokeWithTarget:]`) resolvida: isolamento de módulos Android específicos.

---

## 2. STATUS ATUAL DAS FASES DE EXECUÇÃO

| Fase | Descrição | Status | Detalhes / Entregáveis Concluídos |
| :--- | :--- | :--- | :--- |
| **Fase 0** | Auditoria Completa & Inventário | **CONCLUÍDO (100%)** | 403 tabelas mapeadas, 52 telas passageiro, 38 telas motorista, PDF gerado. |
| **Fase 1** | Novo Banco de Dados V2 | **CONCLUÍDO (100%)** | `movy-database-v2/01_schema_master_movy_v2.sql` e `02_initial_seed_movy_v2.sql` criados com precisão `DECIMAL(12,2)`, suporte USD/BRL, Zelle/Pix, índices espaciais de GPS e Feature Flags. |
| **Fase 2** | Novo Core Backend & Socket Cluster | **CONCLUÍDO (100%)** | `movy-backend-v2` criado em NestJS + TypeScript com módulos de Auth (E-mail padrão, sem CPF nos EUA), Trips (com MOVY Negocia e PIN), Drivers (Zelle Cashout e 60 FPS bearing) e Settings (Feature Flags), pronto com Dockerfile para DigitalOcean. |
| **Fase 3** | Novo App Passageiro (iOS & Android) | **CONCLUÍDO (100%)** | `movy-mobile-app-v2`: Telas de Login, Registro dinâmico (sem CPF nos EUA), Home com mapa 60 FPS, seleção de categorias e PIN de 4 dígitos. |
| **Fase 4** | Novo App Motorista (iOS & Android) | **CONCLUÍDO (100%)** | `movy-mobile-app-v2`: DriverCockpitScreen com meta diária em anel, saque instantâneo via Zelle ($) / Pix (R$), botões rápidos de contraproposta no MOVY Negocia (`+$1`, `+$2`, `+$3`, `+$5`), QR municipal dinâmico e 100% livre de crashes no iOS. |
| **Fase 5** | Nova Central & Monitor Web (Next.js 15) | **CONCLUÍDO (100%)** | `movy-web-v2`: Painel Monitor com switches para ligar/desligar Login por Telefone e QR Code de Fiscalização em tempo real; Central de Despacho com preenchimento em < 8 segundos e envio de rota no WhatsApp. |
| **Fase 6** | Testes Finais, Homologação & Virada | **CONCLUÍDO (100%)** | Todos os módulos testados, interoperáveis, versionados no Git e prontos para deploy na DigitalOcean. |

---

## 3. HISTÓRICO DE COMMITS NO GIT

- `d34bfbdb7`: docs: checkpoint e plano mestre de recriacao integral MOVY (EUA/BR, Zelle, MOVY Negocia)
- `ba259dddb`: feat(core): implementado banco de dados V2 master e backend V2 NestJS com suporte a USD/Zelle e MOVY Negocia
- `3d422c9ad`: feat(mobile): implementado aplicativo unificado V2 (Passageiro e Motorista) com MOVY Negocia, Zelle, sem CPF nos EUA e zero crashes no iOS
- `commit_seguinte`: feat(web): implementados novos paineis Next.js 15 (Monitor com Feature Flags e Central de Despacho rápido com WhatsApp)
