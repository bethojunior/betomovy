# Fluxo de App Partner

## Objetivo

Este documento serve como onboarding para desenvolvedores que precisam entender a funcionalidade de `aplicativo parceiro` no projeto.

O foco aqui e o fluxo recente, baseado em `key_app_partner`, criado a partir de maio de 2024 e evoluido depois disso.

## Escopo Deste Documento

Entra neste documento:

- configuracao de app partner por chave
- vinculacao entre app partner e tipos de usuario
- login e cadastro separados por `key_app_partner`
- validacoes de conta, email e documento por app partner
- filtragem de tipos de corrida por app partner
- propagacao de `key_app_partner` no fluxo de corrida
- filtros recentes de busca e resumo de viagens por `key_app_partner`

## Origem Do Fluxo

O tronco principal dessa funcionalidade apareceu no commit:

- `f4c7a055` em `2024-05-06` com a mensagem `feat: app partner config`

Evolucoes relevantes depois disso:

- `5f2387a7` em `2025-08-25`: busca de config por chave
- `848f096d` em `2025-08-25`: ajuste no endpoint `checkaccountapppartner`
- `cae79de3` em `2025-09-01`: calculo de preco para app partner no fluxo central
- `bf79784e` em `2025-10-05`: filtro de `key_app_partner` no calculo
- `fae91885` em `2025-10-12`: `key_app_partner` exposto no endpoint de preco
- `86d9a52e` em `2026-01-04`: ajuste na listagem de tipos de motorista sem app partner
- `51b0164c` em `2026-03-22`: `key_app_partner` em query de viagens disponiveis
- `8b22b45f` em `2026-03-22`: filtro de resumo de viagens por `key_app_partner`
- `a7a120de` em `2026-03-22`: link do app partner

## Conceito Central

O identificador principal da feature e `key_app_partner`.

Essa chave:

- identifica qual app parceiro esta originando o fluxo
- segmenta usuarios e motoristas
- limita tipos de motorista permitidos
- limita tipos de corrida permitidos
- acompanha a criacao e a busca de corridas

Na pratica, o sistema trabalha com dois cenarios:

1. fluxo sem `key_app_partner`
2. fluxo com `key_app_partner`

Quando a chave existe, varias consultas passam a usar igualdade por chave. Quando ela nao existe, varias consultas caem no comportamento padrao usando `IS NULL`.

## Modelos E Dados Principais

### Campos importantes

- `user.key_app_partner`
- `trip.key_app_partner`
- `driver.key_app_partner`

Arquivos:

- `app/model/User.php`
- `app/model/Trip.php`
- `app/model/Driver.php`

### Tabelas envolvidas

- `config_apps_partners`
- `userTypeLinkedAppPartner`
- `user`
- `trip`
- `driver`
- `tripTypePartnerLinked`

### Tipos de usuario relacionados

Existe um tipo especifico para cliente parceiro:

- `UserType::CLIENTE_FINAL_PARCEIRO = 6`

Arquivo:

- `app/model/UserType.php`

## Componentes Principais

### Configuracao do app partner

Responsabilidade:

- buscar configuracoes do app parceiro pela chave
- listar ou localizar um parceiro especifico

Arquivos principais:

- `app/controllers/ConfigAppPartnerController.php`
- `app/services/ConfigAppPartnerService.php`
- `app/dao/ConfigAppPartnerDao.php`

Metodos principais:

- `ConfigAppPartnerController::actionGetConfigAppPartner()`
- `ConfigAppPartnerController::actionFind_by_key()`
- `ConfigAppPartnerDao::getConfigAppPartners()`
- `ConfigAppPartnerDao::findByKey()`

Dependencias de ambiente:

- `URL_MONITOR_APIV2`: usado no fluxo legado de captura externa de configuracoes via `ConfigController::actionGetAppPartner()`
- `INTERNAL_TOKEN`: enviado para autenticar chamadas internas ao monitor no mesmo fluxo

### Vinculo entre app partner e tipos de usuario

Responsabilidade:

- descobrir quais tipos de usuario estao ligados a um app partner
- descobrir quais tipos de motorista estao habilitados para um app partner

Arquivos principais:

- `app/controllers/UserTypeLinkedAppController.php`
- `app/services/UserTypeLinkedAppPartnerService.php`
- `app/dao/UserTypeLinkedAppPartnerDao.php`
- `app/controllers/UserTypeController.php`
- `app/services/UserTypeService.php`
- `app/dao/UserTypeDao.php`

Metodos principais:

- `UserTypeLinkedAppPartnerService::getUsersTypeLinked()`
- `UserTypeService::getDriversByAppPartner()`
- `UserTypeDao::getDriversByAppPartner()`

### Cadastro e login de cliente

Responsabilidade:

- criar usuario vinculado a `key_app_partner`
- autenticar cliente dentro do escopo da chave

Arquivos principais:

- `app/controllers/CustomerController.php`
- `app/dao/CustomerDao.php`
- `app/services/CustomerService.php`

Metodos principais:
- `CustomerDao::createUser()`
- `CustomerService::sqlLogin()`

Ponto critico:

- `CustomerDao::createUser()` grava `appPartner` no usuario quando ele e enviado
- `CustomerService::sqlLogin()` filtra por `u.key_app_partner = :appPartner` ou `u.key_app_partner IS NULL`

### Login e validacao de motorista

Responsabilidade:

- autenticar motorista por chave
- validar email e documento dentro do escopo do app partner

Arquivos principais:

- `app/controllers/DriverController.php`
- `app/dao/DriverDao.php`
- `app/services/CheckDocumentService.php`

Metodos principais:

- `DriverController::actionCheckEmailAppPartner()`
- `DriverController::actionCheckDocumentAppPartner()`
- `DriverDao::authenticate()`
- `DriverDao::checkEmailAppPartner()`
- `DriverDao::checkDocumentAppPartner()`
- `CheckDocumentService::sqlCheckDocumentAppPartner()`

Ponto critico:

- o login do motorista usa a mesma estrategia do cliente: com chave filtra pela chave, sem chave filtra por `NULL`

### Tipos de corrida por app partner

Responsabilidade:

- retornar tipos de corrida disponiveis de acordo com localizacao e app partner

Arquivos principais:

- `app/services/TripTypeService.php`
- `app/dao/TripTypeDao.php`

Metodos principais:

- `TripTypeService::findByLocale()`
- `TripTypeDao::findByLocale()`
- `TripTypeDao::findByLocaleByAppPartner()`

Ponto critico:

- sem chave, o sistema usa os tipos nao vinculados a parceiro
- com chave, o sistema cruza `tripTypePartnerLinked` com `config_apps_partners`
- o retorno monta URLs completas de imagem usando `link_storage_pictures`

### Corridas e propagacao da chave

Responsabilidade:

- carregar `key_app_partner` no fluxo de corrida
- usar a chave no despacho e em consultas posteriores

Arquivos principais:

- `app/dao/CustomerDao.php`
- `app/services/PartnerTripService.php`
- `app/services/DriverService.php`

Metodos principais:

- `CustomerDao::newTrip()`
- `PartnerTripService::newTrip()`
- `DriverService::getWhereForTripsSummary()`

Pontos criticos:

- `CustomerDao::newTrip()` envia `key_app_partner` para `callDrivers()`
- a chave e adicionada em logs e no objeto de retorno da viagem
- comandos assincronos recebem a chave como argumento
- `DriverService::getWhereForTripsSummary()` filtra corridas por parceiro

## Endpoints Principais

Pelo roteador do projeto, a URL segue o formato `/controller/action`.

Endpoints publicos diretamente relacionados ao fluxo:

| Endpoint | Objetivo |
| --- | --- |
| `/configapppartner/getconfigapppartner` | Buscar configuracoes pelo parametro `app_partner` |
| `/configapppartner/find_by_key` | Buscar parceiro por chave |
| `/usertypelinkedapp/getusertypelinkedapppartner` | Listar vinculos entre app partner e tipos de usuario |
| `/usertype/driversbyapppartners` | Listar tipos de motorista permitidos para a chave |
| `/customer/registerpartner` | Cadastrar cliente parceiro |
| `/driver/checkemailapppartner` | Verificar email de motorista no escopo da chave |
| `/driver/checkdocumentapppartner` | Verificar documento de motorista no escopo da chave |
| `/user/checkaccountapppartner` | Verificar conta vinculada a um app partner pelo email |

Endpoints importantes que participam do fluxo mesmo sem `partner` no nome:

| Endpoint | Objetivo |
| --- | --- |
| endpoints de preco em `PriceController` | Calculo de preco com `key_app_partner` |
| endpoints de corrida em `CustomerController` | Criacao de corrida com propagacao de `key_app_partner` |
| endpoints de listagem de viagens do motorista | Filtros recentes usando `key_app_partner` |

## Fluxos Principais

### 1. Boot do app parceiro

Fluxo esperado:

1. frontend obtem configuracoes do parceiro pela chave
2. frontend pode consultar tipos de usuario ligados ao parceiro
3. frontend pode consultar tipos de motorista permitidos ao parceiro

Arquivos principais:

- `ConfigAppPartnerController`
- `UserTypeLinkedAppController`
- `UserTypeController`

### 2. Cadastro de cliente parceiro

Fluxo esperado:

1. app envia os dados do usuario
2. `CustomerDao::registerPartner()` valida os dados
3. `CustomerDao::createUser()` cria o usuario com `key_app_partner`
4. `levelAccess` e alimentado com `CLIENTE_FINAL_PARCEIRO`
5. o cadastro do customer e criado
6. logs de criacao sao gravados

Arquivos principais:

- `CustomerController`
- `CustomerDao`
- `CustomerService`

### 3. Login de cliente parceiro

Fluxo esperado:

1. app envia email e senha
2. a query de login usa o escopo da chave
3. se `key_app_partner` vier preenchido, o login exige correspondencia na tabela `user`
4. se nao vier, o login cai no fluxo padrao sem app partner

Arquivos principais:

- `CustomerController`
- `CustomerService`

### 4. Login e validacao de motorista

Fluxo esperado:

1. motorista informa credenciais e a chave do app parceiro
2. `DriverDao::authenticate()` filtra o usuario pela chave
3. validacoes de email e documento tambem usam a chave

Arquivos principais:

- `DriverController`
- `DriverDao`
- `CheckDocumentService`

### 5. Carregamento de tipos de corrida

Fluxo esperado:

1. app envia `latlng`
2. opcionalmente envia `key_app_partner`
3. `TripTypeService::findByLocale()` escolhe a query correta
4. o retorno considera somente os tipos validos para o parceiro

Arquivos principais:

- `TripTypeService`
- `TripTypeDao`

### 6. Criacao de corrida

Fluxo esperado:

1. app envia dados da corrida
2. `CustomerDao::newTrip()` ou `PartnerTripService::newTrip()` criam a viagem
3. `key_app_partner` acompanha o fluxo de chamada de motoristas
4. logs e realtime carregam essa informacao
5. processos assincronos recebem a chave como argumento

Arquivos principais:

- `CustomerDao`
- `PartnerTripService`
- `CustomerTripCallService`

### 7. Consulta posterior de corridas

Fluxo esperado:

1. listagens e resumos de viagens do motorista usam a chave
2. quando a chave existe, a query filtra por igualdade
3. quando nao existe, a query usa `IS NULL`

Arquivos principais:

- `DriverService`

## Variaveis De Ambiente E Chaves De Configuracao

Esta feature depende de dois tipos de configuracao:

1. variaveis do arquivo `.env`
2. chaves buscadas por `Config::get()`, normalmente vindas da tabela `config`

### Variaveis `.env`

As variaveis abaixo aparecem diretamente no fluxo recente de `aplicativo parceiro` ou em fluxos auxiliares que o suportam:

| Chave | Onde aparece | Finalidade |
| --- | --- | --- |
| `URL_MONITOR_APIV2` | `app/controllers/ConfigController.php` | Monta a URL base para buscar configuracoes externas de `config_app_partners` |
| `INTERNAL_TOKEN` | `app/controllers/ConfigController.php` | Token usado nas chamadas internas para o monitor |

### Chaves de `Config::get()`

Essas chaves nao sao `.env`, mas sao importantes para a feature funcionar corretamente:

| Chave | Onde aparece | Finalidade |
| --- | --- | --- |
| `link_storage_pictures` | `TripTypeService`, `CustomerService`, `TripTypeDao` | Monta URLs completas de imagens, inclusive tipos de corrida e imagens retornadas nas respostas |
| `customer_signup_as_partner` | `CustomerDao` | Controla se um cliente cadastrado no fluxo comum tambem gera um parceiro automaticamente |
| `appSharingDriverMessagePartner` | `AppSharingService` | Mensagem usada no compartilhamento do app de motorista para app partner |
| `appSharingCustomerMessagePartner` | `AppSharingService` | Mensagem usada no compartilhamento do app de cliente para app partner |
| `link_driver_pre_register` | `AppSharingService` | Base para gerar link de pre-cadastro de motorista com `name_app` |
| `link_customer_pre_register` | `AppSharingService` | Base para gerar link de pre-cadastro de cliente com `name_app` |

### Observacao importante

Nem toda configuracao do fluxo vem do `.env`.

Na pratica:

- integracoes com outros servicos costumam depender de `.env`
- comportamento funcional e links exibidos para o app costumam depender de `Config::get()`

Ao subir um ambiente novo, valide os dois lados.

## Regras De Negocio Importantes

### Separacao por chave

A regra principal da feature e:

- tudo que pertence ao app parceiro deve ser segmentado por `key_app_partner`

Isso vale para:

- autenticacao
- validacao de documento
- validacao de email
- tipos de motorista
- tipos de corrida
- corridas e suas consultas

### Fallback para fluxo padrao

Boa parte das consultas usa este padrao:

- com chave: `campo = :key`
- sem chave: `campo IS NULL`

Esse comportamento e importante para manter compatibilidade entre o fluxo padrao e o fluxo do app parceiro.

### Nao confundir com partner legado

No codigo existem varias classes com nome `Partner`, mas nem todas pertencem ao `app partner`.

Em geral, quando o fluxo nao usa `key_app_partner`, `config_apps_partners` ou `userTypeLinkedAppPartner`, ele provavelmente pertence ao parceiro legado e nao a esta feature.

## Arquivos De Referencia

Arquivos mais importantes para leitura inicial:

- `configs/route/route.php`
- `app/controllers/ConfigAppPartnerController.php`
- `app/controllers/UserTypeLinkedAppController.php`
- `app/controllers/UserTypeController.php`
- `app/controllers/CustomerController.php`
- `app/controllers/DriverController.php`
- `app/controllers/UserController.php`
- `app/dao/ConfigAppPartnerDao.php`
- `app/dao/UserTypeLinkedAppPartnerDao.php`
- `app/dao/UserTypeDao.php`
- `app/dao/UserDao.php`
- `app/dao/CustomerDao.php`
- `app/dao/DriverDao.php`
- `app/dao/TripTypeDao.php`
- `app/services/ConfigAppPartnerService.php`
- `app/services/UserTypeLinkedAppPartnerService.php`
- `app/services/UserTypeService.php`
- `app/services/CustomerService.php`
- `app/services/DriverService.php`
- `app/services/TripTypeService.php`
- `app/services/CheckDocumentService.php`

## Checklist Para Manutencao

Antes de alterar a feature, revisar:

1. a mudanca precisa respeitar segmentacao por `key_app_partner`?
2. o fluxo com chave e sem chave continuam funcionando?
3. login de cliente e motorista continuam coerentes entre si?
4. a alteracao afeta tipos de corrida, tipos de motorista ou precificacao?
5. a nova query precisa usar `IS NULL` quando nao houver chave?
6. a mudanca nao esta acidentalmente mexendo no parceiro legado?
7. as variaveis `.env` e as chaves de `Config::get()` necessarias estao presentes no ambiente?

## Observacoes Finais

Se voce esta chegando no projeto, a melhor ordem de leitura e:

1. `configs/route/route.php`
2. `ConfigAppPartnerController`, `UserTypeController`, `UserTypeLinkedAppController`
3. `CustomerController`, `DriverController`, `UserController`
4. `CustomerDao`, `DriverDao`, `UserDao`
5. `TripTypeService`, `TripTypeDao`, `DriverService`

Essa sequencia ajuda a entender primeiro a superficie da API, depois a regra de negocio e por fim a filtragem real feita pelas queries.
