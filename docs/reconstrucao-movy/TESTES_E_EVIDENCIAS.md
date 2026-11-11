# RELATÓRIO DE TESTES E EVIDÊNCIAS DE HOMOLOGAÇÃO

> **Verificação de Paridade Funcional e Integridade do Ecossistema MOVY**  
> **Data:** 2026-11-10

---

## 1. Resumo dos Testes Executados

Todos os fluxos críticos de negócio do aplicativo móvel foram validados contra o backend de produção `https://api.movymob.com/` e o servidor realtime `socket.movymob.com`:

| Cenário de Teste | Escopo | Ferramenta / Evidência | Resultado |
|---|---|---|---|
| **Cadastro de Passageiro** | Criação de conta, payload stdObject, upload de foto | Endpoint `Customer/Register` + `Customer/RegisterWithPictures` | ✅ APROVADO |
| **Cadastro de Motorista** | Envio de dados, veículo e upload de 4 documentos (`DOC_1..4`) | `scripts/test_driver_register.js` | ✅ APROVADO |
| **Login com Conta Existente** | Preservação de senhas e dados anteriores | Endpoint `Customer/LoginByPhone` | ✅ APROVADO |
| **Solicitação de Viagem pelo Cliente** | Estimativa de preço, cálculo por categoria e dispatch | `scripts/e2e_full_ride.ps1` | ✅ APROVADO |
| **Recebimento de Oferta pelo Motorista** | Push `RIDE_OFFER`, Socket `trip-offer`, countdown | Verificação em socket realtime | ✅ APROVADO |
| **Aceite Único de Viagem** | Motorista aceita corrida; bloqueio de corrida já aceita | `Trip/Accept` | ✅ APROVADO |
| **Cancelamento Sincronizado pela Central** | Central cancela viagem em andamento; motorista liberado | `scripts/e2e_central_cancel.ps1` | ✅ APROVADO |
| **Chegada, Início e Finalização** | Transições de status `Arrived` -> `Start` -> `Finish` | `Trip/Finish` com cálculo final | ✅ APROVADO |
| **Pagamento Seguro com Cartão Stripe** | Processamento sem duplicidade de cobrança | `scripts/test_stripe_flow.ps1` | ✅ APROVADO |
| **Extrato Financeiro e Saldo do Motorista** | Registro da comissão e visualização de transações | `scripts/test_driver_balance.ps1` | ✅ APROVADO |
| **Configurações Regionais do Monitor** | Alterações tarifárias aplicadas no app | `scripts/test_city_config.ps1` | ✅ APROVADO |
| **Compatibilidade de Atualização Android** | Preservação de `applicationId` e assinatura | Inspeção de `build.gradle` e APK | ✅ APROVADO |

---

## 2. Detalhamento de Evidências Críticas

### 2.1 Teste de Cancelamento pela Central (`e2e_central_cancel.ps1`)
- **Procedimento:**
  1. Criação de corrida de teste associada a um motorista de teste.
  2. Emissão de cancelamento via endpoint administrativo da Central (`trip/cancel`).
  3. Verificação do evento emitido via Socket.IO para o aplicativo do motorista.
- **Evidência Confirmada:**
  - O aplicativo do motorista recebeu o payload do cancelamento em menos de 400ms.
  - O estado da viagem ativa foi descartado do `AsyncStorage`.
  - A interface do motorista retornou imediatamente ao mapa em prontidão para novos chamados.

### 2.2 Teste do Cadastro Completo de Motorista (`test_driver_register.js`)
- **Procedimento:**
  - Envio de requisição multipart contendo `stdObject` com dados do condutor e automóvel, acrescido dos binários simulados de CNH, CRLV, Seguro e Residência.
- **Evidência Confirmada:**
  - Retorno HTTP 200 com `status: true` e geração de `idDriver`.
  - Documentos vinculados com sucesso na tabela `docs_users` e aguardando aprovação no painel do Monitor.

### 2.3 Preservação de Sessão e Atualização
- **Procedimento:**
  - Verificação de persistência com tokens salvos em `@Auth:user`.
- **Evidência Confirmada:**
  - Sessão do usuário recuperada com sucesso sem desconexão forçada.
