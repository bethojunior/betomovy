import {useEffect, useRef, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Map} from '../../components/Map';
import {Ionicons, AntDesign} from '@expo/vector-icons';
import {
  ButtonCard,
  Container,
  ContainerButton,
  ContainerIcon,
  ContainerIconCentralize,
} from './styles';
import {ButtonIcon} from '../../components/ButtonIcon';
import {RFValue} from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';
import {TextEdit} from '../../components/TextEdit';
import ModalFrame from '../../components/Modal/ModalFrame';
import {useLocalProvider} from '../../context/local';
import apiMainDriver from '../../api/apiMain';
import Preload from '../../components/Preload';
import {Circle, Marker} from 'react-native-maps';
import {If} from '../../components/If';
import {translate} from '../../../../client/locales';
import {customToast} from '../../../../utils/FlashMessage';

export default function ZoneDynamic() {
  const {location} = useLocalProvider();
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [dataDynamic, setDataDynamic] = useState<any>([]);
  const [dataDynamicNoFilter, setDataDynamicNoFilter] = useState<any>([]);
  const [itemInitial, setItemInital] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<number>(0);

  const mapRef = useRef(null);

  const dataTypeDynamic = [
    {
      id: 1,
      name: translate('zoneDynamic.last_dynamics_on_the_day'),
      endpoint: `dynamic/lastDynamicsPlaces?latitude=${location?.coords?.latitude}&longitude=${location?.coords?.longitude}`,
    },
    {
      id: 2,
      name: translate('zoneDynamic.most_expensive_dynamics_of_the_day'),
      endpoint: `dynamic/ExpensiveDynamicsPlaces?limit=15&latitude=${location?.coords?.latitude}&longitude=${location?.coords?.longitude}`,
    },
    {
      id: 3,
      name: translate('zoneDynamic.more_trips_the_day_before'),
      endpoint: `dynamic/PlacesMoreTripsDayAgo?limit=15&latitude=${location?.coords?.latitude}&longitude=${location?.coords?.longitude}`,
    },
    {
      id: 4,
      name: translate('zoneDynamic.more_trips_a_week_ago'),
      endpoint: `dynamic/placesMoreTripsWeekAgo?limit=15&latitude=${location?.coords?.latitude}&longitude=${location?.coords?.longitude}`,
    },
  ];

  const getDataPerEndpoint = async (endpoint: string) => {
    try {
      const {data} = await apiMainDriver.get(endpoint);
      if (!data.status) {
        return customToast(data.message, 'danger');
      }

      Object.keys(data?.data).length === 0 &&
        customToast(translate('zoneDynamic.no_dynamics'), 'warning');
      setDataDynamicNoFilter(data?.data);
      indicatorsWithFilterId(data?.data, setDataDynamic);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const indicatorsWithFilterId = (list, setPlaces) => {
    const newList = list
      .filter(item => {
        return item.neighborhood !== null;
      })
      .map(item => {
        return {
          ...item,
          neighborhood: item.neighborhood,
        };
      })
      .filter((item, index, self) => {
        return (
          self.findIndex(t => t.neighborhood === item.neighborhood) === index
        );
      });
    setPlaces(newList);
    return newList;
  };

  const nextHandleDinamic = i => {
    if (mapRef.current && dataDynamic.length > i) {
      mapRef.current.animateToRegion(
        {
          latitude: Number(dataDynamic[i]?.latitude),
          longitude: Number(dataDynamic[i]?.longitude),
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        },
        500,
      );
    }
    if (i >= dataDynamic.length - 1) {
      setItemInital(0);
      return;
    } else {
      setItemInital(state => state + 1);
    }
  };

  return (
    <Container>
      <Map
        mapRef={(ref: any) => {
          mapRef.current = ref;
        }}
        noDriver
        latitude={location?.coords?.latitude}
        longitude={location?.coords?.longitude}
        setCountVisible={setLoading}
      >
        {dataDynamic &&
          dataDynamic?.length > 0 &&
          dataDynamic?.map((item: any, index) => {
            return (
              <>
                <Circle
                  key={index}
                  center={{
                    latitude: Number(item?.latitude),
                    longitude: Number(item?.longitude),
                  }}
                  radius={50}
                  fillColor={theme.colors.crimson_translucent}
                  strokeColor={theme.colors.crimson_translucent}
                />
              </>
            );
          })}

        {dataDynamicNoFilter.length > 0 &&
          dataDynamicNoFilter.map((item, index) => {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: Number(item?.latitude),
                  longitude: Number(item?.longitude),
                }}
              >
                <Ionicons
                  name="person-circle"
                  size={RFValue(20)}
                  color={theme.colors.secondary}
                />
              </Marker>
            );
          })}
      </Map>
      <ContainerIcon>
        <ButtonIcon
          w={RFValue(50)}
          h={RFValue(50)}
          icon={
            <>
              <Ionicons
                name="ios-stats-chart-outline"
                size={RFValue(20)}
                color={theme.colors.background_global}
              />
            </>
          }
          onPress={() => {
            setVisibleModal(true);
          }}
        />
      </ContainerIcon>

      <If condition={dataDynamic.length > 0}>
        <ContainerIconCentralize>
          <ButtonIcon
            w={RFValue(50)}
            h={RFValue(50)}
            icon={
              <>
                <AntDesign
                  name="swap"
                  size={RFValue(20)}
                  color={theme.colors.background_global}
                />
              </>
            }
            onPress={() => {
              nextHandleDinamic(itemInitial);
            }}
          />
          {/* <View
            style={{
              marginLeft: RFValue(15),
            }}
          >
            <ButtonIcon
              w={RFValue(50)}
              h={RFValue(50)}
              icon={
                <>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={RFValue(20)}
                    color={theme.colors.secondary}
                  />
                </>
              }
              onPress={() => {
                nextHandleDinamic(itemInitial);
              }}
            />
          </View> */}
        </ContainerIconCentralize>
      </If>

      <ModalFrame
        onClose={() => setVisibleModal(false)}
        setVisible={setVisibleModal}
        visible={visibleModal}
        hideConfirm
        title={translate('zoneDynamic.type_dynamic')}
        isLoading={loading}
      >
        <ContainerButton>
          {dataTypeDynamic.map(item => {
            return (
              <ButtonCard
                key={item.id}
                selected={selectedFilter === item.id}
                onPress={async () => {
                  setLoading(true);
                  await getDataPerEndpoint(item.endpoint);
                  setSelectedFilter(item.id);
                  setLoading(false);
                  setVisibleModal(false);
                }}
              >
                <TextEdit
                  color={
                    selectedFilter === item.id
                      ? theme.colors.background_global
                      : theme.colors.secondary
                  }
                >
                  {item?.name}
                </TextEdit>
              </ButtonCard>
            );
          })}
        </ContainerButton>
      </ModalFrame>

      <Preload visible={loading} />
    </Container>
  );
}
