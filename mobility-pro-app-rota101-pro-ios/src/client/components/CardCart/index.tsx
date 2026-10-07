import {CardContent, CardPaymentForm, Icon, TextPaymentType} from './styles';
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
  return (
    <CardContent
      onPress={() => {
        setCardSelected(card.idCard);
        setVisibleSecondModal(false);
      }}
      selected={selectedCard === card.idCard}
    >
      <CardPaymentForm>
        <Icon source={Card1} />
        <TextPaymentType>****{card.number.substr(-4)}</TextPaymentType>
      </CardPaymentForm>
    </CardContent>
  );
};
