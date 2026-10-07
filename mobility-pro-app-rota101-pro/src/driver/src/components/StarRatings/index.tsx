import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Container } from './styles';
import { useTripProvider } from '../../context/Trip';

export default function StarRatings() {
  const rating: any = useTripProvider(
    (context: any) => context.stateTrip.rating,
  );
  const dispatchTrip: any = useTripProvider(
    (context: any) => context.dispatchTrip,
  );
  const maxRating = [1, 2, 3, 4, 5];

  return (
    <Container>
      {maxRating.map((item) => {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            key={item}
            onPress={() =>
              dispatchTrip({ type: 'update', field: 'rating', arg: item })
            }
          >
            <AntDesign
              size={31}
              name={'star'}
              color={item <= rating ? "#FFC107" : "#9e9e9d"}
            />
          </TouchableOpacity>
        );
      })}
    </Container>
  );
}
