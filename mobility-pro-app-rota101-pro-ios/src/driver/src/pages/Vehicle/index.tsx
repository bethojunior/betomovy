import {useEffect, useState} from 'react';
import {Button} from 'react-native-paper';
import {translate} from '../../../../client/locales';
import {customToast} from '../../../../utils/FlashMessage';
import {CardVehicle} from '../../components/CardVehicle';
import {If} from '../../components/If';
import {IfLoaderInsideScreen} from '../../components/IfLoaderInsideScreen';
import {useUserDriver} from '../../context/userDriver';
import {useVehicle} from '../../context/Vehicle';

import {Container, ContainerButton, ContentVehicle, TextButton} from './styles';

export default function Vehicle() {
  const {userDriverFind, getDriverFind} = useUserDriver();
  const {pendingVehicle, changeCar} = useVehicle();
  const [car, setCar] = useState(userDriverFind.car);
  const [haveVehicle, setHaveVehicle] = useState({});
  const [loading, setLoading] = useState(false);

  const [editable, setEditable] = useState(false);

  const getPendingVehicle = async () => {
    const {data} = await pendingVehicle();
    setHaveVehicle(data);
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
              <Button
                mode="outlined"
                disabled={haveVehicle && Object.keys(haveVehicle).length > 0}
                onPress={() => setEditable(true)}
              >
                <TextButton>
                  {haveVehicle && Object.keys(haveVehicle).length > 0
                    ? translate('vehicle.under_analysis')
                    : translate('vehicle.request_vehicle_change')}{' '}
                </TextButton>
              </Button>
            </If>
            <If condition={editable}>
              <Button mode="outlined" onPress={handleSend}>
                <TextButton>{translate('vehicle.send')}</TextButton>
              </Button>
            </If>
            <If condition={editable}>
              <Button mode="outlined" onPress={handleCancel}>
                <TextButton>{translate('vehicle.cancel')}</TextButton>
              </Button>
            </If>
          </IfLoaderInsideScreen>
        </ContainerButton>
      </ContentVehicle>
    </Container>
  );
}
