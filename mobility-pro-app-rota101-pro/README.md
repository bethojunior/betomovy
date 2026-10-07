# Mobility-Pro-App

> O MobilityPro é um aplicativo de mobilidade urbana desenvolvido pela 704 Apps, projetado para oferecer uma solução completa e personalizada para quem deseja operar sua própria plataforma de transporte, como motoristas, cooperativas ou empreendedores do setor.

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você possui instalado `Node` e `Yarn`.
- Uma máquina com sistema operacional `Windows, Linux ou MacOS` com Android Studio configurado para uso com emuladores ou dispositivos físicos.
- Certifique-se de criar uma nova branch a partir da branch `develop` antes de iniciar qualquer desenvolvimento.

## 🚀 Iniciando o projeto

1. Instale as dependências:

```
yarn
```

2. Gere o APK de desenvolvimento:

```
yarn android-build:dev
```

3. Inicie o servidor local de desenvolvimento:

```
yarn start
```

## Configurando projeto iOS

- 1 - Instale as dependencias: yarn
- 2 - Gere a pasta iOs: expo prebuild --clean -p ios
- 3 - Instale os pods: npx pod-install
- 4 - Rodando app no simulador: npx expo run:ios
