import {Entypo} from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native';
import {Container, Content, Title, Logo} from './styles';

import theme from '../../styles/theme';

interface Props {
  name: string;
  picture: string;
  onPress: () => void;
}

export function ItemCategory({name, picture, onPress}: Props) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Container>
        <Content>
          {picture ? (
            <Logo
              source={{
                uri: picture,
              }}
              resizeMode="stretch"
            />
          ) : (
            <FontAwesome
              name="photo"
              style={{fontSize: 60}}
              color={theme.colors.primary}
            />
          )}

          <Title>{name}</Title>
        </Content>

        <Entypo
          name="chevron-right"
          style={{marginLeft: 10, fontSize: 23}}
          color={theme.colors.secondary}
        />
      </Container>
    </TouchableOpacity>
  );
}
