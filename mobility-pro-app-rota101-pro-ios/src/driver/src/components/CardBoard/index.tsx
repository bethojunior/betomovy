import {TouchableOpacity} from 'react-native';
import {IfLoaderInsideScreen} from '../IfLoaderInsideScreen';
import {ContainerCardBoard, TextCard} from './styles';

interface Props {
  text: string;
  onPress?: () => void;
}
export const CardBoard = ({text, onPress}: Props) => {
  return (
    <ContainerCardBoard>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <TextCard>{text || ''}</TextCard>
      </TouchableOpacity>
    </ContainerCardBoard>
  );
};
