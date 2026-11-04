import { useEffect, useState } from 'react';
import {
  ImageBackground,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  Platform,
  Share,
  Linking,
  Alert,
} from 'react-native';
import Icon from '@expo/vector-icons/AntDesign';
import { FontAwesome5, EvilIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import Icon1 from '@expo/vector-icons/FontAwesome';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import * as Application from 'expo-application';
import ArrowIcon from '@expo/vector-icons/Fontisto';
import iconGuest from '../../assets/images/shopping.png';
import { AvatarProfile } from '../../../components/AvatarProfile';
import ButtonOptionCustom from '../../components/form/ButtonOptionCustom';
import OptionSignInModal from '../../components/OptionSignInModal';
import ImageRoute from '../../assets/images/rotas.png';
import ImageWallet from '../../assets/images/wallet.png';
import { translate } from '../../locales';
import { Container, SimpleText, styles, VersionContainer } from './styles';
import { If } from '../../components/If';
import { customToast } from '../../../utils/FlashMessage';
import { useAuth } from '../../../context/auth';
import { OptionsProps } from '../../contexts/menu/types';
import { useMenu } from '../../contexts/menu';
import Preload from '../../components/Preload';
import Helper from '../../utils/Helper';
import theme from '../../styles/theme';
import { UserDriverService } from '../../../driver/src/context/userDriver/service';
import { LinkExternalActionType } from '../../../constants/LinkExternal';
import { userIndicationService } from '../../contexts/userIndication/services';
import { AppsId } from '../../../context/ConfigGlobal/constants';
import { useLocal } from '../../contexts/local';

import { buildApp } from '../../../constantBuild/config';
import { RFValue } from 'react-native-responsive-fontsize';

export default function Profile({ route }) {
  const { signOut, user, isGuest, generalSettings } = useAuth();
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const { position } = useLocal();
  const [loading, setLoading] = useState(false);
  const { getMenuOptions, optionsMenu, setOptionsMenu, externalLink } = useMenu();
  const sizeIcon = 25;
  const version = Application.nativeApplicationVersion;
  const service = UserDriverService();


  function handleSignOut() {
    signOut();
  }

  const onShare = async () => {
    try {
      const { data } = await userIndicationService.sharing({
        userId: user.idUser,
        phone: null,
        appId: Number(AppsId['CLIENTE FINAL']),
        formOfSharing: 'whatsapp',
        location: {
          latitude: position?.latitude || 0,
          longitude: position?.longitude || 0,
        },
      });
      const result = await Share.share({
        message: `${data?.data?.message}`,
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

  const onInitMenu = async () => {
    if (optionsMenu.length > 0) return;
    const response = await getMenuOptions();

    if (response) {
      setOptionsMenu(response);
    }
  };

  const verifyOptions = (options: OptionsProps[], key: string) => {
    if (options.length === 0) {
      return false;
    }

    const find = options.find(item => item.key === key);

    if (find.value === '1') {
      return true;
    }

    return false;
  };

  useEffect(() => {
    setLoading(true);
    onInitMenu();
    setLoading(false);
  }, []);

  if (isGuest) return <Guest />;
  const routeIf = route.params?.title;

  const openLink = (url: string) => {
    Linking.openURL(url || '');
  };

  const clickLinkExternal = (url, idMenuAction) => {
    if (externalLink.id !== '') {
      service.addAds(Number(externalLink.id));
    }
    if (!idMenuAction) {
      return openLink(url);
    }
    const publicity = {
      banner: externalLink?.linkImage,
      description: externalLink?.textImage,
      link: externalLink?.link,
      typeAction: idMenuAction,
      buttonCta: externalLink?.buttonCta || null,
      buttonsActions: externalLink?.buttonsActions || null,
      id: externalLink?.id,
    };
    switch (Number(idMenuAction)) {
      case LinkExternalActionType.ONLY_NAVIGATION:
        return openLink(url);
        break;
      case LinkExternalActionType.OPEN_WEBVIEW:
        navigate('Publicity', {
          publicity,
        });
        break;
      case LinkExternalActionType.OPEN_INTERACT_IMAGE:
        navigate('Publicity', {
          publicity,
        });
        break;
    }
  };

  return (
    <Container>
      <Preload visible={loading} />

      <ScrollView contentContainerStyle={styles.content}>
        <If condition={verifyOptions(optionsMenu, 'client_profile')}>
          <ButtonOptionCustom
            icon={<AvatarProfile uri={user?.profileImageLink || user?.profileImage} />}
            title={user != null && Helper.maskNames(user?.nameUser?.trim())}
            subtitle={translate('profile.text_subtitle_edit_profile')}
            onPress={() => {
              navigate('MyProfile');
            }}
          />
        </If>

        <If
          condition={
            routeIf !== 'Delivery' &&
            routeIf !== 'GetLight' &&
            verifyOptions(optionsMenu, 'client_trip')
          }
        >
          <ButtonOptionCustom
            title={translate('profile.text_title_my_travels')}
            icon={<Image style={styles.image} source={ImageRoute} />}
            onPress={() => {
              navigate('MyTravels');
            }}
          />
        </If>

        <If
          condition={
            routeIf !== 'Delivery' &&
            verifyOptions(optionsMenu, 'client_payment')
          }
        >
          <ButtonOptionCustom
            title={translate('profile.text_title_payment')}
            icon={<Image style={styles.image} source={ImageWallet} />}
            onPress={() => {
              navigate('PaymentPage');
            }}
          />
        </If>

        <If
          condition={
            routeIf !== 'Delivery' &&
            verifyOptions(optionsMenu, 'client_payment')
          }
        >
          <ButtonOptionCustom
            title={translate('paymentPage.title_cuopon')}
            icon={<Ionicons size={RFValue(sizeIcon)} name="ticket" />}
            onPress={() => {
              navigate('CouponsMobility');
            }}
          />
        </If>

        <If condition={routeIf !== 'GetLight' && routeIf !== 'Delivery'}>
          <ButtonOptionCustom
            title={translate('profile.text_title_transfer')}
            icon={<ArrowIcon size={sizeIcon} name="arrow-swap" />}
            onPress={() => {
              navigate('Transfer');
            }}
          />
        </If>

        <If
          condition={
            routeIf !== 'Delivery' &&
            routeIf !== 'GetLight' &&
            verifyOptions(optionsMenu, 'client_indication')
          }
        >
          <ButtonOptionCustom
            title={translate('profile.text_title_indications')}
            icon={<Icon1 size={sizeIcon} name="users" />}
            onPress={() => {
              navigate('IndicationPage');
            }}
          />
        </If>
        <If
          condition={
            routeIf === 'Delivery' &&
            verifyOptions(optionsMenu, 'client_indication')
          }
        >
          <ButtonOptionCustom
            title={translate('appRoutes.title_coupons')}
            icon={<Icon size={sizeIcon} name="tags" />}
            onPress={() => {
              navigate('Coupons');
            }}
          />
        </If>

        <If
          condition={
            routeIf !== 'Delivery' &&
            routeIf !== 'GetLight' &&
            Helper.generalSettingsActive(
              generalSettings,
              'enable_favorite_customer_and_driver',
            )
          }
        >
          <ButtonOptionCustom
            title={translate('profile.text_title_favorite_drivers')}
            icon={<Icon size={sizeIcon} name="star" />}
            onPress={() => {
              navigate('Favorites');
            }}
          />
        </If>

        <ButtonOptionCustom
          title={translate('profile.text_title_adresses')}
          onPress={() => {
            navigate('Local');
          }}
          icon={<Icon1 size={sizeIcon} name="map-o" />}
        />
        <ButtonOptionCustom
          title={translate('language.title')}
          onPress={() => {
            navigate('Languages');
          }}
          icon={<Icon1 size={sizeIcon} name="flag" />}
        />
        <ButtonOptionCustom
          title="Política de Privacidade"
          onPress={() => {
            Linking.openURL('https://movymob.com/privacy');
          }}
          icon={<Ionicons size={sizeIcon} name="shield-checkmark-outline" color={theme.colors.secondary} />}
        />
        <If condition={verifyOptions(optionsMenu, 'client_share')}>
          <ButtonOptionCustom
            title={translate('myProfile.share_app')}
            icon={<Icon1 size={sizeIcon} name="share-square-o" />}
            onPress={onShare}
          />
        </If>

        {/* <If condition={verifyOptions(optionsMenu, 'client_contact_us')}> */}
        <ButtonOptionCustom
          title={translate('contactUs.contact_us')}
          icon={
            <FontAwesome5 name="hands-helping" size={sizeIcon} color="black" />
          }
          onPress={() => navigate('ContactUs')}
        />
        {/* </If> */}

        <If
          condition={externalLink && Object.keys(externalLink || {}).length > 0}
        >
          <ButtonOptionCustom
            title={externalLink?.description}
            icon={
              <EvilIcons
                size={sizeIcon}
                name="external-link"
                color={theme.colors.secondary}
              />
            }
            onPress={() =>
              clickLinkExternal(
                externalLink?.link,
                externalLink?.menuAppTypeAction,
              )
            }
          />
        </If>

        {__DEV__ && (
          <ButtonOptionCustom
            icon={<MaterialIcons name="developer-mode" size={25} color={theme.colors.secondary} />}
            title="Desenvolvedor"
            onPress={() => navigate('DevMenu')}
          />
        )}

        <ButtonOptionCustom
          title={translate('profile.text_title_sign_out')}
          icon={<Icon size={sizeIcon} name="logout" />}
          onPress={() => handleSignOut()}
        />
      </ScrollView>

      <VersionContainer>
        <SimpleText>{translate('commom.version')}: {version}</SimpleText>
      </VersionContainer>
    </Container>
  );
}

function Guest() {
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const [visible, setVisible] = useState(false);
  const { disablePhoneLogin } = useAuth();

  return (
    <>
      <View style={styles.containerGuest}>
        <ImageBackground
          source={iconGuest}
          resizeMode="cover"
          style={styles.iconGuest}
        />
        <Text style={styles.labelGuest}>
          {translate('profile.text_explore_more_with_your_account')}
        </Text>
        <TouchableOpacity
          style={styles.buttonGuest}
          onPress={() => {
            // eslint-disable-next-line radix
            if (Platform.OS === 'ios' || parseInt(disablePhoneLogin.value)) {
              navigate('Login');
              return;
            }

            setVisible(true);
          }}
        >
          <Text style={styles.buttonTextGuest}>
            {translate('profile.text_login_or_register')}
          </Text>
        </TouchableOpacity>
      </View>
      <OptionSignInModal
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </>
  );
}
