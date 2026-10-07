import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useTheme} from 'styled-components';
import {
  ButtonConfirm,
  Card,
  Container,
  ContainerButton,
  ContainerCard,
  ContainerHeader,
  Content,
  Image,
} from './styles';
import {TextEdit} from '../TextEdit';
import {useFavorite} from '../../contexts/favorite';
import theme from '../../styles/theme';
import {useTrip} from '../../contexts/Trip';
import {If} from '../If';
import Helper from '../../utils/Helper';
import {translate} from '../../locales';
import {buildApp} from '../../../constantBuild/config';

interface Props {
  onPressConfirm?: () => void;
  loading: boolean;
}

export const ModalFavorite = ({onPressConfirm, loading}: Props) => {
  const [text, setText] = useState(translate('favoriteOnDriver.call_favorite'));

  const {favorites, getFavorites} = useFavorite();
  const {dispatchTripCustomer} = useTrip();
  const [selecteds, setSelecteds] = useState([]);

  const listFavorites = async () => {
    await getFavorites();
  };

  useEffect(() => {
    listFavorites();
  }, []);

  const handleFavorite = item => {
    if (selecteds?.includes(item?.idDriver)) {
      const newArray = selecteds?.filter(
        favorite => favorite !== item?.idDriver,
      );
      return setSelecteds(newArray);
    }

    return setSelecteds(prev => [...prev, item.idDriver]);
  };

  useEffect(() => {
    if (
      favorites.length > 0 &&
      favorites.filter(
        (item: {statusDriver: string}) => item.statusDriver === 'disponivel',
      ).length === 0
    ) {
      setText(translate('favoriteOnDriver.no_favorite_drivers_found'));
    } else if (favorites.length > 0) {
      const favoritesOnline: [
        {
          idDriver: number;
        },
      ] = favorites.filter(
        (item: {statusDriver: string}) => item.statusDriver === 'disponivel',
      );
      if (favoritesOnline.length > 0) {
        favoritesOnline.map(item => {
          handleFavorite(item);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (selecteds?.length > 0) {
      dispatchTripCustomer({
        type: 'update',
        field: 'selectedFavorite',
        arg: [...selecteds],
      });
    }
  }, [selecteds]);

  const {colors} = useTheme();

  return (
    <Container
      from={{
        opacity: 0,
        translateY: 150,
      }}
      animate={{
        opacity: 1,
        translateY: 0,
      }}
      transition={{
        type: 'timing',
      }}
      exit={{
        opacity: 0,
        translateY: 150,
      }}
      exitTransition={{
        type: 'timing',
        duration: 200,
      }}
    >
      <ContainerHeader
        centralized={
          favorites.length > 0 &&
          favorites?.filter(
            (item: {statusDriver: string}) =>
              item?.statusDriver === 'disponivel',
          ).length === 0
        }
      >
        <TextEdit color={colors.secondary}>{text}</TextEdit>
      </ContainerHeader>
      <If condition={favorites.length > 0}>
        <ContainerCard>
          <Content>
            {favorites.length > 0 &&
              favorites
                .filter(item => item.statusDriver === 'disponivel')
                .map((item, index) => (
                  <Card
                    key={index}
                    onPress={() => handleFavorite(item)}
                    selected={selecteds?.includes(item?.idDriver)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{
                        uri: buildApp().HOST_IMAGE_DRIVER + item?.driverImage,
                      }}
                    />
                    <View>
                      <TextEdit
                        color={
                          selecteds?.includes(item?.idDriver)
                            ? theme.colors.background_global
                            : theme.colors.secondary
                        }
                      >
                        {item?.plate}
                      </TextEdit>
                      <TextEdit
                        color={
                          selecteds?.includes(item?.idDriver)
                            ? theme.colors.background_global
                            : theme.colors.secondary
                        }
                      >
                        {item?.driverNickname}
                      </TextEdit>
                    </View>
                  </Card>
                ))}
          </Content>
        </ContainerCard>
        <ContainerButton>
          <ButtonConfirm onPress={onPressConfirm} disabled={loading}>
            <TextEdit size="large" color={theme.colors.primaryText}>
              {translate('tripPreAccepted.text_continue')}
            </TextEdit>
          </ButtonConfirm>
        </ContainerButton>
      </If>
    </Container>
  );
};
