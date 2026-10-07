import styled from "styled-components";

export const Container = styled.div`
  margin: 1rem 0;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
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

  .ant-table-tbody > tr > td {
    background-color: #ffffffff;
  }

  @media (max-width: 550px) {
    th {
      font-size: 12px;
    }

    td {
      font-size: 12px;
    }
  }
`;

export const ContentButtonNewData = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;

export const ButtonNewData = styled.button`
  color: #ffffff;
  padding: 10px;
  background-color: #0069d9;
  float: right;
  border: none;
  border-radius: 5px;
  margin-bottom: 1rem;
  font-size: 16px;
`;

export const ButtonDeleteItem = styled.button`
  background-color: #dc143c;
  color: #ffffff;
  border: none;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
`;
