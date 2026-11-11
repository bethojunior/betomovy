# CONTRATO FUNCIONAL E TÉCNICO: CADASTRO DE MOTORISTA

> **Documento Oficial de Preservação e Reconstrução — MOVY**  
> **Arquivo Original:** `src/client/pages/Register/index.tsx` (fluxo `driverStep`)  
> **Status:** Auditado e Especificado

---

## 1. Visão Geral do Fluxo do Motorista

O cadastro de motorista é mais completo e rigoroso, pois envolve validação de identidade, conformidade legal com órgãos de trânsito, dados do veículo e documentação comprobatória com análise administrativa via Monitor MOVY.

### Etapas do Fluxo:
1. **Dados Pessoais:** Nome, e-mail, telefone, data de nascimento, documento pessoal (SSN nos EUA / CPF no BR) e cidade.
2. **Seleção de Categoria Operacional:** Categoria do serviço (`userTypeId`, ex: Carro comum, Premium, Mototáxi/Moto entrega).
3. **Dados do Veículo:** Placa, modelo, marca, cor e ano de fabricação.
4. **Documentação Digitalizada (Upload Obrigatório):**
   - Habilitação (`DOC_1` / CNH / Driver's License)
   - Licenciamento / Registro do Veículo (`DOC_2` / CRLV / Vehicle Registration)
   - Seguro Veicular Obrigatório (`DOC_3` / `DOC_10` / Insurance)
   - Comprovante de Residência (`DOC_4` / `DOC_6` / Proof of Residence)
5. **Foto de Perfil do Motorista:** Fotografia frontal com rosto nítido (sem óculos escuros ou chapéu).
6. **Definição de Senha:** Credenciais seguras de acesso ao app.
7. **Pós-Cadastro:** Entrada no estado de análise (`StatusPending`); liberação de corridas somente após aprovação no Monitor MOVY.

---

## 2. Inventário Técnico de Todos os Campos

### 2.1 Dados Pessoais

| Nome Exibido | Identificador Técnico | Tipo | Obrigatório | Máscara / Validação | Persistência (Backend) | Relação com o Monitor | Regra de Edição |
|---|---|---|---|---|---|---|
| **Nome Completo** | `dName` / `name` | String | Sim | Mínimo 2 nomes | `drivers.name` | Visível na listagem de motoristas | Bloqueado após aprovação |
| **E-mail** | `dEmail` / `email` | String | Sim | Formato de e-mail | `drivers.email` | Chave de contato e login | Exige validação de suporte |
| **Telefone** | `dPhone` / `phone` | String | Sim | E.164 internacional | `drivers.phone` | Contato direto pela Central | Editável com OTP |
| **Documento** | `dSsn` / `document` | String | Sim | 9 dígitos (EUA) ou 11 (BR) | `drivers.cpf` / `document` | Validação de antecedentes no Monitor | Imutável |
| **Data Nascimento** | `dBirthDate` / `dateOfBirth` | Date | Sim | `YYYY-MM-DD` (mín. 21 anos para motorista) | `drivers.date_of_birth` | Verificação de maioridade legal | Imutável |
| **Cidade** | `dCity` / `cityId` | Object | Sim | ID da cidade válida | `drivers.city_id` | Área de despacho e jurisdição de tarifas | Editável por admin |

### 2.2 Categoria e Veículo

| Nome Exibido | Identificador Técnico | Tipo | Obrigatório | Formato / Validação | Persistência | Relação com o Monitor | Regra de Edição |
|---|---|---|---|---|---|
| **Categoria** | `selectedCategoryId` / `userTypeId` | Number | Sim | ID de categoria ativa (default `3` ou selecionado) | `drivers.user_type_id` | Categorias configuradas no Monitor | Editável no Monitor |
| **Placa do Veículo** | `dPlate` / `licensePlate` | String | Sim | Formato alfanumérico em maiúsculas | `cars.license_plate` | Identificação obrigatória no despacho | Editável com reenvio de CRLV |
| **Modelo** | `dVehicleModel` / `model` | String | Sim | Ex: Corolla, Onix, Civic | `cars.model` | Exibido ao passageiro na corrida | Editável na tela `Vehicle` |
| **Marca** | `brand` | String | Sim | Extraído do modelo ou inserido | `cars.brand` | Registro veicular | Editável na tela `Vehicle` |
| **Cor** | `dVehicleColor` / `color` | String | Sim | Ex: Preto, Prata, Branco | `cars.color` | Exibido ao passageiro | Editável na tela `Vehicle` |
| **Ano** | `dVehicleYear` / `year` | String/Num | Sim | 4 dígitos (ano limite conforme regra da cidade) | `cars.year` | Validação de idade da frota no Monitor | Editável na tela `Vehicle` |

### 2.3 Documentos Digitalizados

| Nome Exibido | Identificador Técnico | ID do Doc | Tipo | Validação | Persistência / Relação Monitor |
|---|---|---|---|---|---|
| **Habilitação (Driver's License / CNH)** | `dDocLicense` | `1` | Imagem JPEG | Foto legível com data de validade visível | Aprovado/Rejeitado com justificativa no Monitor |
| **Registro do Veículo (Registration / CRLV)** | `dDocRegistration` | `2` | Imagem JPEG | Documento do ano vigente | Aprovado/Rejeitado no Monitor |
| **Seguro do Veículo (Insurance)** | `dDocInsurance` | `3` (ou `10`) | Imagem JPEG | Apólice com cobertura para transporte | Aprovado/Rejeitado no Monitor |
| **Comprovante de Residência** | `dDocResidence` | `4` (ou `6`) | Imagem JPEG | Máximo 90 dias de emissão | Aprovado/Rejeitado no Monitor |
| **Foto de Perfil** | `dPhoto` | `PROFILE` | Imagem JPEG | Foto frontal sem adereços | Avatar do motorista exibido ao passageiro |

---

## 3. Especificação do Contrato de API

### Endpoint de Cadastro:
- **Rota:** `POST https://api.movymob.com/Driver/Register`
- **Cabeçalhos:** `Content-Type: multipart/form-data`
- **Campos Form-Data:**
  - `stdObject`: JSON stringified contendo `driver` e `car`:
  ```json
  {
    "driver": {
      "name": "Carlos Santos",
      "email": "carlos.driver@example.com",
      "document": "987654321",
      "dateOfBirth": "1990-08-20",
      "phone": "15559876543",
      "password": "SenhaDoMotorista123",
      "userTypeId": 3,
      "registered_in": "mobilidade",
      "cityId": 5605,
      "docs": [
        { "docId": 1, "text": "Driver's License" },
        { "docId": 2, "text": "Vehicle insurance and registration" },
        { "docId": 6, "text": "Proof of residence" },
        { "docId": 10, "text": "SCN" }
      ]
    },
    "car": {
      "licensePlate": "MOV7890",
      "model": "Toyota Corolla",
      "brand": "Toyota",
      "color": "Preto",
      "year": "2022"
    }
  }
  ```
  - Anexos binários:
    - `PROFILE`: binário da foto de perfil.
    - `DOC_1` / `CNH`: binário da habilitação.
    - `DOC_2` / `CRLV`: binário do documento do veículo.
    - `DOC_4` / `DOC_6`: binário do comprovante de residência.
    - `DOC_3` / `DOC_10`: binário da apólice de seguro.

### Reenvio de Pendências:
- **Rota:** `POST https://api.movymob.com/DocUser/Send`
- **Campos Form-Data:**
  - `docId`: Código do documento (`1`, `2`, `3` ou `4`)
  - `userId`: ID do motorista
  - `DOC_{docId}`: Binário do novo documento corrigido

---

## 4. Estados de Aprovação e Ciclo de Vida do Motorista

1. **`StatusPending`:** O motorista aguarda aprovação da equipe no Monitor MOVY. O aplicativo exibe uma tela informativa com status claro de cada documento.
2. **`DocumentPending`:** Caso um documento seja recusado pelo operador no Monitor, o aplicativo alerta o motorista com o motivo da recusa e habilita a substituição direta.
3. **`Aprovado`:** O motorista ganha acesso imediato à tela inicial com botão de alternância de disponibilidade ("Ficar Online").
4. **Preservação de Motoristas Existentes:** Motoristas que já utilizam o sistema continuam com seus acessos, veículos e saldos inalterados.
