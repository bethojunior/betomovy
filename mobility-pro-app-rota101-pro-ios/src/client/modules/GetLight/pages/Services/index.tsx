import {useCallback, useEffect, useState} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Text} from 'react-native';
import Preload from '../../../../components/Preload';
import {translate} from '../../../../locales';
import {CardService} from '../../components/CardService';
import {HeaderInfoButton} from '../../components/TravelOptionsGL/styles';
import {Container, ContainerContent, Header, Title} from './styles';
import {PaginationSelect} from '../../components/PaginationSelect';
import {useTripGL} from '../../../../contexts/TripGL';
import theme from '../../../../styles/theme';

export function Services() {
  const {getTrips, trips} = useTripGL();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dataPage, setDataPage] = useState<any>({});
  const [selectedValue, setSelectedValue] = useState(true);
  const [modalInfo, setModalInfo] = useState(false);

  const getListTrips = useCallback(async () => {
    setLoading(true);
    await getTrips(selectedValue, page, setDataPage);
    setLoading(false);
  }, [loading, page, selectedValue]);

  const handleModalInfo = () => {
    setModalInfo(!modalInfo);
  };

  useEffect(() => {
    getListTrips();
  }, [page, selectedValue]);
  return (
    <Container>
      <Preload visible={loading} />
      <Header>
        <Title>{translate('service.my_services')}</Title>
        <HeaderInfoButton>
          <Ionicons
            name="reload"
            size={24}
            color={theme.colors.primary}
            onPress={getListTrips}
          />
        </HeaderInfoButton>
      </Header>
      <ContainerContent>
        {trips.length > 0
          ? trips.map((trip: any, index: number) => {
              return (
                <CardService
                  setLoading={setLoading}
                  getListTrips={getListTrips}
                  key={index}
                  trip={trip}
                />
              );
            })
          : trips.length === 0 &&
            !loading && <Text>{translate('service.not_service')}</Text>}
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
