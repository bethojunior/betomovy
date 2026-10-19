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
`;

export const ContentTypesTravels = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 920px) {
    flex-direction: column;
    align-items: center;
    border: none;
    gap: 1rem;
    height: 400px;
    margin-bottom: 0.8rem;
  }
`;

export const ContentListTypesTravels = styled.div`
  display: flex;
  flex: 2;

  @media (max-width: 920px) {
    width: 100%;
    flex-direction: column;
    overflow: auto;
  }
`;

export const ButtonAddNewTariff = styled.button`
  width: 250px;
  min-height: 125px;
  background-color: #1e88e5;
  color: #ffffff;
  border: none;
  font-size: 18px;
  @media (max-width: 920px) {
    width: 100%;
    padding: 2rem;
  }

  @media (max-width: 425px) {
    padding: 0.5rem;
  }
`;

export const CardTariff = styled.div<CardTariffProps>`
  width: 100%;
  max-width: 300px;
  text-align: center;
  border: 1px solid gray;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.selected ? "#d6edc4" : "#ffffff")};
  opacity: ${(props) => (props.selected ? 1 : 0.5)};

  @media (max-width: 920px) {
    max-width: 100%;
    border-right: none;
    border-bottom: 1px solid gray;
  }

  @media (max-width: 425px) {
    padding: 1rem 0;
    gap: 5px;
    h3 {
      margin: 0.5rem 0;
    }
  }
`;

export const ImageTariff = styled.img`
  width: 40%;
  max-width: 100px;

  @media (max-width: 425px) {
    width: 60px;
  }
`;

export const TitleCardTariff = styled.h3`
  font-size: 16px;
`;

export const TextCardTariff = styled.span`
  font-size: 16px;
`;

export const ContentDetailsTariffs = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #ffffff;
  border: 0.5px solid #d3d3d3;
  margin: 0.2rem 0;

  @media (max-width: 920px) {
    flex-direction: column;
  }
`;

export const ConfigDetailsTariffs = styled.div`
  flex: 1;
  height: 600px;

  /* ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  } */

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
  flex: 1;
  display: flex;
  justify-content: center;
`;

export const ImageLogoApp = styled.img`
  width: 200px;
  mix-blend-mode: multiply;

  @media (max-width: 920px) {
    width: 50%;
  }
`;

export const ContentPricePolicy = styled.div`
  border: 1px solid #ccc;
  padding: 1rem;

  > h2 {
    text-align: center;
  }

  @media (max-width: 920px) {
    > h2 {
      font-size: 16px;
    }
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
`;

export const LabelText = styled.p`
  margin: 0;
  flex: 1;
  @media (max-width: 450px) {
    font-size: 12px;
  }
`;

export const InputText = styled.input`
  width: 100%;
  padding: 0.3rem 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  flex: 1;

  &:disabled {
    background-color: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }

  @media (max-width: 450px) {
    width: 70px;
  }
`;

export const ContentInputs = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin: 2rem 0;

  @media (max-width: 450px) {
    gap: 0.5rem;
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
