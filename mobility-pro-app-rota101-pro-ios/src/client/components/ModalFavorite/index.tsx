import { useEffect, useState, useRef, useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';
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
import { TextEdit } from '../TextEdit';
import { useFavorite } from '../../contexts/favorite';
import theme from '../../styles/theme';
import { useTrip } from '../../contexts/Trip';
import { If } from '../If';
import { translate } from '../../locales';
import { buildApp } from '../../../constantBuild/config';
import { useStoragePictures } from '../../../driver/src/hooks/useStoragePictures';
import { getAvailableFavorites } from '../../utils/favoriteDrivers';

interface Props {
  onPressConfirm?: (data: Array<string | number>) => void;
  loading: boolean;
}

export const ModalFavorite = ({ onPressConfirm, loading }: Props) => {
  const [text, setText] = useState(translate('favoriteOnDriver.call_favorite'));

  const { colors } = useTheme();
  const { favorites, getFavorites } = useFavorite();
  const { dispatchTripCustomer, stateTripCustomer } = useTrip();

  const { selectedOptionTravel, selectedFavorite } = stateTripCustomer;
  const selectedDrivers = selectedFavorite ?? [];

  const setSelectedDrivers = (idDrivers: Array<number | string>) => {
    dispatchTripCustomer({
      type: 'update',
      field: 'selectedFavorite',
      arg: idDrivers,
    });
  };

  // Trava o tipo de viagem quando o modal abre para evitar mudanças
  const lockedTripType = useRef(selectedOptionTravel?.tripTypeId);
  const lockedTripTypeData = useRef(selectedOptionTravel);

  useEffect(() => {
    // Trava o tipo na primeira renderização
    if (!lockedTripType.current && selectedOptionTravel?.tripTypeId) {
      lockedTripType.current = selectedOptionTravel.tripTypeId;
      lockedTripTypeData.current = selectedOptionTravel;
    }
  }, []);

  const { getStoragePictureSpecific } = useStoragePictures();

  const getValidFavorites = () => {
    // Usa o tipo TRAVADO ao invés do atual para evitar mudanças
    const tripTypeToUse = lockedTripTypeData.current || selectedOptionTravel;
    return getAvailableFavorites(favorites, tripTypeToUse?.tripTypeId);
  };

  const validFavorites = useMemo(() => getValidFavorites(), [favorites]);
  const hasValidFavorites = validFavorites.length > 0;

  useEffect(() => {
    const validSelection = selectedDrivers.filter(id =>
      validFavorites.some(item => item.idDriver === id),
    );

    if (validSelection.length === 0 && validFavorites[0]?.idDriver) {
      setSelectedDrivers([validFavorites[0].idDriver]);
    } else if (validSelection.length !== selectedDrivers.length) {
      setSelectedDrivers(validSelection);
    }

    getFavorites();
  }, []);

  const handleFavorite = item => {
    // Toggle: adiciona ou remove o motorista da seleção
    if (selectedDrivers.includes(item.idDriver)) {
      setSelectedDrivers(selectedDrivers.filter(id => id !== item.idDriver));
    } else {
      setSelectedDrivers([...selectedDrivers, item.idDriver]);
    }
  };

  useEffect(() => {
    if (
      favorites.length > 0 &&
      selectedOptionTravel?.tripTypeId &&
      validFavorites.length === 0
    ) {
      setText(translate('favoriteOnDriver.no_favorite_drivers_found'));
    }
  }, [favorites, selectedOptionTravel?.tripTypeId, validFavorites]);


  const handleConfirm = () => {
    // Mantém só os motoristas que ainda estão na lista após refetch;
    // array vazio = busca aleatória
    const validSelection = selectedDrivers.filter(id =>
      validFavorites.some(item => item.idDriver === id),
    );

    setSelectedDrivers(validSelection);
    onPressConfirm?.(validSelection);
  };

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
            (item: { statusDriver: string }) =>
              item?.statusDriver === 'disponivel',
          ).length === 0
        }
      >
        <TextEdit color={colors.secondary}>{text}</TextEdit>
      </ContainerHeader>
      <If condition={hasValidFavorites}>
        <ContainerCard>
          <Content>
            {(() => {
              return validFavorites.map((item, index) => (
                <Card
                  key={index}
                  onPress={() => handleFavorite(item)}
                  selected={selectedDrivers.includes(item?.idDriver)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{
                      uri:
                        getStoragePictureSpecific('driver') + item?.driverImage ||
                        buildApp().HOST_IMAGE_DRIVER + item?.driverImage,
                    }}
                  />
                  <View>
                    <TextEdit
                      color={
                        selectedDrivers.includes(item?.idDriver)
                          ? theme.colors.primaryText
                          : theme.colors.secondary
                      }
                    >
                      {item?.plate}
                    </TextEdit>
                    <TextEdit
                      color={
                        selectedDrivers.includes(item?.idDriver)
                          ? theme.colors.primaryText
                          : theme.colors.secondary
                      }
                    >
                      {item?.driverNickname}
                    </TextEdit>
                  </View>
                </Card>
              ));
            })()}
          </Content>
        </ContainerCard>
      </If>
      <ContainerButton>
        <ButtonConfirm onPress={handleConfirm} disabled={loading}>
          <TextEdit size="large" color={theme.colors.primaryText}>
            {translate('tripPreAccepted.text_continue')}
          </TextEdit>
        </ButtonConfirm>
      </ContainerButton>
    </Container>
  );
};
