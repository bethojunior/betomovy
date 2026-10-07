import {useEffect, useState} from 'react';
import {translate} from '../../../../client/locales';
import {TripListCard} from '../../components/TripListCard';
import {TripListFooter} from '../../components/TripListFooter';
import Preload from '../../components/Preload';
import {useMyTravels} from '../../context/MyTravel';
import {Container, ContainerCards, TextNone} from './styles';

export default function MyTrips() {
  const {getTrips, trips} = useMyTravels();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [dataPage, setDataPage] = useState<any>({});
  const [selectedValue, setSelectedValue] = useState(null);

  const listTrips = async () => {
    setLoading(true);
    await getTrips(selectedValue, page, null, setDataPage);
    setLoading(false);
  };

  useEffect(() => {
    listTrips();
  }, [selectedValue, page]);

  return (
    <Container>
      <Preload visible={loading} />
      <ContainerCards>
        {trips.length > 0 && !loading
          ? trips.map(trip => <TripListCard key={trip.tripReference} trip={trip} />)
          : trips.length === 0 &&
            !loading && (
              <TextNone>
                {translate('tripDriver.there_are_no_trips_available')}
              </TextNone>
            )}
      </ContainerCards>

      <TripListFooter
        dataPage={dataPage}
        page={page}
        setPage={setPage}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />
    </Container>
  );
}
