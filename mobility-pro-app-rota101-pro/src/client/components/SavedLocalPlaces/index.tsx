import {FC, useEffect} from 'react';
import StarIcon from '@expo/vector-icons/EvilIcons';
import {ContentPlaces, CardPlace, SubTitle} from './styles';
import theme from '../../styles/theme';
import {TextEdit} from '../TextEdit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {translate} from '../../locales';
import {useTrip} from '../../contexts/Trip';
import { Place, usePlaces } from '../../hooks/place';

interface Props {
  handleAddressSelected: (item: Place, type: string) => void;
  visible: boolean;
  setVisible: (status: boolean) => void;
  type: string;
}

export const SavedLocalPlaces: FC<Props> = ({
  handleAddressSelected,
  visible,
  setVisible,
  type,
}) => {
  const { places, requestAllPlaces } = usePlaces();

  const {dispatchTripCustomer} = useTrip();

  useEffect(() => {
    requestAllPlaces();
  }, []);
  return (
    <>
      <ContentPlaces visible={visible}>
        <TextEdit color={theme.colors.border_green}>
          {translate('trip.last_destinys')}
        </TextEdit>
        {places.map((item: Place, index) => {
          return (
            <CardPlace
              key={index}
              onPress={async () => {
                const isTripNoDestinationAnother = JSON.parse(
                  await AsyncStorage.getItem('@app:tripNoDestinationAnother'),
                );
                handleAddressSelected(item, type);
                setVisible(false);

                if (isTripNoDestinationAnother) {
                  dispatchTripCustomer({
                    type: 'update',
                    field: 'hideTravelOptions',
                    arg: false,
                  });

                  dispatchTripCustomer({
                    type: 'update',
                    field: 'visibleLookUpAddressesModal',
                    arg: false,
                  });
                }
              }}
            >
              <StarIcon
                name="star"
                size={22}
                style={{
                  marginRight: 5,
                  color: theme.colors.border_green,
                }}
              />
              <SubTitle>{item.address}</SubTitle>
            </CardPlace>
          );
        })}
      </ContentPlaces>
    </>
  );
};
