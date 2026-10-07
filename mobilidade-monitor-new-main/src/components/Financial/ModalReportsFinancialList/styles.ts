import styled from "styled-components";

export const Container = styled.div`
  overflow: auto;
  max-height: 500px;
`;

export const Content = styled.div`
  > div {
    margin: 0.5rem 0;
  }
`;

export const LabelText = styled.span`
  font-size: 14px;
  font-weight: bold;
`;

export const Text = styled.span`
  font-style: italic;
  font-size: 14px;
`;
