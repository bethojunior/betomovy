import {useAuth} from '../../../context/auth';
import theme from '../../styles/theme';
import {coinTypePerApi, maskMoney} from '../../utils/money';
import {TextEdit} from '../TextEdit';
import {ButtonOffer} from './styles';

interface Props {
  onPress?: () => void;
  price: number;
}

export const OfferPricesButton = ({price, onPress}: Props) => {
  const {cityConfig} = useAuth();
  return (
    <ButtonOffer onPress={onPress} activeOpacity={0.8}>
      <TextEdit color={theme.colors.primaryText}>
        {coinTypePerApi(cityConfig?.typeMoney)} {maskMoney(price)}
      </TextEdit>
    </ButtonOffer>
  );
};
