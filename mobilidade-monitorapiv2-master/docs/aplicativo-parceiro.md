# Fluxos de Aplicativo Parceiro

## Origem do mapeamento

Mapeamento feito a partir da branch `feat/config-apps-partners`, procurando principalmente por:

- `key_app_partner`
- `config_app_partners`
- `config_apps_partners_id`

No código atual, o domínio de aplicativo parceiro está concentrado no cadastro `config_apps_partners`.

## Fluxos encontrados na branch de origem

### 1. CRUD de aplicativo parceiro

Arquivos centrais:

- `app/Http/Controllers/ConfigAppPartners/ConfigAppPartnersController.php`
- `app/Services/ConfigAppPartners/ConfigAppPartnersService.php`
- `app/Repositories/ConfigAppPartners/ConfigAppPartnersRepository.php`
- `app/Models/ConfigAppPartners/ConfigAppPartners.php`
- `app/Http/Requests/ConfigAppPartners/ConfigAppPartnersRequest.php`
- `app/Http/Requests/ConfigAppPartners/ConfigAppPartnersUpdateRequest.php`
- `routes/app/configapppartners.php`
- `routes/ensure_token/configapppartners.php`

Endpoints:

- `POST /config_app_partners`
- `POST /config_app_partners/{id}`
- `DELETE /config_app_partners/{id}`
- `GET /config_app_partners/find_all`
- `GET /config_app_partners/find`
- `GET /config_app_partners/get_all`

Responsabilidades:

- cadastrar parceiro com upload de `logo_app`
- atualizar dados e trocar logo
- excluir parceiro
- listar parceiros com e sem paginação

### 2. Vínculo com tipo de usuário

Arquivos encontrados:

- `app/Services/User/UserTypeService.php`
- `app/Repositories/AppPartners/UserTypeLinkedAppPartnerRepository.php`
- `app/Models/AppPartners/UserTypeLinkedAppPartner.php`
- `app/Http/Controllers/User/UserTypeController.php`
- `app/Http/Requests/User/UpdateUserTypeRequest.php`
- `app/Http/Requests/User/UserTypeRemoveRequest.php`
- `routes/app/user.php`

Campo de integração:

- `idsAppPartners`

### 3. Vínculo com tipo de corrida

Arquivos encontrados:

- `app/Services/Trip/TripTypeService.php`
- `app/Repositories/AppPartners/TripTypePartnerLinkedRepository.php`
- `app/Models/AppPartners/TripTypePartnerLinked.php`
- `app/Http/Controllers/Trip/TripTypeController.php`
- `app/Http/Requests/Trip/TripTypeRequest.php`
- `app/Http/Requests/Trip/TripTypeRemoveRequest.php`
- `routes/app/trip.php`

Campo de integração:

- `idsAppPartners`

### 4. Uso em contatos

Arquivos encontrados:

- `app/Http/Controllers/ListContacts/ListContactsController.php`
- `app/Repositories/ListContacts/ListContactsRepository.php`
- `app/Services/ListContacts/ListContactsService.php`
- `app/Models/ListContacts/ListContacts.php`
- `routes/app/listcontacts.php`
- `routes/ensure_token/listcontacts.php`

Campo de integração:

- `config_apps_partners_id`

## Recorte migrado para `feat/app-partners-v1`

Nesta branch nova foi migrado somente o fluxo de CRUD/listagem de aplicativo parceiro.

Entrou na migração:

- controller, service, repository, model e requests de `ConfigAppPartners`
- rotas privadas e rota pública com token para listagem
- repositories/models de vínculo usados apenas como dependência da exclusão segura do parceiro

Ficou de fora:

- alterações em `UserType`
- alterações em `TripType`
- fluxo de `ListContacts`
- ajustes de Docker, README, storage auxiliar e outras mudanças paralelas da branch original
