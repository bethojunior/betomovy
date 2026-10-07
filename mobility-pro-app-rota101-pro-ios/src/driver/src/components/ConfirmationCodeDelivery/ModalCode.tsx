import React, {useState} from 'react';
import {View, Text, TextInput, Button, Modal, StyleSheet} from 'react-native';

export const ModalCode = ({isVisible, onClose, onConfirm}) => {
  const [code, setCode] = useState('');

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text>Solicite o nº do pedido ao cliente e digite abaixo:</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />
          <Button title="CONFIRMAR" onPress={() => onConfirm(code)} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    width: '100%',
  },
});
