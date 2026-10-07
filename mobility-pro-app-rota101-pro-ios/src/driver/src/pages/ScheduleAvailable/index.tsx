import {Text} from 'react-native';
import {CardSchedule} from '../../components/CardSchedule';
import {useTripProvider} from '../../context/Trip';
import {Container, ContainerCard} from './styles';
import {translate} from '../../../../client/locales';

export default function ScheduleAvailable({route}) {
  const {stateTrip} = useTripProvider();
  const {listSchedule} = stateTrip;

  return (
    <Container>
      <ContainerCard>
        {listSchedule.length > 0 ? (
          listSchedule.map((trip, index) => {
            return (
              <CardSchedule
                key={index}
                trip={trip}
                onPress={'acceptScheduled'}
              />
            );
          })
        ) : (
          <Text>{translate('tripDriver.there_are_no_trips_available')}</Text>
        )}
      </ContainerCard>
    </Container>
  );
}
