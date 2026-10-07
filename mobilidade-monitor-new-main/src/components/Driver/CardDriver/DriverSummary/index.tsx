import {
  FiBarChart2,
  FiStar,
  FiLock,
  FiCreditCard,
  FiMinusCircle,
  FiSmartphone,
  FiMonitor,
  FiClock,
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
} from "../styles";
import { DriverSummaryProps } from "./types";
import { PlatformInfo } from "../../../Utils/PlatformInfo";
import Utils from "../../../../utils/Utils";

const formatCurrency = (value: number | null | undefined) =>
  (value ?? 0).toLocaleString("pt-br", { style: "currency", currency: "BRL" });

export const DriverSummary = ({
  rating,
  blockedBalance,
  balance,
  maximumAmountNegativeBalanceDriver,
  appVersion,
  platform,
  hours_worked,
  hours_open,
}: DriverSummaryProps) => {
  return (
    <SectionCard>
      <SectionTitleRow>
        <FiBarChart2 size={18} />
        Resumo financeiro e operacional
      </SectionTitleRow>
      <SectionFieldsGrid>
        <FieldRow>
          <FieldIcon>
            <FiStar size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Pontuação</FieldLabel>
            <FieldValue>{rating}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiLock size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Saldo bloqueado</FieldLabel>
            <FieldValue>{formatCurrency(blockedBalance)}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiCreditCard size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Saldo disponível</FieldLabel>
            <FieldValue>{formatCurrency(balance)}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiMinusCircle size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Limite de saldo negativo</FieldLabel>
            <FieldValue>
              {maximumAmountNegativeBalanceDriver != null
                ? formatCurrency(maximumAmountNegativeBalanceDriver)
                : "-"}
            </FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiSmartphone size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Versão do App</FieldLabel>
            <FieldValue>{appVersion || "-"}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiMonitor size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Sistema Operacional</FieldLabel>
            <FieldValue>
              <PlatformInfo platform={platform} />
            </FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiClock size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Horas trabalhadas</FieldLabel>
            <FieldValue>{Utils.convertMinutesToHours(hours_worked)}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiClock size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Horas limite</FieldLabel>
            <FieldValue>{Utils.convertMinutesToHours(hours_open)}</FieldValue>
          </Field>
        </FieldRow>
      </SectionFieldsGrid>
    </SectionCard>
  );
};
