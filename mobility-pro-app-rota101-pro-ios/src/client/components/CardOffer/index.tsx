import {useEffect, useState} from 'react';
import {useAuth} from '../../../context/auth';
import {useTrip} from '../../contexts/Trip';
import theme from '../../styles/theme';
import Helper from '../../utils/Helper';
import {coinTypePerApi} from '../../utils/money';
import {TextEdit} from '../TextEdit';
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

interface Props {
  data: any;
}
export const CardOffer = ({data}: Props) => {
  const {cityConfig} = useAuth();
  const [loading, setLoading] = useState(false);
  const {refusedOffer, acceptOffer} = useTrip();

  const handleRefusedOffer = async tripBidId => {
    setLoading(true);
    await refusedOffer(tripBidId);
    setLoading(false);
  };
  const handleAcceptOffer = async tripBidId => {
    setLoading(true);
    await acceptOffer(tripBidId);
    setLoading(false);
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
              { Number(data?.duration || 0).toFixed(1)} min/ {(parseFloat(data?.distance || 0) / 1000).toFixed(3)} km
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
          onPress={() => {
            handleRefusedOffer(data.id);
          }}
        >
          <TextEdit color={theme.colors.red}>Recusar</TextEdit>
        </ButtonRefused>
        <ButtonAccept
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
