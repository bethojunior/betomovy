import styled from "styled-components";

export const Container = styled.div``;

export const ContentsRowCard = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex: 1;
  margin: 1rem 0;

  @media (max-width: 905px) {
    flex-direction: column;
  }
`;

export const ItemConfigs = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  p {
    margin: 0;
  }

  @media (max-width: 440px) {
    flex-direction: column;

    p {
      text-align: center;
    }
  }
`;
