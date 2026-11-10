import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardContent, CardPaymentForm, Icon, TextPaymentType } from './styles';
import Card1 from '../../assets/images/card.png';

interface Props {
  setCardSelected: (idCard: string) => void;
  card: any;
  selectedCard: string;
  setVisibleSecondModal: (boolean: boolean) => void;
}

export const CardCart = ({
  setCardSelected,
  card,
  selectedCard,
  setVisibleSecondModal,
}: Props) => {
  const isSelected = String(selectedCard) === String(card?.idCard);

  const storageCard = () => {
    try {
      AsyncStorage.setItem('cardSelected', JSON.stringify(card));
    } catch (_) {}
  };

  const cardNumber = String(card?.number || card?.lastFourDigits || card?.mpLastFourDigits || '');
  const lastFour = cardNumber.length >= 4 ? cardNumber.slice(-4) : (cardNumber || '****');

  return (
    <CardContent
      activeOpacity={0.7}
      onPress={() => {
        if (card?.idCard) {
          setCardSelected(String(card.idCard));
          storageCard();
        }
        setVisibleSecondModal(false);
      }}
      selected={isSelected}
    >
      <CardPaymentForm pointerEvents="none">
        <Icon source={Card1} />
        <TextPaymentType selected={isSelected}>****{lastFour}</TextPaymentType>
      </CardPaymentForm>
    </CardContent>
  );
};

