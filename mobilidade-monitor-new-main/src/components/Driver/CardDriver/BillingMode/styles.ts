import styled from "styled-components";
import { Checkbox } from "antd";
import { theme_colors } from "../../../../theme/theme";
import { LabelText, SectionCard } from "../styles";

export const BillingCard = styled(SectionCard)`
  min-width: 240px;
`;

export const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PrepaidLabel = styled(LabelText)`
  margin-left: 2px;
`;

export const ContentFormsPayments = styled.div`
  width: 100%;
`;

export const PaymentFormRow = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #000000;
  font-size: 14px;
  font-weight: 700;

  &:disabled {
    color: ${theme_colors.gray};
    cursor: not-allowed;
  }
`;

export const PaymentFormRowLeft = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ContentTable = styled.div`
  margin-top: 0.75rem;

  @media (max-width: 768px) {
    text-align: start;
  }
`;

export const THeader = styled.thead`
  background-color: #000000;

  th {
    text-align: left;
    font-weight: normal;
    font-size: 14px;
    padding: 0.5rem;
    color: ${theme_colors.white};
  }
`;

export const TBody = styled.tbody`
  tr {
    width: 100%;
  }
  td {
    padding: 0.5rem;
    font-size: 15px;
  }
`;

export const PaymentFormTable = styled.table`
  width: 100%;
`;

export const PaymentCheckbox = styled(Checkbox)`
  margin-right: 10px;
`;
