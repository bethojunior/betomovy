import { FC, useState } from 'react';
import { 
  CloseOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import {
  Wrapper,
  PhoneContainer,
  PhoneFrame,
  ScreenContent,
  MapBackground,
  TopButtons,
  DistanceButton,
  CloseButton,
  LocationButton,
  LocationTime,
  AddressCard,
  AddressText,
  InfoBanner,
  InfoIcon,
  TripTypesList,
  TripTypeItem,
  PaymentSection,
  PaymentText,
  PaymentDropdown,
  BottomButtons,
  SmallButton,
  SmallButtonIcon,
  SmallButtonText,
  ConfirmButton,
  ConfirmButtonText,
  Overlay,
  Modal,
  ModalContent,
  Label,
  StyledAimOutlined,
  StyledRightOutlined,
  StyledExpandOutlined,
  StyledClockCircleOutlined,
  StyledRocketOutlined,
  StyledDownOutlined,
  ModalCloseButton,
  InfoBannerContent,
  InfoBannerTitle,
  FixedPriceSection,
  FixedPriceTitle,
  FixedPriceDescription,
} from './styles';
import PhoneImage from '../../../../../../../assets/cellphone.png';
import MapImage from '../../../../../../../assets/mapa-simulator.jpeg';
import CarIconImage from '../../../../../../../assets/carDefault.png';
import { MOCKUP_DEFAULTS } from './constants';
import TripType from './TripType';
import ModalTripType from './ModalTripType';

interface MockupTripTypeInfoProps {
  title?: string;
  description?: string;
  savedTitle?: string;
  savedDescription?: string;
}

const MockupTripTypeInfo: FC<MockupTripTypeInfoProps> = ({
  title = '',
  description = '',
  savedTitle = '',
  savedDescription = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Manter COMUM fixo, título e descrição aparecem em seção separada
  const tripTypes = [
    {
      icon: CarIconImage,
      name: MOCKUP_DEFAULTS.title,
      price: MOCKUP_DEFAULTS.commonPrice,
    },
    {
      icon: CarIconImage,
      name: MOCKUP_DEFAULTS.priorityName,
      price: MOCKUP_DEFAULTS.priorityPrice,
    },
  ];

  const modalTripTypes = [
    {
      icon: CarIconImage,
      name: MOCKUP_DEFAULTS.title,
      description: MOCKUP_DEFAULTS.description,
    },
    {
      icon: CarIconImage,
      name: MOCKUP_DEFAULTS.priorityName,
      description: MOCKUP_DEFAULTS.priorityDescription,
    },
  ];

  const bottomButtons = [
    { icon: <StyledExpandOutlined />, text: MOCKUP_DEFAULTS.buttons.handle },
    { icon: <StyledClockCircleOutlined />, text: MOCKUP_DEFAULTS.buttons.schedule },
    { icon: <StyledRocketOutlined />, text: MOCKUP_DEFAULTS.buttons.turbo },
  ];

  return (
    <Wrapper>
      <Label>{MOCKUP_DEFAULTS.previewLabel}</Label>
      <PhoneContainer>
        <PhoneFrame src={PhoneImage} alt="Phone" />
        <ScreenContent>
          {/* Mapa na metade superior */}
          <MapBackground src={MapImage} alt="Map" />
          
          {/* Botão distância centralizado */}
          <TopButtons>
            <DistanceButton>{MOCKUP_DEFAULTS.distance}</DistanceButton>
          </TopButtons>
          
          {/* Botão X no canto */}
          <CloseButton aria-label="Fechar">
            <CloseOutlined />
          </CloseButton>
          
          {/* Botão de localização */}
          <LocationButton>
            <StyledAimOutlined />
          </LocationButton>
          
          {/* Card de endereço */}
          <AddressCard>
            <LocationTime>
              <span>{MOCKUP_DEFAULTS.time}</span>
              <span>{MOCKUP_DEFAULTS.timeUnit}</span>
            </LocationTime>
            <AddressText dangerouslySetInnerHTML={{ __html: MOCKUP_DEFAULTS.address.replace('\n', '<br/>') }} />
            <StyledRightOutlined />
          </AddressCard>
          
          {/* Banner de informações / Título */}
          <InfoBanner>
            <InfoBannerContent>
              {(title.trim() || savedTitle) && (
                <InfoBannerTitle>{title.trim() || savedTitle}</InfoBannerTitle>
              )}
            </InfoBannerContent>
            <InfoIcon>
              <InfoCircleOutlined />
            </InfoIcon>
          </InfoBanner>
          
          {/* Lista de tipos de viagem */}
          <TripTypesList>
            {tripTypes.map((tripType) => (
              <TripTypeItem key={tripType.name}>
                <TripType
                  icon={tripType.icon}
                  name={tripType.name}
                  price={tripType.price}
                />
              </TripTypeItem>
            ))}
          </TripTypesList>
          
          {/* Seção de pagamento */}
          <PaymentSection>
            <PaymentText data-bold>{MOCKUP_DEFAULTS.paymentSymbol}</PaymentText>
            <PaymentText>{MOCKUP_DEFAULTS.paymentLabel}</PaymentText>
            <PaymentDropdown>
              <StyledDownOutlined />
            </PaymentDropdown>
          </PaymentSection>
          
          {/* Botões inferiores */}
          <BottomButtons>
            {bottomButtons.map((button, index) => (
              <SmallButton key={index} aria-label={button.text}>
                <SmallButtonIcon>{button.icon}</SmallButtonIcon>
                <SmallButtonText>{button.text}</SmallButtonText>
              </SmallButton>
            ))}
            <ConfirmButton>
              <ConfirmButtonText>{MOCKUP_DEFAULTS.confirmButton}</ConfirmButtonText>
            </ConfirmButton>
          </BottomButtons>
          
          {/* Overlay e Modal */}
          {isModalOpen && (
            <>
              <Overlay />
              <Modal>
                <ModalCloseButton 
                  aria-label="Fechar" 
                  onClick={() => setIsModalOpen(false)}
                >
                  <CloseOutlined />
                </ModalCloseButton>
                <ModalContent>
                  {modalTripTypes.map((modalTripType) => (
                    <ModalTripType
                      key={modalTripType.name}
                      icon={modalTripType.icon}
                      name={modalTripType.name}
                      description={modalTripType.description}
                    />
                  ))}
                  
                  {/* Seção azul com Título e Descrição personalizados - sempre visível */}
                  <FixedPriceSection>
                    <FixedPriceTitle>{title.trim() || savedTitle || ''}</FixedPriceTitle>
                    <FixedPriceDescription>
                      {description.trim() || savedDescription || ''}
                    </FixedPriceDescription>
                  </FixedPriceSection>
                </ModalContent>
              </Modal>
            </>
          )}
        </ScreenContent>
      </PhoneContainer>
    </Wrapper>
  );
};

export default MockupTripTypeInfo;

