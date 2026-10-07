import styled from "styled-components";

export const Container = styled.div``;

export const Content = styled.div`
  width: 100%;
  display: flex;
  gap: 4rem;
  justify-content: space-between;
  padding: 0 2rem;

  @media (max-width: 1100px) {
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 940px) {
    padding: 0rem;
    gap: 0rem;
  }
`;

export const ContentItems = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;

  > div {
    display: flex;
    flex-direction: column-reverse;
    align-self: flex-start;
  }

  @media (max-width: 940px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 425px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.span`
  font-size: 14px;
`;

export const ContentButtonSave = styled.div`
  margin: 1rem 0;
  max-width: 75px;

  @media (max-width: 940px) {
    max-width: 100%;
    width: 100%;
  }
`;

export const ContentSimulatorApp = styled.div``;
