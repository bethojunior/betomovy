import { Modal } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { translate } from '../../../../client/locales';
import theme from '../../styles/theme';
import { AntDesign } from '@expo/vector-icons';
import { Button } from '../Button';
import {
  ContainerModal,
  ContentOptions,
  ContentOptionsButtons,
  Title,
  Exit,
  Subtitle,
  OptionButton,
  OptionText,
  SubmitButton,
} from './styles';
import { useState } from 'react';

interface Props {
  modalEdit: boolean;
  setModalEdit: (value: boolean) => void;
  onClickButton1?: () => void;
  onClickButton2?: () => void;
  title: string;
  subtitle?: string;
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
  subtitle,
  textButtons,
}: Props) => {
  const [option, setOption] = useState<number>(1);

  function onSubmit() {
    if (option === 1 && onClickButton1) {
      onClickButton1();
    } else if (option === 2 && onClickButton2) {
      onClickButton2();
    }
  }

  return (
    <Modal visible={modalEdit} transparent>
      <ContainerModal>
        <ContentOptions>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}

          <ContentOptionsButtons>
            <OptionButton onPress={() => setOption(1)} active={option === 1}>
              <OptionText active={option === 1}>{textButtons?.button1}</OptionText>
            </OptionButton>

            <OptionButton onPress={() => setOption(2)} active={option === 2}>
              <OptionText active={option === 2}>{textButtons?.button2}</OptionText>
            </OptionButton>
          </ContentOptionsButtons>

          <SubmitButton title={translate('modalSwitch.submit_button')} onPress={onSubmit} />

          <Exit onPress={() => setModalEdit(false)} activeOpacity={1}>
            <AntDesign
              name="close-circle"
              size={RFValue(24)}
              color={theme.colors.primary}
              onPress={() => setModalEdit(false)}
            />
          </Exit>
        </ContentOptions>
      </ContainerModal>
    </Modal>
  );
};
