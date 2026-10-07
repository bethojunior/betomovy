import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

import {useState, useEffect, useCallback} from 'react';
import {translate} from '../../../locales';

import {useTravel} from '../../../contexts/travel';

import Preload from '../../../components/Preload';

import {
  Container,
  ButtonBack,
  Header,
  TitleHeader,
  ContentTravels,
} from './styles';

import {CardService} from '../../../components/CardTravel';
import {PaginationSelect} from '../../../components/PaginationSelect';

import theme from '../../../styles/theme';

export default function MyTravelsSpeedMob() {
  const {getTravel, travels} = useTravel();
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [dataPage, setDataPage] = useState<any>({});
  const [selectedValue, setSelectedValue] = useState<boolean>(true);

  const navigation = useNavigation();

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
      <Header backgroundColor={theme.colors.primary}>
        <ButtonBack
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back"
            size={30}
            color={theme.colors.background_global}
          />
        </ButtonBack>
        <TitleHeader colorText={theme.colors.background_global}>
          {translate('appRoutes.title_my_travels')}
        </TitleHeader>
      </Header>
      <ContentTravels>
        {travels.length > 0 &&
          travels.map((trip: any, index: number) => {
            return (
              <CardService
                isSpeedMob={true}
                setLoading={setLoading}
                getListTrips={getListTravels}
                key={index}
                trip={trip}
              />
            );
          })}
      </ContentTravels>
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
