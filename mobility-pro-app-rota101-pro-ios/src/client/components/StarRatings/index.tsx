import {TouchableOpacity} from 'react-native';
import {useState} from 'react';
import {AntDesign} from '@expo/vector-icons';
import {useTheme} from 'styled-components';
import {Container} from './styles';
import {useTrip} from '../../contexts/Trip';

export default function StarRatings() {
  const {colors} = useTheme();
  const {stateTripCustomer, dispatchTripCustomer} = useTrip();

  const {defaultRating} = stateTripCustomer;
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  return (
    <Container>
      {maxRating.map((item, key) => {
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
              size={31}
              name={item <= defaultRating ? 'star' : 'staro'}
              color={colors.primary}
            />
          </TouchableOpacity>
        );
      })}
    </Container>
  );
}
