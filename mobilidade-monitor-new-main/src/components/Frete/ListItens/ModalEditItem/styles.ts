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

export const Row = styled.div`
    display: flex;
    gap: 1rem;

    @media(max-width: 425px){
        display: flex;
        flex-direction: column;
        gap: 0;
    }
`;

export const MessageError = styled.span`
  color: ${theme_colors.red_crismon};
`;

export const Footer = styled.footer`
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
`;