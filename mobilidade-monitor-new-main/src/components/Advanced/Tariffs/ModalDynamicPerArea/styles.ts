import styled from "styled-components";

interface SuggestionsAddressesProps {
  selected: boolean;
}

export const Container = styled.div``;

export const LabelText = styled.p``;

export const ContentInput = styled.div``;

export const ContentAreas = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ContentSuggestions = styled.div`
  width: 100%;
  height: 360px;
  overflow-y: auto;

  @media (max-width: 768px) {
    height: auto;
  }
`;

export const SuggestionsAddresses = styled.div<SuggestionsAddressesProps>`
  font-size: 14px;
  padding: 0.5rem;
  border: 0.5px solid #000;
  margin-bottom: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? "#007BFF" : "")};
  color: ${({ selected }) => (selected ? "#FFFFFF" : "#000000")};
`;

export const MapDiv = styled.div;
