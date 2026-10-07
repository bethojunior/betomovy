import {MutableRefObject} from 'react';
import MapView from 'react-native-maps';
import {Position} from '~/context/auth/types';
import {Publicity} from '~/interfaces/publicity';
import {ModuleItem} from '../../../../../contexts/modules';

export interface HomeBottomSheetProps {
  mapRef: MutableRefObject<MapView | null>;
  position: Position | null;
  onPositionChange: (position: Position) => void;
  searchPlaceholder: string;
  onSearchPress: () => void;
  onMicPress: () => void;
  moduleButtons: ModuleItem[];
  onModulePress: (moduleName: string) => void;
  publicityList: Publicity[];
}
