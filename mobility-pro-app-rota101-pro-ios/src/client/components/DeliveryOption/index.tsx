import {useEffect, useState} from 'react';
import {Modal, Platform, TextInput} from 'react-native';
import {useTrip} from '../../contexts/Trip';
import {translate} from '../../locales';
import theme from '../../styles/theme';
import Helper from '../../utils/Helper';
import {BackPage} from '../BackPage';
import {CardDelivery} from '../CardDelivery';
import {CardInDriver} from '../CardInDriver';
import { Button } from '../Button';
import { RFValue } from 'react-native-responsive-fontsize';
import {If} from '../If';
import {IfLoaderInsideScreen} from '../IfLoaderInsideScreen';
import {TextEdit} from '../TextEdit';
import {
  ContainerButton,
  ContainerCards,
  ContainerContent,
  ContainerDetailsDelivery,
  ContainerInput,
  ContainerModal,
  ContentDelivery,
  ContentModal,
  Input,
  TextError,
} from './styles';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  hasInDriver: any;
  selectedCard: any;
  setVisibleOptionTravel: (visible: boolean) => void;
  setVisibleConfirmAddress: (visible: boolean) => void;
}

interface InfoDeliveryProps {
  details: string;
  received: string;
  obs: string;
}

interface PlaceholderProps {
  id: string;
  obs: string;
  obsDestination: string;
  obsOrigin: string;
  status_id: string;
}

export const DeliveryOption = ({
  visible,
  setVisible,
  hasInDriver,
  selectedCard,
  setVisibleOptionTravel,
  setVisibleConfirmAddress,
}: Props) => {
  const {
    getAllTypeDelivery,
    getDescriptionTypeDelivery,
    newTripTypeDelivery,
    stateTripCustomer,
  } = useTrip();

  const {destination, selectedOptionTravel, isLoading} = stateTripCustomer;
  const [infoDelivery, setInfoDelivery] = useState<InfoDeliveryProps>({
    details: '',
    received: '',
    obs: '',
  });
  const [typesDelivery, setTypesDelivery] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [modalInDriver, setModalInDriver] = useState(false);
  const [placeholders, setPlaceholders] = useState({} as PlaceholderProps);
  const [priceOffer, setPriceOffer] = useState(0);
  const [error, setError] = useState(false);

  const getTypes = async () => {
    const types = await getAllTypeDelivery();
    setTypesDelivery(types.data);
  };

  const getInfos = async () => {
    const types = await getDescriptionTypeDelivery();
    setPlaceholders(types.data);
  };

  const newTripDelivery = async () => {
    if (
      // @ts-ignore
      selectedOptionTravel?.tripType?.offerOption === '1' ||
      hasInDriver !== undefined
    ) {
      await setPriceOffer(selectedOptionTravel?.price);
      setModalInDriver(true);
      return;
    }
    setVisible(false);
    await newTripTypeDelivery(selectedCard, infoDelivery, selectedItems, null);
  };

  useEffect(() => {
    getTypes();
    getInfos();
  }, []);

  useEffect(() => {
    if (error) {
      Helper.timeout(1000).then(() => {
        setError(false);
      });
    }
  }, [error]);

  return (
    <>
      <Modal visible={visible}>
        <ContainerModal behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ContentModal>
            <BackPage
              ml={-10}
              text={translate('deliveryOption.text')}
              onPress={() => {
                setVisible(false)
                setVisibleOptionTravel(true);
                setVisibleConfirmAddress(false);
                setSelectedItems([]);
              }}
            />
            <ContainerContent>
              <TextEdit size={'medium'}>
                {translate('deliveryOption.text_delivery_type')}
              </TextEdit>
              <ContainerCards horizontal={true}>
                {typesDelivery.length > 0 &&
                  typesDelivery.map((item, index) => {
                    return (
                      <CardDelivery
                        key={index}
                        text={item?.name}
                        onPress={() => {
                          setSelectedItems(item);
                        }}
                        image={item?.picture}
                        selected={selectedItems?.id === item?.id}
                      />
                    );
                  })}
              </ContainerCards>
              <ContainerDetailsDelivery>
                <TextError>
                  {error && translate('schedule.toast_warning')}
                </TextError>

                <TextEdit size={'medium'}>
                  {translate('deliveryOption.text_pickup_details')}
                </TextEdit>
                <Input
                  multiline
                  onChangeText={text => {
                    setInfoDelivery({...infoDelivery, details: text});
                  }}
                  placeholder={placeholders?.obsOrigin}
                />
              </ContainerDetailsDelivery>
              <ContentDelivery>
              <TextEdit size={'medium'}>
                  {translate('deliveryOption.text')}
                </TextEdit>
                <ContainerInput>
                  <TextEdit size={'small'}>{destination?.address}</TextEdit>
                  <Input
                    multiline
                    onChangeText={text => {
                      setInfoDelivery({...infoDelivery, received: text});
                    }}
                    placeholder={placeholders?.obsDestination}
                  />
                </ContainerInput>
                <ContainerInput>
                  <TextEdit size={'medium'}>
                    {translate('deliveryOption.text_obs')}
                  </TextEdit>
                  <Input
                    multiline
                    onChangeText={text => {
                      setInfoDelivery({...infoDelivery, obs: text});
                    }}
                    placeholder={placeholders?.obs}
                  />
                </ContainerInput>
              </ContentDelivery>
            </ContainerContent>
            <ContainerButton>
              <IfLoaderInsideScreen loading={isLoading}>
                <Button
                  style={{ marginTop: RFValue(80) }}
                  title={translate('informChangeModal.text_button_confirm')}
                  onPress={async () => {
                    if (
                      infoDelivery.details === '' ||
                      infoDelivery.obs === '' ||
                      infoDelivery.received === '' ||
                      selectedItems.length === 0
                    ) {
                      return setError(true);
                    }

                    return newTripDelivery();
                  }}
                />
              </IfLoaderInsideScreen>
            </ContainerButton>
          </ContentModal>
          <If condition={modalInDriver}>
            <CardInDriver
              visible={modalInDriver}
              setVisible={setModalInDriver}
              initialPriceOffer={selectedOptionTravel?.price}
              setOfferPrice={setPriceOffer}
              setVisibleDelivery={setVisible}
              priceOffer={priceOffer}
              selectedCard={selectedCard}
              condition={'createOffer'}
              info={infoDelivery}
              tripItem={selectedItems}
            />
          </If>
        </ContainerModal>
      </Modal>
    </>
  );
};
