import AsyncStorage from '@react-native-async-storage/async-storage';
import {FC} from 'react';
import StarIcon from '@expo/vector-icons/EvilIcons';
import {useLocal} from '../../contexts/local';
import {
  ContentPlaces,
  CardPlace,
  ContentTitle,
  SubTitle,
  Title,
} from './styles';
import theme from '../../styles/theme';
import {TextEdit} from '../TextEdit';
import {translate} from '../../locales';
import {useTrip} from '../../contexts/Trip';

interface Props {
  handleAddressSelected: (item: PlacesItem, type: string) => void;
  visible: boolean;
  setVisible: (status: boolean) => void;
  type: string;
}

interface PlacesItem {
  referencePoint: string;
  address: string;
}

export const SavedLocals: FC<Props> = ({
  handleAddressSelected,
  visible,
  setVisible,
  type,
}) => {
  const {places} = useLocal();
  const {dispatchTripCustomer} = useTrip();

  return (
    <>
      <ContentPlaces visible={visible}>
        <TextEdit color={theme.colors.primary}>
          {translate('trip.my_locals')}
        </TextEdit>
        {places.map((item: PlacesItem, index) => {
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
              <ContentTitle>
                <StarIcon
                  name="star"
                  size={22}
                  style={{
                    marginRight: 5,
                    color: theme.colors.primary,
                  }}
                />
                <Title>{item.referencePoint}</Title>
              </ContentTitle>
              <SubTitle>{item.address}</SubTitle>
            </CardPlace>
          );
        })}
      </ContentPlaces>
    </>
  );
};
