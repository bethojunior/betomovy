import styled from "styled-components";

export const Container = styled.div`
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const ContainerInput = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 425px) {
    flex-direction: column;
  }
`;

export const ContentInput = styled.div`
  width: 100%;
`;

export const LabelText = styled.p``;

export const ContentMap = styled.div`
  margin: 1rem 0;
`;
