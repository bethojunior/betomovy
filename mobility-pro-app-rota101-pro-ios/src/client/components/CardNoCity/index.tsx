import {useAuth} from '../../../context/auth';
import {translate} from '../../locales';
import {If} from '../If';
import {SwalAlert} from '../SwalAlert';

export const CardNoCity = ({onPress}) => {
  const {cityConfig, user} = useAuth();
  return (
    <If
      condition={!cityConfig?.cityId && user && Object?.keys(user)?.length > 0}
    >
      <SwalAlert
        visible={!cityConfig?.cityId && user && Object?.keys(user)?.length > 0}
        description={translate(
          'welcomeSpeedmob.unable_to_load_cities_settings',
        )}
        textButton={translate('welcomeSpeedmob.back')}
        callBack={() => {
          onPress && onPress();
        }}
        title={translate(
          'welcomeSpeedmob.this_city_is_not_yet_available_for_travel',
        )}
      />
    </If>
  );
};
