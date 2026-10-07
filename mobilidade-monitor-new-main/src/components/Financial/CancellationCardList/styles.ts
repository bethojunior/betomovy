import { MdMoneyOff } from "react-icons/md";
import styled from "styled-components";
import Whatsapp from "../../../assets/whatsappIcon.svg";

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const CardList = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  padding: 10px;
  margin-bottom: 30px;
`;

export const ColumnCard = styled.div`
  width: 100%;
  display: flex;
  white-space: nowrap;
`;

export const LabelCard = styled.p`
  margin-bottom: 0px;
`;

export const ItemCard = styled.p`
  margin-bottom: 0px;
  margin-left: 4px;
  font-weight: bold;

  overflow: hidden;
  text-overflow: ellipsis !important;
  -webkit-line-clamp: 1;
`;

export const SocialRede = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const SocialButton = styled.a`
  background: transparent;
  border: none;
`;

export const MoneyButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background: transparent;
  border-radius: 18px;
`;

export const CashIcon = styled(MdMoneyOff)`
  color: red;
  font-size: 24px;
`;

export const WhatsappIcon = styled.div`
  background-image: url(${Whatsapp});
  background-size: cover;
  width: 25px;
  height: 25px;
  border: 0;
  border-radius: 50%;
  margin-right: 5px;
`;

export const ButtonDeleteCancellationFee = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding-top: 0.4rem;
`;
