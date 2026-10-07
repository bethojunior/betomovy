import {Modal} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {translate} from '../../../../client/locales';
import theme from '../../styles/theme';
import {AntDesign} from '@expo/vector-icons';
import {Button} from '../Button';
import {
  ContainerModal,
  ContentOptions,
  ContentOptionsButtons,
  ContentOptionsText,
  Exit,
} from './styles';

interface Props {
  modalEdit: boolean;
  setModalEdit: (value: boolean) => void;
  onClickButton1?: () => void;
  onClickButton2?: () => void;
  title: string;
  textButtons: {
    button1: string;
    button2: string;
  };
}

export const ModalSwitch = ({
  modalEdit,
  setModalEdit,
  onClickButton1,
  onClickButton2,
  title,
  textButtons,
}: Props) => {
  return (
    <Modal visible={modalEdit} transparent>
      <ContainerModal>
        <ContentOptions>
          <ContentOptionsText>{title}</ContentOptionsText>

          <ContentOptionsButtons>
            <Button
              title={textButtons?.button1}
              onPress={onClickButton1}
              small
            />
            <Button
              title={textButtons?.button2}
              onPress={onClickButton2}
              small
            />
          </ContentOptionsButtons>
          <Exit onPress={() => setModalEdit(false)} activeOpacity={1}>
            <AntDesign
              name="closecircleo"
              size={RFValue(22)}
              color={theme.colors.primary}
              onPress={() => setModalEdit(false)}
            />
          </Exit>
        </ContentOptions>
      </ContainerModal>
    </Modal>
  );
};
