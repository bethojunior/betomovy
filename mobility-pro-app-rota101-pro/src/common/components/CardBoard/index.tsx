import { TouchableOpacity } from 'react-native';
import { ContainerCardBoard, TextCard } from './styles';

interface Props {
  text: string;
  onPress?: () => void;
}

// Chip de mensagem rápida do rodapé do chat — compartilhado entre motorista e passageiro.
export const CardBoard = ({ text, onPress }: Props) => {
  return (
    <ContainerCardBoard>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <TextCard numberOfLines={2}>{text || ''}</TextCard>
      </TouchableOpacity>
    </ContainerCardBoard>
  );
};
