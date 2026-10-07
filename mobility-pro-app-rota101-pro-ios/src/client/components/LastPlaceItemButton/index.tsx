import {
  LastPlaceItem,
  LastPlaceItemContent,
  LastPlaceItemIcon,
  LastPlaceItemText,
} from '../../modules/mobility/pages/Home/styles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import {useNavigation} from '@react-navigation/native';

interface Props {
  item?: any;
  text?: string;
  onPress?: () => void;
}

export const LastPlaceItemButton = ({item, text, onPress}: Props) => {
  const navigation = useNavigation();
  return (
    <LastPlaceItem activeOpacity={0.6} onPress={onPress}>
      <LastPlaceItemContent>
        <LastPlaceItemIcon>
          <SimpleLineIcons name="clock" size={20} color="black" />
        </LastPlaceItemIcon>
        <LastPlaceItemText>{text}</LastPlaceItemText>
      </LastPlaceItemContent>
      <SimpleLineIcons name="arrow-right" size={20} color="black" />
    </LastPlaceItem>
  );
};
