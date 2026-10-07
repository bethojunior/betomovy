import {useState} from 'react';
import {useTripProvider} from '../../context/Trip';
import {If} from '../If';
import {ModalTripPreAccepted} from '../Modal/TripPreAccepted';
import {
  ButtonTripPreAccepted,
  PreAcceptedContent,
  TextPreAccepted,
} from './styles';
import {useTheme} from 'styled-components';
import {translate} from '../../../../client/locales';
import {MaterialIcons} from '@expo/vector-icons';
export const ModalAndButtonPreAcceptedComponent = () => {
  const {stateTrip} = useTripProvider();
  const {tripPreAccepted} = stateTrip;
  const [tripPreAcceptedModal, setTripPreAcceptedModal] = useState(false);
  const {colors} = useTheme();
  return (
    <If condition={Object.keys(tripPreAccepted).length !== 0}>
      <ModalTripPreAccepted
        visible={tripPreAcceptedModal}
        setVisible={setTripPreAcceptedModal}
      />
      <ButtonTripPreAccepted
        visible={Object.keys(tripPreAccepted).length !== 0}
        onPress={() => setTripPreAcceptedModal(true)}
        activeOpacity={0.8}
      >
        <PreAcceptedContent>
          <TextPreAccepted>
            {translate('tripPreAccepted.title_trip_pre_accepted')}
          </TextPreAccepted>
          <MaterialIcons
            name="keyboard-arrow-right"
            color={colors.primaryText}
            size={30}
          />
        </PreAcceptedContent>
      </ButtonTripPreAccepted>
    </If>
  );
};
