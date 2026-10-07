import styled from "styled-components";

export const Container = styled.div<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  width: 90px;
  height: 80px;
  border-radius: 10px;
  padding: 0.3rem;
`;

export const TitleModule = styled.span<{ colorText: string }>`
  font-size: 12px;
  font-weight: bold;
  color: ${({ colorText }) => colorText};
`;

export const ContentIcon = styled.div`
  text-align: right;
  margin: 0.3rem;
  > img {
    width: 40px;
  }
`;
