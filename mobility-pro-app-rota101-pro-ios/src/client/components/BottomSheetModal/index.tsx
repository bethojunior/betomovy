import React from 'react';
import {Modal, TouchableWithoutFeedback} from 'react-native';
import Animated from 'react-native-reanimated';
import {useSlideUpAnimation} from '../../hooks/useSlideUpAnimation';
import {Content, Handle, ModalContent} from './styles';
import {BottomSheetModalProps} from './types';

/**
 * Chrome compartilhado de bottom sheet: fundo escurecido com fade, folha
 * branca com cantos arredondados no topo animada via translateY
 * (useSlideUpAnimation), independente do fade do backdrop nativo do Modal.
 * Tocar fora da folha fecha (TouchableWithoutFeedback no backdrop; a folha
 * tem seu próprio TouchableWithoutFeedback no-op pra não propagar o toque).
 */
export function BottomSheetModal({visible, onRequestClose, children}: BottomSheetModalProps) {
  const sheetStyle = useSlideUpAnimation(visible);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <Content>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View style={sheetStyle}>
              <ModalContent edges={['bottom']}>
                <Handle />
                {children}
              </ModalContent>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Content>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
