import styled from "styled-components";
import { Spin } from 'antd';

interface CardTariffProps {
  selected: boolean;
}

interface ButtonProps {
  color: string;
}

export const Container = styled.div`
  margin: 1rem;
  padding-bottom: 5rem;
  min-height: 100%;
`;

export const ContentTypesTravels = styled.div`
  display: flex;
  width: 100%;
  gap: 12px;
  align-items: stretch;
  margin-bottom: 1.25rem;
  overflow-x: auto;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  @media (max-width: 920px) {
    flex-direction: column;
    align-items: stretch;
    height: auto;
  }
`;

export const ContentListTypesTravels = styled.div`
  display: flex;
  flex: 1;
  gap: 12px;
  align-items: stretch;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  @media (max-width: 920px) {
    width: 100%;
    flex-direction: column;
  }
`;

export const ButtonAddNewTariff = styled.button`
  min-width: 170px;
  max-width: 190px;
  min-height: 140px;
  background: linear-gradient(135deg, #00349A 0%, #002166 100%);
  color: #ffffff;
  border: 1px solid rgba(4, 243, 250, 0.3);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 1rem;
  transition: all 0.25s ease-in-out;
  box-shadow: 0 4px 14px rgba(0, 52, 154, 0.2);

  &::before {
    content: "+";
    font-size: 28px;
    font-weight: 300;
    line-height: 1;
  }

  &:hover {
    background: #111111 !important;
    color: #ffffff !important;
    border-color: #04F3FA !important;
    box-shadow: 0 0 16px rgba(4, 243, 250, 0.5) !important;
    transform: translateY(-2px);
  }

  @media (max-width: 920px) {
    width: 100%;
    max-width: 100%;
    min-height: 52px;
    flex-direction: row;
    padding: 0.75rem;
  }
`;

export const CardTariff = styled.div<CardTariffProps>`
  min-width: 160px;
  max-width: 180px;
  min-height: 140px;
  text-align: center;
  border-radius: 12px;
  border: 1.5px solid ${(props) => (props.selected ? "#04F3FA" : "#E2E8F0")};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.85rem 0.5rem;
  background-color: ${(props) => (props.selected ? "#F0FDFA" : "#FFFFFF")};
  box-shadow: ${(props) =>
    props.selected
      ? "0 4px 16px rgba(4, 243, 250, 0.25)"
      : "0 2px 8px rgba(0, 0, 0, 0.04)"};
  transition: all 0.2s ease-in-out;
  opacity: 1;

  &:hover {
    border-color: #04F3FA;
    box-shadow: 0 4px 14px rgba(4, 243, 250, 0.2);
    transform: translateY(-2px);
  }

  @media (max-width: 920px) {
    max-width: 100%;
    min-width: 100%;
    min-height: 70px;
    flex-direction: row;
    justify-content: flex-start;
    gap: 1rem;
    padding: 0.75rem 1rem;
  }
`;

export const ImageTariff = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin-bottom: 6px;

  @media (max-width: 920px) {
    width: 42px;
    height: 42px;
    margin-bottom: 0;
  }
`;

export const TitleCardTariff = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
  line-height: 1.2;
`;

export const TextCardTariff = styled.span`
  font-size: 12px;
  color: #64748B;
  margin-top: 3px;
`;

export const ContentDetailsTariffs = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin: 1rem 0 3rem 0;
  padding: 1.5rem;
  gap: 2rem;

  @media (max-width: 920px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1.5rem;
  }
`;

export const ConfigDetailsTariffs = styled.div`
  flex: 1.6;
  width: 100%;

  @media (max-width: 920px) {
    width: 100%;
  }
`;

export const ContentListOptionsDetailsTariffs = styled.div``;

export const ContentButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
`;

export const ButtonActions = styled.button`
  background-color: #00349A;
  color: #ffffff;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0.9rem 2.2rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: all 0.25s ease-in-out;
  box-shadow: 0 4px 14px rgba(0, 52, 154, 0.25);

  &:hover {
    background-color: #111111 !important;
    color: #ffffff !important;
    border-color: #04F3FA !important;
    box-shadow: 0 0 16px rgba(4, 243, 250, 0.45) !important;
    transform: translateY(-1px);
  }

  @media (max-width: 920px) {
    font-size: 14px;
    padding: 0.75rem 1.25rem;
  }
`;

export const ContentLogoApp = styled.div`
  flex: 0 0 280px;
  max-width: 300px;
  display: flex;
  justify-content: center;
  position: sticky;
  top: 1.5rem;
  align-self: flex-start;

  @media (max-width: 1024px) {
    flex: 1;
    max-width: 100%;
    width: 100%;
    position: static;
    margin-top: 1.5rem;
  }
`;

export const ImageLogoApp = styled.img`
  width: 140px;
  max-width: 100%;
  mix-blend-mode: multiply;

  @media (max-width: 920px) {
    width: 120px;
  }
`;

export const ContentPricePolicy = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  > h2 {
    text-align: left;
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #f1f5f9;
  }

  @media (max-width: 920px) {
    padding: 1rem;
    > h2 {
      font-size: 15px;
    }
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.6rem 0.85rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #00349A;
  }
`;

export const LabelText = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  flex: 0 0 240px;
  max-width: 280px;

  @media (max-width: 768px) {
    flex: 1 1 100%;
    max-width: 100%;
  }
`;

export const InputText = styled.input`
  flex: 1;
  width: 100%;
  max-width: 100%;
  padding: 0.6rem 0.85rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
  background-color: #ffffff;
  outline: none;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);

  &:focus {
    border-color: #00349A;
    box-shadow: 0 0 0 3px rgba(0, 52, 154, 0.12);
  }

  &:disabled {
    background-color: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
    border-color: #e2e8f0;
  }

  @media (max-width: 450px) {
    width: 100%;
  }
`;

export const ContentInputs = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8fafc;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.4rem;
  }
`;

export const ContentTable = styled.div`
  overflow: auto;
`;

export const ContentCashbacks = styled.div`
  display: flex;
`;

export const ContentBtnSaveCashBack = styled.div`
  display: flex;
  justify-content: center;
`;

export const THead = styled.thead`
  width: 100%;
  border-top: 1px solid #000000;
  border-bottom: 1px solid #000000;
  text-align: left;

  th {
    padding: 0.5rem;
  }
`;
export const TBody = styled.tbody`
  text-align: left;
  background-color: #dddddd;
  th {
    padding: 0.5rem;
  }
`;

export const ButtonDelete = styled.button`
  background-color: #c82333;
  color: #ffffff;
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

export const ContentColumnInputs = styled.div`
  display: flex;
  flex-direction: column;

  div {
    margin: 0;
  }
`;

export const ButtonPriceRange = styled.button`
  background-color: #27283c;
  color: #ffffff;
  padding: 0.5rem 0.8rem;
  border-radius: 5px;
`;

export const ButtonClosePrices = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: red;
`;

export const Select = styled.select`
  padding: 0.3rem 0.8rem;
`;

export const Button = styled.button<ButtonProps>`
  background-color: ${(props) => props.color};
  color: #ffffff;
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 8px;
  margin: 1rem 0;
`;

export const Loader = styled(Spin)`
	display: flex;
	justify-content: center;
	margin-top: 30px;
`;

export const CustomOrderContainer = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

export const CustomOrderLabel = styled.span`
  font-weight: 500;
  color: #495057;
`;

export const CustomOrderSubmenu = styled.div`
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
`;

export const CustomOrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CustomOrderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 0.75rem;
`;

export const CustomOrderItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CustomOrderItemImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;
`;

export const CustomOrderItemText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CustomOrderItemName = styled.span`
  font-weight: 500;
  color: #495057;
`;

export const CustomOrderItemId = styled.span`
  font-size: 0.875rem;
  color: #6c757d;
`;

export const CustomOrderControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const CustomOrderButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

export const CustomOrderSaveButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background-color: #218838;
  }
`;

export const CustomOrderNewBadge = styled.span`
  color: #ff6b6b;
  font-size: 0.8em;
`;

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
`;

export const SwitchLabel = styled.p`
  margin: 0;
`;

// Stepper Navigation (Passo a Passo)
export const WizardStepper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1.75rem;
  background: #f8fafc;
  padding: 0.6rem 0.8rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  gap: 10px;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  &::-webkit-scrollbar {
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  @media (max-width: 920px) {
    gap: 6px;
    padding: 0.5rem;
  }
`;

export const WizardStepItem = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 8px;
  background: ${(props) =>
    props.active ? "#00349A" : props.completed ? "#e0f2fe" : "transparent"};
  color: ${(props) =>
    props.active ? "#ffffff" : props.completed ? "#00349A" : "#64748b"};
  font-weight: ${(props) => (props.active ? "700" : "600")};
  font-size: 13px;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;

  &:hover {
    background: ${(props) =>
      props.active ? "#002166" : props.completed ? "#bae6fd" : "#f1f5f9"};
  }
`;

export const WizardStepNumber = styled.span<{ active: boolean; completed: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background: ${(props) =>
    props.active ? "#04F3FA" : props.completed ? "#00349A" : "#cbd5e1"};
  color: ${(props) =>
    props.active ? "#002166" : props.completed ? "#ffffff" : "#ffffff"};
  font-weight: 700;
`;

export const WizardStepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-height: 380px;
`;

export const WizardStepTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const WizardNavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  gap: 1rem;
`;

export const WizardButtonPrev = styled.button`
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #e2e8f0;
    color: #0f172a;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const WizardButtonNext = styled.button`
  background: #00349A;
  color: #ffffff;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0.75rem 1.75rem;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 52, 154, 0.25);

  &:hover {
    background: #111111 !important;
    color: #ffffff !important;
    border-color: #04F3FA !important;
    box-shadow: 0 0 16px rgba(4, 243, 250, 0.5) !important;
    transform: translateY(-1px);
  }
`;

// Tela de Sucesso
export const SuccessScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  animation: fadeInStep 0.4s ease-in-out;

  @keyframes fadeInStep {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const SuccessIconBadge = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 40px;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
`;

export const SuccessTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
`;

export const SuccessSubtitle = styled.p`
  font-size: 15px;
  color: #64748b;
  max-width: 520px;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

export const SuccessSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 650px;
  margin-bottom: 2.5rem;
`;

export const SuccessSummaryCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SuccessSummaryLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const SuccessSummaryValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
`;

export const SummarySectionCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
`;
