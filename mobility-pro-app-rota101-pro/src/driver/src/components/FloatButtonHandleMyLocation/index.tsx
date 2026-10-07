import {useTripProvider} from '../../context/Trip';
import theme from '../../styles/theme';
import {FloatButton} from '../FloatButton';
import {MaterialIcons} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';

export const FloatButtonHandleMyLocation = ({callback}) => {
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );
  return (
    <FloatButton
      icon={
        <MaterialIcons
          name="my-location"
          size={RFValue(24)}
          color={theme.colors.primaryText}
        />
      }
      onPress={() =>
        callback(tripAccepted && Object.keys(tripAccepted || {}).length > 0)
      }
    />
  );
};
