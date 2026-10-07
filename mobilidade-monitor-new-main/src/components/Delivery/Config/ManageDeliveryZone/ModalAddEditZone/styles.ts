import styled from "styled-components";
import { theme_colors } from "../../../../../theme/theme";

interface CardSuggestionProps {
  selected?: boolean;
}

export const Container = styled.div`
  max-height: 400px;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }
`;

export const ContentInput = styled.div`
  margin-bottom: 0.5rem;
`;

export const Label = styled.label``;

export const ContentMapAndSuggestion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ContentSuggestion = styled.div`
  width: 100%;
  max-height: 280px;
  height: auto;
  overflow: auto;
  border: 1px solid ${theme_colors.gray};
  padding: 0.3rem;
  border-radius: 5px;

  ::-webkit-scrollbar {
    width: 7px !important;
    height: 10px;
    display: block !important;
  }

  ::-webkit-scrollbar-thumb {
    background: #d3d3d3 !important;
    border-radius: 5px !important;
  }

  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
`;

export const CardSuggestion = styled.div<CardSuggestionProps>`
  border: 1px solid ${theme_colors.black};
  padding: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  margin: 0.3rem 0;
  background: ${({ selected }) => (selected ? theme_colors.primary_antd : "")};
  color: ${({ selected }) =>
    selected ? theme_colors.white : theme_colors.black};
  font-size: 12px;
`;

export const ContentMap = styled.div`
  margin: 1rem 0;
`;
