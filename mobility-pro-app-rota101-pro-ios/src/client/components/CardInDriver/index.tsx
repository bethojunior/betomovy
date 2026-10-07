import {useState} from 'react';
import {View} from 'react-native';
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
import {OfferContent} from '../OfferContent';
import {OfferPricesButton} from '../OfferPricesButton';
import {Button} from '../Button';
import {If} from '../If';
import {useTrip} from '../../contexts/Trip';
import {translate} from '../../locales';
import {IfLoaderInsideScreen} from '../IfLoaderInsideScreen';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setVisibleDelivery?: (visible: boolean) => void;
  priceOffer?: number;
  setOfferPrice?: (price: number) => void;
  selectedCard?: any;
  initialPriceOffer?: number;
  condition?: string;
  info?: any;
  tripItem?: any;
}

export const CardInDriver = ({
  visible,
  setVisible,
  priceOffer,
  setOfferPrice,
  selectedCard,
  condition,
  initialPriceOffer,
  setVisibleDelivery,
  info,
  tripItem,
}: Props) => {
  const {changeOfferPrice, newTripTypeDelivery, stateTripCustomer} = useTrip();

  const {trip} = stateTripCustomer;
  const [loading, setLoading] = useState(false);

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
    <Container>
      <Content>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <BackPage ml={-5} onPress={() => setVisible(false)} />
          <TextEdit>{translate('inDriver.negotiate_your_price')}</TextEdit>
        </View>
        <ContainerContent>
          <OfferContent
            initialPriceOffer={initialPriceOffer}
            setPrice={setOfferPrice}
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
                  setOfferPrice(calculateWithPercent(priceOffer, percentageMIN))
                }
              />
              <OfferPricesButton
                price={calculateWithPercent(priceOffer, percentageMED)}
                onPress={() =>
                  setOfferPrice(calculateWithPercent(priceOffer, percentageMED))
                }
              />
              <OfferPricesButton
                price={calculateWithPercent(priceOffer, percentageMAX)}
                onPress={() =>
                  setOfferPrice(calculateWithPercent(priceOffer, percentageMAX))
                }
              />
            </If>
          </ContainerOffers>

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
          <IfLoaderInsideScreen loading={loading}>
            <Button
              title="Confirmar"
              onPress={async () => {
                setLoading(true);
                if (condition === 'createOffer') {
                  await setVisible(false);
                  await newTripTypeDelivery(
                    selectedCard,
                    info,
                    tripItem,
                    priceOffer,
                  );
                  setVisibleDelivery(false);
                }
                await changeOfferPrice(trip.tripReference, priceOffer);
                setVisible(false);
                setLoading(false);
              }}
            />
          </IfLoaderInsideScreen>
        </ContainerContent>
      </Content>
    </Container>
  );
};
