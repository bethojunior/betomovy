import { FC } from 'react';
import { Modal, Platform, StyleProp, TouchableOpacity, View, ViewStyle, useWindowDimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { translate } from '../../../../../client/locales';
import { If } from '../../If';

import {
  Content,
  ModalContent,
  ContentButton,
  Button,
  ErrorText,
  TextButton,
  TextBold,
  ContentScroll,
} from './styles';
import theme from '../../../styles/theme';
import { IfLoaderInsideScreen } from '../../IfLoaderInsideScreen';

interface Props {
  visible: boolean;
  setVisible(boolean: boolean): void;
  children: any;
  onPressConfirm?: any;
  closeIcon?: boolean;
  closeIconColor?: string;
  closeIconSize?: number;
  closeIconTransparent?: boolean;
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
  loadingColor?: string;
  scrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  contentBackgroundColor?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** When set with contentBackgroundColor, overrides min height (e.g. 0.58 for 58% of screen) */
  contentMinHeightPercent?: number;
  /** When set with contentBackgroundColor, overrides max height (e.g. 0.94 for 94% of screen) */
  contentMaxHeightPercent?: number;
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
  closeIconColor,
  closeIconSize = 24,
  closeIconTransparent,
  componentButton,
  isLoading,
  loadingColor,
  scrollable,
  contentStyle,
  contentBackgroundColor,
  contentContainerStyle,
  contentMinHeightPercent,
  contentMaxHeightPercent,
  onDismiss,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  const modalContentStyle =
    contentBackgroundColor
      ? {
          backgroundColor: contentBackgroundColor,
          minHeight: windowHeight * (contentMinHeightPercent ?? 0.4),
          maxHeight: windowHeight * (contentMaxHeightPercent ?? 0.94),
          width: '92%',
          alignSelf: 'center' as const,
        }
      : undefined;

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
          <ModalContent
            pointerEvents={isLoading ? 'none' : 'auto'}
            style={modalContentStyle}
          >
            {error === true && <ErrorText>{textError}</ErrorText>}
            <If condition={closeIcon}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  zIndex: 1,
                  padding: closeIconTransparent ? 4 : 8,
                  borderRadius: 20,
                  backgroundColor: closeIconTransparent ? 'transparent' : 'rgba(255, 255, 255, 0.9)',
                }}
              >
                <AntDesign
                  name="close"
                  onPress={onClose}
                  size={closeIconSize}
                  color={closeIconColor || theme.colors.secondary}
                />
              </TouchableOpacity>
            </If>
            <If condition={title}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                  paddingHorizontal: 40,
                }}
              >
                <TextBold>{title}</TextBold>
              </View>
            </If>

            <ContentScroll
              style={contentStyle}
              contentContainerStyle={contentContainerStyle}
              scrollEnabled={scrollable ?? !!contentBackgroundColor}
              showsVerticalScrollIndicator={!!contentBackgroundColor}
            >
              {children}
            </ContentScroll>

            {(!hideCancel || !hideConfirm) && (
              <ContentButton align={hideCancel || hideConfirm ? 'center' : null}>
                {!hideCancel && (
                  <Button
                    disabled={isLoading}
                    onPress={() => {
                      onClose();
                      setVisible(false);
                    }}
                  >
                    <TextButton cancel>
                      {textCancel || translate('buttonModal.cancel')}
                    </TextButton>
                  </Button>
                )}

                {!hideConfirm && (
                  <Button
                    disabled={isLoading}
                    onPress={onPressConfirm}
                  >
                    <View>
                      <IfLoaderInsideScreen
                        color={loadingColor || null}
                        loading={isLoading || null}
                      >
                        <TextButton>
                          {textConfirm || translate('buttonModal.confirm')}
                        </TextButton>
                      </IfLoaderInsideScreen>
                    </View>
                  </Button>
                )}
              </ContentButton>
            )}
          </ModalContent>
        </Content>
      </Modal>
    </>
  );
};

export default ModalFrame;
