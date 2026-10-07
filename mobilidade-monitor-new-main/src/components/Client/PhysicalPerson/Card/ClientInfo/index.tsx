import { useContext } from "react";
import {
  FiUser,
  FiCheckCircle,
  FiHash,
  FiCreditCard,
  FiPhone,
  FiCalendar,
  FiMail,
  FiGift,
  FiShield,
  FiMapPin,
} from "react-icons/fi";

import {
  SectionCard,
  SectionTitleRow,
  SectionFieldsGrid,
  FieldRow,
  FieldIcon,
  Field,
  FieldLabel,
  FieldValue,
  StatusBadge,
} from "../../../../Utils/EntityCard/styles";
import { resolveStatusColors } from "../../../../Utils/EntityCard/statusColor";
import { ClientInfoProps } from "./types";
import AuthContext from "../../../../../contexts/auth";
import Mask from "../../../../../services/Mask";
import { ZAFIRA, ZAFIRA_VISUALIZAR_VALIDACAO } from "../../../../../constants/permissions";
import { ZafiraValidationStatus } from "../../../../Utils/ZafiraValidationStatus";

const CLIENT_STATUS_BACKGROUND_COLOR: Record<string, string> = {
  ATIVO: "#3CE64AFF",
  BLOQUEADO: "#E0142CFF",
  INATIVO: "#8c8c8c",
};

const CLIENT_STATUSES_WITH_WHITE_TEXT = ["ATIVO", "BLOQUEADO", "INATIVO"];

const formatBirthday = (dateOfBirth: number) => {
  const date = String(dateOfBirth).split("-");
  return `${date[2]}/${date[1]}/${date[0]}`;
};

export const ClientInfo = ({
  name,
  document,
  rg,
  phone,
  email,
  dateOfBirth,
  status,
  created_at,
  city,
  enableZafiraValidationMonitor,
  zafiraValidated,
}: ClientInfoProps) => {
  const { hasPermission } = useContext(AuthContext);
  const statusColors = resolveStatusColors(
    status,
    CLIENT_STATUS_BACKGROUND_COLOR,
    CLIENT_STATUSES_WITH_WHITE_TEXT
  );

  return (
    <SectionCard>
      <SectionTitleRow>
        <FiUser size={18} />
        Informações do cliente
      </SectionTitleRow>
      <SectionFieldsGrid>
        <FieldRow>
          <FieldIcon>
            <FiUser size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Cliente</FieldLabel>
            <FieldValue>{name}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiCheckCircle size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <StatusBadge
              $backgroundColor={statusColors.backgroundColor}
              $textColor={statusColors.textColor}
            >
              {status}
            </StatusBadge>
          </Field>
        </FieldRow>
        {enableZafiraValidationMonitor && hasPermission(ZAFIRA, ZAFIRA_VISUALIZAR_VALIDACAO) && (
          <FieldRow>
            <FieldIcon>
              <FiShield size={16} />
            </FieldIcon>
            <Field>
              <FieldLabel>Validação Zafira</FieldLabel>
              <ZafiraValidationStatus zafiraValidated={zafiraValidated} />
            </Field>
          </FieldRow>
        )}
        <FieldRow>
          <FieldIcon>
            <FiHash size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>CPF</FieldLabel>
            <FieldValue>{document || "Não informado"}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiCalendar size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Data Cadastro</FieldLabel>
            <FieldValue>
              {new Date(created_at).toLocaleDateString()}
            </FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiCreditCard size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>RG</FieldLabel>
            <FieldValue>{rg || "Não informado"}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiGift size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Data de nascimento</FieldLabel>
            <FieldValue>
              {dateOfBirth ? formatBirthday(dateOfBirth) : "Não informado"}
            </FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiPhone size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Telefone</FieldLabel>
            <FieldValue>{phone ? Mask.setMaskPhoneValue(phone) : "Não informado"}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiMail size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>E-mail</FieldLabel>
            <FieldValue>{email}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiMapPin size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Cidade</FieldLabel>
            <FieldValue>{city || "Não informado"}</FieldValue>
          </Field>
        </FieldRow>
      </SectionFieldsGrid>
    </SectionCard>
  );
};
