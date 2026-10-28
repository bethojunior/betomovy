# AUDITORIA TÉCNICA E STATUS DAS CORREÇÕES — MOVY CENTRAL

**URL de Produção:** https://movycentral.com/  
**Repositório Base:** `mobilidade-central-master`  
**API Consumida:** `https://api.movymob.com/`

---

## 1. Problemas Diagnosticados e Corrigidos

### Item MC-01: Exibição de Valores Crus de Duração e Distância
- **Problema:** No painel de busca e confirmação da central (`Procurando motorista...`), o card de ETA exibia texto bruto desformatado (exemplo: `3 • 0.782`) sem indicação de unidades de medida.
- **Causa Raiz:** O JavaScript da central obtinha os valores numéricos brutos da sessão (`Session.getLocal("estimatedTripTime")` e `distanceTrip`) e concatenava diretamente com o separador ` • ` sem tratar as strings de unidade.
- **Correção:** Atualizados os arquivos `updateTrip.js` e `confirmationDataTrip.js` para validar e injetar as unidades correspondentes (`min` e `km` / `mi` caso detectado EUA).
- **Validação:** Validação de sintaxe JavaScript com Node.js sem erros, código comitado e publicado via push.

### Item MC-02: Viagens da Central Presas no Status `searching` Sem Expirar
- **Problema:** Quando a central solicitava uma corrida e nenhum motorista aceitava, a viagem ficava presa indefinidamente no popup de solicitação em vez de expirar para `not_answered` e notificar o operador.
- **Causa Raiz:** O usuário central (`userId = 4634`) não possuía registro correspondente em `levelAccess` (`userTypeId = 5` - Cliente Final) e suas instâncias na tabela `customer` estavam com o campo `balanceId` nulo. Ao tentar expirar/cancelar a corrida, o comando interno da API lançava exceção ao verificar a conta e saldo do cliente.
- **Correção:** Inserida a permissão de cliente em `levelAccess` para o usuário 4634 e normalizados todos os registros em `customer` com `balanceId = 4588`.
- **Validação:** Verificado banco de dados e rotina de expiração executada com sucesso.

### Item MC-03: Motorista Particular Desvinculado da Central
- **Problema:** Motoristas cadastrados para atendimento particular da central não recebiam chamados disparados pela mesma.
- **Causa Raiz:** Ausência de vínculo na tabela relacional `centralDriver` para a central operacional (ID 33 e 54).
- **Correção:** Inseridos os vínculos de ambos os motoristas nas tabelas de central com status ativo (`statusId = 1`) e flag de favorito.
- **Validação:** Consulta SQL confirmando a associação de múltiplos vínculos para cada condutor.
