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

export const ContentConfigLocalization = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StepperContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const StepCard = styled.div<{ active?: boolean; completed?: boolean }>`
  background: #ffffff;
  border: 1.5px solid ${(props) => (props.active ? "#0284c7" : props.completed ? "#10b981" : "#e2e8f0")};
  border-radius: 10px;
  padding: 16px 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: ${(props) => (props.active ? "#0284c7" : "#cbd5e1")};
  }
`;

export const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

export const StepNumber = styled.span<{ active?: boolean; completed?: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${(props) => (props.active ? "#0284c7" : props.completed ? "#10b981" : "#e2e8f0")};
  color: ${(props) => (props.active || props.completed ? "#ffffff" : "#64748b")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
`;

export const StepTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
`;

export const ContainerInputs = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
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
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const SelectedBanner = styled.div`
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 10px;
  padding: 18px 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  box-shadow: 0 2px 4px rgba(2, 132, 199, 0.06);
`;

export const SelectedInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  h3 {
    margin: 0;
    color: #0369a1;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    margin: 0;
    color: #475569;
    font-size: 13px;
  }
`;

export const SelectedActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ContentMap = styled.div`
  position: relative;
  margin: 1rem 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #cbd5e1;
`;

export const MapOverlayBadge = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border: 1px solid #e2e8f0;
  padding: 8px 14px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
`;

export const BottomActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding: 16px 20px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;
