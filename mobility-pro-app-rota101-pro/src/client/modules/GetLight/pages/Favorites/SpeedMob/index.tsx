// @ts-nocheck

import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {Platform} from 'react-native';

import {useEffect, useState, useCallback} from 'react';
import {translate} from '../../../../../locales';

import {useFavorite} from '../../../../../contexts/favorite';
import {useAuth} from '../../../../../../context/auth';

import {customToast} from '../../../../../../utils/FlashMessage';

import Preload from '../../../../../components/Preload';
import ModalFrame from '../../../../../components/form/Modal';
import InputFrame from '../../../../../components/form/InputFrame';
import {CardFavorite} from '../../../components/CardFavorite';

import {
  Container,
  Header,
  ButtonAddDriver,
  ButtonBack,
  TitleHeader,
  Body,
  ContentListDrivers,
  TextButtonAddDriver,
  Message,
  Content,
  TextTitle,
} from './styles';

import theme from '../../../../../styles/theme';

export default function FavoritesSpeedMob() {
  const navigation = useNavigation();

  const {
    getFavorites,
    favorites,
    findPerCodeDriver,
    driver,
    addFavorites,
    handleDialogAdd,
  } = useFavorite();

  const [loading, setLoading] = useState<boolean>(false);
  const [dialogAdd, setDialogAdd] = useState<boolean>(false);
  const {user} = useAuth();
  const [text, setText] = useState<string>('');

  const getListFavorites = useCallback(async () => {
    setLoading(true);
    await getFavorites();
    setLoading(false);
  }, [loading, getFavorites]);

  const handleDialog = () => {
    if (favorites.length >= 3) {
      return customToast(translate('favorites.limit_favorites'), 'warning');
    }
    handleDialogAdd();
  };

  const handleAddFavorite = async data => {
    if (Platform.OS !== 'ios') setLoading(true);
    handleDialog();
    await addFavorites(user.idCustomer, data.idDriver);
    setText('');
    setDialogAdd(false);
    return setLoading(false);
  };

  // eslint-disable-next-line consistent-return
  const verifyCodeDriver = async code => {
    if (code === '') {
      return customToast(
        translate('favorites.toast_alert_warning_void'),
        'warning',
      );
    }
    setLoading(true);
    setDialogAdd(false);
    await findPerCodeDriver(code);
    setText('');
    setLoading(false);
  };

  useEffect(() => {
    getListFavorites();
  }, []);

  return (
    <Container>
      <Preload visible={loading} />
      <Header backgroundColor={theme.colors.primary}>
        <ButtonBack onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" color={theme.colors.background_global} size={30} />
        </ButtonBack>
        <TitleHeader colorText={theme.colors.background_global}>
          {translate('appRoutes.title_favorite_driver')}
        </TitleHeader>
      </Header>
      <Body>
        <ContentListDrivers>
          {favorites !== undefined && favorites.length > 0 ? (
            favorites.map((favorite, index) => (
              <CardFavorite
                key={index}
                item={favorite}
                setLoader={setLoading}
              />
            ))
          ) : (
            <Message>{translate('favorites.no_favorites')}</Message>
          )}
        </ContentListDrivers>
        <ButtonAddDriver
          onPress={() => setDialogAdd(true)}
          backgroundColor={theme.colors.primary}
        >
          <TextButtonAddDriver textColor={theme.colors.background_global}>
            {translate('favorites.text_button_add')}
          </TextButtonAddDriver>
        </ButtonAddDriver>
        <Message>{translate('favorites.text_description')}</Message>

        <ModalFrame
          visible={dialogAdd}
          setVisible={setDialogAdd}
          onPressConfirm={() => {
            verifyCodeDriver(text);
          }}
          onClose={() => {
            setText('');
          }}
        >
          <TextTitle> {translate('favorites.text_code_job')} </TextTitle>
          <Content>
            <InputFrame
              keyboradType={'default'}
              setValue={setText}
              value={text}
              editable
            />
          </Content>
        </ModalFrame>
      </Body>
    </Container>
  );
}
