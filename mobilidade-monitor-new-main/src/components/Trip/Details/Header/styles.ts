import { Button } from "antd";
import styled from "styled-components";

export const Content = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
  gap: 16px;

  @media (max-width: 800px) {
    flex-direction: column;
    justify-content: flex-start;
    margin-top: 10px;
  }
`;

export const DriverCalledContent = styled.div`
  @media (max-width: 800px) {
    margin-top: 10px;
  }
`;

export const TitleDriver = styled.p`
  color: green;
  font-weight: bold;
  margin: 0;
`;

export const TripDriver = styled.img`
  width: clamp(64px, 10vw, 88px);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  object-fit: cover;
  background: #f3f4f6;
`;

export const TripDriverContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
`;

export const TripDriverName = styled.p`
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 5px;
`;

export const TripDriverType = styled.p`
  margin-bottom: 5px;
  font-size: 15px;
`;

export const DriverButton = styled(Button)`
  min-height: 70px;
  border-radius: 100%;
`;

export const DriverCalled = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  opacity: 0.5;
  object-fit: cover;
  background: #f3f4f6;
`;

export const DriverWhatsappButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
  width: auto;
  padding: 0;
`;

export const DriverEmptyState = styled.div`
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f9fafb;
  color: #4b5563;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 320px;

  p {
    margin: 0;
  }
`;

export const DriverEmptyTitle = styled.p`
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

export const NotifiedDriverPopoverContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  min-width: 200px;
`;

export const NotifiedDriverName = styled.p`
  font-weight: bold;
  margin: 0;
`;

export const NotifiedDriverInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4b5563;

  svg {
    flex-shrink: 0;
    color: #9ca3af;
  }
`;

export const NotifiedDriverInfoLabel = styled.span`
  font-weight: 600;
  color: #1f2937;
`;

export const NotifiedDriverWhatsappButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  margin-top: 2px;
  height: auto;
`;
