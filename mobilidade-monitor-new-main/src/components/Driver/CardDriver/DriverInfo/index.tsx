import { useContext } from "react";
import {
  FiUser,
  FiCheckCircle,
  FiHash,
  FiCalendar,
  FiPhone,
  FiTruck,
  FiMail,
  FiTag,
  FiMapPin,
  FiDroplet,
  FiShield,
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
  DRIVER_STATUS_BACKGROUND_COLOR,
  DRIVER_STATUSES_WITH_WHITE_TEXT,
} from "../styles";
import { resolveStatusColors } from "../../../Utils/EntityCard/statusColor";
import { DriverInfoProps } from "./types";
import AuthContext from "../../../../contexts/auth";
import Mask from "../../../../services/Mask";
import { ZAFIRA, ZAFIRA_VISUALIZAR_VALIDACAO } from "../../../../constants/permissions";
import { ZafiraValidationStatus } from "../../../Utils/ZafiraValidationStatus";

export const DriverInfo = ({
  name,
  document,
  phone,
  email,
  city,
  registerStatus,
  created_at,
  carModel,
  carBrand,
  carPlate,
  carColor,
  carYear,
  enableZafiraValidationMonitor,
  zafiraValidated,
}: DriverInfoProps) => {
  const { hasPermission } = useContext(AuthContext);
  const statusColors = resolveStatusColors(
    registerStatus,
    DRIVER_STATUS_BACKGROUND_COLOR,
    DRIVER_STATUSES_WITH_WHITE_TEXT
  );

  return (
    <SectionCard>
      <SectionTitleRow>
        <FiUser size={18} />
        Informações do motorista
      </SectionTitleRow>
      <SectionFieldsGrid>
        <FieldRow>
          <FieldIcon>
            <FiUser size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Motorista</FieldLabel>
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
              {registerStatus}
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
            <FieldValue>{document}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiCalendar size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Data de cadastro</FieldLabel>
            <FieldValue>
              {new Date(created_at).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiPhone size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Telefone</FieldLabel>
            <FieldValue>{phone ? Mask.setMaskPhoneValue(phone) : phone}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiTruck size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Carro</FieldLabel>
            <FieldValue>
              {carModel} - {carBrand}
            </FieldValue>
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
            <FiTag size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Placa</FieldLabel>
            <FieldValue>{carPlate}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiMapPin size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Cidade</FieldLabel>
            <FieldValue>{city}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiDroplet size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Cor</FieldLabel>
            <FieldValue>{carColor}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiCalendar size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Ano</FieldLabel>
            <FieldValue>{carYear}</FieldValue>
          </Field>
        </FieldRow>
      </SectionFieldsGrid>
    </SectionCard>
  );
};
