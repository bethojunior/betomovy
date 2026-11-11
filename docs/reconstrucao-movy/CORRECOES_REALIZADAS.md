# REGISTRO DE CORREÇÕES REALIZADAS — MOVY MOBILE

> **Auditoria e Eliminação de Defeitos Históricos**  
> **Módulo:** `mobility-pro-app-rota101-pro`

---

## 1. Sincronização de Cancelamento pela Central de Operações

- **Problema Histórico:** Quando um operador na Central de Operações cancelava uma corrida já aceita por um motorista, o aplicativo do motorista permanecia congelado na tela de viagem em andamento, impedindo-o de receber novas chamadas e gerando inconsistência no painel do Monitor.
- **Causa Raiz Identificada:** O aplicativo escutava apenas eventos REST polling esporádicos e ignorava o payload do evento Socket `trip-canceled` ou o push `RIDE_CANCELLED` quando estava em segundo plano.
- **Correção Implementada:**
  1. No `SocketIOContext`, registro obrigatório do listener `trip-canceled` com emissão de alerta em tela cheia e transição automática da rota para `Home` do motorista.
  2. Limpeza imediata do objeto `tripDriver` no armazenamento local (`AsyncStorage`).
  3. No handler de push notification em `index.tsx`, reconhecimento da tag `RIDE_CANCELLED` com interrupção instantânea do som de corrida e redefinição do estado de disponibilidade.
  4. Homologação completa via script E2E `scripts/e2e_central_cancel.ps1`.

---

## 2. Inconsistência de Fundo de Splash Screen e Layout de Marca

- **Problema Histórico:** O arquivo `app.json` mantinha `"backgroundColor": "#CF227B"` (rosa magenta legada) e ícones antigos, criando uma transição visual brusca entre a inicialização nativa e o carregamento do React Native.
- **Causa Raiz Identificada:** Configurações herdadas de versão anterior antes da transição da marca para MOVY.
- **Correção Implementada:**
  1. Atualização da cor de splash nativa em `app.json` e nos recursos XML do Android (`android/app/src/main/res/values/colors.xml` e drawables) para a cor oficial Deep Navy `#070A1A`.
  2. Padronização dos assets de logotipo e splash para o conjunto oficial MOVY (`assets/logo-on-dark.png` e variantes).

---

## 3. Teclado Ocluindo Campos no Cadastro de Veículo do Motorista

- **Problema Histórico:** No cadastro de motorista (`driverStep`), ao digitar o ano ou modelo do veículo, o teclado virtual do Android cobria os campos inferiores e o botão "Avançar", bloqueando a submissão em dispositivos de tela menor.
- **Causa Raiz Identificada:** Falta de ajuste dinâmico no contêiner com `KeyboardAvoidingView` e `ScrollView` sem `keyboardShouldPersistTaps="handled"`.
- **Correção Implementada:**
  1. Implementação de scroll adaptativo que rola automaticamente a visão para o campo em foco.
  2. Ajuste de altura e padding inferior seguro com `react-native-safe-area-context`.

---

## 4. Ícones de Categoria Operacional

- **Problema Histórico:** Ícones de categorias de veículos (Mototáxi, Moto Entrega e Carro) exibiam artefatos desconfigurados ou repetidos no picker de categorias.
- **Causa Raiz Identificada:** Mapeamento fixo de IDs de ícones divergente dos IDs retornados pela API `/UserType/GetAll`.
- **Correção Implementada:** Mapeamento dinâmico baseado na propriedade `userTypeId` retornada pelo backend com fallbacks visuais limpos.

---

## 5. Eliminação de Código Legado Inativo

- **Problema Histórico:** Existência de diretórios inativos `src/client/pages/DataUserSignUp/` e `src/client/pages/DataDriverSingUp/` que causavam confusão sobre qual formulário de cadastro estava em produção.
- **Correção Implementada:** Confirmação de que `Register/index.tsx` é a única rota ativa e documentação explícita do contrato em `CADASTRO_CLIENTE.md` e `CADASTRO_MOTORISTA.md`.
