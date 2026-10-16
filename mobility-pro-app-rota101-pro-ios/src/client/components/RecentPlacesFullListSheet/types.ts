import {Place} from '../../hooks/place';

export interface RecentPlacesFullListSheetProps {
  visible: boolean;
  places: Place[];
  getDistanceLabel: (place: Place) => string | undefined;
  onRequestClose: () => void;
  onSelectPlace: (place: Place) => void;
  onOptionsPress: (place: Place) => void;
}
