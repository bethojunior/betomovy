import { Linking, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import { useTheme } from 'styled-components/native';
import ModalFrame from '../form/Modal';

import {
  Alert,
  ButtonFilterAll,
  ButtonFilterNew,
  Content,
  ContentButtonFilter,
  ContentButtonNotify,
  ContentInfo,
  GeneralContent,
  Hearder,
  IconNotify,
  LinkButton,
  Message,
  ReadButton,
  TextButtonFilter,
  TextNoNotify,
  Title,
  TitleNotify,
} from './styles';
import apiMain from '../../api/apiMain';
import Logo from '../../assets/images/perfil-de-usuario.png';
import Preload from '../Preload';
import { translate } from '../../locales';
import { useAuth } from '../../../context/auth';
import { buildApp } from '../../../constantBuild/config';
import { customToast } from '../../../utils/FlashMessage';
import { If } from '../If';
import { useStoragePictures } from '../../../driver/src/hooks/useStoragePictures';
import { RFValue } from 'react-native-responsive-fontsize';

interface NotificationItem {
  viewed: string;
  idNotification: number;
  title: string;
  message: string;
  link: string;
}

interface Props {
  isAnimating?: boolean;
  marginR?: number;
}

export default function NotificationButton({
  isAnimating = false,
  marginR,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(true);
  const [hasNotify, setHasNotify] = useState(true);
  const { getStoragePictureSpecific } = useStoragePictures();

  const { notification, getNotification, user, userDriver } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    if (notification === null) {
      getNotification();
    }

    if (
      notification.length !== 0 &&
      notification.some((item: NotificationItem) => item.viewed === '0')
    ) {
      return setShowAlert(true);
    }

    return setShowAlert(false);
  }, [notification, Notifications]);

  useEffect(() => {
    if (notification === null || notification.length === 0) {
      return setHasNotify(false);
    }

    if (
      !notification.some((item: NotificationItem) => item.viewed === '0') &&
      filter
    ) {
      return setHasNotify(false);
    }

    if (notification.length === 0 && !filter) {
      return setHasNotify(false);
    }

    return setHasNotify(true);
  }, [filter, notification]);

  const readNotification = async (id: number) => {
    setLoading(true);
    await apiMain
      .post('notification/viewed', {
        idUser:
          userDriver && Object.keys(userDriver).length > 0
            ? userDriver?.idUser
            : user.idUser,
        notifications: [id],
      })
      .then(({ data }) => {
        if (!data.status) {
          return customToast(
            translate('notification.text_error_load'),
            'danger',
          );
        }

        return getNotification();
      })
      .catch(error => {
        console.log(error);
      });
    setLoading(false);
  };

  const transformPath = () => {
    const arrayString =
      getStoragePictureSpecific('driver')?.split('/') ||
      buildApp().HOST_IMAGE_DRIVER?.split('/');
    arrayString.splice(-4);
    return `${arrayString.join('/')}/`;
  };

  const Card = (data: any) => {
    const { item } = data;
    return (
      <Content viewed={item.viewed} key={item.idNotification}>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <IconNotify
            source={
              item.image === null
                ? Logo
                : {
                  uri: `${transformPath()}${item.image}`,
                }
            }
          />
          <ContentInfo>
            <TitleNotify>{item.title}</TitleNotify>
            <Message>{item.message}</Message>
            <ContentButtonNotify>
              <LinkButton
                show={item.link}
                onPress={() => Linking.openURL(item.link)}
              >
                <Text style={{ color: colors.primaryText, fontSize: 12 }}>
                  {translate('notification.text_see_more')}
                </Text>
              </LinkButton>
              <ReadButton
                viewed={item.viewed}
                onPress={() => {
                  readNotification(item.idNotification);
                }}
              >
                <Text style={{ color: colors.primaryText, fontSize: 12 }}>
                  {translate('notification.text_mark_viewed')}
                </Text>
              </ReadButton>
            </ContentButtonNotify>
          </ContentInfo>
        </View>
      </Content>
    );
  };

  return (
    <>
      <Preload visible={loading} />
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={{ marginRight: marginR ?? 10 }}
      >
        <If condition={isAnimating}>
          <Feather
            name="bell"
            size={RFValue(18)}
            color={showAlert ? colors.primary : colors.background_global}
          />
        </If>
        <If condition={!isAnimating}>
          <Alert showAlert={isAnimating ? !showAlert : showAlert} />
          <Ionicons name="notifications" size={RFValue(18)} color={colors.secondary} />
        </If>
      </TouchableOpacity>

      <ModalFrame
        visible={showModal}
        setVisible={setShowModal}
        onPressConfirm={() => {
          setShowModal(false);
          setFilter(true);
        }}
        hideCancel
        textConfirm={translate('tripPreAccepted.text_close')}
        onClose={() => {
          setShowModal(false);
        }}
      >
        <GeneralContent>
          <Hearder>
            <Title>{translate('notification.title')}</Title>
            <ContentButtonFilter>
              <ButtonFilterNew
                isActive={filter}
                onPress={() => setFilter(true)}
              >
                <TextButtonFilter isActive={filter}>
                  {translate('notification.text_new')}
                </TextButtonFilter>
              </ButtonFilterNew>
              <ButtonFilterAll
                isActive={filter}
                onPress={() => setFilter(false)}
              >
                <TextButtonFilter isActive={!filter}>
                  {translate('notification.text_all')}
                </TextButtonFilter>
              </ButtonFilterAll>
            </ContentButtonFilter>
          </Hearder>
          <ScrollView>
            {hasNotify ? (
              notification
                .filter((data: NotificationItem) => {
                  return filter ? data.viewed === '0' : data;
                })
                .map((item: any, index: number) => {
                  return Card({ item, index });
                })
            ) : (
              <TextNoNotify>
                {translate('notification.text_empty')}
              </TextNoNotify>
            )}
          </ScrollView>
        </GeneralContent>
      </ModalFrame>
    </>
  );
}
