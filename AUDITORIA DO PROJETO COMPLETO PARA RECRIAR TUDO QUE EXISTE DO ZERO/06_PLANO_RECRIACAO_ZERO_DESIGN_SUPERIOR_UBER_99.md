# BLUEPRINT DE ENGENHARIA: PLANO DE RECRIARÇÃO DO ZERO (DESIGN SUPERIOR A UBER E 99)

## 1. VISÃO ESTRATÉGICA E DIRETRIZES DO NOVO PROJETO

O objetivo principal desta recriação é **substituir integralmente o ecossistema legado**, preservando 100% das regras e funcionalidades mapeadas na auditoria, eliminando todos os gargalos técnicos e implementando um padrão de **Design, Layout, Performance e Experiência do Usuário (UX) indiscutivelmente superior ao Uber e 99**.

---

## 2. BENCHMARK E INOVAÇÕES VISUAIS: POR QUE O NOVO MOVY SERÁ SUPERIOR A UBER E 99

| Recurso / Aspecto | Uber | 99 | **Novo Ecossistema MOVY** |
| :--- | :--- | :--- | :--- |
| **Identidade Visual & Tema** | Minimalista preto e branco monocromático | Amarelo corporativo saturado e pesado | **Dark Obsidian Neo-Automotivo** de alto luxo com toques em verde esmeralda elétrico (`#00E599`) e azul titânio; modo Claro limpo e ergonômico. |
| **Fluidez de Movimento dos Carros no Mapa** | Atualização a cada 3s com interpolação linear padrão | Snapping perceptível e saltos de posição | **Interpolação Bézier a 60 FPS com rotação vetorial angular (bearing)**; o carrinho faz curvas de forma suave na rua, sem engasgos. |
| **Gavetas e Modais de Ação (Bottom Sheets)** | Padrão nativo rígido | Lento com transições travadas | **Interactive Bottom Sheets baseados em física de molas (Spring Physics)**, permitindo arrastar com uma só mão e ajuste dinâmico de altura. |
| **Modos de Chamada de Corrida** | Somente Despacho Algorítmico Fixo | Somente Despacho Algorítmico Fixo | **Modo Híbrido Triplo:** 1) Despacho Algorítmico Rápido (Uber/99); 2) Modo Leilão / Ofertas (Indrive); 3) Fila de Ponto Fixo/Bolsão de Cooperativa. |
| **Segurança Ativa em Corrida** | Código de 4 dígitos básico | Gravação de áudio oculta | **Central de Proteção Completa:** PIN dinâmico no embarque, gravação de áudio criptografada, compartilhamento ao vivo com nível de bateria do celular, botão de pânico silencioso com telemetria direta para viaturas e central. |
| **Cockpit do Motorista (Driver HUD)** | Telas densas com muitos cliques | Poluição visual e anúncios | **Heads-Up Display (HUD) Noturno**, velocímetro com alerta de radar, indicador de meta diária em anel progressivo e botão flutuante ergonômico. |
| **Painéis Web (Central & Monitor)** | N/A (Plataforma fechada) | N/A (Plataforma fechada) | **Central de Atendimento Ultrarrápida (<8 segundos para criar corrida via telefone)** e **Monitor de Frotas com Visão Holográfica em 3D de alta performance**. |

---

## 3. NOVA ARQUITETURA TECNOLÓGICA (CLEAN & MODERNA)

A nova solução será construída do zero, eliminando o emaranhado de PHP legado, Cordova, RethinkDB e contêineres fragmentados:

```
                            ┌──────────────────────────────────────────────┐
                            │               CLIENTES & CANAIS              │
                            │  • App Passageiro (iOS & Android - Expo 54)  │
                            │  • App Motorista (iOS & Android - Expo 54)   │
                            │  • Central de Despacho (Next.js 15 AppRouter)│
                            │  • Monitor de Frotas (Next.js 15 + Mapbox)   │
                            │  • Site Institucional (Next.js SEO Otimizado)│
                            └──────────────────────┬───────────────────────┘
                                                   │
                                     (HTTPS / WSS - Cloudflare CDN)
                                                   │
                                                   ▼
                            ┌──────────────────────────────────────────────┐
                            │           API GATEWAY & MESH SERVICE         │
                            │             Fastify / NestJS Cluster         │
                            └──────┬───────────────────────┬───────────────┘
                                   │                       │
                                   ▼                       ▼
              ┌───────────────────────────────┐ ┌───────────────────────────┐
              │      CORE BUSINESS ENGINE     │ │   REALTIME SOCKET ENGINE  │
              │  • Gestão de Corridas & Leilão│ │  • WebSocket / Socket.IO  │
              │  • Tarifas, Zonas & Cupons    │ │  • Telemetria GPS < 2 seg │
              │  • Split Financeiro & Pix 2.0 │ │  • Broadcast de Fila      │
              │  • Autenticação JWT Segura    │ │  • Chat & Push Notifee    │
              └──────────────┬────────────────┘ └─────────────┬─────────────┘
                             │                                │
                             └───────────────┬────────────────┘
                                             ▼
                            ┌──────────────────────────────────────────────┐
                            │           CAMADA DE DADOS E EVENTOS          │
                            │  • PostgreSQL 16 + PostGIS (ou MySQL 8 Norm) │
                            │  • Redis 7 Cluster (Pub/Sub & Cache GPS)     │
                            │  • DigitalOcean Spaces (S3 CDN para Mídias)  │
                            └──────────────────────────────────────────────┘
```

---

## 4. DESIGN SYSTEM: COMPONENTES E LINGUAGEM VISUAL

### 4.1. Paleta de Cores
- **Obsidian Dark (Fundo Principal):** `#090A0F`
- **Surface Elevation 1 (Cards & Bottom Sheets):** `#141721`
- **Surface Elevation 2 (Inputs & Modais):** `#1E2333`
- **Emerald Pulse (Ações Positivas / Ganhos / Online):** `#00E599`
- **Electric Blue (Rotas / Seleção / Destaques):** `#0070F3`
- **Amber Surge (Tarifa Dinâmica / Atenção):** `#FF9900`
- **Crimson Alert (Cancelamento / Botão de Pânico SOS):** `#FF334B`
- **Pure White (Tipografia Principal):** `#FFFFFF`
- **Titanium Gray (Tipografia Secundária):** `#8E95A5`

### 4.2. Tipografia
- Fonte Principal: **Inter** ou **Plus Jakarta Sans** (geometria perfeita para números, preços e mapas legíveis sob luz solar direta).

---

## 5. ROTEIRO DE TRANSIÇÃO E SUBSTITUIÇÃO SEM IMPACTO

1. **Fase 1 (Banco de Dados & Dados Históricos):**
   - Execução do script de normalização das 403 tabelas legadas para as 48 tabelas estritas no MySQL 8 / PostgreSQL.
   - Saneamento de colunas de moeda para `DECIMAL(12,2)` e padronização em `utf8mb4_unicode_ci`.
2. **Fase 2 (Novo Backend Unificado):**
   - Implantação da API moderna em NestJS e servidor de sockets com Redis Adapter ativo no DigitalOcean App Platform.
3. **Fase 3 (Novos Aplicativos Mobile):**
   - Criação da base unificada em Expo SDK 54+, eliminando os crashes nativos de iOS causados pelo pacote Android BubbleButton.
   - Publicação das versões aprovadas nas lojas Apple App Store e Google Play Store.
4. **Fase 4 (Novos Painéis Web):**
   - Substituição da Central legada e Monitor antigo pelas novas interfaces Next.js 15 de carregamento instantâneo.
