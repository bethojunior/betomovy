import Ionicons from '@expo/vector-icons/Ionicons';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import theme from '../../styles/theme';
import {Container, IconMoney} from './styles';
import MoneyPng from '../../assets/images/money.png';
import {Alert} from 'react-native';
import { translate } from '../../locales';

interface Props {
  icon?: any;
}

export function NavRegister({icon}: Props) {
  const {goBack}: NavigationProp<ParamListBase> = useNavigation();

  const createAlertBack = () => {
    Alert.alert(
      translate('informChangeModal.title_alert_attention'),
      translate('login.goBack'),
      [
        {
          text: translate('informChangeModal.text_button_denied_alert'),
          onPress: () => {},
          style: 'cancel',
        },
        {text: translate('informChangeModal.text_button_confirmed_alert'), onPress: () => goBack()},
      ],
    );
  };

  return (
    <Container>
      <Ionicons
        name="chevron-back"
        size={40}
        color={theme.colors.primary}
        onPress={createAlertBack}
      />
      {!icon ? <IconMoney source={MoneyPng} /> : icon}

      {/* <Title>Cadastro de parceiro</Title> */}
    </Container>
  );
}
