import styled from "styled-components";

export const Container = styled.div`
  padding: 1.5rem;
  max-width: 1300px;
  margin: 0 auto;
`;

export const Content = styled.div`
  margin: 1rem 0;
`;

export const ContainerRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  align-items: flex-end;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

export const ContentInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const LabelText = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const ContainerButton = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin: 1rem 0 1.5rem 0;
`;

export const StatusCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #00349a;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
`;

export const LogCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
  }
`;

export const LogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f1f5f9;
`;

export const LogBadge = styled.span<{ type?: string }>`
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(props) =>
    props.type === "ERROR"
      ? "#FEE2E2"
      : props.type === "WARN"
      ? "#FEF3C7"
      : "#E0E7FF"};
  color: ${(props) =>
    props.type === "ERROR"
      ? "#DC2626"
      : props.type === "WARN"
      ? "#D97706"
      : "#3730A3"};
`;

export const LogTimestamp = styled.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
`;

export const LogMessage = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
`;

export const LogDetails = styled.pre`
  background: #0f172a;
  color: #f8fafc;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  font-size: 12px;
  font-family: "JetBrains Mono", Consolas, monospace;
  overflow-x: auto;
  margin: 0;
`;
