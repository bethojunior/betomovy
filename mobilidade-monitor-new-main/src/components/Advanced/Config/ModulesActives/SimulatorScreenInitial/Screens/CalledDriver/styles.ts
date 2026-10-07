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

export const ContentButtonsFloat = styled.div`
  width: 100%;
  position: absolute;
  top: 20%;

  display: flex;
  justify-content: space-between;
  padding-right: 1rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const ButtonFloat = styled.button<{
  backgroundColor: string;
  colorIcon: string;
}>`
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

export const ModalCalledTrip = styled.div`
  width: 100%;
  background-color: ${constants.colors.text};
  position: absolute;
  bottom: -5px;
  border-radius: 15px 15px 20px 20px;
  padding: 0.5rem;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
`;

export const HeaderModalTrip = styled.div`
  display: flex;
  justify-content: space-between;

  h3 {
    font-size: 14px;
    font-weight: bold;
    color: ${constants.colors.primary};
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
    font-size: 20px;
    color: crimson;
  }
`;

export const ContentInformationsClient = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ContentBonus = styled.div`
  margin-left: 1rem;
  > h3 {
    margin: 0;
    font-weight: bold;
  }
`;

export const ContentImgClient = styled.div`
  img {
    width: 35px;
    border-radius: 360px;
  }
`;

export const NameClient = styled.span`
  font-size: 12px;
  display: block;
`;

export const QntTrips = styled.span`
  font-size: 10px;
  display: block;
`;

export const Rating = styled.span`
  font-size: 10px;
  display: block;
`;

export const TypesServices = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  align-items: center;
`;

export const Label = styled.span`
  display: block;
  font-size: 12px;
`;

export const Item = styled.span`
  display: block;
  font-size: 10px;
  font-weight: bold;
`;

export const ContentValueTrip = styled.div`
  width: 80px;
  padding: 0.3rem 0.2rem;
  font-size: 14px;
  font-weight: bold;
  background-color: ${constants.colors.primary};
  color: ${constants.colors.text};
  border-radius: 5px;
  text-align: right;
`;

export const ContainerOriginDestiny = styled.div`
  position: relative;
  display: flex;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }
  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }
`;

export const ContentIconsOriginDestiny = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Ball = styled.div`
  width: 13px;
  height: 13px;
  background-color: ${constants.colors.primary};
  border-radius: 360px;
  align-self: flex-start;
  position: relative;
  z-index: 10;
`;

export const Squad = styled.div`
  width: 13px;
  height: 13px;
  background-color: ${constants.colors.primary};
  align-self: flex-end;
  z-index: 10;
`;

export const ContentOriginDestiny = styled.div`
  padding-left: 1rem;
  border-left: 3px dashed ${constants.colors.primary};
  position: relative;
  left: -0.55em;

  > div {
    margin: 0.3rem 0;
  }

  span {
    font-size: 10px;
    line-height: 15px;
    display: block;
  }

  strong {
    font-size: 12px;
    font-weight: bold;
  }
`;

export const ButtonSave = styled.button`
  margin-top: 0.3rem;
  width: 100%;
  background-color: ${constants.colors.primary};
  border: none;
  color: ${constants.colors.text};
  padding: 0.3rem 0;
  border-radius: 5px;
  font-size: 12px;
`;
