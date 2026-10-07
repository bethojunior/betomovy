import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const ContentInformations = styled.div`
  margin: 0.5rem 0;
`;

export const LabelText = styled.span``;
