import {
  FiMonitor,
  FiSmartphone,
  FiCheckSquare,
  FiXCircle,
  FiGift,
  FiDollarSign,
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
} from "../../../../Utils/EntityCard/styles";
import { PlatformInfo } from "../../../../Utils/PlatformInfo";
import { ClientSummaryProps } from "./types";

const formatCurrency = (value: number | null | undefined) =>
  (value ?? 0).toLocaleString("pt-br", { style: "currency", currency: "BRL" });

export const ClientSummary = ({
  platform,
  appVersion,
  quantityTripsFinished,
  quantityTripsCancelled,
  voucherBalance,
  comission,
}: ClientSummaryProps) => {
  return (
    <SectionCard>
      <SectionTitleRow>
        <FiMonitor size={18} />
        Resumo financeiro e operacional
      </SectionTitleRow>
      <SectionFieldsGrid>
        <FieldRow>
          <FieldIcon>
            <FiMonitor size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>SO smartphone</FieldLabel>
            <FieldValue>
              <PlatformInfo platform={platform} />
            </FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiSmartphone size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Versão App</FieldLabel>
            <FieldValue>{appVersion || "Não informado"}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiCheckSquare size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Viagens finalizadas</FieldLabel>
            <FieldValue>{quantityTripsFinished}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiXCircle size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Viagens canceladas</FieldLabel>
            <FieldValue>
              {quantityTripsCancelled ?? "Não informado"}
            </FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiGift size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Voucher</FieldLabel>
            <FieldValue>{formatCurrency(voucherBalance)}</FieldValue>
          </Field>
        </FieldRow>
        <FieldRow>
          <FieldIcon>
            <FiDollarSign size={16} />
          </FieldIcon>
          <Field>
            <FieldLabel>Saldo atual</FieldLabel>
            <FieldValue>{formatCurrency(comission)}</FieldValue>
          </Field>
        </FieldRow>
      </SectionFieldsGrid>
    </SectionCard>
  );
};
