# PAINEL MESTRE DE ACOMPANHAMENTO — PROJETO MOVY
## AUDITORIA TOTAL, RECONSTRUÇÃO, MODERNIZAÇÃO E VALIDAÇÃO INTEGRAL

> **Regra Absoluta:** Preservação integral dos bancos de dados existentes, dados reais de clientes, motoristas, históricos de corridas, financeiro e configurações. Nenhuma operação destrutiva permitida em produção.  
> **Ordem Obrigatória:** Bloco 00 a Bloco 14. Nenhuma fase é pulada. Teste real com persistência validada antes da conclusão de cada item.

---

## Matriz Geral de Blocos

| Bloco | Área | Descrição Resumida | Status Geral |
| :--- | :--- | :--- | :--- |
| **00** | Diagnóstico e Segurança | Inventário de diretórios, stack, APIs, portas, bancos e segurança | **EM AUDITORIA** |
| **01** | Arquitetura e Dados | Modelagem de schemas, tabelas (MySQL 444 tabelas, Mongo, Redis), integridade | **EM AUDITORIA** |
| **02** | Monitor — Estrutura | Autenticação, layout responsivo, hierarquia de menus, permissões | **EM AUDITORIA** |
| **03** | Monitor — Operações | Gestão de Clientes, Motoristas (exclusão, status), Veículos, Viagens | **EM CORREÇÃO** |
| **04** | Monitor — Delivery | Gestão de entregas, estabelecimentos, zonas e configurações | **PENDENTE** |
| **05** | Monitor — Financeiro | Faturamento, tarifas, estornos, extratos, split e relatórios | **PENDENTE** |
| **06** | Monitor — Configurações | Tarifas por cidade/categoria, integrações, limites, chaves, regras | **EM AUDITORIA** |
| **07** | Monitor — Demais Módulos | Módulos restantes (Publicidade, Mensagens, Promoções, Mapas) | **PENDENTE** |
| **08** | Monitor — Homologação | Testes ponta a ponta e validação integral do MOVY MONITOR | **PENDENTE** |
| **09** | Central — Reconstrução | Modernização da Central de Operações, interface, mapas e despacho | **PENDENTE** |
| **10** | Central — Chamadas | Fluxo de despacho, aceite, cancelamento sincronizado motorista/passageiro | **PENDENTE** |
| **11** | Aplicativos Mobile | Reconstrução Android/iOS Motorista e Passageiro, layout profissional | **PENDENTE** |
| **12** | Sincronização Realtime | Push notifications (Firebase), WebSockets, sincronismo de status | **PENDENTE** |
| **13** | Qualidade e Segurança | Testes E2E, segurança, auditoria de vulnerabilidades e performance | **PENDENTE** |
| **14** | Implantação e Rollback | Publicação em produção gradual, observabilidade e rollback seguro | **PENDENTE** |

---

## Tabela Detalhada de Itens e Ocorrências

| ID | Bloco | Módulo | Página / Recurso | Descrição do Problema | Causa Raiz | Prioridade | Dependências | Status | Solução Aplicada | Testes Realizados | Evidência | Resultado da Validação |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **MOV-001** | 03 | Monitor Operações | `/driver/list` | Ao clicar em 'Confirmar' na exclusão de motorista, nada é excluído | A coluna `status` na tabela `driver` é VARCHAR/ENUM (`'desligado'`), mas a query da API PHP fazia `SET status = 0`, disparando `SQLSTATE[01000]: Warning: 1265 Data truncated for column 'status'` | CRÍTICA | API PHP `DriverController` | **EM CORREÇÃO** | Ajustado `DriverController::handleDeleteDriver` para `SET status = 'desligado'` e exclusão lógica segura com `user.statusId = 2` | Linter PHP validado sem erros sintáticos; teste de requisição DELETE via API | SQLSTATE Warning 1265 eliminado | Aguardando deploy no App Platform para teste final no browser |
| **MOV-002** | 06 | Monitor Configurações | `/config/rates` (Tarifas) | Persistência de valores de tarifas por cidade e categoria falha ou não salva | Endpoints de atualização de tarifas necessitam parâmetros estruturados compatíveis com a tabela `cityAreaTariff` | CRÍTICA | API PHP `CityController` / `TariffController` | **EM AUDITORIA** | Mapeamento dos hooks `useTripRates` e `useTariffPricing` | Análise de payloads POST/PUT de tarifas | `endpoints_audit_report.json` | Em análise |
| **MOV-003** | 03 | Monitor Operações | `/client/list` | Fotos de perfil de passageiros não carregavam | Redirecionamento de fotos locais para o storage MinIO `https://minio.704app.com.br/rota101fb704` | ALTA | API PHP `public/index.php` | **APROVADO** | Adicionado fallback dinâmico no `public/index.php` para redirecionar fotos `/customer/profile/*` para o bucket MinIO | Requisições HTTP com retorno 302/200 para MinIO | Imagens de passageiros renderizando corretamente | APROVADO |
| **MOV-004** | 06 | Monitor Configurações | `/config/appDocuments` | Erro ao listar documentos: `Action não existe: doc` | O frontend busca `GET /doc`, mas a rota correta na API PHP é `GET /appDocuments` ou ação específica do controller | ALTA | API PHP / Monitor React | **PROBLEMA IDENTIFICADO** | Alinhar rota do frontend com o endpoint correto da API ou criar alias seguro na API | Teste em `test_monitor_endpoints.js` retornou HTTP 200 com `Action não existe: doc` | `scripts/endpoints_audit_report.json` | Aguardando correção |
| **MOV-005** | 06 | Monitor Configurações | `/config/appConfig` | Erro ao carregar configurações de app: `Action não existe: appConfig` | `AppConfigController` da API PHP não possui `actionIndex` ou mapeamento de rota correspondente | ALTA | API PHP `AppConfigController` | **PROBLEMA IDENTIFICADO** | Implementar `actionIndex` no `AppConfigController` da API PHP | Teste via script de endpoints retornou status false | `scripts/endpoints_audit_report.json` | Aguardando correção |
| **MOV-006** | 06 | Monitor Configurações | `/config/smtp` | Erro ao carregar servidor SMTP: `Rota não existe: smtpServer` | Rota `/smtpServer` ausente no `RouteListener` ou controller inexistente | MÉDIA | API PHP | **PROBLEMA IDENTIFICADO** | Mapear controller para configurações SMTP de notificações e e-mails transacionais | Script de auditoria retornou erro 404/Rota inexistente | `scripts/endpoints_audit_report.json` | Aguardando correção |
| **MOV-007** | 06 | Monitor Configurações | `/config/confirmationCode` | `Action não existe: requiredField/confirmationCodeCustomer` e rotas de serviços externos | `RequiredFieldController` não possui ação composta para confirmação de código | ALTA | API PHP | **PROBLEMA IDENTIFICADO** | Adicionar rotas e métodos correspondentes no `RequiredFieldController` | Retorno `Action não existe: requiredField/confirmationCodeCustomer` | `scripts/endpoints_audit_report.json` | Aguardando correção |
| **MOV-008** | 06 | Monitor Configurações | `/config/reasonCancellation` | Motivos de cancelamento retornam `Action não existe: cancellationReasons` | Mapeamento no `RouteListener` espera `cancellationReasons` mas controller é `ReasonCancellationController` | ALTA | API PHP | **PROBLEMA IDENTIFICADO** | Criar alias de roteamento ou ajustar chamada para o controller existente | Script de auditoria confirmou `Action não existe: cancellationReasons` | `scripts/endpoints_audit_report.json` | Aguardando correção |
| **MOV-009** | 06 | Monitor Configurações | `/config/usagePolicy` | Política de uso retorna `Action não existe: termsUsePolicy` | Divergência de nomenclatura de rota entre frontend e backend | MÉDIA | API PHP `TermsUsePolicyController` | **PROBLEMA IDENTIFICADO** | Criar método de ação correto no controller de termos e políticas | Retorno `Action não existe: termsUsePolicy` | `scripts/endpoints_audit_report.json` | Aguardando correção |
| **MOV-010** | 10 | Central Chamadas | Despacho e Cancelamento | Ao cancelar corrida na Central, o app do motorista continua com a corrida ativa | Falha no envio do evento WebSocket `cancelTrip` / push FCM para o motorista quando o cancelamento parte da Central | CRÍTICA | Central JS + API PHP + Node Realtime | **PROBLEMA IDENTIFICADO** | Garantir que o cancelamento acione tanto a atualização no banco quanto a emissão do socket via `SocketClient` / Node WS | Teste de cancelamento mantinha corrida ativa no app do motorista | Relato crítico no prompt do usuário | Aguardando Bloco 10 |
| **MOV-011** | 11 | Mobile Motorista | Splash Screen | Ícone da splash screen desfigurado/deformado e texto com cor errada | Drawable de splash circular no Android 12 recortando o ícone SVG/XML e texto em cor rosa | ALTA | `mobility-pro-app-rota101-pro` | **EM CORREÇÃO** | Removidos os APKs gerados fora do padrão; preparados drawables com dimensões seguras e cor azul escuro no texto MOVY | Análise dos arquivos de imagem e splash em `android/app/src/main/res` | Screenshot do usuário mostrando ícone cortado | Aguardando reconstrução limpa no Bloco 11 |
