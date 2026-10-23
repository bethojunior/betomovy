import styled from "styled-components";
import { Checkbox } from "antd";
import { theme_colors } from "../../../../theme/theme";
import { LabelText, SectionCard } from "../styles";

export const BillingCard = styled(SectionCard)`
  flex: 1 1 240px;
  min-width: 240px;
`;

export const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
`;

export const PrepaidLabel = styled(LabelText)`
  font-size: 13px;
  font-weight: 600;
  color: #334155;
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
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  color: #0f172a;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f9ff;
    border-color: #0284c7;
    color: #0284c7;
  }

  &:disabled {
    color: ${theme_colors.gray};
    cursor: not-allowed;
    background: #f1f5f9;
  }
`;

export const PaymentFormRowLeft = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #0284c7;
  }
`;

export const ContentTable = styled.div`
  margin-top: 0.75rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    text-align: start;
  }
`;

export const THeader = styled.thead`
  background-color: #0f172a;

  th {
    text-align: left;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.35px;
    padding: 8px 10px;
    color: #ffffff;
  }
`;

export const TBody = styled.tbody`
  tr {
    width: 100%;
    border-bottom: 1px solid #e2e8f0;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: #f8fafc;
    }
  }
  td {
    padding: 8px 10px;
    font-size: 13px;
    color: #334155;
  }
`;

export const PaymentFormTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const PaymentCheckbox = styled(Checkbox)`
  margin-right: 10px;
`;
