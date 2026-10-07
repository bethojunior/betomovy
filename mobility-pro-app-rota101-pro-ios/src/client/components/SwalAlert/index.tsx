import theme from '../../styles/theme';
import {If} from '../If';
import {TextEdit} from '../TextEdit';
import {
  AlertContainer,
  ButtonOk,
  Container,
  ContainerText,
  Title,
} from './styles';

import {useTheme} from 'styled-components';

interface Props {
  visible: boolean;
  setVisible?: (visible: boolean) => void;
  description?: string;
  title?: string;
  callBack?: () => void;
  textButton?: string;
  children?: React.ReactNode;
}

export const SwalAlert = ({
  visible,
  setVisible,
  description,
  title,
  callBack,
  textButton,
  children,
}: Props) => {
  const {colors} = useTheme();

  return (
    <If condition={visible}>
      <Container>
        <AlertContainer>
          <If condition={title}>
            <Title>{title || ''}</Title>
          </If>

          <ContainerText>
            <TextEdit color={colors.secondary}>{description}</TextEdit>
          </ContainerText>
          <If condition={setVisible || callBack}>
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
