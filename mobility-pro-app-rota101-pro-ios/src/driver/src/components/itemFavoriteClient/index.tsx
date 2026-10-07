import AntDesign from '@expo/vector-icons/AntDesign';
import {buildApp} from '../../../../constantBuild/config';
import {Avatar, Container, Content, Name} from './styles';
import theme from '../../styles/theme';
import { TouchableOpacity } from 'react-native';

interface Props {
  image?: string;
  name?: string;
  onPress?: () => void;
}

export function ItemFavoriteClient({image, name, onPress}: Props) {
  return (
    <Container>
      <Content>
        <Avatar
          source={{
            uri: `${buildApp().HOST_IMAGE_CUSTOMER}${image}`,
          }}
        />

        <Name>{name}</Name>
      </Content>

      <TouchableOpacity onPress={onPress} activeOpacity={1}>
        <AntDesign name="delete" size={24} color={theme.colors.black} />
      </TouchableOpacity>
    </Container>
  );
}
