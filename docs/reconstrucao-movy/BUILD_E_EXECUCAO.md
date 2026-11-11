# GUIA DE BUILD E EXECUÇÃO — MOVY MOBILE (`mobility-pro-app-rota101-pro`)

> **Procedimentos Oficiais de Compilação, Assinatura e Execução**

---

## 1. Pré-Requisitos do Ambiente

- **Sistema Operacional:** Windows 10/11, macOS ou Linux.
- **Node.js:** v18 ou v20 LTS.
- **Gerenciador de Pacotes:** `yarn` (v1.22+).
- **Java Development Kit (JDK):** JDK 17 (obrigatório para compilação Android Gradle 8+).
- **Android SDK:**
  - Android SDK Platform 34 e 36.
  - Android SDK Build-Tools 34.0.0 e 36.0.0.
  - Variáveis de ambiente configuradas: `ANDROID_HOME` e `%ANDROID_HOME%\platform-tools` no `PATH`.

---

## 2. Instalação e Execução em Desenvolvimento

### Instalação de Dependências:
```bash
cd "d:\APLICATIVO MOVY\mobility-pro-app-rota101-pro"
yarn install
```

### Iniciar o Servidor Expo / Metro:
```bash
yarn start
# ou
npx expo start --dev-client
```

### Executar Diretamente em Emulador / Dispositivo Android Conectado:
```bash
yarn android
# ou
npx expo run:android
```

---

## 3. Geração de Pacotes de Produção (APK e AAB)

O repositório possui uma toolchain automatizada de compilação e assinatura:

### 3.1 Compilação do Android App Bundle (AAB Oficial da Play Store)
Para gerar o AAB de release assinado com a chave oficial:
```bash
cd "d:\APLICATIVO MOVY\mobility-pro-app-rota101-pro"
node build_and_sign.js
# ou utilizando o script de bundle Gradle:
run_gradle_bundle.bat
```
- **Saída:** O arquivo AAB final é gerado em `android/app/build/outputs/bundle/release/app-release.aab`.

### 3.2 Geração do APK Universal de Validação
Para gerar o APK instalável em qualquer dispositivo Android (via `bundletool`):
```bash
cd "d:\APLICATIVO MOVY\mobility-pro-app-rota101-pro"
build_apk_final.bat
# ou
python build_movy_universal.py
```
- **Saída:** `movy_release_universal.apk` pronto para testes de homologação direta no dispositivo.

---

## 4. Configuração de Assinatura (Keystore)

A assinatura do aplicativo segue as regras de segurança estabelecidas em `android/app/build.gradle`:
- O arquivo de keystore oficial de upload `movy_upload_keystore.jks` está localizado no diretório do projeto e devidamente configurado para assinar os builds de release com alias `movy`.
- Nenhum segredo ou chave privada deve ser exposto publicamente ou commitado em texto aberto em documentações.
