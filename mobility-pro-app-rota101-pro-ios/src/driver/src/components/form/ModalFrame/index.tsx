import {FC} from 'react';
import {Modal, Platform, TouchableOpacity, View} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import {If} from '../../If';

import {
  Content,
  ModalContent,
  ContentButton,
  Button,
  ErrorText,
  TextButton,
  TextBold,
} from './styles';

import theme from '../../../styles/theme';
import {IfLoaderInsideScreen} from '../../IfLoaderInsideScreen';
import {translate} from '../../../../../client/locales';

interface Props {
  visible: boolean;
  setVisible(boolean: boolean): void;
  children: any;
  onPressConfirm?: any;
  closeIcon?: boolean;
  error?: boolean;
  textError?: string;
  onClose: () => void;
  textCancel?: string;
  textConfirm?: string;
  hideCancel?: boolean;
  hideConfirm?: boolean;
  title?: string;
  componentButton?: any;
  isLoading?: boolean;
  onDismiss?: () => void;
}

const ModalFrame: FC<Props> = ({
  visible,
  setVisible,
  children,
  onPressConfirm,
  error,
  textError,
  onClose,
  textCancel,
  textConfirm,
  hideCancel,
  hideConfirm,
  title,
  closeIcon,
  componentButton,
  isLoading,
  onDismiss,
}) => {
  return (
    <>
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}
        onDismiss={onDismiss}
      >
        <Content behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ModalContent pointerEvents={isLoading ? 'none' : 'auto'}>
            <If condition={closeIcon}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onClose}
                style={{
                  padding: 15,
                  marginLeft: 'auto',
                }}
              >
                <AntDesign
                  name="close"
                  onPress={onClose}
                  size={30}
                  color={theme.colors.secondary}
                />
              </TouchableOpacity>
            </If>
            <If condition={title}>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <TextBold>{title}</TextBold>
                {componentButton || null}
              </View>
            </If>

            {error === true && <ErrorText>{textError}</ErrorText>}
            {children}
            <ContentButton>
              {!hideCancel && (
                <Button
                  disabled={isLoading}
                  onPress={() => {
                    onClose();
                    setVisible(false);
                  }}
                >
                  <TextButton>
                    {textCancel || translate('driver_buttonModal.cancel')}
                  </TextButton>
                </Button>
              )}
              {!hideConfirm && (
                <Button
                  disabled={isLoading}
                  onPress={onPressConfirm}
                >
                  <View>
                    <IfLoaderInsideScreen loading={isLoading || null}>
                      <TextButton>
                        {textConfirm || translate('driver_buttonModal.confirm')}
                      </TextButton>
                    </IfLoaderInsideScreen>
                  </View>
                </Button>
              )}
            </ContentButton>
          </ModalContent>
        </Content>
      </Modal>
    </>
  );
};

export default ModalFrame;
