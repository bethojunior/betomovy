import styled from "styled-components";
import { theme_colors } from "../../../../../../theme/theme";

export const Title = styled.p`
  margin-top: 10px;
  margin-bottom: 0;

  &:first-child {
    margin-top: 0;
  }
`;

export const Section = styled.div`
  width: 50%;

  &:first-child {
    margin-right: 10px;
  }
`;

export const SideBySide = styled.div`
  display: flex;
  margin-top: 10px;
`;

export const FooterModal = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

export const MessageError = styled.span`
  color: ${theme_colors.red_crismon};
  font-size: 14px;
`;
