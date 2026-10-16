import {useNavigation} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTheme} from 'styled-components/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {translate} from '../../locales';
import {
  BackButton,
  BackButtonText,
  Container,
  IconCircle,
  Subtitle,
  Title,
} from './styles';

export default function Freight() {
  const navigation: any = useNavigation();
  const {colors} = useTheme();

  return (
    <Container>
      <IconCircle>
        <MaterialCommunityIcons
          name="truck-delivery-outline"
          size={RFValue(48)}
          color={colors.primary}
        />
      </IconCircle>

      <Title>{translate('freight.coming_soon_title')}</Title>
      <Subtitle>{translate('freight.coming_soon_subtitle')}</Subtitle>

      <BackButton
        activeOpacity={0.8}
        onPress={() => navigation.navigate('TripRoutes', {screen: 'Home'})}
      >
        <BackButtonText>{translate('freight.back_to_mobility')}</BackButtonText>
      </BackButton>
    </Container>
  );
}
