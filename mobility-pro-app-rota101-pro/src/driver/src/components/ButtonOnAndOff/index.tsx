import {RFValue} from 'react-native-responsive-fontsize';
import {useUserDriver} from '../../context/userDriver';
import theme from '../../styles/theme';
import {TextEdit} from '../TextEdit';

import {MaterialIcons} from '@expo/vector-icons';
import {ButtonOnAndOff, ButtonView} from './styles';
import {IfLoaderInsideScreen} from '../IfLoaderInsideScreen';
import {translate} from '../../../../client/locales';

interface Props {
  setOn: () => void;
  setOff: () => void;
  setInitLocationX: (value: number) => void;
  initLocationX: number;
}

export const ButtonV2 = ({
  setOn,
  setInitLocationX,
  initLocationX,
  setOff,
}: Props) => {
  const {userDriverFind, loadingButton} = useUserDriver();

  return (
    <ButtonOnAndOff pointerEvents={loadingButton ? 'box-none' : null}>
      <ButtonView
        activeOpacity={0.8}
        color={
          userDriverFind.status === 'desligado'
            ? theme.colors.primary
            : theme.colors.background_global
        }
        disabled={userDriverFind.status === 'disponivel'}
        onPressIn={e => {
          setInitLocationX(Number(e.nativeEvent.locationX.toFixed(2)));
        }}
        onPressOut={e => {
          setOn();
        }}
        onPress={() => {
          setOn();
        }}
      >
        <TextEdit
          color={
            userDriverFind.status === 'desligado'
              ? theme.colors.background_global
              : theme.colors.secondary
          }
          size={'large'}
        >
          {translate('driverhome.deactivate')}
        </TextEdit>
        <IfLoaderInsideScreen loading={loadingButton}>
          <MaterialIcons
            name="arrow-forward-ios"
            size={RFValue(20)}
            color={theme.colors.background_global}
          />
        </IfLoaderInsideScreen>
      </ButtonView>
      <ButtonView
        activeOpacity={0.8}
        disabled={userDriverFind.status === 'desligado'}
        color={
          userDriverFind.status === 'disponivel'
            ? theme.colors.primary
            : theme.colors.background_global
        }
        onPressIn={e => {
          setInitLocationX(Number(e.nativeEvent.locationX.toFixed(2)));
        }}
        onPress={() => {
          setOff();
        }}
        onPressOut={e => {
          setOff();
        }}
      >
        <IfLoaderInsideScreen loading={loadingButton} marginLeft={5}>
          <MaterialIcons
            name="arrow-back-ios"
            size={RFValue(20)}
            color={theme.colors.background_global}
          />
        </IfLoaderInsideScreen>

        <TextEdit
          color={
            userDriverFind.status === 'desligado'
              ? theme.colors.secondary
              : theme.colors.background_global
          }
          size={'large'}
        >
          {translate('driverhome.activated')}
        </TextEdit>
      </ButtonView>
    </ButtonOnAndOff>
  );
};