import {useNavigation} from '@react-navigation/native';
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
} from '@expo/vector-icons';
import {Linking, View} from 'react-native';
import Helper from '../../../utils/Helper';

import {useState} from 'react';
import {buildApp} from '../../../../../constantBuild/config';

import {customToast} from '../../../../../utils/FlashMessage';

import {translate} from '../../../../../client/locales';

import {useUserDriver} from '../../../context/userDriver';
import {useAuth} from '../../../../../context/auth';

import Preload from '../../../components/Preload';

import {
  Container,
  ButtonBack,
  Header,
  Logo,
  Body,
  ContentInformationDriver,
  ContentOptions,
  Description,
  NameDriver,
  ImageDriver,
  NumberInformationDriver,
  ContentRow,
  Item,
  ItemText,
} from './styles';

import theme from '../../../styles/theme';

export default function ProfileSpeedMob() {
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation();

  const {userDriverFind} = useUserDriver();

  const {signOutDriver, cityConfig} = useAuth();

  const onNavLinkWPP = async () => {
    try {
      const url = `https://wa.me/55${cityConfig?.supportContactNumber}/`;
      Linking.openURL(url);
    } catch (error) {
      customToast('Erro ao navegar', 'danger');
    }
  };

  return (
    <Container>
      <Preload visible={loading} />
      {(
        <>
          <Header backgroundColor={theme.colors.background_white}>
            <ButtonBack onPress={() => navigation.goBack()}>
              <Ionicons
                name="arrow-back"
                size={30}
                color={theme.colors.primary}
              />
            </ButtonBack>
            <Logo
              source={{
                uri: theme.images.logo,
              }}
            />
          </Header>
          <Body>
            <ContentInformationDriver
              backgroundColor={theme.colors.primary}
            >
              <ImageDriver
                source={{
                  uri: `${buildApp().HOST_IMAGE_DRIVER}${
                    userDriverFind.profileImage
                  }`,
                }}
              />
              <NameDriver colorText={theme.colors.background_global}>
                {Helper.maskNames(userDriverFind.name.trim())}
              </NameDriver>
              {userDriverFind.car && (
                <Description
                  colorText={theme.colors.background_global}
                >{`${userDriverFind.car.model} - ${userDriverFind.car.plate}`}</Description>
              )}

              <ContentRow>
                <View>
                  <NumberInformationDriver
                    colorText={theme.colors.background_global}
                  >
                    {userDriverFind.total_finished_trip}
                  </NumberInformationDriver>
                  <Description colorText={theme.colors.background_global}>
                    {translate('driverhome.modal_header')}
                  </Description>
                </View>
                <View>
                  <NumberInformationDriver
                    colorText={theme.colors.background_global}
                  >
                    {userDriverFind.rating
                      ? parseFloat(userDriverFind?.rating).toPrecision(2)
                      : '0.0'}
                  </NumberInformationDriver>
                  <Description colorText={theme.colors.background_global}>
                    Avaliação
                  </Description>
                </View>
              </ContentRow>
            </ContentInformationDriver>
            <ContentOptions>
              <Item onPress={() => navigation.navigate('EditProfileSpeedMob')}>
                <Ionicons name="pencil" color={theme.colors.black} size={25} />
                <ItemText>{translate('menu.text_edit_profile')}</ItemText>
              </Item>
              <Item onPress={() => navigation.navigate('AccountSpeedMob')}>
                <MaterialIcons
                  name="attach-money"
                  color={theme.colors.black}
                  size={25}
                />
                <ItemText>{translate('menu.text_account_bank')}</ItemText>
              </Item>
              <Item onPress={() => onNavLinkWPP()}>
                <Ionicons name="warning" color={theme.colors.black} size={25} />
                <ItemText>{translate('menu.text_problem')}</ItemText>
              </Item>
              <Item onPress={() => navigation.navigate('VehicleSpeedMob')}>
                <FontAwesome5 name="car" color={theme.colors.black} size={25} />
                <ItemText>{translate('menu.text_vehicle')}</ItemText>
              </Item>
              <Item onPress={() => navigation.navigate('ConfigSpeedMob')}>
                <FontAwesome name="gear" color={theme.colors.black} size={25} />
                <ItemText>{translate('menu.text_config')}</ItemText>
              </Item>
              <Item onPress={() => signOutDriver()}>
                <Ionicons name="exit-outline" color={theme.colors.black} size={25} />
                <ItemText>{translate('menu.text_logout')}</ItemText>
              </Item>
            </ContentOptions>
          </Body>
        </>
      )}
    </Container>
  );
}
