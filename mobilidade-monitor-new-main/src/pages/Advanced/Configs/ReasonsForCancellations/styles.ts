import styled from "styled-components";

export const Container = styled.div``;

export const EmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ContentActionsBtn = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Header = styled.div``;

export const Body = styled.div`
  display: flex;
  margin: 2rem 0;
  background-color: #ffffff;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const ContentTable = styled.div`
  width: 100%;
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
`;

export const ContentSimulation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
`;
