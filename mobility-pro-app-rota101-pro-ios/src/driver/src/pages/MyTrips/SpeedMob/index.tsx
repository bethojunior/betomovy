import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

import {useState, useEffect} from 'react';

import {useMyTravels} from '../../../context/MyTravel';

import {translate} from '../../../../../client/locales';

import Preload from '../../../components/Preload';
import {CardTravel} from '../../../components/CardTravel';
import {PaginationSelect} from '../../../components/PaginationSelect';

import {
  Container,
  ButtonBack,
  Header,
  TitleHeader,
  ContentTrips,
  TextNone,
} from './styles';

import theme from '../../../styles/theme';

export default function MyTripsSpeedMob() {
  const navigation = useNavigation();

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
      <Header backgroundColor={theme.colors.primary}>
        <ButtonBack onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            color={theme.colors.background_global}
            size={30}
          />
        </ButtonBack>
        <TitleHeader colorText={theme.colors.background_global}>
          {translate('routes.my_travels')}
        </TitleHeader>
      </Header>
      <ContentTrips>
        {trips.length > 0 && !loading
          ? trips.map((trip, index) => {
              return <CardTravel isSpeedMob key={index} trip={trip} />;
            })
          : trips.length === 0 &&
            !loading && (
              <TextNone>
                {translate('tripDriver.there_are_no_trips_available')}
              </TextNone>
            )}
      </ContentTrips>

      <PaginationSelect
        dataPage={dataPage}
        page={page}
        setPage={setPage}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        background={theme.colors.primary}
      />
    </Container>
  );
}
