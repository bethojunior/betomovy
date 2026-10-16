import React, {useCallback, useState} from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import {Badge} from 'react-native-paper';
import {Platform} from 'react-native';
import {Container, ContainerColumn, Avatar, Text} from './styles';
import theme from '../../../../styles/theme';
import {hostImageDriver} from '../../../../constants/host';

import {useFavorite} from '../../../../contexts/favorite';
import {ContentModal, TextTitle} from '../CardService/styles';
import ModalFrame from '../../../../components/form/Modal';
import {translate} from '../../../../locales';
import {buildApp} from '../../../../../constantBuild/config';
import {useStoragePictures} from '../../../../../driver/src/hooks/useStoragePictures';

interface Props {
  item: any;
  setLoader: any;
}

export function CardFavorite({item, setLoader}: Props) {
  const [dialogRemove, setDialogRemove] = useState(false);
  const {removeFavorites} = useFavorite();
  const {getStoragePictureSpecific} = useStoragePictures();

  const handleRemoveFavorite = useCallback(async () => {
    if (Platform.OS !== 'ios') setLoader(true);
    await removeFavorites(item.idFavorite);
    setDialogRemove(false);
    setLoader(false);
  }, []);

  return (
    <>
      <Container>
        <Avatar
          source={{
            uri:
              (getStoragePictureSpecific('driver') ||
                buildApp().HOST_IMAGE_DRIVER) + item.driverImage,
          }}
        />
        <Badge
          size={15}
          style={{
            backgroundColor:
              item.statusDriver !== 'desligado'
                ? theme.toast.success
                : theme.colors.grayLight,
          }}
        />
        <ContainerColumn>
          <Text>{item.driverName}</Text>
          <Text> {item.plate} </Text>
        </ContainerColumn>
        <AntDesign
          name="close"
          size={24}
          color="black"
          onPress={() => setDialogRemove(true)}
        />
      </Container>
      <ModalFrame
        visible={dialogRemove}
        setVisible={setDialogRemove}
        onPressConfirm={handleRemoveFavorite}
        onClose={() => setDialogRemove(false)}
      >
        <ContentModal>
          <TextTitle> {translate('favorites.text_dialog_remove')} </TextTitle>
        </ContentModal>
      </ModalFrame>
    </>
  );
}
