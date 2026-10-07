import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
`;

export const CardsRow = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 1024px) {
    flex-wrap: wrap;
  }
`;

export const CardWrapper = styled.div`
  flex: 1;
  min-width: 220px;
`;

export const WithdrawsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const HistorySection = styled.div`
  margin-top: 16px;
`;