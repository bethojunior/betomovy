import styled from "styled-components";

export const Container = styled.div``;

export const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 425px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const ContentInput = styled.div`
  max-width: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ContentBtnHeader = styled.div`
  max-width: 300px;
  width: 100%;
`;

export const ContentTable = styled.div`
  overflow: auto;

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

export const ContentPagination = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ContentButtonsActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
`;
