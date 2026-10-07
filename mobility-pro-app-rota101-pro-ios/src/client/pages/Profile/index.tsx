// @ts-nocheck
import {useEffect, useState} from 'react';
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
} from 'react-native';
import {Avatar} from 'react-native-elements';
import Icon from '@expo/vector-icons/AntDesign';
import {FontAwesome5, EvilIcons} from '@expo/vector-icons';
import Icon1 from '@expo/vector-icons/FontAwesome';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import * as Application from 'expo-application';
import ArrowIcon from '@expo/vector-icons/Fontisto';
import imageUser from '../../assets/images/user.png';
import iconGuest from '../../assets/images/shopping.png';
import ButtonOptionCustom from '../../components/form/ButtonOptionCustom';
import OptionSignInModal from '../../components/OptionSignInModal';
import ImageRoute from '../../assets/images/rotas.png';
import ImageWallet from '../../assets/images/wallet.png';
import {translate} from '../../locales';
import {Container, SimpleText, styles} from './styles';
import {If} from '../../components/If';
import {customToast} from '../../../utils/FlashMessage';
import {useAuth} from '../../../context/auth';
import {OptionsProps} from '../../contexts/menu/types';
import {useMenu} from '../../contexts/menu';
import Preload from '../../components/Preload';
import Helper from '../../utils/Helper';
import theme from '../../styles/theme';

export default function Profile({route}) {
  const {signOut, user, isGuest, generalSettings} = useAuth();
  const {navigate}: NavigationProp<ParamListBase> = useNavigation();
  const [loading, setLoading] = useState(false);
  const {getMenuOptions, optionsMenu, setOptionsMenu, externalLink} = useMenu();
  const sizeIcon = 25;
  const version = Application.nativeApplicationVersion;

  function handleSignOut() {
    signOut();
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `${
          generalSettings.find(item => item.key === 'appSharingCustomerMessage')
            .value
        } ${generalSettings
          .find(item => item.key === 'link_customer_pre_register')
          .value.replace('{userId}', user.idUser)}`,
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
      customToast('Erro ao Compartilhar', 'error');
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

  return (
    <Container>
      <Preload visible={loading} />
      <If condition={verifyOptions(optionsMenu, 'client_profile')}>
        <ButtonOptionCustom
          icon={
            <Avatar
              size="large"
              rounded
              source={user != null ? {uri: user.profileImageLink} : imageUser}
            />
          }
          title={user != null && Helper.maskNames(user.nameUser.trim())}
          subtitle={translate('profile.text_subtitle_edit_profile')}
          onPress={() => {
            navigate('MyProfile');
          }}
        />
      </If>

      <ScrollView style={styles.content}>
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
            icon={<Icon size={sizeIcon} name="tagso" />}
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
            icon={<Icon size={sizeIcon} name="staro" />}
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

        <If condition={Object.keys(externalLink || {}).length > 0}>
          <ButtonOptionCustom
            title={externalLink.description}
            icon={
              <EvilIcons
                size={sizeIcon}
                name="external-link"
                color={theme.colors.secondary}
              />
            }
            onPress={() => openLink(externalLink.link)}
          />
        </If>

        <ButtonOptionCustom
          title={translate('profile.text_title_sign_out')}
          icon={<Icon size={sizeIcon} name="logout" />}
          onPress={() => handleSignOut()}
        />
      </ScrollView>
      <SimpleText style={styles.versionNumber}>{version}</SimpleText>
    </Container>
  );
}

function Guest() {
  const {navigate}: NavigationProp<ParamListBase> = useNavigation();
  const [visible, setVisible] = useState(false);
  const {disablePhoneLogin} = useAuth();

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
