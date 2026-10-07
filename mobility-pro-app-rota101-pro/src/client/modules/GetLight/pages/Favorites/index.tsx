/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
// @ts-nocheck

import {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {ContainerLogoCentral, Logo} from '../MapCall/styles';
import {Header, Title} from '../Services/styles';
import {
  Container,
  ContainerButton,
  ContainerContent,
  Content,
  ContentCenter,
  Description,
  Image,
} from './styles';
import {ButtonSmall} from '../../components/ButtonSmall';
import ModalFrame from '../../../../components/form/Modal';
import {useFavorite} from '../../../../contexts/favorite';
import {CardFavorite} from '../../components/CardFavorite';
import Preload from '../../../../components/Preload';
import {TextTitle} from '../../components/CardService/styles';
import {hostImageDriver} from '../../../../constants/host';
import {translate} from '../../../../locales';
import logo from '../../../../../../assets/logo.png';
import InputFrame from '../../../../components/form/InputFrame';
import {useAuth} from '../../../../../context/auth';
import theme from '../../../../styles/theme';
import {customToast} from '../../../../../utils/FlashMessage';
import {buildApp} from '../../../../../constantBuild/config';
import {useStoragePictures} from '../../../../../driver/src/hooks/useStoragePictures';

export function Favorites() {
  const {
    getFavorites,
    favorites,
    findPerCodeDriver,
    driver,
    addFavorites,
    handleDialogAdd,
  } = useFavorite();
  const [loading, setLoading] = useState(false);
  const [dialogAdd, setDialogAdd] = useState(false);
  const {user} = useAuth();
  const [text, setText] = useState('');
  const getListFavorites = useCallback(async () => {
    setLoading(true);
    await getFavorites();
    setLoading(false);
  }, [loading, getFavorites]);
  const {getStoragePictureSpecific} = useStoragePictures();

  useEffect(() => {
    getListFavorites();
  }, []);

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

  return (
    <>
      <Preload visible={loading} />
      <Container>
        <ContainerLogoCentral>
          <Logo source={theme.images.logo ? {uri: theme.images.logo} : logo} />
        </ContainerLogoCentral>
        <ContainerContent>
          {favorites !== undefined && favorites.length > 0 ? (
            favorites.map((favorite, index) => (
              <CardFavorite
                key={index}
                item={favorite}
                setLoader={setLoading}
              />
            ))
          ) : (
            <Description>{translate('favorites.no_favorites')}</Description>
          )}
          <ContainerButton>
            <ButtonSmall
              title={translate('favorites.text_button_add')}
              loading={false}
              onPress={() => setDialogAdd(true)}
            />
            <Description>{translate('favorites.text_description')}</Description>
          </ContainerButton>
        </ContainerContent>
      </Container>
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
      <ModalFrame
        visible={Object.keys(driver)?.length > 0}
        setVisible={setDialogAdd}
        onPressConfirm={() => handleAddFavorite(driver)}
        onClose={() => {
          handleDialogAdd();
          setText('');
        }}
      >
        <ContentCenter>
          <TextTitle> {driver.name} </TextTitle>
          <Content>
            <Image
              source={{
                uri: `${
                  getStoragePictureSpecific('driver') ||
                  buildApp().HOST_IMAGE_DRIVER
                }${driver.profileImage}`,
              }}
            />
          </Content>
        </ContentCenter>
      </ModalFrame>
    </>
  );
}

export default Favorites;
