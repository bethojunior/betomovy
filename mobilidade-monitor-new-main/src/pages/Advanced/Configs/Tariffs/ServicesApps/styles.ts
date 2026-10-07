import styled from "styled-components";
import { Input as InputAntd } from "antd";
import { theme_colors } from "../../../../../theme/theme";
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
  margin: 1rem 0;

  @media (max-width: 920px) {
    flex-direction: column;
    align-items: center;
    border: none;
    gap: 1rem;
    height: 400px;
    margin-bottom: 0.8rem;
  }
`;

export const Input = styled(InputAntd)`
  max-width: 200px;
  width: 100%;
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
  background-color: ${theme_colors.primary_antd};
  color: ${theme_colors.white};
  border: none;
  font-size: 18px;
  @media (max-width: 920px) {
    width: 100%;
    padding: 2rem;
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
  background-color: ${(props) => (props.selected ? theme_colors.pale_mint : theme_colors.white)};
  opacity: ${(props) => (props.selected ? 1 : 0.5)};

  @media (max-width: 920px) {
    max-width: 100%;
    border-right: none;
    border-bottom: 1px solid gray;
  }

  @media (max-width: 425px) {
    padding: 1rem 0;
    gap: 20px;
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
  justify-content: center;

  background-color: ${theme_colors.white};
  border: 0.5px solid ${theme_colors.light_gray};
  margin: 0.2rem 0;

  @media (max-width: 920px) {
    flex-direction: column;
  }
`;

export const ConfigDetailsTariffs = styled.div`
  flex: 1;

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
  background-color: ${theme_colors.teal_green};
  color: ${theme_colors.white};
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;

  @media (max-width: 920px) {
    font-size: 14px;
  }
`;

export const ContentLogoApp = styled.div`
  text-align: center;
  flex: 1;
  padding: 2rem 0;
`;

export const ImageLogoApp = styled.img`
  width: 200px;
  mix-blend-mode: multiply;

  @media (max-width: 920px) {
    width: 50%;
  }
`;

export const ContentPricePolicy = styled.div`
  border: 1px solid ${theme_colors.light_gray};
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
  font-size: 14px;

  @media (max-width: 450px) {
    font-size: 12px;
  }
`;

export const InputText = styled.input`
  width: 100%;
  padding: 0.3rem 1rem;
  border: 1px solid ${theme_colors.light_gray};
  border-radius: 10px;
  flex: 1;

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
  margin: 1rem 0;
`;

export const THead = styled.thead`
  width: 100%;
  border-top: 1px solid ${theme_colors.black};
  border-bottom: 1px solid ${theme_colors.black};
  text-align: left;

  th {
    padding: 0.5rem;
  }
`;
export const TBody = styled.tbody`
  text-align: left;
  background-color: ${theme_colors.gray};
  th {
    padding: 0.5rem;
  }
`;

export const ButtonDelete = styled.button`
  background-color: ${theme_colors.red_crismon};
  color: ${theme_colors.red_crismon};
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
  background-color: ${theme_colors.midnight_blue};
  color: ${theme_colors.white};
  padding: 0.5rem 0.8rem;
  border-radius: 5px;
`;

export const ButtonClosePrices = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme_colors.red_crismon};
`;

export const Select = styled.select`
  padding: 0.3rem 0.8rem;
`;

export const Button = styled.button<ButtonProps>`
  background-color: ${(props) => props.color};
  color: ${theme_colors.white};
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