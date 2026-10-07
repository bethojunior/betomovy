import styled from "styled-components";
import { Button, Table } from "antd";
import { MdMoneyOff } from "react-icons/md";
import Whatsapp from "../../../assets/whatsappIcon.svg";

export const BodyTable = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const TableContainer = styled.div`
  width: 90%;
`;

export const TableList = styled(Table)`
  .ant-table-pagination > * {
    display: none;
  }
`;

export const TableButtonsContainer = styled.div`
  margin-top: -15px;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

export const LeftButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;

export const RightButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
`;

export const SocialButton = styled.a`
  background: transparent;
  border: none;
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

export const ContentButtons = styled.div`
  display: flex;
  align-items: center;
`;

export const ButtonDeleteCancellationFee = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding-top: 0.4rem;
`;
