import styled from "styled-components";
import { Input, Select, Radio, Alert, Menu, Button } from "antd";
import Lottie from "lottie-react";

const { Search } = Input;

type AlertProps = {
  visible: boolean;
};

export const AlertSuccess = styled(Alert)<AlertProps>`
  display: ${(props) => (props.visible ? "" : "none")};
  position: absolute;
  width: 300px;
  right: 0;
`;

export const AlertError = styled(Alert)<AlertProps>`
  display: ${(props) => (props.visible ? "" : "none")};
  position: absolute;
  width: 300px;
  right: 0;
`;

export const ItemMenuSettings = styled(Menu.Item)`
  margin-top: -5px;
`;

export const ItemMenuSettingsDanger = styled(Menu.Item)`
  margin-top: -5px;
  color: #ff4d4f;
`;

export const InstructionsLottie = styled(Lottie)`
  width: 30%;
`;

export const ShowMoreButton = styled(Button)`
  margin-top: 10px;
  margin-bottom: 5px;
`;

export const Researches = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  margin-top: 10px;
  margin-left: 20px;
  width: 95%;
  border-bottom: solid #e0e0e0;
  padding-bottom: 20px;
  border-width: 1px;

  @media (max-width: 800px) {
    flex-direction: column;
    margin-left: 0;
    width: 98%;
  }
`;

export const Div = styled.div`
  width: 90%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`;

export const SearchLabel = styled.p`
  margin-bottom: 0;
`;

export const SearchInput = styled(Search)`
  .ant-input {
    width: 100%;
  }

  @media (max-width: 800px) {
    width: 100%;
  }
`;

export const StatusLabel = styled.p`
  margin: 0;
  margin-left: 50px;
  @media (max-width: 800px) {
    margin-top: 10px;
    font-size: 15px;
    margin-left: 0;
  }
`;

export const SelectList = styled(Select)`
  margin-left: 50px;
  width: 40%;
  max-width: 230px;
  .ant-select-selector {
    display: flex;
    align-items: center;
  }
  @media (max-width: 800px) {
    display: flex;
    width: 100%;
    margin-left: 0;
  }
`;

export const SelectListStatus = styled(SelectList)`
  width: 200px;
  margin-right: 30px;
`;

export const AllRadios = styled.div`
  margin-left: 2px;
  margin-top: 5px;
  white-space: nowrap;
  @media (max-width: 800px) {
    width: 100%;
    margin-left: 10px;
  }
`;

export const Radios = styled(Radio)`
  white-space: nowrap;
  @media (max-width: 800px) {
    font-size: 15px;
  }
`;

export const ContainerClient = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
  @media (max-width: 800px) {
    width: 95%;
    margin-top: 5%;
    margin-bottom: 5%;
  }
`;

export const Body = styled.div`
  flex-direction: column;
  width: 100%;
  @media (max-width: 800px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const MsgObservation = styled.p`
  margin-top: 20px;
  color: gray;
  margin-left: 1rem;

  @media (max-width: 500px) {
    font-size: 14px;
  }
`;

export const ContentIconSearch = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const ContentInstructionsSearch = styled.div`
  display: flex;
  justify-content: center;
  > div {
    max-width: 600px;
    width: 100%;
  }
  span {
    display: block;
    margin: 0.5rem 0;
  }
  @media (max-width: 768px) {
    h3 {
      font-size: 16px;
    }
    span {
      font-size: 12px;
    }
    padding: 0 1rem;
  }
`;
