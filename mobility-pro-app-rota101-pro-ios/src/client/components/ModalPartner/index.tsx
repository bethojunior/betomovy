import {Modal, Platform, View} from 'react-native';
import {useState} from 'react';
import {Button, Container, ContainerContent, Content} from './styles';
import {TextEdit} from '../TextEdit';
import InputFrame from '../form/InputFrame';
import {useTrip} from '../../contexts/Trip';
import {BackPage} from '../BackPage';
import theme from '../../styles/theme';
import {translate} from '../../locales';
import {customToast} from '../../../utils/FlashMessage';

interface Props {
  setTripType?: (tripType: string) => void;
}

export const ModalPartner = ({setTripType}: Props) => {
  const {calculateAll, stateTripCustomer, dispatchTripCustomer} = useTrip();

  const {
    itsForMe,
    origin,
    destination: destiny,
    waypoints,
    inputWho,
  } = stateTripCustomer;
  const [name, setName] = useState(inputWho.name);
  const [phone, setPhone] = useState(inputWho.phone);

  const onClose = () => {
    dispatchTripCustomer({
      type: 'update',
      field: 'itsForMe',
      arg: false,
    });
  };
  return (
    <Modal
      visible={itsForMe}
      transparent
      animationType="slide"
      onDismiss={onClose}
    >
      <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Content>
          <BackPage ml={-5} onPress={() => onClose()} />
          <ContainerContent>
            <View>
              <TextEdit color={theme.colors.secondary}>
                {translate('myProfile.text_name')}
              </TextEdit>
              <InputFrame
                value={name}
                setValue={(value: string) => {
                  setName(value);
                }}
                editable
                keyboradType="default"
              />
            </View>
            <View>
              <TextEdit color={theme.colors.secondary}>
                {translate('changePhone.text_number')}
              </TextEdit>
              <InputFrame
                value={phone}
                setValue={(value: string) => setPhone(value)}
                editable
                keyboradType="numeric"
                maxLength={11}
              />
            </View>

            <Button
              onPress={async () => {
                if (name === '' || phone === '') {
                  customToast(translate('panic.alert_incomplete'), 'warning');
                  return;
                }
                dispatchTripCustomer({
                  type: 'update',
                  field: 'inputWho',
                  arg: {
                    name,
                    phone,
                  },
                });
                dispatchTripCustomer({
                  type: 'update',
                  field: 'itsForMe',
                  arg: false,
                });

                await setTripType('tripPartner');
                // @ts-ignore
                await calculateAll(origin, destiny, waypoints);
              }}
            >
              <TextEdit color={theme.colors.primaryText}>
                {translate('trip.confirm')}
              </TextEdit>
            </Button>
          </ContainerContent>
        </Content>
      </Container>
    </Modal>
  );
};
