import styled, { css } from "styled-components";

const baseSectionStyles = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ZafiraValidationSection = styled.div`
  ${baseSectionStyles}
  margin-top: 16px;
  margin-bottom: 16px;
`;

export const ZafiraValidationSectionCompact = styled.div`
  ${baseSectionStyles}
`;
