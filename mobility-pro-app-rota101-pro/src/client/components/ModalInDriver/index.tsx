import {Modal, View} from 'react-native';
import {useState} from 'react';
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
import {translate} from '../../locales';
import {useTrip} from '../../contexts/Trip';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  priceOffer?: number;
  setOfferPrice?: (price: number) => void;
  selectedCard?: any;
  initialPriceOffer?: number;
  setVisibleOptionTravel: (visible: boolean) => void;
}

export const ModalInDriver = ({
  visible,
  setVisible,
  priceOffer,
  setOfferPrice,
  selectedCard,
  initialPriceOffer,
  setVisibleOptionTravel,
}: Props) => {
  const {newTripOffer} = useTrip();

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
              onPress={() => {
                setVisible(false);
                setVisibleOptionTravel(true);
              }}
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

            <ContainerText>
              <TextEdit size={'smalls'} color={theme.colors.secondary}>
                {translate('inDriver.text_money_lower')}
              </TextEdit>
              <TextEdit size={'smalls'} color={theme.colors.secondary}>
                {translate('inDriver.text_fastest_service')}
              </TextEdit>
              <TextEdit size={'smalls'}>
                {translate('inDriver.important')}:{' '}
              </TextEdit>
              <TextEdit size={'smalls'} color={theme.colors.secondary}>
                {translate('inDriver.label_price_offer_trip')}
              </TextEdit>
            </ContainerText>
            <Button
              title={translate('buttonModal.confirm')}
              onPress={async () => {
                setVisible(false);
                await newTripOffer(selectedCard, priceOffer);
              }}
            />
          </ContainerContent>
        </Content>
      </Container>
    </Modal>
  );
};
