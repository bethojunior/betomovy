import { Card, Carousel, Image } from "antd";
import styled, { keyframes, css } from "styled-components";

interface ButtonsFilteredProps {
  selected: boolean;
}

const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const DashBoardContainer = styled.div`
  padding: 1.5rem 2rem 3rem;
  background-color: #f8fafc;
  min-height: 100vh;
  box-sizing: border-box;

  @media (max-width: 900px) {
    padding: 1rem 1rem 2rem;
  }
`;

/* ==========================================================================
   Hero Header & Actions
   ========================================================================== */

export const DashboardHeroHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 8px 0 24px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 24px;
`;

export const DashboardTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DashboardTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: #00349a;
  }
`;

export const DashboardSubtitle = styled.p`
  font-size: 13.5px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
`;

export const HeaderActionsRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

export const LiveIndicatorPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 9999px;
  font-size: 12.5px;
  font-weight: 700;
  color: #166534;
`;

export const PulseDot = styled.span`
  width: 8px;
  height: 8px;
  background-color: #22c55e;
  border-radius: 50%;
  animation: ${pulse} 1.8s infinite ease-in-out;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
`;

export const CityPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  svg {
    color: #0284c7;
  }
`;

export const ModernRefreshBtn = styled.button<{ $loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 20px;
  background: linear-gradient(135deg, #00349a 0%, #002266 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.2px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 52, 154, 0.25);
  transition: all 0.22s ease;

  &:hover {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #04f3fa;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  svg.spin-icon {
    ${(props) =>
      props.$loading &&
      css`
        animation: ${spin} 0.9s linear infinite;
      `}
  }
`;

/* Legacy Header button compatibility */
export const GridButtonRefresh = styled.div`
  display: flex;
  padding: 8px 0 16px 0;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    letter-spacing: -0.3px;
  }

  button.ant-btn {
    height: 42px;
    padding: 0 20px;
    background-color: #00349a !important;
    border: none !important;
    border-radius: 10px;
    font-weight: 700;
    font-size: 13.5px;
    color: #ffffff !important;
    box-shadow: 0 4px 14px rgba(0, 52, 154, 0.25);
    transition: all 0.22s ease;

    &:hover {
      background-color: #0f172a !important;
      color: #04f3fa !important;
      transform: translateY(-2px);
    }
  }
`;

/* ==========================================================================
   KPI Summary Overview Cards
   ========================================================================== */

export const KpiOverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ModernKpiCard = styled.div<{ $variant?: "primary" | "success" | "info" | "warning" }>`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 22px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.25s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${(props) => {
      switch (props.$variant) {
        case "success":
          return "#10b981";
        case "info":
          return "#0284c7";
        case "warning":
          return "#f59e0b";
        default:
          return "#00349a";
      }
    }};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
    border-color: #cbd5e1;
  }
`;

export const KpiIconBadge = styled.div<{ $variant?: "primary" | "success" | "info" | "warning" }>`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  background: ${(props) => {
    switch (props.$variant) {
      case "success":
        return "#ecfdf5";
      case "info":
        return "#f0f9ff";
      case "warning":
        return "#fffbeb";
      default:
        return "#eff6ff";
    }
  }};
  color: ${(props) => {
    switch (props.$variant) {
      case "success":
        return "#059669";
      case "info":
        return "#0284c7";
      case "warning":
        return "#d97706";
      default:
        return "#00349a";
    }
  }};
`;

export const KpiDetails = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const KpiMetricLabel = styled.span`
  font-size: 12.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  margin-bottom: 4px;
`;

export const KpiMetricValue = styled.h3`
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const KpiMetricHint = styled.span`
  font-size: 11.5px;
  color: #94a3b8;
  margin-top: 3px;
  font-weight: 500;
`;

/* ==========================================================================
   Section Card & Structure
   ========================================================================== */

export const SectionCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
  padding: 24px;
  margin-bottom: 28px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
`;

export const SectionHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SectionTitleText = styled.h2`
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SectionCounterBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  background: #f1f5f9;
  color: #475569;
`;

export const SectionDescription = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0;
`;

/* ==========================================================================
   Driver Types Grid & Cards
   ========================================================================== */

export const ModernDriverTypesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
`;

export const DriverCategoryCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
  transition: all 0.25s ease;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-3px);
    border-color: #cbd5e1;
    box-shadow: 0 10px 25px -4px rgba(15, 23, 42, 0.08);
  }
`;

export const DriverCategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
`;

export const DriverAvatarCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const DriverCategoryInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const DriverCategoryName = styled.h3`
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px 0;
  letter-spacing: -0.2px;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DriverCategorySubtitle = styled.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
`;

export const DriverTotalBanner = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

export const DriverTotalLabel = styled.span`
  font-size: 12.5px;
  font-weight: 600;
  color: #475569;
`;

export const DriverTotalValue = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
`;

export const DriverStatusGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 14px;
`;

export const DriverStatusItem = styled.div<{ $status: "active" | "waiting" | "pending" | "blocked" }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;

  background-color: ${(props) => {
    switch (props.$status) {
      case "active":
        return "#ecfdf5";
      case "waiting":
        return "#fffbeb";
      case "pending":
        return "#eff6ff";
      case "blocked":
        return "#fef2f2";
    }
  }};

  color: ${(props) => {
    switch (props.$status) {
      case "active":
        return "#047857";
      case "waiting":
        return "#b45309";
      case "pending":
        return "#1d4ed8";
      case "blocked":
        return "#b91c1c";
    }
  }};
`;

export const DriverStatusDot = styled.span<{ $status: "active" | "waiting" | "pending" | "blocked" }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;

  background-color: ${(props) => {
    switch (props.$status) {
      case "active":
        return "#10b981";
      case "waiting":
        return "#f59e0b";
      case "pending":
        return "#3b82f6";
      case "blocked":
        return "#ef4444";
    }
  }};
`;

export const DriverActiveRatioBar = styled.div`
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
`;

export const DriverActiveRatioFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(props) => Math.min(100, Math.max(0, props.$percent))}%;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  border-radius: 9999px;
  transition: width 0.4s ease;
`;

/* ==========================================================================
   Customers Grid & Cards
   ========================================================================== */

export const ModernCustomersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const ModernCustomerCard = styled.div<{ $variant: "total" | "active" | "pending" | "blocked" }>`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
  transition: all 0.22s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
  }
`;

export const CustomerCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CustomerCardIconWrap = styled.div<{ $variant: "total" | "active" | "pending" | "blocked" }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;

  background: ${(props) => {
    switch (props.$variant) {
      case "total":
        return "#eff6ff";
      case "active":
        return "#ecfdf5";
      case "pending":
        return "#fffbeb";
      case "blocked":
        return "#fef2f2";
    }
  }};

  color: ${(props) => {
    switch (props.$variant) {
      case "total":
        return "#00349a";
      case "active":
        return "#059669";
      case "pending":
        return "#d97706";
      case "blocked":
        return "#dc2626";
    }
  }};
`;

export const CustomerCardCount = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
  letter-spacing: -0.5px;
`;

export const CustomerCardTitleText = styled.span`
  font-size: 13.5px;
  font-weight: 600;
  color: #64748b;
`;

/* ==========================================================================
   Analytics Grid & Cards
   ========================================================================== */

export const ModernAnalyticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 28px;
  align-items: stretch;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const ModernAnalyticsCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.22s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07);
  }
`;

export const AnalyticsCardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
`;

export const AnalyticsCardTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.2px;
`;

export const AnalyticsCardBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  flex: 1;
`;

export const AnalyticsDataList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const AnalyticsDataItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
`;

export const AnalyticsItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const AnalyticsColorDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  flex-shrink: 0;
`;

export const AnalyticsItemName = styled.span`
  font-size: 13.5px;
  font-weight: 600;
  color: #334155;
`;

export const AnalyticsItemValue = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
`;

export const AnalyticsChartWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  width: 100%;
  position: relative;
`;

export const ChartCenterHole = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;
`;

export const ChartCenterValue = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.1;
  letter-spacing: -0.5px;
`;

export const ChartCenterLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
`;

/* ==========================================================================
   Rankings Section
   ========================================================================== */

export const ModernRankingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ModernRankingCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const RankingHeaderWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px 22px;
  border-bottom: 1px solid #f1f5f9;
  background: #ffffff;
`;

export const RankingFiltersWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 10px;
`;

export const RankingFilterPill = styled.button<{ $active: boolean }>`
  border: none;
  background: ${(props) => (props.$active ? "#ffffff" : "transparent")};
  color: ${(props) => (props.$active ? "#00349a" : "#64748b")};
  font-weight: ${(props) => (props.$active ? "700" : "500")};
  padding: 5px 12px;
  border-radius: 7px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: ${(props) => (props.$active ? "0 1px 3px rgba(0,0,0,0.08)" : "none")};
  transition: all 0.18s ease;

  &:hover {
    color: #00349a;
  }
`;

export const RankingScrollList = styled.div`
  max-height: 380px;
  min-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 18px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f8fafc;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

export const RankingListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 14px;
  margin-bottom: 8px;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #e2e8f0;
    transform: translateX(2px);
  }
`;

export const RankingPositionBadge = styled.div<{ $position: number }>`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 13px;
  flex-shrink: 0;

  background: ${(props) => {
    switch (props.$position) {
      case 1:
        return "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)";
      case 2:
        return "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)";
      case 3:
        return "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)";
      default:
        return "#f8fafc";
    }
  }};

  color: ${(props) => {
    switch (props.$position) {
      case 1:
        return "#b45309";
      case 2:
        return "#475569";
      case 3:
        return "#c2410c";
      default:
        return "#64748b";
    }
  }};

  border: 1px solid
    ${(props) => {
      switch (props.$position) {
        case 1:
          return "#fcd34d";
        case 2:
          return "#cbd5e1";
        case 3:
          return "#fdba74";
        default:
          return "#e2e8f0";
      }
    }};
`;

export const RankingUserMeta = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  min-width: 0;
  flex: 1;
`;

export const RankingUserNameText = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RankingStatsPills = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

export const RankingStatChip = styled.span<{ $variant?: "trips" | "revenue" | "avg" }>`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;

  background: ${(props) => {
    switch (props.$variant) {
      case "revenue":
        return "#ecfdf5";
      case "avg":
        return "#f0f9ff";
      default:
        return "#f1f5f9";
    }
  }};

  color: ${(props) => {
    switch (props.$variant) {
      case "revenue":
        return "#047857";
      case "avg":
        return "#0284c7";
      default:
        return "#475569";
    }
  }};
`;

export const RankingActionBtns = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
  flex-shrink: 0;
`;

export const WhatsAppActionBtn = styled.a`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #25d366;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(37, 211, 102, 0.25);
  transition: all 0.2s ease;

  &:hover {
    background: #128c7e;
    transform: scale(1.08);
    color: #ffffff;
  }
`;

export const CelebrateActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #00349a;
  border-radius: 9px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #00349a;
    color: #ffffff;
    border-color: #00349a;
    transform: translateY(-1px);
  }
`;

/* ==========================================================================
   Backwards Compatibility Exports
   ========================================================================== */

export const TypesOfDrivers = styled.div`
  display: flex;
  padding: 4px 0;
  width: 100%;
  flex-direction: column;
`;

export const TitleNotTypesDrivers = styled.h1`
  font-size: 1.2rem;
  color: #64748b;
  text-align: center;
  padding: 24px 0;
  font-weight: 600;
`;

export const TypeDriversCarousel = styled(Carousel)`
  display: flex;
  width: 100%;
`;

export const CardTyperDriverContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const TypeDriverDataContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const TypeDriverDataLabel = styled.p`
  margin-bottom: 0;
`;

export const TypeDriverDataItem = styled.p`
  margin-bottom: 0;
`;

export const StatisticContainer = styled.div`
  margin-top: 10px;
`;

export const LineConatiner = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  @media (max-width: 800px) {
    flex-direction: column;
    margin-bottom: 0;
  }
`;

export const StatisticRealTime = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 49%;

  @media (max-width: 800px) {
    width: 100%;
  }
`;

export const CardOfInformations = styled.div`
  width: 49%;
  background-color: #ffffff !important;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 800px) {
    margin-top: 10px;
    width: 100%;
  }
`;

export const ContentCardInformations = styled.div`
  width: 100%;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 800px) {
    flex-direction: column;
    height: auto;
  }
`;

export const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 14px 6px 14px;
  border-bottom: 1px solid #fafafa;
`;

export const ContentFilteredMonthAndDay = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ButtonsFiltered = styled.button<ButtonsFilteredProps>`
  background-color: ${(props) => (props.selected ? "#00349A" : "#FFFFFF")};
  border: 1px solid ${(props) => (props.selected ? "#00349A" : "#E2E8F0")};
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 700;
  color: ${(props) => (props.selected ? "#FFFFFF" : "#64748B")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0f172a !important;
    border-color: #04f3fa !important;
    color: #04f3fa !important;
  }
`;

export const TopDriversAndClients = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 70px;
  gap: 16px;

  @media (max-width: 800px) {
    flex-direction: column;
    height: auto;
    padding-bottom: 50px;
  }
`;

export const TripAndTicketOfToday = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background-color: #ffffff;
  margin-bottom: 10px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  height: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
`;

export const ClientsAndDriversRealTime = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background-color: #ffffff;
  margin-top: 10px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  height: 50%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
`;

export const TripAndTicketContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const CardContainerMap = styled.div`
  display: flex !important;
  justify-content: center;
`;

export const TripAndTicketData = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const TripAndTicked = styled.p`
  font-size: 17px;
  margin-bottom: 0;
`;

export const TypeDriversCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  margin: 8px;
  width: 100%;
  max-width: 280px;
  background-color: #ffffff !important;
`;

export const TypeDriverImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 12px;
`;

export const TypeDriverImage = styled(Image)`
  min-height: 80px;
  max-height: 90px;
  object-fit: contain;
`;

export const TypeDriverContainer = styled.div`
  margin-bottom: 14px;
  color: #070a1a;
  font-weight: 800;
  font-size: 16px;
  text-align: center;
`;

export const CustomersCardWrapper = styled(CardContainerMap)`
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const CustomersTypeTitle = styled(TypeDriverContainer)`
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 800;
  color: #070a1a;
`;

export const CustomersCardsRow = styled(LineConatiner)`
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  align-items: stretch;
  width: 100%;
`;

export const CustomerMetricCard = styled(TypeDriversCard)`
  min-width: 160px;
  flex: 1;
  max-width: 220px;
`;

export const CustomerMetricContent = styled(TypeDriverDataContainer)`
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  width: 100%;
`;

export const CustomerMetricLabel = styled(TypeDriverDataLabel)`
  font-size: 13.5px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  text-align: center;
`;

export const CustomerMetricValue = styled(TypeDriverDataItem)`
  font-size: 26px;
  font-weight: 900;
  color: #00349a;
  margin-top: 4px;
`;

export const TripsAcceptedContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

export const TripsLabel = styled.p`
  margin-bottom: 0;
`;

export const TripsItem = styled.p`
  margin-bottom: 0;
`;

export const TextOfCard = styled.p`
  padding: 10px;
  padding-bottom: 0;
  font-size: 18px;
  margin: 0;
  flex-shrink: 0;
`;

export const ContainerInformationsData = styled.div`
  border-radius: 5px;
  min-width: 200px;
  max-width: 200px;
  border: 1px solid #dfdfdf;
  @media (max-width: 800px) {
    min-width: 100%;
    max-width: 100%;
  }
`;

export const InformationsDataMap = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #dfdfdfdf;
`;

export const ContainerOfCarInformationGlobal = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #dfdfdf;
`;

export const ParagraphBasicGlobal = styled.p`
  margin-bottom: 0;
`;

export const TopItem = styled.p`
  margin-bottom: 0;
  margin-left: 4px;
`;

export const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const TopName = styled.p`
  margin-bottom: 0;
`;

export const SkeletonContainer = styled.div`
  padding: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const ContainerInput = styled.div`
  button {
    margin-top: 10px;
  }
`;

export const TopListContainer = styled.div`
  max-height: 250px;
  height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  flex: 1;
`;

export const TopItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #dfdfdf;
  gap: 8px;
`;

export const TopItemContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

export const TopItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
  flex-shrink: 0;
`;

export const WhatsAppLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #25d366;
  color: white;
  text-decoration: none;
`;

export const TicketMedioText = styled.span`
  font-size: 12px;
  color: #666;
  margin-left: 8px;
`;

export const LoadingMoreText = styled.p`
  text-align: center;
  padding: 15px;
  color: #666;
  font-size: 14px;
  margin: 0;
`;

export const LoadingMoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 10px;
`;

export const LoadingMoreSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
`;

export const ButtonParabens = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 500;
  color: #333;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
`;

export const RankingFilterLabel = styled.span`
  font-size: 12px;
  color: #8c8c8c;
  margin-right: 4px;
`;
