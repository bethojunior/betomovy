import React, {FC} from 'react';
import {Modal, Platform, TouchableOpacity, View} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import {translate} from '../../../locales';
import {If} from '../../If';

import {
  Content,
  ModalContent,
  ContentButton,
  Button,
  ErrorText,
  TextButton,
} from './styles';
import {TextBold} from '../../CardTravel/styles';
import theme from '../../../styles/theme';
import {IfLoaderInsideScreen} from '../../IfLoaderInsideScreen';

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
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border,
                }}
              >
                <TextBold>{title}</TextBold>
                {componentButton || null}
              </View>
            </If>

            {error === true && <ErrorText>{textError}</ErrorText>}
            {children}
            <ContentButton>
              <Button
                disabled={isLoading}
                hide={hideCancel}
                onPress={() => {
                  onClose();
                  setVisible(false);
                }}
              >
                <TextButton cancel hide={hideCancel}>
                  {textCancel || translate('buttonModal.cancel')}
                </TextButton>
              </Button>
              <Button
                disabled={isLoading}
                hide={hideConfirm}
                onPress={onPressConfirm}
              >
                <View>
                  <IfLoaderInsideScreen loading={isLoading || null}>
                    <TextButton hide={hideConfirm}>
                      {textConfirm || translate('buttonModal.confirm')}
                    </TextButton>
                  </IfLoaderInsideScreen>
                </View>
              </Button>
            </ContentButton>
          </ModalContent>
        </Content>
      </Modal>
    </>
  );
};

export default ModalFrame;
