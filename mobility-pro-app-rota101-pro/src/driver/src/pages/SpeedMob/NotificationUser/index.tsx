import * as Notifications from 'expo-notifications';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {Linking} from 'react-native';

import {useState, useEffect} from 'react';

import apiMain from '../../../../../client/api/apiMain';

import {customToast} from '../../../../../utils/FlashMessage';

import {translate} from '../../../../../client/locales';

import {useAuth} from '../../../../../context/auth';

import Preload from '../../../components/Preload';

import {
  Container,
  ButtonBack,
  Header,
  TitleHeader,
  Body,
  ContentNotifications,
  ContentCard,
  ButtonNotify,
  DescriptionNotify,
  TextButtonNotify,
  TitleNotify,
  MessageNotFound,
  ContentButtonsNotify,
} from './styles';

import theme from '../../../styles/theme';

interface NotificationItem {
  viewed: string;
  idNotification: number;
  title: string;
  message: string;
  link: string;
}

export default function NotificationUser() {
  const {notification, getNotification, user, userDriver} = useAuth();

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(true);
  const [hasNotify, setHasNotify] = useState(true);

  const navigation = useNavigation();

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
      .then(({data}) => {
        if (!data.status) {
          return customToast(
            translate('notification.text_error_load'),
            'danger',
          );
        }

        return getNotification();
      })
      .catch((error) => {
        console.log(error);
      });
      setLoading(false);
  };

  const Card = (data: NotificationItem) => {
    return (
      <ContentCard key={data.idNotification}>
        <TitleNotify viewed={data.viewed}>{data.title}</TitleNotify>
        <DescriptionNotify>{data.message}</DescriptionNotify>
        <ContentButtonsNotify>
          {data.link && (
            <>
              <ButtonNotify
                backgroundColor={theme.colors.primary}
                onPress={() => Linking.openURL(data.link)}
              >
                <TextButtonNotify colorText={theme.colors.background_global}>
                  {translate('notification.text_see_more')}
                </TextButtonNotify>
              </ButtonNotify>
            </>
          )}

          {data.viewed === '0' && (
            <ButtonNotify
              backgroundColor={theme.colors.background_global}
              onPress={() => readNotification(data.idNotification)}
            >
              <TextButtonNotify
                viewed={data.viewed}
                colorText={theme.colors.primary}
              >
                {translate('notification.text_mark_viewed')}
              </TextButtonNotify>
            </ButtonNotify>
          )}
        </ContentButtonsNotify>
      </ContentCard>
    );
  };

  return (
    <Container>
      <Preload visible={loading} />
      <Header backgroundColor={theme.colors.primary}>
        <ButtonBack onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            color={theme.colors.background_global}
            size={30}
          />
        </ButtonBack>
        <TitleHeader colorText={theme.colors.background_global}>
          {translate('notification.title')}
        </TitleHeader>
      </Header>

      <Body>
        <ContentNotifications>
          {hasNotify ? (
            notification.map((item: NotificationItem) => {
              return Card(item);
            })
          ) : (
            <MessageNotFound>
              {translate('notification.text_empty')}
            </MessageNotFound>
          )}
        </ContentNotifications>
      </Body>
    </Container>
  );
}
