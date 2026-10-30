# Relatório final — auditoria MOVY

## O que foi entregue

A corrida é criada e o motorista elegível entra em `callingDriver`. Nas corridas 15912–15916 o motorista 1037 foi escolhido e a corrida encerrou como `not_answered`. O comando `trip-call` republicava um registro de `tripDrivers` sem status `searching`, e a API Node removia a chamada do aplicativo. O push usava o canal `default` e um mp3 que o APNs não aceita. Essas duas falhas foram corrigidas no código local. Não houve deploy nem teste em aparelho.

## Evidências executadas

- `php tests/Push/push_data_check.php` → `PushData ok`
- `php -l` nos arquivos PHP alterados → sem erro de sintaxe
- Função `extractCallingDriverIds` executada com Node → `extractCallingDriverIds ok`

## Não executado

- Corrida real com cliente e motorista
- Toque com app aberto, em segundo plano, com tela bloqueada ou encerrado
- Login em https://movymonitor.com/ e https://movycentral.com/
- Consulta ao MySQL de produção
- Painel DigitalOcean, push e deploy
- Build novo de APK, AAB ou IPA
- Suíte Jest do Nest (`node_modules` ausente)

A versão de apresentação permanece **8.2.2**. O número de build passou de 80202 para **80203** nos alvos que já estavam em 8.2.2. O alvo `VouteHomologar` do projeto Android, que já está em 8.3.1 (build 80301), não foi reduzido. Nenhum binário novo foi gerado nem publicado.

## Para a chamada passar a funcionar em produção

1. Publicar a API PHP com autorização explícita.
2. Gerar e instalar um build novo dos apps, porque o canal `tripCall` e a retomada do som estão no aplicativo.
3. Repetir o teste com um cliente e um motorista online, com notificação permitida.

Enquanto esses três passos não forem feitos, a correção está no repositório e ainda não está comprovada no ambiente que os motoristas usam.
