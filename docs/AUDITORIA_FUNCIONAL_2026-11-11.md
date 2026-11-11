# Auditoria funcional ao vivo — 2026-11-11

Escopo: API de produção (`api.movymob.com`), socket (`socket.movymob.com`), Monitor, Central, fluxo cliente→motorista. Executado via chamadas HTTP reais com conta de teste criada nesta auditoria.

## Conta de teste criada

| Campo | Valor |
|---|---|
| idUser | 4733 |
| idCustomer | 3685 |
| email | auditoria.devin.1794409939@example.com |
| cidade | Boston (cityId 5605) |

## Verificado e aprovado

| Item | Evidência |
|---|---|
| API PHP no ar | `GET /` → 200 |
| Cadastro de cliente | `POST /Customer/Register` → status true, idUser 4733 |
| Login cliente | `POST /Customer/login` → token de sessão emitido (exige `deviceToken` — validado: sem token retorna erro claro) |
| Endpoint autenticado | `POST /Customer/Find` com headers `token`+`userid` → perfil completo retornado |
| Socket.IO handshake | `socket.movymob.com/socket.io/?EIO=4` → sid emitido, upgrades websocket |
| Monitor no ar | `movymonitor.com` → 200 |
| Central no ar | `movycentral.com` → 200 |
| Console SQL público | `db-migrate.php` → **410 Gone** (correção de segurança deployada) |
| Catálogo de corridas | `tripType` → 5 tipos; `tripPaymentForm` → CASH/STRIPE/VOUCHER; `price?cityId=5605` → tarifas Boston |
| Posições de motoristas | `driver/positions` → 300 registros retornados |
| Histórico do cliente | `trip?customerId=3685` → lista funciona |
| Notificações | `notification` → lista funciona |
| Configurações gerais | `config/general` → chaves retornadas (inclui google_api_key — ver pendência de exposição) |
| Criação de corrida | `POST /Customer/NewTrip` → trip **16106** gravada no banco (13:21), dispatch executado, resposta correta "Nenhum motorista foi encontrado" |
| Correções de cancelamento/chamada | commits `a48bf9ed2`, `9fd82e8f4`, `c57baed5b`, `2be36fb2a` confirmados em `origin/main` → deploy automático DigitalOcean |

## Bloqueado — não foi possível verificar

| Item | Motivo |
|---|---|
| Motorista recebe chamada / aceita / tempo real | **Nenhum motorista online**: `driver/positions` mostra 298 "desligado", 1 "disponivel" e 1 "corrida" — ambos com posição de 01/11 e 09/11 (stale). Sem motorista real no app, o loop oferta→aceite→corrida não pode ser exercido. |
| Login como motorista | Sem credenciais de conta de motorista de teste |
| Login Monitor/Central | Sem credenciais administrativas |
| Cancelamento após aceite | Depende de corrida ativa (precisa motorista) |
| Pagamento/corrida completa | Depende de corrida aceita |
| Redis/filas interno | Sem acesso SSH/painel DigitalOcean; handshake Socket.IO OK é a evidência indireta |
| Firebase/FCM entrega real | Depende de aparelho físico com app instalado |

## Achados

1. **Nenhum motorista online no momento** — o fluxo de chamada não pode ser homologado até um motorista abrir o app e ficar disponível. Os dois registros "disponivel"/"corrida" têm `last_position_update` de 01/11 e 09/11 — provável status obsoleto no banco, não motoristas reais.
2. **Trip 16106 criada sem motorista** — comportamento correto do backend (registra e responde "nenhum motorista"), mas convém verificar se corridas órfãs assim ficam presas em algum status intermediário (verificar `status` da 16106 no Monitor quando houver acesso).
3. `config/general` expõe `google_api_key` sem autenticação de admin — avaliar se deve exigir token (já exige token de usuário; chave do Maps é pública por natureza no app, risco baixo mas registrado).
4. Senha do keystore em texto plano no `build.gradle` (pendência já registrada).

## O que falta para homologação completa

1. Credenciais de um motorista de teste (ou um motorista real de plantão).
2. Login administrativo do Monitor e da Central.
3. Aparelho(s) Android com o APK 8.4.0 instalado (cliente + motorista).
4. Opcional: acesso SSH/DigitalOcean para conferir Redis, filas e logs do Node API.
