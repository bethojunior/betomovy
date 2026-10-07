import styled from "styled-components";

export const Container = styled.div`
  input[type="color"] {
    border: none;
    background: none;
    cursor: pointer;
    width: 50px;
    height: 30px;

    ::-webkit-color-swatch {
      width: 100%;
      height: 100%;
    }
  }
`;

export const ContentButtonAddConfig = styled.div`
  margin: 1rem 0;
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
  justify-content: flex-end;
  gap: 0.5rem;
`;

export const ContentPagination = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;
