import { Checkbox } from "antd";
import styled from "styled-components";

interface ActionButtonProps {
  color: string;
}

export const Body = styled.div`
  margin: 1rem 0;
`;

export const AddButtonContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

export const ContainerNoData = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

export const ColumnActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ColumnCheckbox = styled(Checkbox)``;

export const ActionButton = styled.p<ActionButtonProps>`
  margin-bottom: 0;
  font-size: 20px;
  cursor: pointer;
  color: ${({ color }) => color};
`;

export const ContentTable = styled.div`
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

  td {
    background-color: #ffffff;
  }
`;
