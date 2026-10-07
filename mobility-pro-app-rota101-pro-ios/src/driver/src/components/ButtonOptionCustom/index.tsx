import {View, TouchableNativeFeedback} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import {useTheme} from 'styled-components';
import {SubTitle, Title, Container, Content, IconContent} from './styles';

export default function ButtonOptionCustom(props) {
  const {colors} = useTheme();
  const {icon, title, subtitle, onPress} = props;
  return (
    <View>
      <TouchableNativeFeedback onPress={onPress}>
        <Container>
          <IconContent>{icon}</IconContent>
          <Content>
            <Title>{title}</Title>
            {subtitle ? <SubTitle>{subtitle}</SubTitle> : null}
          </Content>
          <Icon
            name="chevron-right"
            size={13}
            style={{
              position: 'absolute',
              right: 15,
              color: colors.secondary,
            }}
          />
        </Container>
      </TouchableNativeFeedback>
    </View>
  );
}
