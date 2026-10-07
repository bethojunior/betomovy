import {useCallback, useEffect, useState} from 'react';
import Preload from '../../components/Preload';
import {TripListCard} from '../../components/TripListCard';
import {TripListFooter} from '../../components/TripListFooter';
import {Container, ContainerContent, NotTravel} from './styles';
import {useTravel} from '../../contexts/travel';

export function MyTravels() {
  const {getTravel, travels} = useTravel();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dataPage, setDataPage] = useState<any>({});
  const [selectedValue, setSelectedValue] = useState<boolean | string>(true);

  const getListTravels = useCallback(async () => {
    setLoading(true);
    await getTravel(selectedValue, page, setDataPage);
    setLoading(false);
  }, [getTravel, page, selectedValue]);

  useEffect(() => {
    getListTravels();
  }, [page, selectedValue]);

  return (
    <Container>
      <Preload visible={loading} />
      <ContainerContent>
        {travels
          .filter(item => item.status !== 'not_answered' && item.status !== 'back_off')
          .map(trip => (
            <TripListCard key={trip.tripReference} trip={trip} />
          ))}

        {travels.length === 0 && !loading && <NotTravel>Sem viagens registradas</NotTravel>}
      </ContainerContent>
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
