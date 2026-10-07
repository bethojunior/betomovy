import styled from "styled-components";
import { Button } from "antd";

export const Content = styled.div`
  .ant-table-tbody > tr > td {
    background-color: #ffffffff;
  }

  @media (max-width: 425px) {
    margin: 0 0.5rem;
  }
`;

export const LabelText = styled.p`
  font-size: 18px;
  margin: 0.5rem 0;
`;

export const ContentPaginate = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 1rem;
`;

export const ButtonPage = styled(Button)`
  align-items: center;
  justify-content: center;
  display: flex;
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
`;
