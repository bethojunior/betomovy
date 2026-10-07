import styled from "styled-components";

export const Container = styled.div``;

export const ContentBtnAddCallGroup = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 10px 0;
`;

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

export const ContentActions = styled.div`
    display: flex;
    gap: 10px;
`;