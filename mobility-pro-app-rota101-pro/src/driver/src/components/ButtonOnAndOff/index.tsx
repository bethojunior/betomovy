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

const C = theme.colors as any;
const NAVY = C.navy_deep ?? '#070A1A';
const CYAN = C.cyan_electric ?? '#04F3FA';
const MUTED = C.gray_muted ?? '#64748B';
const BORDER = C.gray_border ?? '#E2E8F0';
const INACTIVE_BG = '#FFFFFF';

export const ButtonV2 = ({
  setOn,
  setInitLocationX,
  initLocationX,
  setOff,
}: Props) => {
  const {userDriverFind, loadingButton} = useUserDriver();

  const isOnline = userDriverFind.status === 'disponivel';
  const isOffline = userDriverFind.status === 'desligado';

  // Estado ativo: "Desativado" destaca em navy quando offline; "Ativado" destaca em cyan quando online.
  const leftActive = isOffline;
  const rightActive = isOnline;

  return (
    <ButtonOnAndOff pointerEvents={loadingButton ? 'box-none' : null}>
      <ButtonView
        activeOpacity={0.8}
        color={leftActive ? NAVY : INACTIVE_BG}
        borderColor={leftActive ? NAVY : BORDER}
        disabled={isOnline}
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
          color={leftActive ? '#FFFFFF' : MUTED}
          size={'large'}
        >
          {translate('driverhome.deactivate')}
        </TextEdit>
        <IfLoaderInsideScreen loading={loadingButton}>
          <MaterialIcons
            name="arrow-forward-ios"
            size={RFValue(20)}
            color={leftActive ? '#FFFFFF' : MUTED}
          />
        </IfLoaderInsideScreen>
      </ButtonView>
      <ButtonView
        activeOpacity={0.8}
        disabled={isOffline}
        color={rightActive ? CYAN : INACTIVE_BG}
        borderColor={rightActive ? CYAN : BORDER}
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
            color={rightActive ? NAVY : MUTED}
          />
        </IfLoaderInsideScreen>

        <TextEdit
          color={rightActive ? NAVY : MUTED}
          size={'large'}
        >
          {translate('driverhome.activated')}
        </TextEdit>
      </ButtonView>
    </ButtonOnAndOff>
  );
};
