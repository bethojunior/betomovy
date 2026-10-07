import {useEffect, useState} from 'react';
import {TextEdit} from '../TextEdit';
import {
  ContainerColumn,
  ContainerContent,
  ContainerInput,
  ContainerTextColumn,
  Image,
  InputMask,
} from './styles';

import {useAuth} from '../../../context/auth';
import {useTrip} from '../../contexts/Trip';
import ModalFrame from '../form/Modal';
import {translate} from '../../locales';
import {RFValue} from 'react-native-responsive-fontsize';
import {SvgUri} from 'react-native-svg';
import theme from '../../styles/theme';
import {customToast} from '../../../utils/FlashMessage';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  priceOffer?: string | any;
  setOfferPrice?: any;
  setTripType?: (tripType: string) => void;
}

export const ModalOfferInPrice = ({
  visible,
  setVisible,
  priceOffer,
  setOfferPrice,
  setTripType,
}: Props) => {
  const {cityConfig} = useAuth();
  const {stateTripCustomer} = useTrip();
  const {selectedOptionTravel} = stateTripCustomer;
  const [price, setPrice] = useState<any>(priceOffer);
  const [priceInitial, setPriceInitial] = useState<any>(priceOffer);
  const [ultrapassedPrice, setUltrapassedPrice] = useState<any>(false);

  useEffect(() => {
    setPrice(priceOffer);
  }, [priceOffer]);

  const handlePrice = (value: string) => {
    if (ultrapassedPrice) {
      return;
    }
    setOfferPrice(value.split(`$`)[1].replace(',', '.'));
    setVisible(false);
  };

  const handleCancel = () => {
    setPrice(selectedOptionTravel.price);
    setOfferPrice(String(selectedOptionTravel.price));
    setTripType('');
    setVisible(false);
  };

  return (
    <ModalFrame
      visible={visible}
      setVisible={setVisible}
      onClose={handleCancel}
      onPressConfirm={() => handlePrice(price)}
    >
      <ContainerContent>
        <TextEdit color={theme.colors.secondary}>
          {selectedOptionTravel?.tripType?.type}
        </TextEdit>
        {selectedOptionTravel?.picture?.split('.').pop() === 'svg' ? (
          <SvgUri
            width={RFValue(60)}
            height={RFValue(60)}
            uri={selectedOptionTravel?.picture}
          />
        ) : (
          <Image source={{uri: selectedOptionTravel?.picture}} />
        )}
        <ContainerInput>
          <TextEdit color={theme.colors.secondary}>
            {translate('paymentPage.title_balance')}
          </TextEdit>
          <ContainerColumn>
            <InputMask
              value={price}
              type={'money'}
              disabled={ultrapassedPrice}
              options={{
                unit: cityConfig?.typeMoney,
              }}
              onChangeText={e => {
                if (!e) {
                  setPriceInitial(selectedOptionTravel?.price);
                  return;
                }
                setPrice(e);

                if (
                  Number(e.split(`$`)[1].replace(',', '.')) <
                  Number(selectedOptionTravel?.price)
                ) {
                  setUltrapassedPrice(true);
                } else {
                  setUltrapassedPrice(false);
                }
              }}
            />
            <ContainerTextColumn>
              <TextEdit size={'small'} color={theme.colors.secondary}>
                {ultrapassedPrice
                  ? translate(
                      'tripAnother.amount_below_the_minimum_travel_price',
                    )
                  : ''}
              </TextEdit>
            </ContainerTextColumn>
          </ContainerColumn>
        </ContainerInput>
      </ContainerContent>
    </ModalFrame>
  );
};
