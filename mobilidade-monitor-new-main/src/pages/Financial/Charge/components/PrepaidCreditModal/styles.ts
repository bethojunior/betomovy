import { Form as FormAntd } from "antd";
import styled from "styled-components";

export const CompactForm = styled(FormAntd)`
  .ant-form-item {
    margin-bottom: 12px;
  }
`;

export const SectionTitle = styled.p`
  font-weight: 600;
  font-size: 13px;
  color: #8c8c8c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 16px 0 8px;

  &:first-child {
    margin-top: 0;
  }
`;

export const LabelWithIcon = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  svg {
    color: #000;
  }
`;
