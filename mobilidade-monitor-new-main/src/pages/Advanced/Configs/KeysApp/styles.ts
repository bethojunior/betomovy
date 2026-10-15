import styled from "styled-components";
import { Spin } from "antd";

export const Content = styled.div`
  width: 100%;
  padding: 1.5rem 1.5rem 6rem 1.5rem;
  background-color: #f8fafc;
  min-height: 100%;
  position: relative;

  .ant-collapse {
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    background: transparent;
  }

  .ant-collapse-item {
    border-bottom: 1px solid #e2e8f0;
    background: #ffffff;
    margin-bottom: 8px;
    border-radius: 8px !important;
    border: 1px solid #e2e8f0 !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    overflow: hidden;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .ant-collapse-header {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b !important;
    padding: 14px 20px !important;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f8fafc;
    }
  }

  .ant-collapse-content {
    border-top: 1px solid #f1f5f9;
    background-color: #fafbfc;
  }

  .ant-collapse-content-box {
    padding: 20px !important;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MainTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Subtitle = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0;
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SearchWrapper = styled.div`
  min-width: 280px;
`;

export const StatsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const StatPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 13px;
  color: #475569;
  font-weight: 500;

  span.count {
    background: #0284c7;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 10px;
  }
`;

export const CategoryHeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 8px;
`;

export const CategoryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;

  svg {
    color: #0284c7;
    font-size: 16px;
  }
`;

export const CategoryBadge = styled.span`
  background: #f1f5f9;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

export const GridKeys = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const KeyCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  }
`;

export const KeyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const KeyTitle = styled.span`
  font-size: 13.5px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
`;

export const KeyIdentifier = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  color: #64748b;
  background: #f8fafc;
  padding: 2px 6px;
  border-radius: 4px;
  width: fit-content;
  border: 1px solid #f1f5f9;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  color: #64748b;

  h3 {
    color: #1e293b;
    font-size: 16px;
    font-weight: 600;
    margin: 8px 0;
  }
`;

export const Loader = styled(Spin)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

export const CategoryFilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const CategoryFilterPill = styled.button<{ active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid ${(props) => (props.active ? "#0284c7" : "#cbd5e1")};
  background: ${(props) => (props.active ? "#0284c7" : "#ffffff")};
  color: ${(props) => (props.active ? "#ffffff" : "#475569")};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #0284c7;
    color: ${(props) => (props.active ? "#ffffff" : "#0284c7")};
    background: ${(props) => (props.active ? "#0369a1" : "#f0f9ff")};
  }

  span.pill-count {
    background: ${(props) => (props.active ? "rgba(255, 255, 255, 0.25)" : "#f1f5f9")};
    color: ${(props) => (props.active ? "#ffffff" : "#64748b")};
    font-size: 11px;
    padding: 1px 7px;
    border-radius: 10px;
  }
`;

export const FloatingScrollTopButton = styled.button`
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: #0284c7;
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 16px rgba(2, 132, 199, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
  font-size: 18px;
  transition: all 0.25s ease;

  &:hover {
    background-color: #0369a1;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(2, 132, 199, 0.55);
  }
`;