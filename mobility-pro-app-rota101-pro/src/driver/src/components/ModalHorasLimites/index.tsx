import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';

interface ModalHorasLimitesProps {
  visible: boolean;
  onClose: () => void;
}

export const ModalHorasLimites: React.FC<ModalHorasLimitesProps> = ({
  visible,
  onClose,
}) => {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end'
      }}>
        <View style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          paddingBottom: 40,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
          {/* Indicador de arraste */}
          <View style={{
            width: 40,
            height: 4,
            backgroundColor: '#ddd',
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 20
          }} />

          {/* Título */}
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            color: theme.colors.secondary,
            marginBottom: 20
          }}>
            Atenção
          </Text>

          {/* Conteúdo */}
          <View style={{ alignItems: 'center' }}>
            <Ionicons
              name="time-outline"
              size={50}
              color={theme.colors.primary}
              style={{ marginBottom: 15 }}
            />
            <Text style={{
              fontSize: 16,
              textAlign: 'center',
              color: theme.colors.secondary,
              lineHeight: 22
            }}>
              As horas limites de trabalho foram atingidas.
            </Text>
            <Text style={{
              fontSize: 14,
              textAlign: 'center',
              color: theme.colors.secondary,
              marginTop: 10,
              lineHeight: 20
            }}>
              Por questões de segurança, é necessário fazer uma pausa antes de continuar trabalhando.
            </Text>
          </View>

          {/* Botão de fechar */}
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary,
              padding: 15,
              borderRadius: 10,
              marginTop: 20,
              alignItems: 'center'
            }}
            onPress={onClose}
          >
            <Text style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold'
            }}>
              Entendi
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
