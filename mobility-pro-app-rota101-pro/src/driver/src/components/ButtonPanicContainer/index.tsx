import {useRef} from 'react';
import theme from '../../styles/theme';
import {TextEdit} from '../TextEdit';
import {ButtonPanic, ContainerAlertPanic, ContainerPanic} from './styles';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {If} from '../If';
import {translate} from '../../../../client/locales';
import {TouchableOpacity} from 'react-native';
import {useAuth} from '../../../../context/auth';
import {RFValue} from 'react-native-responsive-fontsize';
interface Props {
  setVisibleAlertProtect: (value: boolean) => void;
  visibleAlertProtect: boolean;
  setVisibleCount: (value: boolean) => void;
  handleCamera?: () => void;
}

export const ButtonPanicContainer = ({
  setVisibleAlertProtect,
  visibleAlertProtect,
  setVisibleCount,
  handleCamera,
}: Props) => {
  const countClick = useRef(0);
  const {generalSettings} = useAuth();

  return (
    <ContainerPanic>
      <If condition={visibleAlertProtect}>
        <ContainerAlertPanic
          from={{
            opacity: 0,
            transform: [{translateY: -20}],
          }}
          animate={{
            opacity: 1,
            transform: [{translateY: 0}],
          }}
          exit={{
            opacity: 0,
            transform: [{translateY: 0}],
          }}
        >
          <TextEdit size="small">
            {translate('panic.text_two_taps_activate_security_alert')}
          </TextEdit>
        </ContainerAlertPanic>
      </If>
      {generalSettings.find(
        item => item?.key === 'enable_security_button_options',
      )?.value === '1' && (
        <ButtonPanic
          onPress={() => {
            // eslint-disable-next-line no-plusplus
            countClick.current++;

            if (countClick.current === 2) {
              setVisibleCount(true);
              setVisibleAlertProtect(false);
              countClick.current = 0;
            }
            setVisibleAlertProtect(true);
            setTimeout(() => {
              countClick.current = 0;
              setVisibleAlertProtect(false);
            }, 2000);
          }}
          activeOpacity={0.8}
        >
          <TextEdit>
            <MaterialCommunityIcons
              name="shield-half-full"
              size={RFValue(20)}
              style={{
                color: theme.colors.primaryText,
              }}
            />
          </TextEdit>
        </ButtonPanic>
      )}
    </ContainerPanic>
  );
};
