# Testes da chamada de corrida

Executado em 2026-10-30:

| Teste | Resultado |
|---|---|
| `tests/Push/push_data_check.php` | Aprovado. `additionalData` sai como JSON string |
| `tests/TripRealtime/calling_driver_check.php` | Aprovado. Id `1037` vira `["1037"]` |
| `php -l` nos arquivos PHP alterados | Sem erro de sintaxe |
| Corridas 15912–15916 no MySQL | Registradas, motorista 1037 marcado, status final `not_answered` |
| Aceite no aparelho, toque, Monitor, Central, APK e IPA | Não executados |

O fluxo completo no aparelho continua bloqueado até o deploy da API e um novo build instalado no motorista.

| Cenário | Resultado | Evidência |
|---|---|---|
| Payload de push com `additionalData` objeto vira JSON e preserva `userId` 4634 | Aprovado | `php tests/Push/push_data_check.php` imprimiu `PushData ok` |
| Sintaxe PHP dos arquivos alterados | Aprovado | `php -l` sem erro de sintaxe. Há um aviso antigo em `CustomerDao.php` linha 1597, não introduzido agora |
| Ids de `callingDriver` (array, texto e número) viram strings de sala | Aprovado | Script Node executou a função real de `realtime-events.helper.ts`. Saída: `extractCallingDriverIds ok` |
| Jest do Nest | Bloqueado | `mobilidade-api-node-main/node_modules` não está instalado |
| Cliente solicita e motorista recebe em aparelho | Bloqueado | Não há emulador, aparelho nem sessão autenticada de cliente/motorista nesta sessão |
| App em segundo plano, tela bloqueada e app encerrado | Bloqueado | Depende de aparelho, permissão de notificação e do deploy desta correção |
| Dois motoristas aceitam ao mesmo tempo | Não reexecutado | O SQL já exige `driverId IS NULL` e recusa update sem linha. Não houve teste concorrente contra o banco |
| Monitor, Central, tarifas, pagamentos, DigitalOcean | Bloqueado | Sem login administrativo e sem acesso ao painel da DigitalOcean |

Nenhum desses bloqueios foi marcado como aprovado.
