import styled from "styled-components";
import { Button, Select } from "antd";

export const Container = styled.div``;

export const ContentTable = styled.div`
  width: 100%;

  overflow: auto;

  td {
    background-color: #ffffff;
  }

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

export const ContentBtnActions = styled.div`
  display: flex;
  align-items: center;
`;

export const DriverLogoImage = styled.img`
  height: 60px;
  width: 60px;
`;

export const NewTypeDriverButton = styled(Button)`
  margin-bottom: 10px;
`;

export const EditActionButton = styled(Button)`
  svg {
    font-size: 20px;
  }
`;

export const DeleteActionButton = styled(Button)`
  color: #ff4d4f !important;

  &:hover,
  &:focus {
    color: #ff4d4f !important;
  }

  svg {
    color: #ff4d4f;
    font-size: 20px;
  }
`;

export const TransferDriverTypeSelect = styled(Select)`
  width: 100%;
`;
