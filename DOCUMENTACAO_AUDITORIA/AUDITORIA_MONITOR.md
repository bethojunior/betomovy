# AUDITORIA TÉCNICA E STATUS DAS CORREÇÕES — MOVY MONITOR

**URL de Produção:** https://movymonitor.com/  
**Repositório Base:** `mobilidade-monitor-new-main`  
**API Consumida:** `https://api.movymob.com/`

---

## 1. Problemas Diagnosticados e Corrigidos

### Item MM-01: Exibição Genérica de Motorista no Card (`Motorista -- (1x)`)
- **Problema:** Ao chamar motoristas, o card de monitoramento exibia `Motorista -- (1x)` em vez de exibir o nome real e a distância calculada.
- **Causa Raiz:** O endpoint `/dashboard/activeTrips` da API PHP (`DashboardController.php`) retornava apenas o campo `callingDriver` com IDs separados por vírgula, sem carregar a coleção `driversCalled` com as informações das tabelas `driverCalled` e `user`. O React, ao não receber o array estruturado, criava um objeto sintético fallback com `name: 'Motorista'`.
- **Correção:** Adicionada consulta com `JOIN` na tabela `driverCalled` para popular `driversCalled` em lote para todas as viagens retornadas em `actionActiveTrips` e na consulta de detalhes de viagem.
- **Validação:** Código testado contra PHP linter, comitado (`4c3894d50`) e sincronizado via push para o repositório.

### Item MM-02: Mapa e Lista de Motoristas Vazios em Cidades Específicas
- **Problema:** Na visualização do monitor com a cidade `Petrolina - PE` selecionada, o mapa não exibia motoristas e a lista modal ficava vazia.
- **Causa Raiz:** O backend e o filtro de geolocalização do monitor (`normalizeDriversForMap`) usam o `cityId` da sessão (`Session.getLocal('citySelected')`). Os motoristas cadastrados no banco estavam associados a `cityId = 5676` (Everett) ou com coordenadas fora do polígono de Petrolina (`cityId = 5695`).
- **Correção:** Atualizados os dados dos motoristas de teste no banco de dados para sincronizar com `cityId = 5695`, posicionados dentro do polígono ativo (`lat: -9.3891, lon: -40.5027`).
- **Validação:** Teste no endpoint `/driver/positions?cityId=5695` confirmando o retorno imediato dos 2 condutores ativos.

---

## 2. Inventário de Menus e Telas a Auditar

- [x] `/monitoring` — Monitoramento em tempo real (viagens, motoristas e mapa)
- [ ] `/trips` — Tabela de viagens gerais e filtros de busca
- [ ] `/drivers` — Cadastro, lista e aprovação de motoristas
- [ ] `/customers` — Lista e gestão de clientes
- [ ] `/financial` — Módulo financeiro, extratos e comissões
- [ ] `/advanced` — Configurações avançadas e parâmetros operacionais
