import {useCallback, useEffect, useState} from 'react';
import {
  Address,
  ButtonConfirm,
  Container,
  ContainerAddress,
  Content,
  ListAddress,
  TextAddress,
  TextConfirm,
} from './styles';
import {CardVehicle} from '../../components/CardVehicle';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {useStationReturn} from '../../context/StationReturn';
import theme from '../../styles/theme';
import apiMainDriver from '../../api/apiMain';
import {IfLoaderInsideScreen} from '../../components/IfLoaderInsideScreen';
import {PropsStationReturn} from '../../context/StationReturn/types';
import {useUserDriver} from '../../context/userDriver';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {translate} from '../../../../client/locales';
import {customToast} from '../../../../utils/FlashMessage';
import {useLocalProvider} from '../../context/local';

interface PropsPointReturn {
  name: string;
  stationId: string;
  address: string;
  latitude: number;
  longitude: number;
  stationName: string;
}
let searchTimeout;

export const StationPointReturn = ({route}) => {
  const {station} = route?.params;

  const [pointReturn, setPointReturn] = useState({
    name: station.name ? station.name : '',
    stationId: station.stationTypeId ? station.stationTypeId : '',
    stationName: '',
    address: station.address ? station.address : '',
    latitude: station.latitude ? Number(station.latitude) : 0,
    longitude: station.longitude ? Number(station.longitude) : 0,
  });

  const findStationIdToName = async (stationId: string, stationTypes) => {
    const stationType = await stationTypes.find(
      (stationType: any) => stationType.id == stationId,
    );
    setPointReturn({
      ...pointReturn,
      stationName: stationType ? stationType.name : '',
    });
    setSearchStation(stationType ? stationType.name : '');
    return stationType ? stationType.name : '';
  };

  const {
    getStationTypeAll,
    createStationReturn,
    updateStationReturn,
    getStationReturnById,
  } = useStationReturn();
  const {userDriverFind} = useUserDriver();
  const {goBack}: NavigationProp<ParamListBase> = useNavigation();
  const [stationTypes, setStationTypes] = useState<any>([]);
  const {location} = useLocalProvider();
  const [value, setValue] = useState<string>(
    station?.address ? station.address : '',
  );
  const [searachStation, setSearchStation] = useState<string>('');
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [listAddresses, setListAddresses] = useState<any>([]);

  const getAll = async () => {
    const response = await getStationTypeAll();
    if (!response.status) {
      return customToast(response.message, 'danger');
    }
    setStationTypes(mapStationTypesForIDAndName(response.data));
    if (station && Object.keys(station).length > 0) {
      findStationIdToName(
        station.stationTypeId,
        mapStationTypesForIDAndName(response.data),
      );
    }
  };

  const mapStationTypesForIDAndName = (stationTypes: any) => {
    return stationTypes.map((stationType: any) => {
      return {
        id: stationType.idStationType,
        name: stationType.name,
      };
    });
  };

  const putStationReturn = async () => {
    try {
      setLoadingConfirm(true);
      const payload: PropsStationReturn = {
        name: pointReturn.name,
        latitude: pointReturn.latitude,
        longitude: pointReturn.longitude,
        driverId: userDriverFind.idDriver,
        null: pointReturn.address,
        address: pointReturn.address,
        stationTypeId: Number(pointReturn.stationId),
      };
      const response = await updateStationReturn(payload, station.stationId);
      if (!response.status) {
        customToast(response.message, 'danger');
      }
      setPointReturn({
        name: '',
        stationId: '',
        stationName: '',
        address: '',
        latitude: 0,
        longitude: 0,
      } as PropsPointReturn);
      customToast(response.message, 'success');
      getStationReturnById();
      goBack();
      setLoadingConfirm(false);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const postStationReturn = async () => {
    try {
      setLoadingConfirm(true);
      const payload: PropsStationReturn = {
        name: pointReturn.name,
        latitude: pointReturn.latitude,
        longitude: pointReturn.longitude,
        driverId: userDriverFind.idDriver,
        null: pointReturn.address,
        address: pointReturn.address,
        stationTypeId: Number(pointReturn.stationId),
      };
      const response = await createStationReturn(payload);
      if (!response.status) {
        customToast(response.message, 'danger');
      }
      setPointReturn({
        name: '',
        stationId: '',
        stationName: '',
        address: '',
        latitude: 0,
        longitude: 0,
      } as PropsPointReturn);
      customToast(response.message, 'success');
      getStationReturnById();
      goBack();
      setLoadingConfirm(false);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  const onChangeAddress = useCallback(text => {
    setValue(text);
    setLoading(true);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      const {
        data: {data},
      } = await apiMainDriver.get(
        `place/search?q=${text}&latlng=${location?.coords?.latitude || 0},${
          location?.coords?.longitude || 0
        }`,
      );
      setListAddresses(data);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <Container>
      <Content>
        <CardVehicle
          description={translate('returns.name')}
          value={pointReturn.name}
          editable={true}
          setValue={e => setPointReturn({...pointReturn, name: e})}
        />
        <CardVehicle
          description={translate('returns.type_post')}
          value={''}
          editable={true}
          setValue={() => {}}
          input={
            <SearchableDropdown
              onItemSelect={(item: any) => {
                setPointReturn({
                  ...pointReturn,
                  stationId: item.id,
                  stationName: item.name,
                });
                setSearchStation(item.name);
              }}
              selectedItems={{
                id: pointReturn?.stationId,
                name: pointReturn?.stationName,
              }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: theme.colors.white_light,
                borderColor: theme.colors.primary,
                borderWidth: 0.5,
                borderRadius: 5,
              }}
              itemTextStyle={{color: theme.colors.background_dark}}
              items={stationTypes}
              defaultIndex={1}
              resetValue={false}
              textInputProps={{
                underlineColorAndroid: 'transparent',
                style: {
                  borderWidth: 0.5,
                  borderColor: theme.colors.primary,
                  borderRadius: 5,
                  padding: theme.spacing.medium,
                  color: theme.colors.secondary,
                },
                onTextChange: (item: string) => {
                  setSearchStation(item);
                },
                value: searachStation,
              }}
              listProps={{
                nestedScrollEnabled: true,
              }}
            />
          }
        />

        <CardVehicle
          description={translate('returns.address')}
          value={value}
          editable={true}
          setValue={onChangeAddress}
        />
        <ContainerAddress>
          <IfLoaderInsideScreen loading={loading}>
            {listAddresses.length > 0 &&
              listAddresses.map((item, index) => {
                return (
                  <ListAddress key={index}>
                    <Address
                      activeOpacity={0.6}
                      onPress={() => {
                        setPointReturn({
                          ...pointReturn,
                          address: item.address,
                          latitude: item.latitude,
                          longitude: item.longitude,
                        });
                        setValue(item.address);
                        setListAddresses([]);
                      }}
                    >
                      <TextAddress>{item.address}</TextAddress>
                    </Address>
                  </ListAddress>
                );
              })}
          </IfLoaderInsideScreen>
        </ContainerAddress>

        <ButtonConfirm
          onPress={() => {
            if (!pointReturn.name) {
              return customToast(
                translate('returns.enter_name_return_point'),
                'danger',
              );
            }
            if (!pointReturn.stationId) {
              return customToast(
                translate('returns.enter_type_return_point'),
                'danger',
              );
            }
            if (!pointReturn.address) {
              return customToast(
                translate('returns.select_return_point_address'),
                'danger',
              );
            }
            if (
              station &&
              Object.keys(station).length > 0 &&
              station.stationId
            ) {
              return putStationReturn();
            }
            return postStationReturn();
          }}
        >
          <IfLoaderInsideScreen loading={loadingConfirm}>
            <TextConfirm>{translate('buttonModal.confirm')}</TextConfirm>
          </IfLoaderInsideScreen>
        </ButtonConfirm>
      </Content>
    </Container>
  );
};
