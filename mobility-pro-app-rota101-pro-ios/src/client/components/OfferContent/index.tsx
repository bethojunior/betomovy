import {Ionicons} from '@expo/vector-icons';
import theme from '../../styles/theme';
import {ContainerIcon} from '../ContainerIcon';
import {ContainerOffer, ContainerValue} from './styles';
import {useAuth} from '../../../context/auth';
import {TextEdit} from '../TextEdit';
import {coinTypePerApi, maskMoney} from '../../utils/money';
import {RFValue} from 'react-native-responsive-fontsize';

interface Props {
  price: number;
  setPrice?: (price: number) => void;
  initialPriceOffer?: number;
}

export const OfferContent = ({price, setPrice, initialPriceOffer}: Props) => {
  const {cityConfig} = useAuth();

  return (
    <ContainerOffer>
      <ContainerIcon
        icon={
          <Ionicons
            name="remove"
            size={RFValue(20)}
            color={theme.colors.background_global}
          />
        }
        // @ts-ignore
        disabled={price < initialPriceOffer - 1}
        onPress={() => setPrice && setPrice(price - 1)}
      />
      <ContainerValue>
        <TextEdit color={theme.colors.background_global} size="medium">
          {coinTypePerApi(cityConfig?.typeMoney)} {maskMoney(price) ?? '0,00'}
        </TextEdit>
      </ContainerValue>
      <ContainerIcon
        icon={
          <Ionicons
            name="add"
            size={RFValue(20)}
            color={theme.colors.background_global}
          />
        }
        // @ts-ignore
        disabled={price + 1 > initialPriceOffer * 2}
        onPress={() => setPrice && setPrice(price + 1)}
      />
    </ContainerOffer>
  );
};
