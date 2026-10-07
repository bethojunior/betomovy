import {ButtonSend, TextCard} from './styles';

interface Props {
  text: string;
  onPress?: () => void;
}
export const CardButtonText = ({text, onPress}: Props) => {
  return (
    <ButtonSend activeOpacity={0.5} onPress={onPress}>
      <TextCard>{text || ''}</TextCard>
    </ButtonSend>
  );
};
