import styled from "styled-components";
import { Spin } from "antd";

export const Container = styled.div`
  margin: 1.5rem 1rem;
  font-family: inherit;

  @media (max-width: 768px) {
    margin: 1rem 0.5rem;
  }
`;

export const HeaderCard = styled.div`
  background: #ffffff;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const HeaderInfo = styled.div`
  margin-bottom: 1.25rem;
`;

export const MainTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px 0;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
`;

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
`;

export const SearchWrapper = styled.div`
  flex: 1;
  min-width: 260px;
  max-width: 480px;

  .ant-input-affix-wrapper {
    border-radius: 8px;
    padding: 8px 12px;
  }
`;

export const CategoriesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

export const CategoryPill = styled.button<{ active?: boolean }>`
  border: none;
  background: ${(props) => (props.active ? "#0284c7" : "#f1f5f9")};
  color: ${(props) => (props.active ? "#ffffff" : "#475569")};
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.active ? "#0369a1" : "#e2e8f0")};
  }
`;

export const Content = styled.div`
  margin: 1rem 0;

  .ant-collapse {
    background: transparent;
    border: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ant-collapse-item {
    background: #ffffff;
    border: 1px solid #e2e8f0 !important;
    border-radius: 10px !important;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }
  }

  .ant-collapse-header {
    padding: 14px 18px !important;
    font-weight: 600;
    color: #1e293b;
    align-items: center;
  }

  .ant-collapse-content {
    border-top: 1px solid #f1f5f9 !important;
  }

  .ant-collapse-content-box {
    padding: 18px !important;
  }
`;

export const ItemHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ItemTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
`;

export const ItemKeyBadge = styled.code`
  font-size: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 2px 8px;
  border-radius: 4px;
  color: #64748b;
  font-family: monospace;
`;

export const ConfigDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const KeyMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #64748b;

  strong {
    color: #334155;
  }
`;

export const ContentButton = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const Loader = styled(Spin)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 250px;
`;

export const EmptyState = styled.div`
  background: #ffffff;
  padding: 3rem;
  border-radius: 12px;
  text-align: center;
  border: 1px dashed #cbd5e1;
  color: #64748b;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #334155;
    margin-top: 12px;
  }
`;
