import styled from 'styled-components';
import {
  AimOutlined,
  RightOutlined,
  ThunderboltFilled,
  DollarCircleOutlined,
  ExpandOutlined,
  ClockCircleOutlined,
  RocketOutlined,
  DownOutlined,
} from '@ant-design/icons';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

export const Label = styled.div`
  font-size: 14px;
  color: #666;
  text-align: center;
  font-weight: 500;
`;

export const PhoneContainer = styled.div`
  position: relative;
  width: 350px;
  height: 700px;
`;

export const PhoneFrame = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  pointer-events: none;
`;

export const ScreenContent = styled.div`
  position: absolute;
  top: 2.5%;
  left: 3.5%;
  width: 93%;
  height: 95%;
  border-radius: 30px;
  overflow: hidden;
  background: #FFFFFF;
`;

export const MapBackground = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  object-fit: cover;
  z-index: 1;
`;

// Botões do topo
export const TopButtons = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 3;
`;

export const DistanceButton = styled.div`
  background: #0066CC;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #FFFFFF;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #0066CC;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  z-index: 3;
  border: none;
  cursor: pointer;
  padding: 0;
`;

// Botão de localização
export const LocationButton = styled.div`
  position: absolute;
  top: 55px;
  left: 10px;
  background: #0066CC;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

export const LocationTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #0066CC;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.2;
  min-width: 32px;
`;

// Card de endereço
export const AddressCard = styled.div`
  position: absolute;
  top: 50px;
  left: 70px;
  right: 10px;
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 3;
`;

export const AddressText = styled.div`
  font-size: 11px;
  color: #333;
  line-height: 1.3;
  flex: 1;
`;

// Banner de informações
export const InfoBanner = styled.div`
  position: absolute;
  top: 51%;
  left: 10px;
  right: 10px;
  background: white;
  padding: 14px 16px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* box-shadow: 0 2px 8px rgba(0,0,0,0.1); */
  z-index: 2;
`;

export const InfoBannerContent = styled.div`
  flex: 1;
  padding-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const InfoBannerTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #000;
  line-height: 1.3;
  width: 100%;
  text-align: center;
`;

export const InfoIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #0066CC;
  flex-shrink: 0;
  align-self: center;
`;

// Lista de tipos de viagem
export const TripTypesList = styled.div`
  position: absolute;
  top: calc(51% + 60px);
  left: 10px;
  right: 10px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 0;
`;

export const TripTypeItem = styled.div`
  background: white;
  padding: 12px 14px;
  border-radius: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &:first-child {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  
  &:last-of-type {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    margin-bottom: 0;
    border-bottom: 1px solid #E8E8E8;
  }
`;

export const CarIconWrapper = styled.div`
  position: relative;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const CarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const CarBadge = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  background: #0066CC;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

export const TripTypeName = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #000;
  flex: 1;
`;

export const TripTypePrice = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #000;
`;

// Seção de pagamento
export const PaymentSection = styled.div`
  position: absolute;
  top: 80%;
  left: 10px;
  right: 10px;
  background: white;
  padding: 12px 14px;
  border-radius: 0;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top: 1px solid #E8E8E8;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 2;
  margin-top: 0;
  margin-bottom: 0;
`;

export const PaymentText = styled.div`
  font-size: 12px;
  color: #000;
  
  &[data-bold] {
    font-weight: 700;
  }
`;

export const PaymentDropdown = styled.div`
  margin-left: auto;
  color: #666;
  display: flex;
  align-items: center;
`;

// Botões inferiores
export const BottomButtons = styled.div`
  position: absolute;
  top: calc(80% + 58px);
  left: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  z-index: 2;
`;

export const SmallButton = styled.button`
  flex: 1;
  background: #F5F5F5;
  padding: 10px 6px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: none;
  cursor: pointer;
`;

export const SmallButtonIcon = styled.div`
  font-size: 15px;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SmallButtonText = styled.div`
  font-size: 8px;
  color: #000;
  font-weight: 500;
`;

export const ConfirmButton = styled.div`
  flex: 2;
  background: #0066CC;
  padding: 10px 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ConfirmButtonText = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #FFFFFF;
`;

// Overlay do modal
export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 100;
`;

// Modal
export const Modal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  background: white;
  border-radius: 18px;
  overflow: hidden;
  z-index: 101;
  box-shadow: 0 6px 24px rgba(0,0,0,0.25);
`;

export const ModalContent = styled.div`
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const ModalTripType = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 18px 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid #E8E8E8;
    margin-bottom: 0;
  }
`;

export const ModalCarIconWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ModalCarImage = styled.img`
  width: 85%;
  height: 85%;
  object-fit: contain;
`;

export const ModalCarBadge = styled.div`
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 20px;
  height: 20px;
  background: #0066CC;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: 12px;
`;

export const ModalTripInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const ModalTripName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #000;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
`;

export const ModalTripDescription = styled.div`
  font-size: 10px;
  color: #666;
  line-height: 1.5;
  margin-top: 4px;
`;

// Seção azul de Valor Fixo / Título e Descrição personalizados
export const FixedPriceSection = styled.div`
  background: #0066CC;
  padding: 18px;
  border-radius: 5px 0 5px 0;
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const FixedPriceTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 10px;
  width: 100%;
`;

export const FixedPriceDescription = styled.div`
  font-size: 12px;
  color: #FFFFFF;
  text-align: center;
  line-height: 1.6;
  width: 100%;
`;

// Botão X para fechar o modal
export const ModalCloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #000;
  z-index: 102;
  border: none;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

// Styled Icons
export const StyledAimOutlined = styled(AimOutlined)`
  font-size: 24px;
  color: #FFFFFF;
`;

export const StyledRightOutlined = styled(RightOutlined)`
  font-size: 14px;
  color: #666;
`;

export const StyledThunderboltFilled = styled(ThunderboltFilled)`
  font-size: 10px;
  color: #FFFFFF;
`;

export const StyledDollarCircleOutlined = styled(DollarCircleOutlined)`
  font-size: 10px;
  color: #FFFFFF;
`;

export const StyledThunderboltFilledModal = styled(ThunderboltFilled)`
  font-size: 12px;
  color: #FFFFFF;
`;

export const StyledDollarCircleOutlinedModal = styled(DollarCircleOutlined)`
  font-size: 12px;
  color: #FFFFFF;
`;

export const StyledExpandOutlined = styled(ExpandOutlined)`
  font-size: 18px;
`;

export const StyledClockCircleOutlined = styled(ClockCircleOutlined)`
  font-size: 18px;
`;

export const StyledRocketOutlined = styled(RocketOutlined)`
  font-size: 18px;
`;

export const StyledDownOutlined = styled(DownOutlined)`
  font-size: 12px;
`;
