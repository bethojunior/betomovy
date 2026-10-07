import {useEffect, useState} from 'react';
import {useTripProvider} from '../../context/Trip';
import theme from '../../styles/theme';
import {FloatButton} from '../FloatButton';
import {If} from '../If';
import {FontAwesome, Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

export const FloatButtonsComponent = ({
  setOnVisibleMap,
  setModalNavigation,
}) => {
  const {trip, tripAccepted} = useTripProvider().stateTrip;
  const {navigate, addListener} = useNavigation();

  const [focusHome, setFocusHome] = useState(false);

  useEffect(() => {
    if (trip && Object.keys(trip).length !== 0 && focusHome) {
      navigate('Home');
    }
  }, [trip]);

  useEffect(() => {
    addListener('blur', () => setFocusHome(true));

    addListener('focus', () => setFocusHome(false));
  }, []);

  return (
    <>
      <If
        condition={
          Object.keys(trip).length > 0 ||
          (tripAccepted && Object.keys(tripAccepted).length > 0)
        }
      >
        <FloatButton
          icon={
            <FontAwesome
              name={'street-view'}
              size={30}
              color={theme.colors.primaryText}
            />
          }
          onPress={() => setOnVisibleMap(true)}
        />
      </If>
      <If
        condition={
          Object.keys(trip).length > 0 ||
          (tripAccepted && Object.keys(tripAccepted).length > 0)
        }
      >
        <FloatButton
          icon={
            <Ionicons
              name={'ios-navigate-outline'}
              color={theme.colors.primaryText}
              size={30}
            />
          }
          onPress={() => {
            setModalNavigation(true);
          }}
        />
      </If>
    </>
  );
};
