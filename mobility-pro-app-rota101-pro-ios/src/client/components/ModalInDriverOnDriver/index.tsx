import {Modal, View} from 'react-native';
import {BackPage} from '../BackPage';
import {TextEdit} from '../TextEdit';
import {
  Container,
  ContainerContent,
  ContainerOffers,
  ContainerText,
  Content,
} from './styles';
import theme from '../../styles/theme';

import {useAuth} from '../../../context/auth';
import {OfferContent} from '../OfferContent';
import {OfferPricesButton} from '../OfferPricesButton';
import {Button} from '../Button';
import {If} from '../If';
import {useEffect, useState} from 'react';
import {useTrip} from '../../contexts/Trip';
import {translate} from '../../locales';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  priceOffer?: number;
  setOfferPrice?: (price: number) => void;
  selectedCard?: any;
  initialPriceOffer?: number;
  noText?: boolean;
  onPress?: any;
  trip: any;
}

export const ModalInDriverOnDriver = ({
  visible,
  setVisible,
  priceOffer,
  setOfferPrice,
  selectedCard,
  initialPriceOffer,
  onPress,
  trip,
  noText,
}: Props) => {
  const {cityConfig} = useAuth();

  const percentageMIN = 10;
  const percentageMED = 20;
  const percentageMAX = 30;

  const [percentages, setPercentages] = useState([
    percentageMIN,
    percentageMED,
    percentageMAX,
  ]);

  function calculateWithPercent(value, percent) {
    return value + (value * percent) / 100;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onDismiss={() => setVisible(false)}
    >
      <Container>
        <Content>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            }}
          >
            <BackPage
              ml={-5}
              text={translate('inDriver.negotiate_your_price')}
              onPress={() => setVisible(false)}
            />
          </View>

          <ContainerContent>
            <OfferContent
              setPrice={setOfferPrice}
              initialPriceOffer={initialPriceOffer}
              price={priceOffer}
            />
            <ContainerOffers>
              {percentages.map((percentage, index) => {
                const price = calculateWithPercent(priceOffer, percentage);
                return (
                  // @ts-ignore
                  <If
                    condition={
                      // @ts-ignore
                      price <= parseFloat(initialPriceOffer) * 2
                    }
                    key={index}
                  >
                    <OfferPricesButton
                      key={index}
                      price={price}
                      onPress={() => setOfferPrice(price)}
                    />
                  </If>
                );
              })}

              <If
                condition={
                  priceOffer > calculateWithPercent(priceOffer, percentageMAX)
                }
              >
                <OfferPricesButton
                  price={calculateWithPercent(priceOffer, percentageMIN)}
                  onPress={() =>
                    setOfferPrice(
                      calculateWithPercent(priceOffer, percentageMIN),
                    )
                  }
                />
                <OfferPricesButton
                  price={calculateWithPercent(priceOffer, percentageMED)}
                  onPress={() =>
                    setOfferPrice(
                      calculateWithPercent(priceOffer, percentageMED),
                    )
                  }
                />
                <OfferPricesButton
                  price={calculateWithPercent(priceOffer, percentageMAX)}
                  onPress={() =>
                    setOfferPrice(
                      calculateWithPercent(priceOffer, percentageMAX),
                    )
                  }
                />
              </If>
            </ContainerOffers>
            <If condition={noText}>
              <ContainerText>
                <TextEdit size={'small'} color={theme.colors.secondary}>
                  {translate('inDriver.text_money_lower')}
                </TextEdit>
                <TextEdit size={'small'} color={theme.colors.secondary}>
                  {translate('inDriver.text_fastest_service')}
                </TextEdit>
                <TextEdit size={'small'}>
                  {translate('inDriver.important')}:{' '}
                </TextEdit>
                <TextEdit size={'small'} color={theme.colors.secondary}>
                  {translate('inDriver.label_price_offer_trip')}
                </TextEdit>
              </ContainerText>
            </If>

            <Button
              title={translate('buttonModal.confirm')}
              onPress={async () => {
                onPress(trip?.idTrip, priceOffer);
                setVisible(false);
              }}
            />
          </ContainerContent>
        </Content>
      </Container>
    </Modal>
  );
};
