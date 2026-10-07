# Projeto MonitorApiV2 - Testes de Controller

## Introdução

Este projeto utiliza testes automatizados para verificar o funcionamento dos controllers no Laravel. 
Os testes de controller são uma parte essencial do desenvolvimento para garantir que as rotas e a lógica de controle 
estejam funcionando corretamente.

## Configuração do Ambiente

Certifique-se de que seu ambiente de desenvolvimento esteja configurado corretamente antes de executar os testes. Isso inclui:

- Ter o Laravel instalado localmente.
- Configurar um banco de dados de teste.
- Instalar as dependências do Composer.

## Execução dos Testes

Para executar os testes de controller, utilize o seguinte comando:

```bash
php artisan test
```

## Para executar um teste específico, utilize o seguinte comando:

```bash
php artisan test --filter nome_do_teste
```

### Testes de Gestores do Monitor

Para rodar os testes específicos de Gestores, utilize o seguinte comando:

```bash
php artisan test --filter Manager
```

## Estrutura de Testes

Os testes de controller estão localizados no diretório tests/Feature e podem ser encontrados em arquivos com o sufixo 
Test.php. Cada método de teste dentro desses arquivos testa uma funcionalidade específica do controller.

.


# Como rodar o projeto

1. Clone o repositório

2. Copie o .env.example
```bash
cp .env.example .env
```

3. Mova o dump do banco de dados para .sql/

4. Rode os containers
```bash
docker compose up -d
```

5. A aplicação estará rodando em http://localhost:8100