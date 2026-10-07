import styled from 'styled-components';

export const DeliveryMonitoringContainer = styled.div`
  display: flex;
  height: calc(100vh - 64px);
  margin: -1vw;
  position: relative;
`;

export const ContentMap = styled.div`
  flex: 1;
  height: 100%;
  position: relative;
`;

export const OrderActivesContainer = styled.div<{ active: boolean }>`
  width: 25%;
  min-width: 300px;
  max-width: 400px;
  background-color: rgba(255,255,255,0.66);
  border-radius: 8px;
  position: fixed;
  bottom: 0;
  right: 10px;
  z-index: 1;
  background-color: #fff;
  height: ${props => props.active ? '80%' : 'auto'};

  @media (max-width: 768px) {
    width: 90%;
    right: 5%;
    left: 5%;
    min-width: auto;
  }

  .order-label {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 0;
    padding-top: 1vw;
    cursor: pointer;
    display: flex;
    justify-content: center;
  }

  hr {
    width: 80%;
    margin: 0.5vw auto;
    border-color: #ddd;
  }

  .order-container {
    max-height: ${props => props.active ? '500px' : '0'};
    overflow: ${props => props.active ? 'auto' : 'hidden'};
    padding: ${props => props.active ? '0 12px 20px 12px' : '0'};
  }
`;

// Loading
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Order Cards
export const OrderCard = styled.div`
  padding: 12px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: #d9d9d9;
  }
`;

export const OrderCardContent = styled.div`
  display: flex;
  align-items: center;
`;

export const CompanyLogo = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background-size: cover;
  background-color: #f5f5f5;
  margin-right: 12px;
  flex-shrink: 0;
`;

export const OrderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CompanyName = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const OrderMeta = styled.div`
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const OrderId = styled.span``;

export const StatusBadge = styled.span`
  background-color: #52c41a;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
`;

// Modal
export const ModalContent = styled.div`
  padding: 8px 0;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

export const ModalCompanyLogo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-size: cover;
  background-color: #f5f5f5;
  margin-right: 12px;
`;

export const ModalCompanyInfo = styled.div``;

export const ModalCompanyName = styled.div`
  font-weight: 600;
  font-size: 16px;
`;

export const ModalOrderInfo = styled.div`
  color: #666;
  font-size: 14px;
`;

export const ItemsList = styled.div``;

export const ItemRow = styled.div<{ isLast: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: ${props => props.isLast ? 'none' : '1px solid #f0f0f0'};
`;

export const ItemQuantity = styled.span`
  background-color: #1890ff;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  margin-right: 8px;
`;

export const ItemName = styled.span``;

export const ItemPrice = styled.span`
  font-weight: 500;
`;

export const PriceSummary = styled.div`
  margin-top: 16px;
  padding: 12px;
  background-color: #fafafa;
  border-radius: 6px;
`;

export const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid #e8e8e8;
  font-weight: 600;
  font-size: 16px;
`;

export const InfoSection = styled.div`
  margin-top: 16px;
  font-size: 14px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const InfoTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

export const InfoText = styled.div`
  color: #666;
  line-height: 1.4;
`;

export const EmptyOrdersMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

export const MapLoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;