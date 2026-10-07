import {View} from 'react-native';
import {Badge} from 'react-native-paper';
import theme from '../../styles/theme';
import {TextEdit} from '../TextEdit';
import {ContainerAddress} from './styles';

interface Props {
  address: string;
  onPress?: () => void;
  colorBadge?: string;
}

export const ContainerAddressBadge = ({
  address,
  colorBadge,
  onPress,
}: Props) => {
  return (
    <ContainerAddress>
      <Badge
        size={10}
        style={{
          backgroundColor: colorBadge,
          alignSelf: 'center',
        }}
      />
      <View style={{padding: 10, width: '90%'}}>
        <TextEdit>{address}</TextEdit>
      </View>
    </ContainerAddress>
  );
};
