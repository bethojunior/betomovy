# AUDITORIA COMPLETA: CENTRAL DE DESPACHO, MONITOR DE FROTAS & DELIVERY

## 1. CENTRAL DE DESPACHO OPERACIONAL (`movycentral.com`)

A Central de Despacho (`mobilidade-central-master` e `mobilidade-central-api-master`) é o sistema utilizado pelos operadores e telefonistas para atendimento de chamados manuais, criação de corridas via telefone/WhatsApp e gestão de cooperativas.

### 1.1. Recursos e Módulos da Central Auditados:
1. **Lançamento Rápido de Corridas Telefônicas (`TripController.php` / `DefaultController.php`):**
   - Atendente digita o telefone do cliente; se já cadastrado, o histórico e os endereços habituais são preenchidos instantaneamente.
   - Cálculo automático de rota, distância e valor sugerido ou cobrança por tabela fixa de bairros (`NeighborhoodRidesController.php`).
   - Seleção manual ou automática de motorista (despacho direto para o motorista mais próximo ou para o primeiro da fila do ponto fixo).
2. **Integração de Mensageria WhatsApp (`WhatsappController.php`):**
   - Notificação automática do passageiro com link de rastreamento do veículo atribuído.
   - Disparo de status da viagem (ex: "Seu motorista chegou à sua porta").
3. **Gestão de Bolsões e Pontos Fixos (`StationController.php`):**
   - Visualização da ordem de chegada dos motoristas nos pontos de apoio (aeroportos, rodoviárias, centros comerciais).
4. **Vouchers Corporativos e Convênios (`VoucherController.php`):**
   - Lançamento de corridas faturadas diretamente para a conta corrente de empresas conveniadas.

---

## 2. MONITOR DE FROTAS EM TEMPO REAL (`movymonitor.com` - MonitorPro)

O Monitor de Frotas (`mobilidade-monitor-new-main` e `mobilidade-monitorapiv2-master`) é um painel administrativo moderno construído em **React 18, TypeScript, Vite, Ant Design e Mapbox GL**.

### 2.1. Funcionalidades Auditadas:
1. **Painel de Monitoramento Cartográfico ao Vivo (`pages/Monitoring`):**
   - Plotagem no mapa de todos os veículos da cidade em tempo real via WebSocket.
   - Diferenciação visual por cores de status:
     - 🟢 **Verde:** Motorista Livre / Disponível para chamada.
     - 🟡 **Amarelo:** Em deslocamento para embarque (`boarding`).
     - 🔴 **Vermelho:** Em corrida com passageiro a bordo (`in_trip`).
     - ⚫ **Cinza:** Offline / Desligado.
   - Clique no veículo para ver velocidade atual, tempo de jornada, bateria do smartphone e dados da corrida ativa.
2. **Dashboard Gerencial e Financeiro (`pages/Dashboard`, `pages/Financial`):**
   - Gráficos de volume de viagens por hora, taxa de aceitação x cancelamento, faturamento total bruto, comissão líquida da plataforma e ticket médio.
3. **Gestão de Motoristas e Passageiros (`pages/Driver`, `pages/Client`):**
   - Aprovação e recusa de novos cadastros e documentos.
   - Bloqueio temporário ou definitivo de motoristas e passageiros reportados.
4. **Tarifas e Zonas Dinâmicas (`pages/Advanced`):**
   - Desenho de polígonos no mapa para aplicação de multiplicador de preço dinâmico por horário e demanda.

---

## 3. VERTICAL DE DELIVERY & RESTAURANTES

O ecossistema conta também com a vertical de Delivery:
- **`delivery-api-master`:** API em Laravel 6 gerenciando cardápios, pedidos, estoques e taxas de entrega.
- **`delivery-estabelecimento-master`:** Painel Web em Laravel 7 + AdminLTE para restaurantes cadastrarem pratos, combos e acompanharem pedidos na cozinha.
- **`delivery-realtimeapi-master`:** Servidor de mensageria em tempo real Node.js com **RethinkDB** para disparar alertas sonoros na cozinha a cada novo pedido.

### Diagnóstico de Manutenibilidade do Delivery:
- A utilização do **RethinkDB** gera dependência de um banco de dados obsoleto e sem suporte ativo no DigitalOcean App Platform.
- Na recriação do zero, o fluxo de pedidos de delivery e entrega deve ser unificado no mesmo barramento de eventos (Redis + WebSockets) da plataforma principal, eliminando a necessidade do contêiner isolado de RethinkDB.
