import {useEffect, useState} from 'react';
import {translate} from '../../../../client/locales';
import {CardTravel} from '../../components/CardTravel';
import {PaginationSelect} from '../../components/PaginationSelect';
import Preload from '../../components/Preload';
import {TextEdit} from '../../components/TextEdit';
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
    const response = await getTrips(selectedValue, page, null, setDataPage);
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
          ? trips.map((trip, index) => {
              return <CardTravel key={index} trip={trip} />;
            })
          : trips.length === 0 &&
            !loading && (
              <TextNone>
                {translate('tripDriver.there_are_no_trips_available')}
              </TextNone>
            )}
      </ContainerCards>

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
