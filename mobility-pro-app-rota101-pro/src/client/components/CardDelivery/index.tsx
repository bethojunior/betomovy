import {TextEdit} from '../TextEdit';
import {ContainerCard, Image} from './styles';

interface Props {
  text: string;
  onPress?: any;
  m?: string;
  image: string;
  selected: boolean;
}

export const CardDelivery = ({text, onPress, m, image, selected}: Props) => {
  return (
    <ContainerCard
      m={m ?? '4px'}
      activeOpacity={0.8}
      onPress={onPress}
      selected={selected}
    >
      <Image source={{uri: image}} />
      <TextEdit size="small">{text}</TextEdit>
    </ContainerCard>
  );
};
