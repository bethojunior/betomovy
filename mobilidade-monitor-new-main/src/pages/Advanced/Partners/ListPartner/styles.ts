import styled from "styled-components";
import { Modal } from "antd";

export const Container = styled.div`
  margin: 1rem 0;
`;

export const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ContentTable = styled.div`
  margin: 1rem 0;
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

export const CustomModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 10px;
    box-shadow: none;
    background-color: transparent;
  }
  .ant-modal-body {
    padding: 0;
    text-align: center;
    background-color: transparent;
  }
  
  .ant-modal-mask {
    background-color: rgba(0, 5, 5);
  }
`;

export const ContentBtnActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;
