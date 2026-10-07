import {
  FiBriefcase,
  FiHash,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiCalendar,
  FiGift,
} from "react-icons/fi";

import {
  SectionTitleRow,
  FieldRow,
  FieldIcon,
  Field,
  FieldLabel,
  FieldValue,
  StatusBadge,
} from "../../../../Utils/EntityCard/styles";
import { resolveStatusColors } from "../../../../Utils/EntityCard/statusColor";
import { IconLink } from "../../../../Utils/IconLink";
import { SectionCard, SectionFieldsGrid, SocialLinksRow } from "./styles";
import { CompanyInfoProps } from "./types";
import Mask from "../../../../../services/Mask";
import IconWhatsApp from "../../../../../assets/whatsappIcon.svg";
import IconGmail from "../../../../../assets/gmailIcon.svg";

const COMPANY_STATUS_BACKGROUND_COLOR: Record<string, string> = {
  ATIVO: "#3CE64AFF",
  BLOQUEADO: "#E0142CFF",
  INATIVO: "#8c8c8c",
};

const COMPANY_STATUSES_WITH_WHITE_TEXT = ["ATIVO", "BLOQUEADO", "INATIVO"];

export const CompanyInfo = ({
  fantasyName,
  document,
  phone,
  email,
  status,
  createdAt,
  voucherBalance,
  whatsAppMessage,
}: CompanyInfoProps) => {
  const statusColors = resolveStatusColors(
    status,
    COMPANY_STATUS_BACKGROUND_COLOR,
    COMPANY_STATUSES_WITH_WHITE_TEXT
  );

  return (
    <SectionCard>
      <SectionTitleRow>
        <FiBriefcase size={18} />
        Informações da empresa
      </SectionTitleRow>
      <SectionFieldsGrid>
        <FieldRow>
          <FieldIcon>
            <FiBriefcase size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Nome fantasia</FieldLabel>
            <FieldValue>{fantasyName}</FieldValue>
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
        <FieldRow>
          <FieldIcon>
            <FiHash size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>CNPJ</FieldLabel>
            <FieldValue>{Mask.setMaskCPFCNPJ(String(document))}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiCalendar size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Data cadastro</FieldLabel>
            <FieldValue>{new Date(createdAt).toLocaleDateString()}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiPhone size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Telefone</FieldLabel>
            <FieldValue>{Mask.setMaskPhoneValue(String(phone))}</FieldValue>
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
            <FiGift size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Voucher</FieldLabel>
            <FieldValue>{Mask.setMaskMoneyNumber(voucherBalance)}</FieldValue>
          </Field>
        </FieldRow>
      </SectionFieldsGrid>
      <SocialLinksRow>
        <IconLink
          link={`https://api.whatsapp.com/send?phone=55${phone}&text=${whatsAppMessage}`}
          icon={IconWhatsApp}
        />
        <IconLink
          link={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${email}`}
          icon={IconGmail}
        />
      </SocialLinksRow>
    </SectionCard>
  );
};
