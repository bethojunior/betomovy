# AUDITORIA TÉCNICA E STATUS DOS APLICATIVOS MÓVEIS (ANDROID E APPLE iOS)

**Projetos Base:**
- Android / Base: `mobility-pro-app-rota101-pro`
- Apple iOS: `mobility-pro-app-rota101-pro-ios`
- Apps Legados: `mobilidade-driverapp-cordova-rota101` / `mobilidade-appclient-cordova-rota101`

---

## 1. Problemas Diagnosticados e Corrigidos

### Item MOB-01: Disparidade e Falha na Tela de Login iOS vs. Android
- **Problema:** A tela de autenticação do aplicativo iOS não permitia acesso adequado ou apresentava layout e fluxo divergentes da versão Android.
- **Causa Raiz:** Diferenças no fluxo de tratamento de sessão, permissões de autenticação social e manipulação de credenciais no bundle do iOS.
- **Correção:** Harmonizado o fluxo de autenticação e parâmetros de login do iOS com os endpoints da API de produção.

### Item MOB-02: Recebimento e Toque de Corrida nos Dispositivos
- **Problema:** O chamado disparado pela central não acionava alerta sonoro/notificação no aplicativo do motorista ou não carregava a quilometragem correta.
- **Causa Raiz:** Configurações de som e despacho no backend (`config` table) com flags vazias para alertas (`soundCallTrip`), somadas à ausência de vínculo formal entre o ID da central e o condutor na tabela `centralDriver`.
- **Correção:** Motoristas vinculados diretamente às centrais ativas, polígonos de atendimento e categorias de viagem sincronizadas.

---

## 2. Inventário de Verificação dos Módulos Mobile
- [x] Configurações de Compilação Android (`build.gradle`, SDKs, manifests)
- [x] Configurações de Compilação iOS (`Podfile`, Xcode Workspace, esquemas de assinatura)
- [ ] Testes de Ciclo de Vida: Login, Logout e Renovação de Token
- [ ] Testes de Notificação e WebSocket / Realtime (toque de corrida)
- [ ] Testes de Aceite, Embarque e Finalização de Trajeto
