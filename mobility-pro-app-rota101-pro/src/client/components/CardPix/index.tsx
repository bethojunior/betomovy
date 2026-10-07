import { CardContent, CardPaymentForm, Icon, TextPaymentType } from './styles';
import Pix from '../../assets/images/pix.png';

interface Props {
  onSelectPix: () => void;
  setVisibleSecondModal: (visible: boolean) => void;
  selected?: boolean;
}

export const CardPix = ({ onSelectPix, setVisibleSecondModal, selected }: Props) => {
  return (
    <CardContent
      selected={selected}
      onPress={() => {
        onSelectPix();
        setVisibleSecondModal(false);
      }}
    >
      <CardPaymentForm>
        <Icon source={Pix} />
        <TextPaymentType selected={selected}>Pix</TextPaymentType>
      </CardPaymentForm>
    </CardContent>
  );
};
