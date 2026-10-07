import styled from "styled-components";

export const Container = styled.div`
  margin: 1rem 0;
`;

export const Content = styled.div``;

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

export const ContentButtonNewDynamicArea = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;

export const LabelSwitch = styled.p`
  margin: 0;
`;
