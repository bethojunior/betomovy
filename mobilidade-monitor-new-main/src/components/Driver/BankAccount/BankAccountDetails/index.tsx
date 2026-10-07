import { Button, Tooltip } from "antd";
import { BsBank2 } from "react-icons/bs";
import {
  FiCopy,
  FiCreditCard,
  FiEdit2,
  FiFileText,
  FiHash,
  FiKey,
  FiLayers,
  FiTag,
  FiUser,
} from "react-icons/fi";

import pixIcon from "../../../../assets/pix.svg";
import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import {
  ACCOUNT_TYPE_LABEL,
  PIX_TYPE_LABEL,
  formatDocument,
  hasBankAccount,
  hasPix,
  withDigit,
} from "../utils";
import {
  Container,
  EmptyText,
  Field,
  FieldIcon,
  FieldLabel,
  FieldText,
  FieldValue,
  Fields,
  Header,
  HeaderTitle,
  PixIcon,
  Section,
  SectionTitle,
  Sections,
} from "./styles";
import { BankAccountDetailsProps, InfoFieldProps } from "./types";

const InfoField = ({ icon, label, value, span, action }: InfoFieldProps) => (
  <Field $span={span}>
    <FieldIcon>{icon}</FieldIcon>
    <FieldText>
      <FieldLabel>{label}</FieldLabel>
      <FieldValue title={value ?? undefined}>{value || "—"}</FieldValue>
    </FieldText>
    {action}
  </Field>
);

export const BankAccountDetails = ({ account, canEdit, onEdit }: BankAccountDetailsProps) => {
  const copy = useCopyToClipboard();
  const bankLabel = account.bankName ? `${account.bankNumber} - ${account.bankName}` : null;

  return (
    <Container>
      <Header>
        <HeaderTitle>Dados bancários</HeaderTitle>
        {canEdit && (
          <Button icon={<FiEdit2 size={14} />} onClick={onEdit}>
            Editar
          </Button>
        )}
      </Header>

      <Sections>
        <Section>
          <SectionTitle>
            <BsBank2 size={16} />
            Conta bancária
          </SectionTitle>
          {hasBankAccount(account) ? (
            <Fields $columns={3}>
              <InfoField icon={<FiUser size={14} />} label="Titular" value={account.holderName} span={2} />
              <InfoField icon={<FiFileText size={14} />} label="CPF/CNPJ" value={formatDocument(account.document)} />

              <InfoField icon={<BsBank2 size={14} />} label="Banco" value={bankLabel} span={2} />
              <InfoField
                icon={<FiLayers size={14} />}
                label="Tipo"
                value={account.typeAccount ? ACCOUNT_TYPE_LABEL[account.typeAccount] : null}
              />

              <InfoField icon={<FiHash size={14} />} label="Agência" value={withDigit(account.agency, account.agencyDigit)} />
              <InfoField
                icon={<FiCreditCard size={14} />}
                label="Conta"
                value={withDigit(account.numberAccount, account.numberAccountDigit)}
              />
              <InfoField icon={<FiTag size={14} />} label="Operação" value={account.op} />
            </Fields>
          ) : (
            <EmptyText>Nenhuma conta bancária cadastrada.</EmptyText>
          )}
        </Section>

        <Section>
          <SectionTitle>
            <PixIcon src={pixIcon} alt="" />
            Pix
          </SectionTitle>
          {hasPix(account) ? (
            <Fields $columns={1}>
              <InfoField
                icon={<FiKey size={14} />}
                label="Chave"
                value={account.pix}
                action={
                  <Tooltip title="Copiar chave Pix">
                    <Button
                      type="text"
                      icon={<FiCopy size={15} />}
                      aria-label="Copiar chave Pix"
                      onClick={() => copy(account.pix ?? "", "Chave Pix copiada")}
                    />
                  </Tooltip>
                }
              />
              <InfoField
                icon={<FiTag size={14} />}
                label="Tipo da chave"
                value={account.pixType ? PIX_TYPE_LABEL[account.pixType] : null}
              />
              {!hasBankAccount(account) && (
                <InfoField icon={<FiUser size={14} />} label="Titular" value={account.holderName} />
              )}
            </Fields>
          ) : (
            <EmptyText>Nenhuma chave Pix cadastrada.</EmptyText>
          )}
        </Section>
      </Sections>
    </Container>
  );
};
