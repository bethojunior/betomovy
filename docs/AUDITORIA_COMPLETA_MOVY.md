# Auditoria MOVY — estado em 2026-10-30

## Bloco 1 — Chamadas

| Campo | Informação |
|---|---|
| Componente | Distribuição da corrida e alerta do motorista |
| Localização | `CustomerDao.php`, `Push.php`, `TripRealtimeComponent` nos dois apps |
| Problema | Motorista não vê a chamada e o aparelho não toca |
| Causa | Push perdia `userId`/não concluía no PHP 8; o app descartava modal e som fora de primeiro plano; Firestore comparava tipo errado do id; o comando `trip-call` dependia de `/usr/bin/php` |
| Correção | Ver `docs/CORRECOES_MOVY.md` |
| Dependências | API PHP, API Node, Firestore ou Socket, canal Android `tripCall`, permissão de notificação |
| Teste | Serialização do push e normalização dos ids |
| Resultado | Aprovado nesses dois testes locais. Fluxo em aparelho bloqueado |
| Situação | Corrigido no código. Pendente de deploy e de teste com cliente e motorista reais |

## Bloco 2 — Inventário

Concluído em `docs/INVENTARIO_SISTEMAS_MOVY.md` a partir dos diretórios existentes.

## Blocos seguintes

| Bloco | Situação |
|---|---|
| Monitor, inclusive `/config/rates` | Rota localizada (`TypesTravels`). Páginas não foram operadas no navegador: não há sessão administrativa |
| Central | Controladores e views listados. Login em https://movycentral.com/ não foi feito |
| Android e iOS além da chamada | Versão de apresentação já é 8.2.2. Demais telas não foram percorridas em dispositivo |
| MySQL `movy-mysql` | Não conectado. Nenhuma migration foi aplicada |
| DigitalOcean | Não acessada. Nenhum deploy foi feito |
| Pagamentos | Integrações existem no código. Nenhuma cobrança foi criada |
| Builds APK, AAB e IPA | Não gerados nesta sessão. Já existem `movy-universal-release.apk` e `movy-release-playstore.aab` na raiz, anteriores a esta correção |

## Aceite de corrida

Uma corrida não deve ficar com dois motoristas: o update de aceite só ocorre enquanto `driverId` é nulo. Isso foi lido no código e não foi medido com duas sessões simultâneas.
