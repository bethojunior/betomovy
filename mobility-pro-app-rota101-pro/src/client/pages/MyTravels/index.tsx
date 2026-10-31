import {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Preload from '../../components/Preload';
import {TripListCard} from '../../components/TripListCard';
import {TripListFooter} from '../../components/TripListFooter';
import {Container, ContainerContent, NotTravel} from './styles';
import {useTravel} from '../../contexts/travel';
import {useAuth} from '../../../context/auth';

const HIDDEN_STATUSES = new Set(['not_answered', 'back_off']);

export function MyTravels() {
  const {getTravel, travels} = useTravel();
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dataPage, setDataPage] = useState<any>({});
  const [selectedValue, setSelectedValue] = useState<boolean | string>(true);

  const customerId =
    user?.idCustomer || (user as any)?.customerId || user?.idUser;

  const getListTravels = useCallback(async () => {
    if (!customerId) {
      return;
    }

    setLoading(true);
    try {
      await getTravel(selectedValue, page, setDataPage);
    } finally {
      setLoading(false);
    }
  }, [getTravel, page, selectedValue, customerId]);

  useFocusEffect(
    useCallback(() => {
      getListTravels();
    }, [getListTravels]),
  );

  const visibleTravels = travels.filter(
    item => !HIDDEN_STATUSES.has(String(item?.status || '').toLowerCase()),
  );

  return (
    <Container>
      <Preload visible={loading} />
      <ContainerContent>
        {visibleTravels.map(trip => (
          <TripListCard key={trip.tripReference} trip={trip} />
        ))}

        {visibleTravels.length === 0 && !loading && (
          <NotTravel>Sem viagens registradas</NotTravel>
        )}
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
