import styled from "styled-components";
import { Table } from "antd";

export const Container = styled.div`
  padding: 20px;
  background: #f5f5f5;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const StyledTable = styled(Table)<any>`
  .ant-table-thead > tr > th {
    background: #f5f5f5;
    color: #000;
    font-weight: bold;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 10px;

  .ant-btn {
    background: none;
    border: none;
    box-shadow: none;
  }

  .ant-btn:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
