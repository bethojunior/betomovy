import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import { Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ButtonOptionCustom from '.././../../../../client/components/form/ButtonOptionCustom';

import { buildApp } from '../../../../../constantBuild/config';

import { translate } from '../../../../../client/locales';

import { customToast } from '../../../../../utils/FlashMessage';

import {
  Container,
  BodyMenu,
  HeaderMenu,
  ContentUser,
  ButtonBack,
  ItemMenu,
  TextMenu,
} from './styles';

import { useUserDriver } from '../../../context/userDriver';
import { useAuth } from '../../../../../context/auth';

import theme from '../../../styles/theme';
import { useStoragePictures } from '../../../hooks/useStoragePictures';

const CODE_TAXI = '3';

export default function ProfileSpeedMob() {
  const { userDriverFind } = useUserDriver();
  const { signOutDriver, generalSettings } = useAuth();
  const { getStoragePictureSpecific } = useStoragePictures();

  const navigation = useNavigation();

  function removeAcento(text: string) {
    text = text.toLowerCase();
    text = text.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]', 'gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]', 'gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]', 'gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]', 'gi'), 'u');
    text = text.replace(new RegExp('[Ç]', 'gi'), 'c');
    return text;
  }

  function createCodeFavorite() {
    const name = removeAcento(userDriverFind?.nickname)?.split('');

    const type = userDriverFind?.userTypeId === CODE_TAXI ? 'T' : 'P';

    const characters = `${name[0].toUpperCase()}${name[
      name.length - 1
    ].toUpperCase()}`;

    const code = `${`00000${userDriverFind.idDriver}`.slice(-5)}`;

    return `${characters}${code}${type}`;
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${generalSettings.find(item => item.key === 'appSharingCustomerMessage')
            .value
          } ${generalSettings
            .find(item => item.key === 'link_customer_pre_register')
            .value.replace('{userId}', userDriverFind.userId)}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      customToast(translate('toast.text_share_error'), 'danger');
    }
  };

  const onShareDriver = async () => {
    try {
      const result = await Share.share({
        message: `${generalSettings.find(item => item.key === 'appSharingCustomerMessage')
            .value
          } ${generalSettings
            .find(item => item.key === 'link_driver_pre_register')
            .value.replace('{userId}', userDriverFind.userId)}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      customToast(translate('toast.text_share_error'), 'danger');
    }
  };

  return (
    <Container>
      <HeaderMenu color={theme.colors.primary}>
        <ButtonBack
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back"
            size={30}
            color={theme.colors.background_global}
          />
        </ButtonBack>
        <ContentUser>
          <ButtonOptionCustom
            icon={
              <Avatar
                size="large"
                rounded
                source={
                  userDriverFind != null && {
                    uri: `${getStoragePictureSpecific('driver') ||
                      buildApp().HOST_IMAGE_DRIVER
                      }${userDriverFind.profileImage}`,
                  }
                }
              />
            }
            title={userDriverFind && userDriverFind.name}
            subtitle={`${translate(
              'menu.code_driver',
            )} - ${createCodeFavorite()}`}
            isSpeedMob={true}
            colorsText={theme.colors.background_global}
          />
        </ContentUser>
      </HeaderMenu>
      <BodyMenu>
        <ItemMenu onPress={() => navigation.navigate('ProfileSpeedMob')}>
          <TextMenu color={theme.colors.primary}>
            {translate('menu.text_name_perfil')}
          </TextMenu>
        </ItemMenu>
        <ItemMenu onPress={() => navigation.navigate('MyTripsSpeedMob')}>
          <TextMenu color={theme.colors.primary}>
            {translate('menu.text_my_trips')}
          </TextMenu>
        </ItemMenu>
        <ItemMenu onPress={() => navigation.navigate('ZoneDynamicSpeedMob')}>
          <TextMenu color={theme.colors.primary}>
            {translate('menu.text_dynamic_zone')}
          </TextMenu>
        </ItemMenu>
        <ItemMenu onPress={() => navigation.navigate('ListClientSpeedMob')}>
          <TextMenu color={theme.colors.primary}>
            {translate('menu.text_client')}
          </TextMenu>
        </ItemMenu>
        <ItemMenu onPress={() => navigation.navigate('AccountSpeedMob')}>
          <TextMenu color={theme.colors.primary}>
            {translate('menu.text_account_bank')}
          </TextMenu>
        </ItemMenu>
        <ItemMenu onPress={onShareDriver}>
          <TextMenu color={theme.colors.primary}>
            {translate('menu.share_app_driver')}
          </TextMenu>
        </ItemMenu>
        <ItemMenu onPress={onShare}>
          <TextMenu color={theme.colors.primary}>
            {translate('menu.share_app')}
          </TextMenu>
        </ItemMenu>
        <ItemMenu onPress={() => signOutDriver()}>
          <TextMenu color={theme.colors.primary}>
            {translate('menu.text_logout')}
          </TextMenu>
        </ItemMenu>
      </BodyMenu>
    </Container>
  );
}
