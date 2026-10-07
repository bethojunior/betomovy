# 🚗 ECOSSISTEMA MOVY - PLATAFORMA DE MOBILIDADE URBANA & DELIVERY

Plataforma completa de mobilidade urbana (transporte de passageiros) e delivery. O ecossistema é composto por 16 módulos integrados abrangendo aplicativos móveis para passageiros e motoristas, centrais de despacho, painéis administrativos de monitoramento de frotas, portais de estabelecimentos comerciais, APIs de regras de negócio em PHP (Laravel e MVC proprietário), e microsserviços em tempo real com WebSockets (Node.js/NestJS).

---

## 🗺️ 1. MAPA GERAL DA ARQUITETURA E MÓDULOS

O ecossistema é dividido em **Mobilidade Urbana** (Ride-Hailing) e **Delivery**:

```
                                  +------------------------------------+
                                  |         USUÁRIO / CLIENTE          |
                                  +------------------------------------+
                                             /               \
                       (Mobilidade Urbana)  /                 \  (Delivery)
                                           v                   v
                     +----------------------------+     +-----------------------------+
                     | mobility-pro-app-rota101   |     | Portal Estabelecimento      |
                     | (React Native / Expo 54)   |     | delivery-estabelecimento    |
                     +----------------------------+     +-----------------------------+
                               /          \                            |
                              /            \                           v
                             v              v           +-----------------------------+
             +--------------------+    +-------------+  | delivery-api-master         |
             | mobilidade-api-php |    | api-node    |  | (Laravel 6 + RethinkDB)     |
             | (Core MVC PHP)     |    | (NestJS WS) |  +-----------------------------+
             +--------------------+    +-------------+                 |
                       |                      |                        v
                       +----------+-----------+         +-----------------------------+
                                  |                     | delivery-realtimeapi        |
                                  v                     | (Node.js + RethinkDB WS)    |
                     +----------------------------+     +-----------------------------+
                     | BANCO DE DADOS & CACHE     |
                     | MySQL + MongoDB + Redis    |
                     +----------------------------+
                             /            \
                            v              v
            +--------------------------+  +-------------------------------+
            | CENTRAL DE DESPACHO      |  | MONITORAMENTO DE FROTA        |
            | mobilidade-central-api   |  | mobilidade-monitorapiv2       |
            | mobilidade-central       |  | mobilidade-monitor-new (Vite) |
            +--------------------------+  +-------------------------------+
```

---

## 📦 2. DETALHAMENTO DOS 16 MÓDULOS

### 🚗 A. Mobilidade Urbana (Core Backend & Tempo Real)

1. **`mobilidade-api-php-master`**
   - **Tecnologia:** PHP 7.4+ (Arquitetura MVC pura com PSR-4 e Composer)
   - **Porta Padrão:** `8101`
   - **Função:** Núcleo de regras de negócio de mobilidade (corridas, tarifas, motoristas, passageiros, cupons, carteira, conciliação, gateways Cielo/MercadoPago/eRede, SMS Newave, push notifications Expo/Firebase).
   - **Banco:** MySQL (tabelas relacionais) + MongoDB (documentos/históricos) + Redis.
   - **Configuração:** `.env` (ou `configs/env/env.json`).

2. **`mobilidade-api-node-main`**
   - **Tecnologia:** Node.js, NestJS, TypeScript, Socket.IO, TypeORM, Mongoose
   - **Porta Padrão:** `3704` (HTTP) / `3000` (WebSocket)
   - **Função:** Rastreamento GPS de motoristas em tempo real, broadcast de posições, filas de despacho e eventos via WebSocket.
   - **Banco:** Redis (Adapter e cache) + MySQL + MongoDB.

3. **`mobilidade-central-api-master`**
   - **Tecnologia:** PHP / Laravel Framework
   - **Porta Padrão:** `8004`
   - **Função:** API REST para o sistema de central de despacho, integração de cooperativas, atendimento e central de rádio/chamadas.

4. **`mobilidade-central-master`**
   - **Tecnologia:** PHP (Frontend Web / Views / Controladores) + JavaScript
   - **Porta Padrão:** `8004`
   - **Função:** Painel Web operacional para operadores da central criarem e despacharem corridas manualmente.

5. **`mobilidade-monitorapiv2-master`**
   - **Tecnologia:** PHP / Laravel Framework
   - **Porta Padrão:** `8100`
   - **Função:** API de monitoramento de frotas, analytics de corridas, geocoding e estatísticas gerenciais em tempo real.

6. **`mobilidade-monitor-new-main` (MonitorPro)**
   - **Tecnologia:** React 18, TypeScript, Vite, Ant Design, Mapbox GL
   - **Porta Padrão:** `5173` (Dev Vite) / `80` (Produção Nginx)
   - **Função:** Painel administrativo moderno com visualização cartográfica de veículos ao vivo no mapa, relatórios e gestão de cooperados.

7. **`mobilidade-monitor-master`**
   - **Tecnologia:** PHP + Web frontend (Versão legado do monitor de frotas)
   - **Porta Padrão:** `8105`

8. **`mobilidade-site-novo-main`**
   - **Tecnologia:** React SPA (Create React App), Tailwind/CSS
   - **Porta Padrão:** `3000`
   - **Função:** Novo site institucional e página de download dos aplicativos.

9. **`mobilidade-site-master`**
   - **Tecnologia:** PHP 7.4 (Site institucional clássico)
   - **Porta Padrão:** `8003`

---

### 📱 B. Aplicativos Mobile

10. **`mobility-pro-app-rota101-pro`**
    - **Tecnologia:** React Native, Expo SDK 54, TypeScript, Hermes Engine
    - **Função:** Aplicativo mobile moderno híbrido (Passageiro e Motorista) com suporte a reconhecimento de voz, Mapbox/Google Maps, notificações push e serviço em background.

11. **`mobility-pro-app-rota101-pro-ios`**
    - **Tecnologia:** React Native / Expo (Configuração e perfil específico para iOS / App Store).

12. **`mobilidade-appclient-cordova-rota101`**
    - **Tecnologia:** Apache Cordova / HTML5 / JavaScript (App passageiro legado Android).

13. **`mobilidade-driverapp-cordova-rota101`**
    - **Tecnologia:** Apache Cordova / HTML5 / JavaScript (App motorista legado Android).

---

### 🍔 C. Ecossistema Delivery

14. **`delivery-api-master`**
    - **Tecnologia:** PHP / Laravel 6.2
    - **Porta Padrão:** `8100`
    - **Função:** Backend da vertical de delivery (pedidos, catálogo, cardápio, restaurantes, status de entrega).
    - **Banco:** MySQL + RethinkDB.

15. **`delivery-estabelecimento-master`**
    - **Tecnologia:** PHP / Laravel 7 + AdminLTE
    - **Porta Padrão:** `8000`
    - **Função:** Painel de controle para restaurantes e lojas cadastrarem produtos, gerenciarem pedidos e horários de funcionamento.

16. **`delivery-realtimeapi-master`**
    - **Tecnologia:** Node.js, Express, Socket.IO v2, RethinkDB
    - **Porta Padrão:** `3000`
    - **Função:** Atualização em tempo real de status de pedidos entre estabelecimentos, entregadores e clientes via RethinkDB Changefeeds.

---

## ⚙️ 3. MATRIZ DE PORTAS E SERVIÇOS

| Serviço | Módulo | Porta Padrão | Protocolo / Tipo |
| :--- | :--- | :--- | :--- |
| **API Mobilidade PHP** | `mobilidade-api-php-master` | `8101` | HTTP / REST |
| **API Mobilidade Node** | `mobilidade-api-node-main` | `3704` / `3000` | HTTP / WebSocket |
| **API Monitor v2** | `mobilidade-monitorapiv2-master` | `8100` | HTTP / REST |
| **API Central Despacho**| `mobilidade-central-api-master` | `8004` | HTTP / REST |
| **Painel Central** | `mobilidade-central-master` | `8004` (Nginx) | HTTP / Web |
| **MonitorPro (Vite)** | `mobilidade-monitor-new-main` | `5173` | HTTP / SPA |
| **Monitor Legado** | `mobilidade-monitor-master` | `8105` | HTTP / Web |
| **Site Institucional** | `mobilidade-site-master` | `8003` | HTTP / Web |
| **Site Novo (React)** | `mobilidade-site-novo-main` | `3000` | HTTP / SPA |
| **Delivery API** | `delivery-api-master` | `8100` | HTTP / REST |
| **Delivery Painel** | `delivery-estabelecimento-master` | `8000` | HTTP / Web |
| **Delivery Realtime** | `delivery-realtimeapi-master` | `3000` | HTTP / WebSocket |
| **MySQL Server** | Docker / Host | `3306` | SQL Database |
| **MongoDB Server** | Docker / Host | `27017` | NoSQL Database |
| **Redis Server** | Docker / Host | `6379` | Key-Value / PubSub |
| **RethinkDB** | Docker / Host | `28015` | Realtime Database |

---

## 🔒 4. SEGURANÇA E GERENCIAMENTO DE AMBIENTE (.ENV)

Todos os arquivos `.env.example` foram completamente auditados e higienizados. **Nenhuma credencial de produção, chave AWS, senha de banco de dados ou token real deve ser comitado ao Git.**

### Como configurar para desenvolvimento local:
1. Em cada pasta de serviço que você for executar, copie o arquivo de modelo:
   ```bash
   cp .env.example .env
   ```
2. No caso de `mobilidade-api-php-master`, também há suporte a configuração em JSON:
   ```bash
   cp configs/env/env.example.json configs/env/env.json
   ```
3. O arquivo `.gitignore` na raiz do projeto já bloqueia `.env`, `configs/env/env.json`, arquivos `.jks` (chaves de assinatura mobile), credenciais do Google Firebase (`google-services.json`, `GoogleService-Info.plist`) e caches.

---

## 🚀 5. INSTRUÇÕES DE EXECUÇÃO

### A. Subindo o Backend de Mobilidade Urbana com Docker:
```bash
# 1. API PHP Principal (Porta 8101 e Redis na 6379)
cd mobilidade-api-php-master
docker-compose up -d

# 2. Servidor WebSocket Node (Porta 3704)
cd ../mobilidade-api-node-main
docker-compose up -d

# 3. Monitor API v2 (Porta 8100, MySQL na 3306 e MongoDB na 27017)
cd ../mobilidade-monitorapiv2-master
docker-compose up -d
```

### B. Executando o Frontend do Monitor (MonitorPro):
```bash
cd mobilidade-monitor-new-main
npm install   # ou yarn
npm run dev
# Acesse: http://localhost:5173
```

### C. Executando o Aplicativo Mobile (Movy Pro):
```bash
cd mobility-pro-app-rota101-pro
npm install   # ou yarn
npx expo start
```

---

## 🛡️ 6. POLÍTICA DE AUDITORIA E PRESERVAÇÃO
- **Regras de Negócio e DAOs:** Todas as 270 DAOs do motor de mobilidade PHP foram preservadas e mapeadas.
- **Assinaturas Mobile:** Os keystores Android em `backup/keystore.jks.*` foram protegidos pelo `.gitignore` para prevenir qualquer vazamento ou perda acidental.
- **Roteamento e Endpoints:** Todos os caminhos relativos, controladores e views mantêm estrita compatibilidade com os servidores de homologação e produção.
