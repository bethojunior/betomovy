# Inventário MOVY — estado real do repositório

Data: 2026-11-01. Fonte: diretórios e código deste workspace. Não é declaração de que cada tela foi reconstruída ou testada em dispositivo.

## Sistemas de produção (usar estes)

| Sistema | Pasta | Papel |
|---|---|---|
| API mobilidade | `mobilidade-api-php-master` | Corridas, cartão, Stripe, chamado `trip-call`, CustomerCard |
| API monitor | `mobilidade-monitorapiv2-master` | Listagem de motoristas, config admin |
| Monitor web | `mobilidade-monitor-new-main` | https://movymonitor.com/ |
| Central web | `mobilidade-central-master` | https://movycentral.com/ |
| App Android cliente+motorista | `mobility-pro-app-rota101-pro` | React Native / Expo |
| App iOS cliente+motorista | `mobility-pro-app-rota101-pro-ios` | Mesma base, projeto iOS separado |
| Realtime / delivery | `delivery-realtimeapi-master`, `delivery-api-master` | Delivery, não o fluxo principal de corrida |

## Não tratar como produção

Pastas `movy-backend-v2`, `movy-mobile-app-v2`, `movy-web-v2` e `AUDITORIA DO PROJETO COMPLETO PARA RECRIAR TUDO QUE EXISTE DO ZERO` são cópias/paralelas. Reescrever o ecossistema nelas e publicar por cima da produção apaga regras já em uso. Correções vão nos sistemas da tabela acima.

## Fluxo crítico de corrida (prioridade)

Caminho real: app/Central → `TripDao` (grava corrida) → `CustomerTripCallService::callDrivers` → Firebase/socket + push → `backgroundTask('trip-call')` → app motorista (`TripRealtimeComponent`).

Já corrigido no código (commit `184e9d969`, branch `cursor/android-version-8-3-4`; conferir se a `main` de produção já contém esse commit antes do deploy):

- Mapa da Central não usa mais Everett, MA (`42.40843, -71.05366`). Pede GPS.
- Chamado do motorista não espera a cobrança Stripe terminar.
- Pausas de 5 s no `TripCallDriverCommand` reduzidas para 1 s.
- Poll de status na Central de 8 s para 1,5 s.
- Mapa do motorista recentraliza no GPS.

Ainda não comprovado em aparelho: toque com app morto, aceite, cancelamento e pagamento ponta a ponta. Sem dispositivo e sem deploy da API, isso permanece **BLOQUEADO**.

## Outras correções já no git (não refeitas aqui)

- Stripe: `feedByStripe`, id 17 vs GETNET id 6, cartão iOS sem `mpToken` fake (`c9fc8802d`).
- Lista de motoristas do Monitor (`29b8ff61c`, `48578ef28`).
- Switches de forma de pagamento do motorista (`a253ba209`).
- Android `8.3.4` / `80304` na branch `cursor/android-version-8-3-4` (`c22b8cabe`).

Stripe em produção ainda depende de: API publicada, adquirente id 17 ativo, chave `sk_…` (não `rk_`), cartão recadastrado.

## O que este documento não afirma

Não há inventário linha a linha de cada menu do Monitor e da Central, nem reconstrução de cada tela. Fazer isso de uma vez, sem teste por página, quebraria login, mapa, pagamento e chamado. O procedimento seguro é uma tela por vez, com a API real, depois da publicação do fluxo de corrida.
