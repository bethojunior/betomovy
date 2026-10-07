import styled from "styled-components";

export const Container = styled.div``;

export const Content = styled.div`
  padding: 0.5rem 0.8rem;
  overflow: auto;
`;

export const ContentHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

export const ContentBody = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  margin: 1rem 0;

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

export const ContentCitiesAndDrivers = styled.div`
  width: 100%;
`;

export const ContentBtnSearch = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const ButtonSearch = styled.button`
  padding: 0.5rem 0.8rem;
  border-radius: 5px;
  border: none;
  background-color: #27283c;
  color: #ffffff;
`;

export const ContentTable = styled.table`
  width: 100%;
  overflow: auto;

  ::-webkit-scrollbar {
    display: block;
    width: 2px;
  }

  ::-webkit-scrollbar-thumb {
    background: #d3d3d3;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #bdbdbd;
  }
`;
