import styled from "styled-components";
import { Input, Select } from "antd";

export const ContentModalEdit = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 68vh;
  overflow-y: auto;
  padding: 4px 6px;

  ::-webkit-scrollbar {
    width: 6px !important;
    height: 6px;
    display: block !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #cbd5e1 !important;
    border-radius: 6px !important;
  }
  ::-webkit-scrollbar-track {
    background: #f8fafc !important;
  }
`;

export const WizardHeaderBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 18px;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

export const WizardHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const WizardHeaderIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(2, 132, 199, 0.2);
  border: 1px solid rgba(2, 132, 199, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #38bdf8;
  font-size: 22px;
  flex-shrink: 0;
`;

export const WizardHeaderTitle = styled.div`
  h2 {
    color: #ffffff;
    font-size: 17px;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
    letter-spacing: -0.2px;
  }
  p {
    color: #94a3b8;
    font-size: 12px;
    margin: 3px 0 0 0;
  }
`;

export const WizardHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StepsContainer = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 20px;

  .ant-steps-item-process .ant-steps-item-icon {
    background: #0284c7;
    border-color: #0284c7;
  }
  .ant-steps-item-finish .ant-steps-item-icon {
    border-color: #0284c7;
  }
  .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
    color: #0284c7;
  }
  .ant-steps-item-title {
    font-size: 13px !important;
    font-weight: 600;
  }
  .ant-steps-item-subtitle {
    font-size: 11px !important;
    color: #64748b !important;
  }
`;

export const FormCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

export const FormSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;

  svg {
    font-size: 18px;
    color: #0284c7;
  }

  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
    letter-spacing: -0.2px;
  }

  span {
    font-size: 12px;
    color: #64748b;
    margin-left: auto;
  }
`;

export const FormGrid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: ${({ columns }) =>
    columns ? `repeat(${columns}, 1fr)` : "repeat(auto-fit, minmax(220px, 1fr))"};
  gap: 14px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;

  .ant-input,
  .ant-select-selector {
    border-radius: 8px !important;
    font-size: 13.5px !important;
    transition: all 0.2s ease;
  }

  .ant-input:focus,
  .ant-select-focused .ant-select-selector {
    border-color: #0284c7 !important;
    box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15) !important;
  }
`;

export const FieldLabel = styled.label`
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const FieldError = styled.span`
  color: #ef4444;
  font-size: 11.5px;
  margin-top: 3px;
  font-weight: 500;
`;

export const PhotoManagerCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 18px 14px;
  margin-bottom: 18px;

  .ant-image {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    border: 2px solid #ffffff;
  }

  @media (min-width: 769px) {
    flex-direction: row;
    gap: 20px;
    align-items: center;
  }
`;

export const PhotoActionsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  width: 100%;

  @media (min-width: 769px) {
    margin-top: 0;
    width: auto;
    flex: 1;
  }

  .ant-btn {
    border-radius: 8px;
    font-weight: 500;
    font-size: 12.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
`;

export const StatusPill = styled.div<{ status?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  margin-bottom: 10px;

  ${({ status }) => {
    switch (status) {
      case "ATIVO":
        return `
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #bbf7d0;
        `;
      case "BLOQUEADO":
        return `
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        `;
      case "PENDENTE":
      case "AGUARDANDO RESPOSTA":
        return `
          background: #fef3c7;
          color: #b45309;
          border: 1px solid #fde68a;
        `;
      default:
        return `
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        `;
    }
  }}
`;

export const SummaryOverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

export const SummaryCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;

  &:hover {
    border-color: #0284c7;
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08);
  }
`;

export const SummaryCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;

  h4 {
    margin: 0;
    font-size: 13.5px;
    font-weight: 700;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 8px;

    svg {
      color: #0284c7;
    }
  }
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  font-size: 12.5px;
  border-bottom: 1px dashed #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  span.label {
    color: #64748b;
    font-weight: 500;
  }

  span.val {
    color: #1e293b;
    font-weight: 600;
    text-align: right;
    max-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const FooterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 10px;
`;

export const FooterActionsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

// Legacy exports kept for backward compatibility
export const ModalEditSection = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

export const ModalEditSectionImage = styled.div`
  display: flex;
  justify-content: top;
  flex-direction: column;
  align-items: center;
  margin-right: 50px;
`;

type StatusDriverProps = {
  status: string | undefined;
};

type TypeColorsStatus = {
  [key: string]: string;
};

const colorsStatus: TypeColorsStatus = {
  ATIVO: "green",
  PENDENTE: "#ffd456",
  BLOQUEADO: "#ff2020",
  "AGUARDANDO RESPOSTA": "#ffd456",
  BLACKLIST: "black",
};

export const ModalEditStatusDriver = styled.p<StatusDriverProps>`
  background-color: ${({ status }) => colorsStatus[status || ""]};
  border-radius: 5px;
  text-align: center;
  width: 60%;
  padding: 1px;
  color: ${({ status }) => (status === "ATIVO" ? "white" : "black")};
  margin-bottom: 10px;
`;

export const ModalEditSectionInformation = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ModalEditSectionAddress = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 2px;
`;

export const SectionInformation = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
  & > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-right: 20px;
  }
  & > div:last-child {
    margin-right: 0;
  }
`;

export const ModalEditLabel = styled.p`
  margin-bottom: 0px;
  margin-top: 2px;
`;

export const InputPhone = styled(Input)``;

export const SelectModalEdit = styled(Select)`
  width: 100%;
`;
