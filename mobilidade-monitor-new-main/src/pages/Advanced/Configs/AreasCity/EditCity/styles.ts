import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding: 1.5rem;
  background-color: #f8fafc;
  min-height: 100vh;
`;

export const HeaderCard = styled.div`
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
  font-size: 13.5px;
  color: #64748b;
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const StatCard = styled.div<{ color?: string }>`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 18px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 16px;

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: ${(props) => props.color ? `${props.color}15` : "#f1f5f9"};
    color: ${(props) => props.color || "#0284c7"};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  }

  .stat-info {
    display: flex;
    flex-direction: column;

    .stat-value {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 12.5px;
      color: #64748b;
      font-weight: 500;
    }
  }
`;

export const TableCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;

  .ant-table-thead > tr > th {
    background: #f8fafc;
    color: #475569;
    font-weight: 600;
    font-size: 13px;
    border-bottom: 1px solid #e2e8f0;
  }

  .ant-table-tbody > tr > td {
    font-size: 13.5px;
    color: #334155;
    border-bottom: 1px solid #f1f5f9;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8fafc;
  }
`;

export const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
`;

export const SearchGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  flex: 1;
`;

export const ContainerInput = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ContentInput = styled.div`
  width: 100%;
`;

export const LabelText = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
`;

export const ContentMap = styled.div`
  position: relative;
  margin: 1rem 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #cbd5e1;
`;

export const ModalHeaderBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
`;

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
