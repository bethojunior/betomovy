import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {translate} from '../../../../../client/locales';
import {customToast} from '../../../../../utils/FlashMessage';
import {CardVehicle} from '../../../components/CardVehicle';
import {If} from '../../../components/If';
import {IfLoaderInsideScreen} from '../../../components/IfLoaderInsideScreen';
import {useUserDriver} from '../../../context/userDriver';
import {useVehicle} from '../../../context/Vehicle';
import Preload from '../../../components/Preload';

import {
  Container,
  ContainerButton,
  ContentVehicle,
  TextButton,
  ButtonBack,
  Header,
  TitleHeader,
  Button,
} from './styles';

import theme from '../../../styles/theme';

export default function VehicleSpeedMob() {
  const {userDriverFind, getDriverFind} = useUserDriver();
  const {pendingVehicle, changeCar} = useVehicle();
  const [car, setCar] = useState(userDriverFind.car);
  const [haveVehicle, setHaveVehicle] = useState({});

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(true);

  const [editable, setEditable] = useState(false);

  const navigation = useNavigation();

  const getPendingVehicle = async () => {
    setLoadingButton(true);
    const {data} = await pendingVehicle();
    setHaveVehicle(data);
    setLoadingButton(false);
  };

  const handleSend = async () => {
    if (
      !car.brand ||
      !car.model ||
      !car.plate ||
      !car.color ||
      !car.year ||
      !car.renavam
    ) {
      return customToast(translate('myTravels.fill_all_fields'), 'warning');
    }
    setLoading(true);
    const response = await changeCar(car);
    if (!response.status) {
      return customToast(response.message, 'danger');
    }
    getPendingVehicle();
    customToast(response.message, 'success');
    setEditable(false);
    setLoading(false);
  };
  const handleCancel = () => {
    setCar(userDriverFind.car);
    setEditable(false);
  };

  useEffect(() => {
    getPendingVehicle().then(async () => {
      await getDriverFind();
    });
  }, []);

  return (
    <Container>
      <Preload visible={loading} />
      <Header backgroundColor={theme.colors.primary}>
        <ButtonBack onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={30}
            color={theme.colors.background_global}
          />
        </ButtonBack>
        <TitleHeader colorText={theme.colors.background_global}>
          {translate('routes.Vehicles')}
        </TitleHeader>
      </Header>
      <ContentVehicle>
        <CardVehicle
          editable={editable}
          value={car?.brand}
          description={translate('vehicle.brand')}
          setValue={e => setCar({...car, brand: e})}
        />
        <CardVehicle
          editable={editable}
          value={car?.model}
          description={translate('vehicle.model')}
          setValue={e => setCar({...car, model: e})}
        />
        <CardVehicle
          editable={editable}
          value={car?.plate}
          description={translate('vehicle.plate')}
          setValue={e => setCar({...car, plate: e})}
        />
        <CardVehicle
          editable={editable}
          setValue={e => setCar({...car, color: e})}
          value={car?.color}
          description={translate('vehicle.color')}
        />
        <CardVehicle
          editable={editable}
          value={car?.year}
          setValue={e => setCar({...car, year: e})}
          description={translate('vehicle.year')}
        />
        <CardVehicle
          editable={editable}
          value={car?.renavam}
          setValue={e => setCar({...car, renavam: e})}
          description={translate('vehicle.renavam')}
        />

        <ContainerButton>
          <IfLoaderInsideScreen loading={loading}>
            <If condition={!editable}>
              {/* SÓ CARREGA */}
              {loadingButton === false && (
                <Button
                  backgroundColor={theme.colors.primary}
                  disabled={haveVehicle && Object.keys(haveVehicle).length > 0}
                  onPress={() => setEditable(true)}
                >
                  <TextButton colorText={theme.colors.background_global}>
                    {haveVehicle && Object.keys(haveVehicle).length > 0
                      ? translate('vehicle.under_analysis')
                      : translate('vehicle.request_vehicle_change')}{' '}
                  </TextButton>
                </Button>
              )}
            </If>
            <If condition={editable}>
              <Button backgroundColor={theme.colors.border_green} onPress={handleSend}>
                <TextButton colorText={theme.colors.white}>
                  {translate('vehicle.send')}
                </TextButton>
              </Button>
            </If>
            <If condition={editable}>
              <Button backgroundColor={theme.colors.red} onPress={handleCancel}>
                <TextButton colorText={theme.colors.white}>
                  {translate('vehicle.cancel')}
                </TextButton>
              </Button>
            </If>
          </IfLoaderInsideScreen>
        </ContainerButton>
      </ContentVehicle>
    </Container>
  );
}
