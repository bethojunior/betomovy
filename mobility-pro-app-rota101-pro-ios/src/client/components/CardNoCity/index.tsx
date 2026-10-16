import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useAuth } from '../../../context/auth';
import { translate } from '../../locales';
import theme from '../../styles/theme';
import { If } from '../If';
import LottieView from 'lottie-react-native';
import {
  AlertContainer,
  Container,
  Title,
  SubTitle,
  ButtonsContainer,
  AlertButton,
  Separator,
  AnimationContainer
} from './styles';
import { useTrip } from '../../contexts/Trip';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CardNoCity = ({ onPress }) => {
  const { stateTripCustomer, showModalNoCity } = useTrip();
  const { showModalNoCity: open } = stateTripCustomer;
  const { cityConfig } = useAuth();

  useEffect(() => {
    const getItem = async (key: string) => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          return JSON.parse(value);
        }
      } catch (error) {
        console.error(error);
      }
      return null;
    };

    getItem('modalNoCity').then((value) => {
      if (value) {
        showModalNoCity(true);
      }
    });
  }, []);

  const onNavLinkWPP = async () => {
    try {
      const url = `https://wa.me/55${cityConfig?.supportContactNumber}/?text=Quero o app na minha cidade`;
      Linking.openURL(url);
    } catch (error) {
      console.error('Erro ao navegar', error);
    }
  };

  return (
    <If condition={open}>
      <Container>
        <AlertContainer>
          <AnimationContainer>
            <LottieView
                autoPlay
                style={{
                  width: '60%',
                }}
                source={require('../../assets/animation/NoCity.json')}
            />
          </AnimationContainer>

          <Title>
            {translate(
              'welcomeSpeedmob.this_city_is_not_yet_available_for_travel',
            )}
          </Title>
          <SubTitle>
            {translate(
              'welcomeSpeedmob.unable_to_load_cities_settings',
            )}
          </SubTitle>
          <Separator/>

          <ButtonsContainer>
            <AlertButton
              color={theme.colors.primary}
              mode="text"
              onPress={() => {
                showModalNoCity(false);
                onPress();
              }}>
              {translate('welcomeSpeedmob.back')}
            </AlertButton>
            <AlertButton
              color={theme.colors.primary}
              mode="text"
              onPress={onNavLinkWPP}>
              {translate('contactUs.contact_us')}
            </AlertButton>
          </ButtonsContainer>
        </AlertContainer>
      </Container>
    </If>
  );
};