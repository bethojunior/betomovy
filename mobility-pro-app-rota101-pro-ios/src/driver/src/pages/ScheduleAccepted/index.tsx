import {Text} from 'react-native';
import {translate} from '../../../../client/locales';
import {CardSchedule} from '../../components/CardSchedule';
import {useTripProvider} from '../../context/Trip';
import {Container, ContainerCard} from './styles';

export default function ScheduleAccepted({route}) {
  const {stateTrip} = useTripProvider();
  const {listScheduleAccepted} = stateTrip;

  return (
    <Container>
      <ContainerCard>
        {listScheduleAccepted.length > 0 ? (
          listScheduleAccepted.map((trip, index) => {
            return <CardSchedule key={index} trip={trip} />;
          })
        ) : (
          <Text>{translate('tripDriver.there_are_no_trips_available')}</Text>
        )}
      </ContainerCard>
    </Container>
  );
}
