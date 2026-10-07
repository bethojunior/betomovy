import styled from "styled-components";
import { theme_colors } from "../../../../theme/theme";

export const Container = styled.form`
  background-color: ${theme_colors.white};
  padding: 1.5rem;
  -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.2);
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
`;

export const Row = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 540px) {
    flex-direction: column;
  }
`;

export const ContentInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
`;

export const LabelInput = styled.label``;

export const ContentImage = styled.div`
  img {
    width: 300px;
  }
`;

export const MessageError = styled.span`
  color: ${theme_colors.red_crismon};
`;

export const ContentBtnSave = styled.div`
  max-width: 205px;
  margin: 1rem 0;

  @media (max-width: 540px) {
    max-width: 100%;
  }
`;
