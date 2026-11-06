# Auditoria MOVY

Status geral: em andamento. Nada abaixo está VALIDADO em aparelho ou no Monitor em produção.

## Feito neste ciclo

| Item | Status | Causa | Correção | Teste |
|---|---|---|---|---|
| Cancelamento da Central não solta o app do motorista | CORRIGIDO — AGUARDANDO TESTE | `trip/{ref}/cancel` atualizava o MySQL. Se o tempo real estava no socket, o documento `trips` do Firestore continuava. O app do motorista escuta esse documento. Cancelamento de estabelecimento também não publicava o evento. Resposta de sucesso era enviada mesmo sem viagem. | `TripController::publishTripCanceled` apaga o Firestore, publica o socket e libera o motorista só no cancelamento novo. App do motorista (Android e iOS) limpa a corrida quando o documento some ou quando a API devolve status cancelado. | Não executado no aparelho nem na Central. |

## Pendente

Blocos 01 a 24 do Monitor, Central inteira, tarifas, fotos de cliente, delivery, financeiro, mapas e testes de ponta a ponta: PENDENTE.

Não alterar tarifas, cobranças ou cadastros reais sem autorização. A API PHP só passa a valer depois do deploy do serviço `api-php`. O app do motorista só muda com build novo.
