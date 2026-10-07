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
  const isSelected = selectedCard === card.idCard;

  const storageCard = () => {
    AsyncStorage.setItem('cardSelected', JSON.stringify(card));
  };

  return (
    <CardContent
      onPress={() => {
        setCardSelected(card.idCard);
        storageCard();
        setVisibleSecondModal(false);
      }}
      selected={isSelected}
    >
      <CardPaymentForm>
        <Icon source={Card1} />
        <TextPaymentType selected={isSelected}>****{card.number.substr(-4)}</TextPaymentType>
      </CardPaymentForm>
    </CardContent>
  );
};
