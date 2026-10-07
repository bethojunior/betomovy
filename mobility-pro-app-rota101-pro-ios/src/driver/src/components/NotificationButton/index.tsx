import {Linking, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons, Feather} from '@expo/vector-icons';
import {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';

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
import Logo from '../../../../client/assets/images/perfil-de-usuario.png';
import Preload from '../Preload';
import {If} from '../If';
import {useAuth} from '../../../../context/auth';
import {customToast} from '../../../../utils/FlashMessage';
import {translate} from '../../../../client/locales';
import {buildApp} from '../../../../constantBuild/config';
import theme from '../../styles/theme';
import ModalFrame from '../Modal/ModalFrame';
import {RFValue} from 'react-native-responsive-fontsize';

interface NotificationItem {
  viewed: string;
  idNotification: number;
  title: string;
  message: string;
  link: string;
}

interface Props {
  isAnimating?: boolean;
  onPress?: () => void;
}

export default function NotificationButton({
  isAnimating = false,
  onPress,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(true);
  const [hasNotify, setHasNotify] = useState(true);

  const {notification, getNotification, user, userDriver} = useAuth();

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

  const readNotification = (id: number) => {
    setLoading(true);
    apiMain
      .post('notification/viewed', {
        idUser:
          Object.keys(userDriver).length > 0 ? userDriver?.idUser : user.idUser,
        notifications: [id],
      })
      .then(({data}) => {
        setLoading(false);

        if (!data.status) {
          return customToast(
            translate('notification.text_error_load'),
            'danger',
          );
        }

        return getNotification();
      });
  };

  const transformPath = () => {
    const arrayString = buildApp().HOST_IMAGE_DRIVER.split('/');
    arrayString.splice(-4);
    return `${arrayString.join('/')}/`;
  };

  const Card = (data: any) => {
    const {item} = data;
    return (
      <Content viewed={item.viewed} key={item.idNotification}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
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
                <Text style={{color: theme.colors.primaryText, fontSize: 12}}>
                  {translate('notification.text_see_more')}
                </Text>
              </LinkButton>
              <ReadButton
                viewed={item.viewed}
                onPress={() => {
                  readNotification(item.idNotification);
                }}
              >
                <Text style={{color: theme.colors.primaryText, fontSize: 12}}>
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
        onPress={() => {
          onPress();
          setShowModal(true);
        }}
      >
        <If condition={isAnimating}>
          <Feather
            name="bell"
            size={30}
            color={
              showAlert ? theme.colors.primary : theme.colors.background_global
            }
          />
        </If>
        <If condition={!isAnimating}>
          <Alert showAlert={showAlert} />
          <Ionicons
            name="notifications"
            size={RFValue(24)}
            color={theme.colors.primaryText}
          />
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
                  return Card({item, index});
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
