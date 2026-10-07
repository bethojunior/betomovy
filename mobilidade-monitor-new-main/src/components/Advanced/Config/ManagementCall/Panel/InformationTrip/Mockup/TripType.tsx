import { FC } from 'react';
import {
  CarIconWrapper,
  CarImage,
  CarBadge,
  TripTypeName,
  TripTypePrice,
  StyledThunderboltFilled,
  StyledDollarCircleOutlined,
} from './styles';

interface TripTypeProps {
  icon: string;
  name: string;
  price: string;
}

const TripType: FC<TripTypeProps> = ({ icon, name, price }) => {
  const isPriority = name === 'PRIORIDADE';
  
  return (
    <>
      <CarIconWrapper>
        <CarImage src={icon} alt="Car" />
        <CarBadge>
          {isPriority ? <StyledThunderboltFilled /> : <StyledDollarCircleOutlined />}
        </CarBadge>
      </CarIconWrapper>
      <TripTypeName>{name}</TripTypeName>
      <TripTypePrice>{price}</TripTypePrice>
    </>
  );
};

export default TripType;

