# CONTRATO FUNCIONAL E TÉCNICO: CADASTRO DE CLIENTE (PASSAGEIRO)

> **Documento Oficial de Preservação e Reconstrução — MOVY**  
> **Arquivo Original:** `src/client/pages/Register/index.tsx` (fluxo `passengerStep`)  
> **Status:** Auditado e Especificado

---

## 1. Visão Geral do Fluxo

O cadastro de passageiro do MOVY opera em formato wizard progressivo, garantindo alta conversão, validações antecipadas e submissão atômica dos dados para o backend em `api.movymob.com`.

### Etapas do Fluxo:
1. **Seleção de Perfil:** Escolha entre "Passageiro" e "Motorista".
2. **Dados Pessoais e Localidade:** Nome, e-mail, telefone, data de nascimento, documento e cidade de atuação.
3. **Foto de Perfil:** Captura ou seleção na galeria com compressão JPEG.
4. **Segurança de Acesso:** Definição e confirmação de senha.
5. **Termos e Parcerias:** Aceite de termos de uso e escolha de serviços conveniados (Mobilidade, Delivery).
6. **Confirmação e Boas-Vindas:** Redirecionamento para tela de parabéns (`CongratulationSignUp`) e autenticação automática.

---

## 2. Inventário Técnico de Todos os Campos

| Nome Exibido | Identificador Técnico | Tipo | Obrigatório | Máscara / Formato | Validação | Condições de Exibição | Persistência (Backend) | Relação com o Monitor | Regra de Edição Posterior |
|---|---|---|---|---|---|---|---|---|---|
| **Nome Completo** | `pName` / `name` | String | Sim | Nenhuma (Capitalize) | Mínimo 2 caracteres, não vazio | Sempre visível | Tabela `customers.name` | Visível na listagem de clientes do Monitor | Editável em `MyProfile` |
| **E-mail** | `pEmail` / `email` | String | Sim | E-mail minúsculo | Regex padrão RFC 5322; unicidade no servidor | Sempre visível | Tabela `customers.email` | Utilizado para contato e identificação no Monitor | Bloqueado para edição direta; exige validação |
| **Telefone / Celular** | `pPhone` / `phone` | String | Sim | Formato internacional com DDI (Ex: `+1 (555) 000-0000` ou `+55 (11) 90000-0000`) | Apenas dígitos no envio (mínimo 10 dígitos) | Sempre visível | Tabela `customers.phone` | Identificação de chamadas e despacho no Monitor | Editável com confirmação por OTP |
| **Documento de Identificação** | `pSsn` / `document` | String | Sim (Condicional) | 9 dígitos (SSN/ITIN nos EUA) ou 11 dígitos (CPF no BR) | Validação numérica; nos EUA não exige envio de foto de documento para passageiro | Sempre visível | Tabela `customers.cpf` / `document` | Campo de identificação antifraude | Somente visualização; edição restrita a suporte |
| **Data de Nascimento** | `pBirthDate` / `dateOfBirth` | Date | Sim | `YYYY-MM-DD` | Idade mínima legal (18 anos) | Sempre visível | Tabela `customers.date_of_birth` | Registro de compliance | Bloqueado após confirmação inicial |
| **Cidade de Atuação** | `pCity` / `cityId` | Object / ID | Sim | Seleção via Picker | Deve existir na lista da API (`cities`); fallback para `5605` | Sempre visível | Tabela `customers.city_id` | Determina tarifação e regras regionais no Monitor | Editável nas preferências regionais |
| **Foto de Perfil** | `pPhoto` / `photo` | File (URI) | Sim | Image JPEG (compressão 0.8) | Resolução nítida; upload multipart/form-data | Etapa 2 do wizard | Armazenamento de mídia (S3/MinIO) e link em `customers.photo` | Exibida no cadastro e histórico de viagens no Monitor | Editável a qualquer momento em `MyProfile` |
| **Senha de Acesso** | `pPassword` / `password` | Password | Sim | Oculto com toggle de visibilidade | Mínimo 6 caracteres | Etapa final | Hash seguro no backend (Bcrypt/Argon2) | Nunca visível em texto puro | Redefinível via `ChangePassword` ou recuperação |
| **Confirmar Senha** | `pConfirmPassword` | Password | Sim | Oculto | Deve ser exatamente igual a `pPassword` | Etapa final | Não persistido | Não se aplica | Não se aplica |

---

## 3. Especificação do Contrato de API

### Endpoint de Criação:
- **Rota:** `POST https://api.movymob.com/Customer/Register`
- **Cabeçalhos:** `Content-Type: application/json`
- **Payload:**
```json
{
  "stdObject": [
    {
      "name": "Alex Miller",
      "email": "alex.miller@example.com",
      "document": "123456789",
      "dateOfBirth": "1995-05-15",
      "nickname": "Alex",
      "registered_in": "mobilidade",
      "phone": "15551234567",
      "password": "MinhaSenhaSegura123",
      "cityId": 5605
    }
  ]
}
```
- **Resposta de Sucesso:**
```json
{
  "status": true,
  "message": "Cadastro realizado com sucesso",
  "data": {
    "idCustomer": 4635,
    "name": "Alex Miller"
  }
}
```

### Endpoint de Foto de Perfil:
- **Rota:** `POST https://api.movymob.com/Customer/UpdateProfileImage`
- **Cabeçalhos:** `Content-Type: multipart/form-data`
- **Campos Form-Data:**
  - `customerId`: `4635`
  - `userId`: `4635`
  - `idUser`: `4635`
  - `photo`: Arquivo binário JPEG (`profile.jpg`)

---

## 4. Tratamento de Erros e Casos de Borda

1. **E-mail ou Telefone já Cadastrados:** O servidor retorna `status: false` com a mensagem descritiva. O app exibe alerta claro e orienta o login ou recuperação de senha.
2. **Queda de Conexão durante o Cadastro:** Os campos preenchidos são preservados no estado local da tela até a confirmação de envio.
3. **Falha no Upload da Foto:** O cadastro do passageiro é mantido com sucesso no banco e o upload da foto é agendado ou alertado para reenvio sem perder a conta criada.
4. **Contas Existentes:** Usuários já registrados continuam acessando normalmente via `Customer/LoginByPhone` ou login por e-mail/senha sem necessidade de recadastro.

---

## 5. Fluxo Alternativo ATIVO — Cadastro via Telefone + OTP

Além do wizard `Register`, existe um segundo caminho de cadastro **em produção**:

- `UserNumberPhone` → `VerificationOTP` → `DataUserSignUp` (rotas em `auth.routes.tsx` e `guest.routes.tsx`).
- `DataUserSignUp` usa schema Yup próprio (`schema.ts`): `name` (obrig., mín.2), `date` (nascimento), `email` (obrig., formato), `phone` (obrig.), `password` (obrig., mín.6), `password_confirmation` (obrig., igual a `password`).
- **A reconstrução deve preservar esse fluxo** (ou convergi-lo explicitamente para o wizard, mediante aprovação de escopo — hoje ambos estão roteados e ativos).
- `DataDriverSingUp` (apenas step `Categories`) **não possui navegação entrante** encontrada — provável dead code, confirmar antes de remover.
