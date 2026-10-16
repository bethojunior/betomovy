import {ComponentProps} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

export interface ItemProfileProps {
  label: string;
  onPress: () => void;
  textValue: any;
  icon?: ComponentProps<typeof Ionicons>['name'];
  nameIconFeather?: ComponentProps<typeof Feather>['name'];
  isLast?: boolean;
}
