# AUDITORIA EXECUTIVA: INFRAESTRUTURA DIGITALOCEAN & ARQUITETURA ATUAL

## 1. VISÃO GERAL DA INFRAESTRUTURA EM PRODUÇÃO

O ecossistema **MOVY** está atualmente provisionado no **DigitalOcean App Platform** (Região NYC / Nova York), utilizando arquitetura de microsserviços e contêineres Docker, acoplada a bancos de dados gerenciados.

### 1.1. Mapeamento de Domínios e Roteamento
De acordo com os logs do App Platform e o arquivo `.do/app.yaml`:

| Domínio de Produção | Serviço Vinculado | Diretório Origem | Rota / Função | Porta Externa |
| :--- | :--- | :--- | :--- | :--- |
| **`movymob.com`** *(PRIMARY)* | `site-web` | `mobilidade-site-novo-main` | `/` (Landing Page & Download Apps) | HTTP/8080 |
| **`api.movymob.com`** | `api-php` | `mobilidade-api-php-master` | `/api` (Regras de Negócio & Core Mobilidade) | HTTP/8080 |
| **`socket.movymob.com`** | `api-node-ws` | `mobilidade-api-node-main` | `/ws` (WebSockets em Tempo Real / Rastreamento) | HTTP/8080 |
| **`movycentral.com`** | `central-web` | `mobilidade-central-master` | `/central` (Central Telefônica / Despacho) | HTTP/8080 |
| **`movymonitor.com`** | `monitor-web` | `mobilidade-monitor-new-main` | `/monitor` (Painel MonitorPro / Frotas) | HTTP/8080 |

---

## 2. AUDITORIA DAS INSTÂNCIAS E CONSUMO DE RECURSOS (DIGITALOCEAN)

Conforme evidenciado no painel do cliente no DigitalOcean:
- **`movy-mobilidade-api-p...`**: CPU: 4% | RAM: 30% (Instância `basic-xs`)
- **`movy-mobilidade-api-n...`**: CPU: 2% | RAM: 3% (Instância `basic-xs`)
- **`movy-mobilidade-monit...`**: CPU: 2% | RAM: 3% (Instância `basic-xxs`)
- **`movy-mobilidade-site-...`**: CPU: 2% | RAM: 7% (Instância `basic-xxs`)
- **`movy-mobilidade-centr...`**: CPU: 2% | RAM: 20% (Instância `basic-xs`)
- **Alerta Crítico Ativo:** *"Less instances running than configured: Capacity may be reduced until instances start."*

### Diagnóstico Técnico do Alerta no DigitalOcean:
1. **Falha de Inicialização ou Loop de Restart do Contêiner:** O DigitalOcean tenta subir réplicas do contêiner, porém o healthcheck HTTP ou o timeout de inicialização falha (geralmente por demora de conexão com o banco MySQL ou Mongo no início da execução).
2. **Dimensionamento Insuficiente (`basic-xxs` com 512MB RAM):** As instâncias `basic-xxs` frequentemente sofrem *Out-Of-Memory (OOM)* durante o `npm run build` ou inicialização do Nginx/Vite com Node.js.
3. **Falta de Healthcheck Específico configurado no `.do/app.yaml`:** Quando o contêiner leva mais de 30 segundos para responder na porta 8080, o orquestrador mata o worker e entra em crash-loop.

---

## 3. AUDITORIA DOS BANCOS DE DADOS EM NUVEM

### 3.1. MySQL Gerenciado (`movy-mysql`)
- **Host Atual:** `movy-mysql-do-user-45837300-0.f.db.ondigitalocean.com`
- **Porta:** `25060` (SSL Obrigatório)
- **Database:** `defaultdb`
- **Usuário:** `doadmin`
- **Tamanho do Dump Histórico:** ~179.8 MB (`rota101_2026-10-13_11-00-48.sql`)
- **Total de Tabelas Físicas:** **403 tabelas**
- **Vulnerabilidade Gravíssima:** Credenciais expostas em texto puro dentro do repositório `.do/app.yaml` e arquivos `.env` locais. Na recriação do zero, deve-se utilizar secrets criptografados do DigitalOcean (`type: SECRET`).

### 3.2. MongoDB Gerenciado (`movy-mongodb`)
- **Host:** `movy-mongodb-79fd3aab.mongo.ondigitalocean.com`
- **Porta:** `27017` (TLS Habilitado)
- **Função no Sistema:** Histórico de telemetria GPS bruta enviada a cada 3 a 5 segundos pelos motoristas, logs de conexões de websockets e chat em tempo real.
- **Problema Detectado:** Falta de índices TTL (Time-To-Live). O banco acumula coordenadas de viagens finalizadas indefinidamente, elevando os custos de armazenamento e degradando o tempo de consulta de histórico.

### 3.3. Redis e Cluster de Sockets
- **Configuração Atual:** `ENABLE_SOCKET_REDIS_ADAPTER: false` no Node.js.
- **Impacto Crítico:** Como o adaptador Redis está desativado, o servidor Socket.IO é puramente local (em memória do processo único). Se o DigitalOcean subir 2 ou mais réplicas para balanceamento de carga, os motoristas conectados no contêiner A **não recebem** os pedidos criados por passageiros conectados no contêiner B! Isso impede o escalonamento horizontal.

### 3.4. Armazenamento de Arquivos e Mídia (S3 e MinIO)
- O sistema possui referências misturadas a buckets da AWS (`s3-sa-east-1.amazonaws.com`, bucket `voutehomologar` e `movy-storage`) e servidores legados (`minio.704app.com.br/rota101fb704`).
- Imagens de perfil, documentos (CNH, CRLV, Alvará) e áudios de chat estão fragmentados entre múltiplos hosts de terceiros, gerando links quebrados quando o MinIO antigo fica inacessível.

---

## 4. DIRETRIZES TÉCNICAS PARA A RECRIARÇÃO DO ZERO

1. **Unificação dos Bancos de Dados:**
   - Substituição da bagunça de 403 tabelas desnormalizadas por um modelo relacional limpo e estrito em PostgreSQL (ou MySQL 8 devidamente normalizado) com suporte a tipos geoespaciais nativos (`PostGIS` / `ST_Point`).
   - Redis ativado nativamente como message broker e pub/sub para websockets.
2. **Ambiente Isolado e 100% Proprietário:**
   - Remoção de qualquer dependência de `704apps.com.br`, `minio.704app.com.br` e `voutehomologar`.
   - Utilização de bucket de alta velocidade **DigitalOcean Spaces** (S3 compatible) ou AWS S3 com CDN Cloudflare.
3. **Escalonamento Automático e Resiliência:**
   - Ajustar as instâncias mínimas para `basic-s` (1 GB RAM / 1 vCPU) para evitar o erro de capacidade reduzida.
   - Definir healthchecks `/health` com retorno HTTP 200 rápido em todas as APIs.
