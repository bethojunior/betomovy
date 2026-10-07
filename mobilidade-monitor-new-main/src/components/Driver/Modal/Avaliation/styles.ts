import { Button, Modal } from "antd";
import styled from "styled-components";

export const Content = styled(Modal)`
  .ant-modal-body {
    padding-top: 0px !important;
    padding-right: 10px !important;
    padding-left: 10px !important;
    padding-bottom: 0 !important;
  }

  @media (max-width: 800px) {
    .ant-modal-body {
      padding: 10px !important;
    }
  }
`;

export const AvaliationGlobal = styled.div`
  overflow-y: scroll !important;
  margin: 0px;
  height: 360px;
`;

export const ButtonDetailsTrip = styled.a`
  text-align: right;
`;

export const ContainerOfAvaliation = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  border-bottom: 1px solid #e9e9e9;
  height: auto;

  &:last-child {
    border: none;
    margin-bottom: -20px !important;
  }

  @media (max-width: 800px) {
    flex-direction: column;
    text-align: center;
    padding: 10px;
  }
`;

export const DataOfAvaliation = styled.div`
  padding: 10px;
  width: 65%;

  @media (max-width: 800px) {
    width: 100%;
    padding: 0 !important;
  }
`;

export const MoreDetailsButton = styled(Button)`
  align-self: flex-end;

  @media (max-width: 800px) {
    margin-left: 50px;
  }
`;

export const AvaliationItem = styled.p`
  margin-bottom: 0;

  &:first-child {
    font-size: 19px;
  }
`;

export const AvaliationConatinerData = styled.div`
  display: flex;
  flex-direction: row;
`;

export const AvaliationDataItem = styled.p`
  margin-left: 3px;
  margin-bottom: 0;
`;

export const AvaliationStarContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 10px;
  width: 35%;

  @media (max-width: 800px) {
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
    padding: 0;
  }
`;

export const ContentButton = styled.div`
  width: 100%;
  display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
  justify-content: center;
`;
