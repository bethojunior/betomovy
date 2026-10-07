import { Table } from "antd";
import styled from "styled-components";
import { theme_colors } from "../../../../../../theme/theme";

export const Container = styled.div`
  margin: 1rem 0;
`;

export const ContentTable = styled.div`
  overflow: auto;

  td {
    background-color: ${theme_colors.white};
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

export const TableUsers = styled(Table)`
  .ant-pagination-options {
    display: none;
  }

  .ant-pagination {
    display: flex;
    justify-content: flex-start;
  }

  @media (max-width: 800px) {
    width: 100%;

    .ant-pagination {
      justify-content: center;
    }
  }
`;
