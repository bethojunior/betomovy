import {Linking, ScrollView, View} from 'react-native';
import {useState} from 'react';
import {CallIcon, ContainerCardColumn} from './styles';
import {TextEdit} from '../TextEdit';
import {IfLoaderInsideScreen} from '../IfLoaderInsideScreen';
import {CardProblem} from '../CardProblem';
import theme from '../../styles/theme';
import {usePanic} from '../../context/Panic';
import {useAuth} from '../../../../context/auth';
import {translate} from '../../../../client/locales';
import {customToast} from '../../../../utils/FlashMessage';

interface Props {
  data: TypeProps[];
  setVisible: (value: boolean) => void;
}

interface TypeProps {
  id: string;
  name: string;
  statusId: string;
}

export const CardPanic = ({data, setVisible}: Props) => {
  const {alertPanicOnMonitor} = usePanic();
  const {cityConfig} = useAuth();

  const [loading, setLoading] = useState(false);

  const ButtonCall = () => {
    Linking.openURL(`tel:${cityConfig?.securityContactNumber}`);
  };

  const handleAlertPanicOnMonitor = async (emergencyId: string) => {
    setLoading(true);
    if (!emergencyId) {
      return;
    }
    const response = await alertPanicOnMonitor(emergencyId);
    if (!response.status) {
      customToast(translate('panic.alert_error'), 'danger');

      setLoading(false);
      return;
    }
    customToast(translate('contactUs.alert_sucess'), 'success');
    setVisible(false);
    setLoading(false);
  };

  return (
    <ContainerCardColumn
      from={{
        opacity: 0,
        transform: [{translateY: 150}],
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
      <CallIcon onPress={ButtonCall} activeOpacity={0.8}>
        <TextEdit color={theme.colors.primaryText}>
          {translate('panic.call_for_emergency')}
        </TextEdit>
      </CallIcon>
      <View
        style={{
          marginBottom: theme.spacing.small,
        }}
      >
        <TextEdit transform="none" color={theme.colors.secondary}>
          {translate('panic.or')}
        </TextEdit>
      </View>
      <View
        style={{
          marginBottom: theme.spacing.xlarge,
        }}
      >
        <TextEdit transform="none" color={theme.colors.secondary}>
          {translate('panic.report_problem')}
        </TextEdit>
      </View>

      <IfLoaderInsideScreen loading={loading}>
        <ScrollView
          style={{
            width: '100%',
          }}
        >
          {data.length > 0 &&
            data.map((item: TypeProps, index: number) => {
              if (item.id !== '6') {
                return (
                  <CardProblem
                    onPress={() => handleAlertPanicOnMonitor(item.id)}
                    item={item}
                    key={index}
                  />
                );
              }
            })}
        </ScrollView>
      </IfLoaderInsideScreen>
    </ContainerCardColumn>
  );
};
