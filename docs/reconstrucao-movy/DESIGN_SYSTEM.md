# SISTEMA DE DESIGN NOVO — MOVY EXECUTIVE

> **Identidade Visual Reconstruída do Aplicativo MOVY**  
> **Conceito:** Moderno, Executivo, Alta Legibilidade e Identidade Própria  
> **Não-cópia:** Não utiliza layout nem paleta de apps concorrentes ou da versão legada rosa.

---

## 1. Paleta de Cores e Tokens Visuais

A nova identidade do MOVY foi construída sob a harmonia executiva de alto contraste, garantindo elegância, nitidez em ambientes ensolarados e modo escuro confortável para motoristas durante corridas noturnas.

| Nome do Token | Hexadecimal | Finalidade e Uso |
|---|---|---|
| `navy_deep` | `#070A1A` | Fundo principal escuro, cabeçalhos executivos, barras de status |
| `navy_card` | `#0B1220` | Superfície de cartões no modo escuro, modais e fundos secundários |
| `cyan_electric` | `#04F3FA` | Acentos principais, indicadores de status ativo, botões de ação e destaques |
| `blue_royal` | `#00349A` | Cor de marca principal, botões primários, seleções ativas |
| `white_pure` | `#FFFFFF` | Textos em superfícies escuras, fundo de cards no modo claro |
| `gray_canvas` | `#F8F9FA` | Fundo global claro para o modo diurno do passageiro |
| `gray_border` | `#E2E8F0` | Linhas divisórias sutis e contornos de inputs no modo claro |
| `dark_border` | `#1E293B` | Bordas e divisores sutis em superfícies escuras |
| `gray_muted` | `#64748B` | Textos secundários, legendas, placeholders e ícones inativos |
| `success_emerald` | `#10B981` | Corridas iniciadas, pagamentos confirmados, aprovação cadastral |
| `danger_crimson` | `#EF4444` | Botão de pânico/SOS, cancelamentos e mensagens de erro |
| `warning_amber` | `#F59E0B` | Documentação pendente, avisos de conexão e contagem de ofertas |

---

## 2. Tipografia e Escalas de Texto

O MOVY adota famílias tipográficas com renderização limpa no Android e iOS:
- **Títulos e Valores Numéricos:** `MavenPro_700Bold` / `Roboto_700Bold` (peso visual marcante em valores de corrida e instruções).
- **Corpo de Texto e Controles:** `Roboto_400Regular` / `Roboto_500Medium` (alta legibilidade em telas de todos os tamanhos).
- **Dados Monospaçados / Códigos OTP:** `SourceCodePro_600SemiBold`.

### Escala Tipográfica (com `react-native-responsive-fontsize`):
- **Display 1 (Valores Grandes / Boas-vindas):** `RFValue(28)`
- **Título de Seção (H1):** `RFValue(22)`
- **Subtítulo / Nome de Categoria (H2):** `RFValue(18)`
- **Corpo de Texto / Botão Principal:** `RFValue(15)`
- **Texto Secundário / Labels:** `RFValue(13)`
- **Legendas / Metadados:** `RFValue(11)`

---

## 3. Componentes de Interface Padronizados

### 3.1 Botões de Ação
- **Botão Primário Executivo:** Gradiente ou preenchimento `blue_royal` (`#00349A`) com texto branco e cantos arredondados de `12px` (`RFValue(12)`). Altura mínima de toque de `52px` para facilidade em trânsito.
- **Botão de Destaque Cyan:** Fundo `cyan_electric` (`#04F3FA`) com texto escuro `navy_deep` (`#070A1A`) para chamadas rápidas e aceite de corrida.
- **Botão de Ação Arrastável (Slide to Accept / Slide to Arrive):** Componente de arraste animado com confirmação háptica para evitar toques acidentais em movimento.
- **Botão de Emergência SOS:** Vermelho vibrante (`#EF4444`) com confirmação rápida e localização GPS instantânea.

### 3.2 Campos de Entrada (Inputs)
- Altura padrão de `54px`.
- Borda de `1.5px` com foco em `cyan_electric`.
- Ícone indicador de campo à esquerda e botão de ação/limpeza à direita.
- Tratamento de teclado com `KeyboardAvoidingView` para evitar oclusão do botão de avanço.

### 3.3 Cartões Informativos (Cards)
- Raio de curvatura de `16px`.
- Sombra suave (`elevation: 4` no Android, `shadowOpacity: 0.08` no iOS).
- Espaçamento interno generoso (`16px` a `20px`).
- Hierarquia clara: Ícone de serviço à esquerda, nome e tempo estimado ao centro, preço destacado à direita.

### 3.4 Modais e Bottom Sheets
- Folhas inferiores (Bottom Sheets) com alça de arraste superior.
- Backdrop escurecido suave (`rgba(0,0,0,0.5)`).
- Fechamento rápido por gesto de puxar para baixo.

---

## 4. Diferenciais da Nova Experiência Visual

1. **Passageiro:**
   - Mapa amplo em tela cheia com overlay flutuante translúcido na barra superior.
   - Seleção de categoria por cartões horizontais dinâmicos com tempo de chegada e estimativa de tarifa clara.
   - Status de corrida com indicador progressivo (Buscando motorista → Motorista a caminho → Chegou → Em viagem → Concluído).
2. **Motorista:**
   - Tela inicial com painel resumo no topo (Ganhos do dia, Horas online, Corridas realizadas).
   - Interruptor de disponibilidade proeminente e seguro ("Online / Offline").
   - Card de oferta com mapa simplificado, valor líquido ao motorista, tempo até o passageiro e barra decrescente de contagem regressiva de aceite.
