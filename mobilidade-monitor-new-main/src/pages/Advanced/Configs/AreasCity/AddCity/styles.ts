import styled from "styled-components";

export const Container = styled.div``;

export const ContentConfigLocalization = styled.div`
  margin: 1rem 0;
`;

export const ContainerInputs = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 768px) {
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
