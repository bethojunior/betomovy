/* eslint-disable global-require */
// @ts-nocheck

import {TouchableOpacity} from 'react-native';
import {useState} from 'react';
import {AntDesign} from '@expo/vector-icons';
import {useTheme} from 'styled-components';
import {Container} from './styles';
import {useTripProvider} from '../../context/Trip';

export default function StarRatings() {
  const {stateTrip, dispatchTrip} = useTripProvider();
  const {rating} = stateTrip;
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

  const {colors} = useTheme();

  return (
    <Container>
      {maxRating.map((item, index) => {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            key={index}
            onPress={() =>
              dispatchTrip({type: 'update', field: 'rating', arg: item})
            }
          >
            <AntDesign
              size={31}
              name={item <= rating ? 'star' : 'staro'}
              color={colors.primary}
            />
          </TouchableOpacity>
        );
      })}
    </Container>
  );
}
