# INVENTÁRIO COMPLETO E ARQUITETURA DO ECOSSISTEMA MOVY

Este documento registra o inventário técnico de todos os módulos que compõem o ecossistema MOVY (Web, APIs, Mobile e Banco de Dados).

---

## 1. Mapeamento de Repositórios e Módulos Locais

| Diretório | Tipo / Stack | Finalidade | Status de Inspeção |
| :--- | :--- | :--- | :--- |
| `mobilidade-monitor-new-main` | React / TypeScript / Styled Components | Frontend MOVY MONITOR (movymonitor.com) | Em Auditoria |
| `mobilidade-central-master` | PHP / JavaScript Nativo / Bootstrap | Frontend MOVY CENTRAL (movycentral.com) | Em Auditoria |
| `mobilidade-api-php-master` | PHP / MVC Customizado / PDO | API Principal Backend (api.movymob.com) | Em Auditoria |
| `mobilidade-monitorapiv2-master` | PHP / Laravel | API Auxiliar Monitor v2 | Em Auditoria |
| `mobility-pro-app-rota101-pro` | React Native / Expo / TypeScript | Aplicativo Motorista Android / Base | Em Auditoria |
| `mobility-pro-app-rota101-pro-ios`| React Native / iOS Xcode Project | Aplicativo Motorista iOS / Apple | Em Auditoria |
| `mobilidade-appclient-cordova-rota101` | Cordova / JavaScript | Aplicativo Passageiro Legado | Em Auditoria |
| `mobilidade-driverapp-cordova-rota101` | Cordova / JavaScript | Aplicativo Motorista Legado | Em Auditoria |
| `delivery-api-master` | PHP Backend | API de Delivery / Encomendas | Mapeado |
| `delivery-estabelecimento-master` | Web Frontend | Painel Estabelecimento Delivery | Mapeado |
| `delivery-realtimeapi-master` | Node.js | Servidor Realtime / WebSockets | Mapeado |

---

## 2. Inventário de Menus e Rotas: MOVY MONITOR (`mobilidade-monitor-new-main`)

### Rotas Principais (`src/routes/`):
- `/monitoring` — Monitoramento em tempo real (mapa Mapbox, viagens ativas, motoristas online, clientes)
- `/trips` — Listagem, busca e histórico de viagens
- `/drivers` — Gerenciamento e aprovação de motoristas, documentação, split
- `/customers` — Gestão de clientes e passageiros
- `/financial` — Gestão financeira, taxas, extratos e relatórios
- `/franchise` — Gestão de franquias
- `/delivery` — Gestão de entregas e pedidos
- `/frete` — Gestão de fretes e cargas
- `/advanced` — Configurações avançadas do sistema, cidade, categorias, preços e regras

### Componentes Críticos:
- `src/components/Monitoring/Map/index.tsx` — Renderização Mapbox e marcação em tempo real
- `src/components/Monitoring/Card/TripCard/index.tsx` — Exibição das viagens ativas e motoristas chamados
- `src/components/Monitoring/Map/ListModal/index.tsx` — Listagem de motoristas e passageiros

---

## 3. Inventário de Menus e Módulos: MOVY CENTRAL (`mobilidade-central-master`)

### Telas e Views (`src/views/`):
- `default/home.php` — Painel principal de solicitação rápida de corrida e entrega
- `trip/` — Módulos de acompanhamento de status, busca de motorista e confirmação
- `modal/listDriversActive.php` — Modal de motoristas ativos e favoritos da central
- `modal/customer.php` — Cadastro e seleção de passageiros da central
- `modal/paymentForm.php` — Seleção de formas de pagamento

### Scripts e Controladores Frontend (`public/webfiles/js/`):
- `modules/default/home.js` — Orquestração de busca de preços, destinos e rotas
- `modules/trip/updateTrip.js` — Atualização do card de busca de corrida em tempo real
- `modules/trip/confirmationDataTrip.js` — Confirmação e cálculo de trajeto
- `modules/trip/statusTrip.js` — Polling de status e tratamento de respostas
- `modules/driver/listDriversActive.js` — Integração com motoristas cadastrados

---

## 4. Banco de Dados de Produção (`api.movymob.com`)

- **Tabelas Totais:** 444 tabelas
- **Tabelas Centrais de Despacho:** `trip`, `driver`, `user`, `customer`, `driverCalled`, `central`, `centralDriver`, `centralCustomer`, `centralUser`, `city`, `cityArea`, `levelAccess`, `config`
- **Ambiente de Dados:** MySQL gerenciado na DigitalOcean
