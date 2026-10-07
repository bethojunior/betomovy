import styled from "styled-components";

import { constants } from "../../../../../../../pages/Advanced/Configs/ModulesActives/constants";

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;

export const NameUser = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-weight: bold;

  > span:nth-child(1) {
    font-size: 12px;
  }

  > span:nth-child(2) {
    font-size: 16px;
  }
`;

export const ContentImgUser = styled.div``;

export const ImgUser = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 360px;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.4);
`;

export const Body = styled.div`
  padding: 0.5rem;
`;

export const ButtonLocalization = styled.button<{
  backgroundColor: string;
  colorIcon: string;
}>`
  position: absolute;
  left: 5%;
  top: 40%;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border: none;
  border-radius: 360px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ colorIcon }) => colorIcon};
`;

export const ModalSearchTrip = styled.div`
  background-color: ${constants.colors.text};
  height: 235px;
  position: absolute;
  bottom: 0px;
  border-radius: 15px 15px 20px 20px;
  padding: 1rem 0.8rem;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
`;

export const HeaderModalSearchTrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const IconNotifications = styled.button`
  background: none;
  border: none;
  font-size: 23px;
`;

export const ContentInputSearch = styled.div`
  margin: 1rem 0;
  position: relative;
`;

export const InputSearch = styled.input<{ colorBorder: string }>`
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: none;
  font-size: 12px;
  border: 1px solid ${({ colorBorder }) => colorBorder};
`;

export const ButtonMicPhone = styled.button<{ colorIcon: string }>`
  width: 35px;
  height: 35px;
  padding: 0.5rem;
  border: none;
  border-radius: 360px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -1.9px;
  right: -6px;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  color: ${({ colorIcon }) => colorIcon};
`;

export const ContainerModules = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  overflow: auto;
  height: 100%;
  height: 100px;

  ::-webkit-scrollbar {
    width: 3px !important;
    height: 10px;
    display: block !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #5c5c5c !important;
    border-radius: 5px !important;
  }
`;
