import styled from "styled-components";
import { Collapse } from "antd";
import { SectionCard as BaseSectionCard } from "../../../../Utils/EntityCard/styles";

export const SectionCard = styled(BaseSectionCard)`
  flex: 1;
  min-width: 300px;
  padding: 1.5rem;
`;

export const WorkersDrop = styled(Collapse)`
  border: none;
  background: transparent;

  .ant-collapse-header {
    padding: 0 !important;
    font-size: 15px;
    font-weight: 700;
    color: #000000;
  }

  .ant-collapse-content-box {
    padding: 0.75rem 0 0 !important;
  }
`;

export const EmptyWorkers = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  color: #8c8c8c;

  @media (max-width: 800px) {
    height: 50px;
  }
`;

export const WorkerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #eef0f2;

  &:last-child {
    border-bottom: none;
  }
`;

export const WorkerName = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: #1890ff;
  font-weight: bold;
  cursor: pointer;
  text-align: left;
`;

export const PhoneCell = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  color: inherit;
`;

export const WhatsAppSmallIcon = styled.img`
  width: 16px;
  height: 16px;
`;
