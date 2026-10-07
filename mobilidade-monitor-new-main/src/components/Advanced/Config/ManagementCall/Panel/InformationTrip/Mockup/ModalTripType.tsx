import { FC } from 'react';
import {
  ModalCarIconWrapper,
  ModalCarImage,
  ModalCarBadge,
  ModalTripInfo,
  ModalTripName,
  ModalTripDescription,
  ModalTripType as StyledModalTripType,
  StyledThunderboltFilledModal,
  StyledDollarCircleOutlinedModal,
} from './styles';

interface ModalTripTypeProps {
  icon: string;
  name: string;
  description: string;
}

const ModalTripType: FC<ModalTripTypeProps> = ({ icon, name, description }) => {
  const isPriority = name === 'PRIORIDADE';
  
  return (
    <StyledModalTripType>
      <ModalCarIconWrapper>
        <ModalCarImage src={icon} alt="Car" />
        <ModalCarBadge>
          {isPriority ? <StyledThunderboltFilledModal /> : <StyledDollarCircleOutlinedModal />}
        </ModalCarBadge>
      </ModalCarIconWrapper>
      <ModalTripInfo>
        <ModalTripName>{name}</ModalTripName>
        <ModalTripDescription>{description}</ModalTripDescription>
      </ModalTripInfo>
    </StyledModalTripType>
  );
};

export default ModalTripType;

