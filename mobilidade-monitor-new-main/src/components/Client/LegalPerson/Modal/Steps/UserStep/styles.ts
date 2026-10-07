import styled from "styled-components";
import { Input, Select } from "antd";
import { theme_colors } from "../../../../../../theme/theme";

export const UserStepBody = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
`;

export const Label = styled.p`
  margin-bottom: 0;
  margin-top: 5px;
`;

export const TwoSelects = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const MiddleSelectContainer = styled.div`
  width: 45%;
`;

export const ButtonContainer = styled.div`
  width: 45%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

export const InputEdit = styled(Input)`
  color: #202020;
`;

export const SelectState = styled(Select)`
  width: 100%;
`;

export const WorkersContainer = styled.div`
  height: 140px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #acacac;
  padding: 10px;
  overflow-y: auto !important;

  ::-webkit-scrollbar {
    width: 7px !important;
    display: block !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }
`;

export const WorkersCard = styled.div`
  background-color: #f5f5f5;
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const InfoCard = styled.div`
  @media (max-width: 800px) {
    width: 90%;
  }
`;

export const LabelWorker = styled.p`
  margin-bottom: 0px;
`;

export const ItemWorker = styled.p`
  margin-bottom: 0;
  margin-left: 4px;
  font-weight: bold;
  @media (max-width: 800px) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis !important;
    -webkit-line-clamp: 1;
  }
`;

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  font-size: 24px;
  color: ${theme_colors.red_crismon};
`;

export const ContentButtonStep = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
  gap: 1rem;
`;
