import { useState } from 'react';
import { useAuth } from '../../../context/auth';
import { useTrip } from '../../contexts/Trip';
import theme from '../../styles/theme';
import Helper from '../../utils/Helper';
import { coinTypePerApi } from '../../utils/money';
import { TextEdit } from '../TextEdit';
import {
  ButtonAccept,
  ButtonRefused,
  ContainerCardOffer,
  ContainerDriver,
  ContainerFooter,
  ContainerHeader,
  ContainerInfo,
  ContainerPrice,
  ImageDriver,
} from './styles';
import { If } from '../If';
import { customToast } from '../../../utils/FlashMessage';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { translate } from '../../locales';

interface Props {
  data: any;
}

export const CardOffer = ({ data }: Props) => {
  const { cityConfig } = useAuth();
  const [isSubmitting, setSubmitting] = useState<string | false>(false);
  const { refusedOffer, acceptOffer } = useTrip();
  const [refused, setRefused] = useState(false);

  function showCancel(message: string) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  }

  const handleRefusedOffer = async tripBidId => {
    if (!!isSubmitting) return;

    setSubmitting("refusing");

    const data = await refusedOffer(tripBidId).finally(() => setSubmitting(false));

    if (data?.status) {
      setRefused(true);
      return showCancel(translate("inDriver.declined_offer"));
    }

    showCancel(translate("inDriver.error_declined_offer"));
  };

  const handleAcceptOffer = async (tripBidId: string) => {
    if (!!isSubmitting) return;

    setSubmitting("accepting");

    acceptOffer(tripBidId).finally(() => setSubmitting(false));
  };

  return (
    <ContainerCardOffer>
      <ContainerHeader>
        <ContainerDriver>
          <ImageDriver
            source={{
              uri: data?.driver?.profilePicture,
            }}
          />
          <ContainerInfo>
            <TextEdit>{data?.driver?.nickname}</TextEdit>
            <TextEdit>{data?.driver?.driverRating}</TextEdit>
            <If condition={data?.driver?.car}>
              <TextEdit>
                {data?.driver?.car?.brand} / {data?.driver?.car?.model}
              </TextEdit>
            </If>

            <TextEdit>
              {Number(data?.duration || 0).toFixed(1)} min/ {(parseFloat(data?.distance || 0) / 1000).toFixed(3)} km
            </TextEdit>
          </ContainerInfo>
        </ContainerDriver>
        <ContainerPrice>
          <TextEdit>
            {cityConfig && coinTypePerApi(cityConfig?.typeMoney)}{' '}
            {Helper.maskMoney(parseFloat(data?.price))}
          </TextEdit>
        </ContainerPrice>
      </ContainerHeader>
      <ContainerFooter>
        <ButtonRefused
          mode="outlined"
          disabled={refused}
          style={{ opacity: refused ? 0.4 : 1 }}
          loading={isSubmitting === "refusing"}
          onPress={() => {
            handleRefusedOffer(data.id);
          }}
        >
          <TextEdit color={theme.colors.red}>Recusar</TextEdit>
        </ButtonRefused>
        <ButtonAccept
          loading={isSubmitting === "accepting"}
          onPress={() => {
            handleAcceptOffer(data.id);
          }}
        >
          <TextEdit color={theme.colors.white}>Aceitar</TextEdit>
        </ButtonAccept>
      </ContainerFooter>
    </ContainerCardOffer>
  );
};
