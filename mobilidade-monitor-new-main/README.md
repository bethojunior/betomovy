# MonitorPro - Documentação
## ReactJS + Typescript + Vite

Este modelo fornece uma configuração mínima para fazer o React funcionar no Vite com HMR e algumas regras ESLint.


## Configuração do ambiente

Certifique-se de ter o Node.js e o npm instalados em seu sistema antes de prosseguir. Você pode instalá-los a partir do <a href="https://nodejs.org/en" target="_blank">site oficial do NodeJS</a>.

### 📋 1 - Clone o repositório para sua máquina local:
```
git clone https://github.com/704apps/mobilidade-monitor-new.git
```

### 📋 2 - Navegue até o diretório do projeto em sua máquina:


### 📋 3 - Instale as dependências do projeto:
```
yarn
```

### 📋 4 - Para executar o projeto:
```
yarn dev
```

## Estrutura do Projeto:
A estrutura do projeto segue as convenções do Vite para organizar os arquivos. Os principais diretórios são:

- <strong>`src`</strong>: Contém o código-fonte da aplicação, incluindo os componentes React, páginas, estilos e outros recursos.
- <strong>`public`</strong>: Contém arquivos estáticos que são copiados para a raiz do diretório de saída durante o build.


## Principais Dependências do Projeto:
- antd (5.10.3)
- styled-components (5.3.6)
- react-icons (4.2.0)
- axios (0.21.4)
- react-router-dom (5.2.0)
- mapbox-gl (2.15.0)
- cypress (13.6.6)


### Observações:
- Este projeto utiliza o pacote `yarn`. Não é recomendado usar npm pois pode causar problemas.
- Caso tenha problemas com dependências, entre na branch atual que você quer rodar o projeto, apague a pasta `node_modules` e o arquivo `yarn.lock` e rode o comando `yarn`.

## Cypress
Este projeto utiliza cypress para testes end to end e testes componentes

Documentação: <a href="https://docs.cypress.io/guides/overview/why-cypress" target="_blank">Cypress</a>

### 📋 Para executar o cypress:
obs: Para realizar os testes é preciso rodar a aplicação primeiro.

```
yarn cypress open
```

### Os arquivos de testes e2e são criados dentro da pasta e2e que está dentro da pasta cypress.
![image](https://github.com/704apps/mobilidade-monitor-new/assets/86391973/561fc9a4-f7bc-4052-a0fb-59bee35652b2)