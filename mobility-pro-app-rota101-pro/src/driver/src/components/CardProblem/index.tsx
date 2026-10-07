import {Ionicons} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTheme} from 'styled-components';
import {TextEdit} from '../TextEdit';
import {ContainerCard} from './styles';
import {translate} from '../../../../client/locales';

interface TypeProps {
  id: string;
  name: string;
  statusId: string;
}

interface Props {
  item: TypeProps;
  onPress: () => void;
}
export const CardProblem = ({item, onPress}: Props) => {
  const {colors} = useTheme();

  return (
    <ContainerCard onPress={onPress} activeOpacity={0.8}>
      <TextEdit color={colors.primaryText}>
        {translate(`typeReports.type_${item?.id}`)}
      </TextEdit>
      <Ionicons
        name="arrow-forward"
        size={RFValue(24)}
        color={colors.primaryText}
      />
    </ContainerCard>
  );
};
