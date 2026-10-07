import {Share} from 'react-native';
import {Ionicons, FontAwesome, Entypo} from '@expo/vector-icons';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

import ButtonOptionCustom from '../../../components/form/ButtonOptionCustom';
import ItemsTripSpeedMob from '../../../components/ItemsTripSpeedMob';
import {customToast} from '../../../../utils/FlashMessage';

import {useAuth} from '../../../../context/auth';

import {translate} from '../../../locales';

import theme from '../../../styles/theme';

import {
  Container,
  BodyMenu,
  HeaderMenu,
  ContentUser,
  ButtonBack,
} from './styles';

export default function ProfileSpeedMob() {
  const {user, signOut, generalSettings, userData} = useAuth();
  const navigation = useNavigation();

  const handleSignOut = () => {
    signOut();
  };

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
                source={{uri: user && user.profileImageLink}}
              />
            }
            title={user && user.nameUser}
            subtitle={Number(userData?.rating).toFixed(1)+ '★'}
            isSpeedMob={true}
            colorsText={theme.colors.background_global}
          />
        </ContentUser>
      </HeaderMenu>
      <BodyMenu>
        <ItemsTripSpeedMob
          icon={<Ionicons name="home" size={25} color={theme.colors.primary} />}
          name={translate('profile.text_title_perfil')}
          onPress={() => {
            navigation.navigate('MyProfileSpeedMob');
          }}
        />

        <ItemsTripSpeedMob
          icon={
            <FontAwesome name="road" size={25} color={theme.colors.primary} />
          }
          name={translate('profile.text_title_my_travels')}
          onPress={() => {
            navigation.navigate('MyTravelsSpeedMob');
          }}
        />

        <ItemsTripSpeedMob
          icon={
            <Ionicons name="heart" size={25} color={theme.colors.primary} />
          }
          name={translate('profile.text_title_favorite_drivers')}
          onPress={() => {
            navigation.navigate('FavoritesSpeedMob');
          }}
        />

        <ItemsTripSpeedMob
          icon={<Ionicons name="card" size={25} color={theme.colors.primary} />}
          name={translate('profile.text_title_payment')}
          onPress={() => {
            navigation.navigate('PaymentPageSpeedMob');
          }}
        />

        <ItemsTripSpeedMob
          icon={
            <Ionicons
              name="share-social"
              size={25}
              color={theme.colors.primary}
            />
          }
          name={translate('myProfile.share_app')}
          onPress={onShare}
        />
        <ItemsTripSpeedMob
          icon={
            <Entypo name="message" size={25} color={theme.colors.primary} />
          }
          name={translate('contactUs.contact_us')}
          onPress={() => {
            navigation.navigate('ContactUsSpeedMob');
          }}
        />

        <ItemsTripSpeedMob
          icon={<Ionicons name="exit" size={25} color={theme.colors.primary} />}
          name={translate('profile.text_title_sign_out')}
          onPress={() => handleSignOut()}
        />
      </BodyMenu>
    </Container>
  );
}
