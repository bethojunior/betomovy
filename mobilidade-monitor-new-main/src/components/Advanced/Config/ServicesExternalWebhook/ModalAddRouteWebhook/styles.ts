import styled from "styled-components";
import { theme_colors } from "../../../../../theme/theme";

export const Container = styled.form``;

export const ContentInput = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
`;

export const LabelInput = styled.label``;

export const ContentBtnFooter = styled.footer`
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
`;

export const MessageErrorInput = styled.span`
    color: ${theme_colors.red_crismon};
    font-size: 14px;
`;