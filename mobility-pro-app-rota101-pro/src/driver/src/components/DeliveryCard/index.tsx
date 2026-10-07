import {
  Card,
  DeliveryFee,
  DeliveryId,
  DeliveryTime,
  Image,
  ImageContainer,
  InfoContainer,
} from './styles';

export const DeliveryCard = ({delivery, onPress}) => {
  return (
    <Card onPress={onPress}>
      <ImageContainer>
        <Image
          source={{uri: delivery?.company?.company_delivery_config?.picture}}
          resizeMode="cover"
        />
      </ImageContainer>
      <InfoContainer>
        <DeliveryId>
          #{delivery?.id} - {delivery?.company?.fantasyName}
        </DeliveryId>
        <DeliveryFee>Taxa de Entrega: {delivery?.deliveryFee}</DeliveryFee>
        <DeliveryTime>Início: {delivery?.startDeliveryTime}</DeliveryTime>
      </InfoContainer>
    </Card>
  );
};
