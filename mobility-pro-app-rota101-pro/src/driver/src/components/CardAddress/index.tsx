import {Ionicons} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';
import {TextEdit} from '../TextEdit';
import {Container, ContainerText} from './styles';
import theme from '../../styles/theme';

interface Props {
  text: string;
  onPress?: () => void;
}
export const CardAddress = ({text, onPress}: Props) => {
  return (
    <Container onPress={onPress}>
      <Ionicons
        name="location"
        size={RFValue(15)}
        color={theme.colors.secondary}
      />
      <ContainerText>
        <TextEdit color={theme.colors.secondary}>{text || ''}</TextEdit>
      </ContainerText>
    </Container>
  );
};
