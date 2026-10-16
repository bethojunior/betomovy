import theme from '../../styles/theme';
import { If } from '../If';
import { TextEdit } from '../TextEdit';
import { Ionicons } from '@expo/vector-icons';
import {
  AlertContainer,
  ButtonOk,
  Container,
  ContainerText,
  Title,
} from './styles';

import { useTheme } from 'styled-components';
import { TouchableOpacity } from 'react-native';

interface Props {
  visible: boolean;
  setVisible?: (visible: boolean) => void;
  description?: string;
  title?: string;
  callBack?: () => void;
  textButton?: string;
  children?: React.ReactNode;
  closeButton?: boolean;
}

export const SwalAlert = ({
  visible,
  setVisible,
  description,
  title,
  callBack,
  textButton,
  children,
  closeButton,
}: Props) => {
  const { colors } = useTheme();

  return (
    <If condition={visible}>
      <Container>
        <AlertContainer>
          <If condition={closeButton}>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                padding: 5,
                marginBottom: 10,
              }}
              onPress={() => {
                setVisible && setVisible(false);
              }}
            >
              <Ionicons name="close" size={24} color={colors.red} />
            </TouchableOpacity>
          </If>
          <If condition={title}>
            <Title>{title || ''}</Title>
          </If>

          <ContainerText>
            <TextEdit color={colors.secondary}>{description}</TextEdit>
          </ContainerText>
          <If condition={closeButton ? false : setVisible || callBack}>
            <ButtonOk
              onPress={() => {
                setVisible && setVisible(false);
                callBack && callBack();
              }}
            >
              <TextEdit color={theme.colors.primary}>
                {textButton || 'Ok'}
              </TextEdit>
            </ButtonOk>
          </If>
          {children}
        </AlertContainer>
      </Container>
    </If>
  );
};
