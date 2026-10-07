import styled from "styled-components";

export const Container = styled.div``;

export const ContentInput = styled.div``;

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

export const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin-top: 1rem;

  max-width: 150px;

  @media (max-width: 425px) {
    max-width: 100%;
  }
`;
