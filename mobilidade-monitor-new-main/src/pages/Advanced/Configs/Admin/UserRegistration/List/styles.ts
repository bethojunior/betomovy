import { Table } from "antd";
import styled from "styled-components";
import { theme_colors } from "../../../../../../theme/theme";

export const Container = styled.div`
  margin: 1rem 0;
`;

export const ContentTable = styled.div`
  overflow: auto;

  table {
    background-color: #ffffff;
  }

  th {
    background-color: #fafafa !important;
    color: #1f2937 !important;
    font-weight: 600 !important;
  }

  td {
    background-color: #ffffff !important;
    color: #111827 !important;
    font-size: 14px !important;
  }

  .ant-table-cell {
    color: #111827 !important;
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
  background-color: #ffffff;

  .ant-table {
    background-color: #ffffff;
    color: #111827;
  }

  .ant-table-thead > tr > th {
    background: #fafafa;
    color: #1f2937;
    font-weight: 600;
  }

  .ant-table-tbody > tr > td {
    background: #ffffff;
    color: #111827;
  }

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
