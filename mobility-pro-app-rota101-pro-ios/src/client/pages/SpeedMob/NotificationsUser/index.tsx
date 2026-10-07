import {
  Container,
  Body,
  Header,
  TitleHeader,
  ButtonBack,
  ContentNotifications,
  ContentCard,
  MessageCard,
  TitleCard,
  ButtonCard,
  TextButtonCard,
  ContentButtonCard,
  MessageNotFound,
} from './styles';

import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {Linking} from 'react-native';

import {translate} from '../../../locales';

import {useAuth} from '../../../../context/auth';

import {IfLoaderInsideScreen} from '../../../components/IfLoaderInsideScreen';
import Preload from '../../../components/Preload';
import {customToast} from '../../../../utils/FlashMessage';
import apiMain from '../../../api/apiMain';

import theme from '../../../styles/theme';

interface NotificationItem {
  viewed: '0' | '1';
  idNotification: number;
  title: string;
  message: string;
  link: string;
}

export default function NotificationUser() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingScreen, setLoadingScreen] = useState<boolean>(false);

  const {notification, getNotification, user, userDriver} = useAuth();

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

  useEffect(() => {
    if (notification === null) {
      getNotification();
    }
  }, []);

  function CardNotification(data: NotificationItem) {
    return (
      <ContentCard key={data.idNotification}>
        <TitleCard isMarked={data.viewed}>{data.title}</TitleCard>
        <MessageCard>{data.message}</MessageCard>
        <ContentButtonCard>
          <ButtonCard
            colorButton={theme.colors.primary}
            onPress={() => Linking.openURL(data.link)}
          >
            <TextButtonCard colorText={theme.colors.background_global}>
              {translate('notification.text_see_more')}
            </TextButtonCard>
          </ButtonCard>
          {data.viewed !== '1' && (
            <ButtonCard
              colorButton={theme.colors.background_global}
              onPress={() => readNotification(data.idNotification)}
            >
              <TextButtonCard colorText={theme.colors.primary}>
                {translate('notification.text_mark_viewed')}
              </TextButtonCard>
            </ButtonCard>
          )}
        </ContentButtonCard>
      </ContentCard>
    );
  }

  return (
    <Container>
      <Preload visible={loading} />
      <Header backgroundColor={theme.colors.primary}>
        <ButtonBack onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color={theme.colors.background_global} />
        </ButtonBack>
        <TitleHeader colorText={theme.colors.background_global}>
          {translate('notification.title')}
        </TitleHeader>
      </Header>
      <Body>
        <ContentNotifications>
          <IfLoaderInsideScreen loading={loadingScreen}>
            {notification.length > 0 &&
              notification.map((value: NotificationItem) => {
                return CardNotification(value);
              })}
            {notification.length <= 0 && (
              <MessageNotFound>
                {translate('notification.text_empty')}
              </MessageNotFound>
            )}
          </IfLoaderInsideScreen>
        </ContentNotifications>
      </Body>
    </Container>
  );
}
