import {View, Linking} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useTrip} from '../../contexts/Trip';
import {
  ContainerButtonCall,
  GoBackButton,
  NavBarContent,
  NavBarTitle,
} from './styles';
import {useAuth} from '../../../context/auth';
import {ButtonIcon} from '../../modules/GetLight/components/ButtonIcon';
import theme from '../../styles/theme';

export function NavBar() {
  const {stateTripCustomer} = useTrip();
  const {trip} = stateTripCustomer;
  const navigation = useNavigation();
  const {cityConfig} = useAuth();

  return (
    <NavBarContent>
      <GoBackButton
        onPress={() => {
          navigation.goBack();
        }}
      >
        <If condition={cityConfig?.enableCallInChat !== '0'}>
          <Ionicons
            name="ios-arrow-back"
            size={30}
            color={theme.colors.primary}
          />
        </If>
      </GoBackButton>
      <View>
        <NavBarTitle>{trip?.driver?.nickname}</NavBarTitle>
      </View>
      <ContainerButtonCall>
        <ButtonIcon
          onPress={() => Linking.openURL(`tel:${trip?.driver.phone}`)}
          icon={
            <Ionicons name="call" color={theme.colors.primaryText} size={20} />
          }
        />
      </ContainerButtonCall>
    </NavBarContent>
  );
}
