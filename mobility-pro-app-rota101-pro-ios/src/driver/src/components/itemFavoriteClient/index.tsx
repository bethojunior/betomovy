import AntDesign from '@expo/vector-icons/AntDesign';
import {buildApp} from '../../../../constantBuild/config';
import {Avatar, Container, Content, Name} from './styles';
import theme from '../../styles/theme';
import {TouchableOpacity} from 'react-native';
import {useStoragePictures} from '../../hooks/useStoragePictures';

interface Props {
  image?: string;
  name?: string;
  onPress?: () => void;
}

export function ItemFavoriteClient({image, name, onPress}: Props) {
  const {getStoragePictureSpecific} = useStoragePictures();
  return (
    <Container>
      <Content>
        <Avatar
          source={{
            uri: `${
              getStoragePictureSpecific('customer') ||
              buildApp().HOST_IMAGE_CUSTOMER
            }${image}`,
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
