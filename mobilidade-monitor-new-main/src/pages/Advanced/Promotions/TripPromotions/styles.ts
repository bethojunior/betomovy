import styled from "styled-components";

export const Container = styled.div`
  margin: 1rem 0;
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

export const ContentPagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
  gap: 1rem;
`;

export const ContentBtnActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;