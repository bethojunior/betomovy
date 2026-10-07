import styled from "styled-components";

const SUCCESS_COLOR = "#10b981";
const ERROR_COLOR = "#ef4444";

interface ZafiraStatusBadgeProps {
  $isValidated: boolean;
}

export const ZafiraStatusBadge = styled.span<ZafiraStatusBadgeProps>`
  display: inline-flex;
  align-items: center;
  font-size: inherit;
  line-height: inherit;
  color: ${(props) => (props.$isValidated ? SUCCESS_COLOR : ERROR_COLOR)};

  svg {
    display: inline;
    vertical-align: middle;
    margin-right: 4px;
    color: ${(props) => (props.$isValidated ? SUCCESS_COLOR : ERROR_COLOR)};
  }
`;
