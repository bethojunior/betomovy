import styled from "styled-components";
import { Button, Card, Spin } from "antd";

export const NotificationPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 8px 4px;
  box-sizing: border-box;
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
`;

export const HeaderTitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  .header-icon-box {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
  }

  .header-texts {
    display: flex;
    flex-direction: column;

    h1 {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      line-height: 1.25;
    }

    p {
      font-size: 13px;
      color: #64748b;
      margin: 4px 0 0 0;
    }
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PrimaryActionBtn = styled(Button)`
  height: 44px;
  padding: 0 20px;
  font-weight: 600;
  font-size: 14px;
  border-radius: 10px;
  background: #0284c7;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25);
  transition: all 0.2s ease;

  &:hover {
    background: #0369a1 !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(2, 132, 199, 0.35);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const RefreshBtn = styled(Button)`
  height: 44px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #0284c7;
    border-color: #0284c7;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  width: 100%;
`;

export const StatCard = styled(Card)`
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
  }

  .ant-card-body {
    padding: 18px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .stat-info {
    display: flex;
    flex-direction: column;

    .stat-label {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
    }
  }

  .stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
`;

export const FiltersCard = styled(Card)`
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);

  .ant-card-body {
    padding: 16px 20px;
  }
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;

  .search-input {
    flex: 1;
    min-width: 240px;
  }

  .city-filter {
    min-width: 200px;
    max-width: 320px;
  }
`;

export const ContentCard = styled(Card)`
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  overflow: hidden;

  .ant-card-body {
    padding: 0;
  }
`;

export const Loader = styled(Spin)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
`;
