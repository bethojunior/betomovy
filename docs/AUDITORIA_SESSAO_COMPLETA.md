# Auditoria MOVY — sessão de extensão além da corrida

Data: 2026-10-30.

## Resposta direta

Não. Menus, páginas, ícones e botões de Android e iOS **não** foram todos auditados e corrigidos. Esta sessão continua a correção por módulos reais, com evidência.

## O que já estava corrigido (corrida)

| Item | Severidade | Status |
|---|---|---|
| `trip-call` apagava a oferta no socket | CRÍTICO | Corrigido e publicado (`3af6d000e`). Aguardando teste em aparelho |
| Push canal/som | CRÍTICO | Corrigido e publicado. Aguardando build + aparelho |
| `assobio.mp3` no `res/raw` Android | ALTO | Arquivo copiado localmente nesta sessão. Ainda precisa entrar no commit/build |

## Correções desta extensão

| Sistema | Problema | Severidade | Status |
|---|---|---|---|
| Central | Duração na busca mostrava valor cru (`1 - 0.565`) | MÉDIO | Corrigido no código (`formatTripEta`, `updateTrip.js`, `confirmationDataTrip.js`). Sem deploy ainda |
| App motorista Android/iOS | Conta bancária: `setModeEdit` lançava `Function not implemented` | ALTO | Corrigido com estado real |
| Monitor tarifas (`ServicesApps`) | Sucesso/erro do `price` tratado pelo HTTP genérico, não pelo `status` do body | MÉDIO | Corrigido no código. Sem login de produção para testar a página |
| Central / Monitor sites | Login abre | — | Páginas de login carregam. Sem credenciais: menus internos não clicados |

## Não corrigido / bloqueado

| Item | Motivo |
|---|---|
| Todos os menus do app cliente/motorista | Não há emulador/dispositivo com login nesta sessão |
| Crash iOS Route95Pro 8.2.0 (`SIGABRT`) | Stack nativa sem nome de tela React; precisa de build com símbolos |
| Teste ponta a ponta cliente → motorista | Precisa de aparelhos + deploy confirmado + build novo |
| Troca de senhas/tokens no Git e MySQL | Autorização explícita de produção |

## Sites

- `https://movycentral.com/` — login carrega.
- `https://movymonitor.com/` — login carrega (captcha matemático).
