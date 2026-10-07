import {useCallback, useEffect, useState} from 'react';
import Preload from '../../components/Preload';
import {CardService} from '../../components/CardTravel';
import {Container, ContainerContent, NotTravel} from './styles';
import {PaginationSelect} from '../../components/PaginationSelect';
import {useTravel} from '../../contexts/travel';
import {If} from '../../components/If';

export function MyTravels() {
  const {getTravel, travels} = useTravel();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dataPage, setDataPage] = useState<any>({});
  const [selectedValue, setSelectedValue] = useState(true);

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
        {travels.length > 0 &&
          travels
            .filter(
              item =>
                item.status !== 'not_answered' && item.status !== 'back_off',
            )
            .map((trip: any, index: number) => {
              return (
                <CardService
                  setLoading={setLoading}
                  getListTrips={getListTravels}
                  key={index}
                  trip={trip}
                />
              );
            })}

        <If condition={travels.length === 0 && loading === false}>
          <>
            <NotTravel>Sem viagens registradas</NotTravel>
          </>
        </If>
      </ContainerContent>
      <PaginationSelect
        dataPage={dataPage}
        page={page}
        setPage={setPage}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />
    </Container>
  );
}
