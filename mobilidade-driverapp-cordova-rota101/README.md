# App Motorista (Cordova)

App legado Cordova para motoristas. Android apenas.

## Requisitos

- Node v16.14.0
- Cordova CLI 10.x
- JDK e Android SDK (para build Android)

## Clone / primeira vez

```bash
npm install
cordova platform add android@14.0.1
cordova build android
# ou rodar no device/emulador:
cordova run android
```

Não use o script `driver-plugin.sh` do repositório pai; plataforma e plugins vêm do `package.json`.

## Comandos úteis

| Comando | Uso |
|---------|-----|
| `cordova build android` | Gera APK debug |
| `cordova run android` | Build e instala no device/emulador |
| `cordova build android --release` | Build release (usa keystore; ver `build_release.sh`) |

## Build release (AAB)

Existe o script `build_release.sh` na raiz do projeto: lê keystore e senha em `keystore/password.txt` e gera o AAB em `test/`. Não usar credenciais de demo em produção.

## FAQ

<details>
<summary>ADB: porta 5037 em uso</summary>

Se `cordova run android` falhar com "Address already in use" ou "ADB server didn't ACK", outro processo (ex.: Android Studio) está usando a 5037. Contorno: usar outra porta na mesma sessão do terminal:

```bash
export ANDROID_ADB_SERVER_PORT=5038
adb start-server
cordova run android
```
</details>
