import styled from "styled-components";

export const Container = styled.div``;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 1rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  > div:nth-child(1) {
    display: flex;
    align-items: center;
    gap: 1rem;
    max-width: 400px;
    width: 100%;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ContentInformations = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0.8rem;
  border: 1px solid #b1b1b1b6;
  background-color: #ffffff;
`;

export const LabelsInformations = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

export const ValueInformations = styled.span`
  font-size: 16px;
  font-style: italic;

  > div {
    display: flex;
    align-items: center;

    svg {
      margin-top: 1px;
    }
  }
`;

export const ContentDescriptionInvalid = styled.div`
  width: 300px;
`;

export const TextPopover = styled.span`
  display: block;
  width: 100%;
  overflow: scroll;
  font-size: 12px;
`;
