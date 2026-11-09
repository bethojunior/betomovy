# Mapa de funções do Movy

Fonte das funções: o sistema atual. O código, o layout e o visual atuais não entram no projeto novo.

Idioma oficial: inglês. Português completo, ligado ou desligado no Monitor. Moeda: dólar americano.

## Monitor

O Monitor novo está em `MOVY CRIADO DO ZERO` e cobre os menus do monitor atual, em 124 telas, todas com gravação própria.

- Visão geral: painel e frota ao vivo.
- Passageiros: pessoa física, pessoa jurídica e exclusão de conta.
- Motoristas: lista, cadastro, troca de veículo, documentos, exclusão e produção.
- Viagens.
- Delivery: pedidos, seções, categorias, financeiro, zonas, acessórios, configurações, estabelecimentos e chamado.
- Financeiro: taxas de cancelamento, lançamentos, crédito, comissão, transferências, relatórios e adquirente.
- Mensagens, atendimento, relatórios e grupos de chamado.
- Avançado: cidades, equipe, adquirente, WhatsApp, despacho, pagamentos, chaves, logs, raio, pedágio, termos, versões, Firebase, SMTP, penalidades, tarifas, cupons, vouchers, gestores, centrais, bairros, frete, publicidade, rotas e mapas.
- Ações gerais: alterar senha, limpar cache, importar, bloquear e desbloquear em massa, zerar saldo e zerar nota.
- Idioma: o inglês permanece padrão. O interruptor do português fica em Advanced → Language.

## Central

Funções que a Central atual precisa cumprir e que serão recriadas no bloco seguinte, na mesma base:

- Atendimento por telefone, com busca do passageiro e endereços habituais.
- Cálculo de rota, distância e tarifa em dólar.
- Despacho manual ou automático para o motorista mais próximo ou para a fila do ponto.
- Bairros com tarifa fixa, bolsões e pontos de apoio.
- Corridas faturadas para empresas.
- Aviso ao passageiro com link de acompanhamento.
- Usuários da central, permissões e configuração por central.

## Aplicativo Android e Apple

Os dois aplicativos atuais compartilham a mesma regra de negócio. O Android será fechado primeiro. O Apple usa a mesma regra, no alvo iOS.

Passageiro: entrar, pedir viagem no mapa, escolher serviço, acompanhar o motorista, pagar em dólar, avaliar, carteira, cupom, suporte e entrega.

Motorista: entrar, ficar disponível, receber oferta, aceitar, navegar, iniciar e encerrar a corrida, ver ganhos em dólar, documentos e avaliação.

## O que ainda não foi migrado

Firebase e o arquivo de aplicação da DigitalOcean já estão em `BACKUP DE BANCO DE DADOS E INFORMAÇOES`. A conexão direta com o MySQL e o MongoDB da DigitalOcean expirou daqui, então o backup do MySQL usa o dump local de 13 de outubro de 2026. O Redis atual é cache e tempo real: o serviço novo nasce vazio, com a mesma função. Os cadastros permanentes entram na base nova quando o dump terminar.
