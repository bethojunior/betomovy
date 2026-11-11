# PENDÊNCIAS E STATUS — RECONSTRUÇÃO MOVY

> **Acompanhamento de Itens e Decisões**  
> **Data:** 2026-11-10

---

## 1. Itens Concluídos e Esclarecidos

- [x] **Localização e inventário integral do projeto:** Mapeamento completo de `mobility-pro-app-rota101-pro`.
- [x] **Identificação de tecnologias e versões:** Expo SDK 54, React Native 0.81.5, React 19.1.0, TypeScript 5.9.2, Android Target SDK 36.
- [x] **Confirmação da identidade Android a preservar:** `applicationId: "br.com.client.rota101"`, `versionCode: 80308 -> 80309`, chave de release `movy_upload_keystore.jks`.
- [x] **Mapeamento completo de endpoints de API:** 168 endpoints catalogados em `ENDPOINTS_MAPEADOS.json`.
- [x] **Mapeamento completo de persistência local:** 91 chaves catalogadas em `STORAGE_KEYS.json`.
- [x] **Contrato e payloads exatos de cadastro:**
  - Passageiro documentado em `CADASTRO_CLIENTE.md` (`Customer/Register` + `Customer/UpdateProfileImage`).
  - Motorista documentado em `CADASTRO_MOTORISTA.md` (`Driver/Register` com 4 documentos + foto de perfil + veículo).
- [x] ~~`DataUserSignUp`/`DataDriverSingUp` dead code~~ **CORRIGIDO**: `DataUserSignUp` está ATIVO — fluxo telefone→OTP (`UserNumberPhone`/`VerificationOTP`) navega para ele. `DataDriverSingUp` sim parece sem navegação entrante (só auto-referência). Ambos os cadastros devem ser preservados na reconstrução.
- [x] **Definição do Sistema Visual Novo:** `DESIGN_SYSTEM.md` formalizando a identidade executiva Deep Navy (`#070A1A`), Royal Blue (`#00349A`) e Electric Cyan (`#04F3FA`).
- [x] **Matriz de Paridade Funcional:** 50 funcionalidades com implementação e homologação detalhadas em `MATRIZ_PARIDADE_FUNCIONAL.md`.

---

## 2. Ações em Execução / Próximos Passos Técnicos

- [x] Auditoria e elaboração de todo o dossiê em `docs/reconstrucao-movy/`.
- [x] Compilação de homologação e validação de build release `movy-app-universal.apk` (70,8 MB, 2026-11-10) e `movy-release-playstore.aab` (52,6 MB).
- [x] Testes Jest: corrigido `node_modules/jest-snapshot/node_modules/semver` corrompido (removido para usar semver 7.8.1 da raiz), adicionado `SafeAreaProvider initialMetrics` em `ConfigThemeGlobal.tsx` e mock de `BottomSheetModal` (Modal nativo não renderiza em test renderer). `ModalTransference.test.tsx` ✅ passando.
- [ ] `versionCode` ainda em `80308` (app.json e build.gradle) — bump para `80309` pendente antes de release (PENDENCIAS anterior citava 80309 como confirmado, mas o código não foi alterado).
- [ ] Documentação `docs/reconstrucao-movy/` e correções de teste **não commitadas** — aguardando autorização (regra do projeto).

## Segurança (novo)

- [ ] **Senha do keystore de release em texto plano** em `mobility-pro-app-rota101-pro/android/app/build.gradle` (signingConfigs.release, fallback). Já está versionada no git — recomendo migrar para `gradle.properties`/variáveis de ambiente (`MOVY_RELEASE_*` já suportadas) e rotacionar a senha. Não alterei para não quebrar o pipeline de build.
- [ ] Build de homologação em andamento (sessão 3) para validação visual do novo design em device.
