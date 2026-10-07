import styled from "styled-components";
import { theme_colors } from "../../../../theme/theme";

export const Container = styled.form``;

export const ContentInput = styled.div`
  margin: 1rem 0;
`;

export const LabelInput = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

export const ContentAddObstacle = styled.div``;

export const Footer = styled.footer`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export const MessageError = styled.span`
  display: block;
  margin: 1rem 0;
  color: ${theme_colors.red_crismon};
`;
