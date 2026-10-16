import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { RFValue } from 'react-native-responsive-fontsize';
import { Container } from './styles';
import { useTrip } from '../../contexts/Trip';

export default function StarRatings() {
  const { colors } = useTheme();
  const { stateTripCustomer, dispatchTripCustomer } = useTrip();

  const { defaultRating } = stateTripCustomer;
  const maxRating = [1, 2, 3, 4, 5];

  return (
    <Container>
      {maxRating.map((item) => {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            key={item}
            onPress={() =>
              dispatchTripCustomer({
                type: 'update',
                field: 'defaultRating',
                arg: item,
              })
            }
          >
            <AntDesign
              size={RFValue(31)}
              name={'star'}
              color={item <= defaultRating ? colors.primary : colors.grayLight}
            />
          </TouchableOpacity>
        );
      })}
    </Container>
  );
}
