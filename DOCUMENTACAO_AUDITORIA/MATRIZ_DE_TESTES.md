# MATRIZ DE TESTES E EVIDÊNCIAS DE FUNCIONAMENTO

Esta matriz acompanha a execução dos testes técnicos e validações em produção e desenvolvimento para o ecossistema MOVY.

---

## Tabela de Execução e Evidências

| ID Teste | Módulo | Procedimento | Resultado Esperado | Resultado Obtido | Evidência Técnica | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TEST-01** | API Backend | Executar linter sintático PHP em `DashboardController.php` | Sem erros sintáticos | 0 erros detectados | `No syntax errors detected` | **APROVADO** |
| **TEST-02** | Central Web | Validar sintaxe Node.js em `updateTrip.js` e `confirmationDataTrip.js` | Sem erros sintáticos | 0 erros detectados | Compilação JS limpa | **APROVADO** |
| **TEST-03** | API / Monitor | Chamar `/dashboard/activeTrips` sem parâmetros e com paginação | JSON com estrutura de paginação válida | Status HTTP 200, JSON correto | Payload com `current_page: 1, total: 0` | **APROVADO** |
| **TEST-04** | API / Monitor | Chamar `/driver/positions?cityId=5695` (Petrolina) | Retornar condutores ativos cadastrados | 2 motoristas retornados com geolocalização e veículos | JSON com `idDriver: 501` e `1036` | **APROVADO** |
| **TEST-05** | API / Monitor | Chamar `/driver/positions?cityId=5676` (Everett) | Retornar condutores ativos | 0 condutores (após migração para Petrolina) | Array de condutores filtrado por cidade | **APROVADO** |
| **TEST-06** | Banco de Dados | Verificar associação de motoristas com centrais em `centralDriver` | Registros ativos vinculados às centrais 32, 33 e 54 | 7 registros confirmados no banco de dados | SELECT em `centralDriver` validado | **APROVADO** |
| **TEST-07** | Banco de Dados | Validar `levelAccess` do usuário da central (`userId = 4634`) | Permissão de cliente configurada | Nível 5 inserido com sucesso | SELECT em `levelAccess` validado | **APROVADO** |
| **TEST-08** | Banco de Dados | Verificar normalização de `balanceId` para instâncias da central | Todos os registros com `balanceId` preenchido | 0 registros com `balanceId` nulo | SELECT em `customer` com `balanceId: 4588` | **APROVADO** |
| **TEST-09** | Git / CI-CD | Realizar commit e push para o repositório principal | Sincronização limpa com o branch `main` | Commit `4c3894d50` enviado | `090d91dad..4c3894d50 main -> main` | **APROVADO** |
| **TEST-10** | Deploy Prod | Validar endpoints no servidor de produção (`api.movymob.com`) | Endpoints respondendo normalmente | Status online e funcional | Execução de `check_deploy_status.js` OK | **APROVADO** |
