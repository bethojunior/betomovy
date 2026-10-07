import { useNavigation } from '@react-navigation/native';
import { Publicity } from '~/interfaces/publicity';

import { ButtonCard, ContainerCard, ImageCard } from './styles';

interface Props {
  publicity: Publicity;
}

export default function CardPublicity({ publicity }: Props) {
  const navigation = useNavigation<any>();

  if (!publicity) return null;

  const onPress = () => {
    navigation.navigate('Publicity', { publicity });
  };

  return (
    <ContainerCard>
      <ButtonCard activeOpacity={0.8} onPress={onPress}>
        <ImageCard source={{ uri: publicity.banner }} resizeMode="stretch" />
      </ButtonCard>
    </ContainerCard>
  );
}
