import styled from "styled-components";
import { SectionCard as BaseSectionCard, SectionFieldsGrid as BaseSectionFieldsGrid } from "../../../../Utils/EntityCard/styles";

export const SectionCard = styled(BaseSectionCard)`
  flex: 1.3;
  min-width: 320px;
  padding: 1.5rem;
  gap: 1.1rem;
`;

export const SectionFieldsGrid = styled(BaseSectionFieldsGrid)`
  gap: 1rem 1.5rem;
`;

export const SocialLinksRow = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 0.75rem;
`;
