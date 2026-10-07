import {ScrollView} from 'react-native';
import {useUserDriver} from '../../context/userDriver';
import {CardButtonText} from '../CardButtonText';
import {useModals} from '../../../../context/Modals';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ButtonScrollViewTaximeter = ({
  setModalTaximeter,
  setSelectedTripType,
}) => {
  const {userDriverFind} = useUserDriver();
  const {setContainerTaximeter} = useModals();

  const handleClearStorage = () => {
    AsyncStorage.multiRemove([
      'startTaximetro',
      'currentTimeTaximeter',
      'priceTaximeter',
      'taximeterIsPause',
      'fare',
      'routeTraveledTaximeter',
      'lastKmTaximeter',
      'TX-timeBg',
    ]);
  };
  return (
    <ScrollView
      style={{
        maxHeight: 420,
      }}
    >
      {userDriverFind?.tripTypes?.length > 0 &&
        userDriverFind?.tripTypes?.map((item, index) => {
          return (
            <CardButtonText
              key={index}
              text={item?.tripType}
              onPress={() => {
                setModalTaximeter(false);
                handleClearStorage();
                setSelectedTripType(item);
                setContainerTaximeter(true);
              }}
            />
          );
        })}
    </ScrollView>
  );
};
