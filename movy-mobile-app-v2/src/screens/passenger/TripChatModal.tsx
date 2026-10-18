import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { MOVY_THEME } from '../../theme/colors';
import { i18n } from '../../i18n';

interface TripChatModalProps {
  visible: boolean;
  tripId: string;
  driverName: string;
  onClose: () => void;
}

export const TripChatModal: React.FC<TripChatModalProps> = ({
  visible,
  tripId,
  driverName,
  onClose,
}) => {
  const country = i18n.getCountry();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<any[]>([
    {
      id: '1',
      sender: 'driver',
      text: country === 'US' ? 'Hello! I am on my way, 3 mins away.' : 'Olá! Estou a caminho, chego em 3 minutos.',
      time: '14:20',
      type: 'text',
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);

  const QUICK_REPLIES = country === 'US'
    ? ["I'm waiting outside", 'Please hurry', 'Traffic is heavy', 'I am wearing a blue jacket']
    : ['Estou esperando na porta', 'Pode buzinar ao chegar', 'Trânsito um pouco lento', 'Estou de camisa azul'];

  const handleSendText = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: 'passenger',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleSendAudioNote = () => {
    const newAudio = {
      id: Date.now().toString(),
      sender: 'passenger',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'audio',
      duration: '0:06',
    };
    setMessages((prev) => [...prev, newAudio]);
    setIsRecording(false);
    Alert.alert(
      country === 'US' ? 'Audio Note Sent' : 'Áudio Enviado',
      country === 'US' ? 'Voice note delivered to driver.' : 'Mensagem de voz entregue ao motorista.'
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>{driverName || 'Carlos (Driver)'}</Text>
              <Text style={styles.headerSubtitle}>
                {country === 'US' ? 'Live In-App Chat • Encrypted' : 'Chat em Tempo Real • Criptografado'}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Replies Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRepliesBar}>
            {QUICK_REPLIES.map((reply, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickChip}
                onPress={() => handleSendText(reply)}
              >
                <Text style={styles.quickChipText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Messages List */}
          <ScrollView style={styles.messagesContainer} contentContainerStyle={{ paddingVertical: 12 }}>
            {messages.map((msg) => {
              const isMe = msg.sender === 'passenger';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageBubble,
                    isMe ? styles.messageBubbleMe : styles.messageBubbleDriver,
                  ]}
                >
                  {msg.type === 'audio' ? (
                    <View style={styles.audioRow}>
                      <Text style={{ fontSize: 18 }}>▶️</Text>
                      <Text style={[styles.audioText, isMe && styles.audioTextMe]}>
                        🎙️ {country === 'US' ? 'Voice Note' : 'Áudio gravado'} ({msg.duration})
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.messageText, isMe && styles.messageTextMe]}>
                      {msg.text}
                    </Text>
                  )}
                  <Text style={[styles.messageTime, isMe && styles.messageTimeMe]}>{msg.time}</Text>
                </View>
              );
            })}
          </ScrollView>

          {/* Input Bar with Voice Audio Recorder */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder={country === 'US' ? 'Type a message to driver...' : 'Digite uma mensagem...'}
              placeholderTextColor="#64748B"
              value={inputText}
              onChangeText={setInputText}
            />

            {inputText.trim().length > 0 ? (
              <TouchableOpacity style={styles.sendButton} onPress={() => handleSendText()}>
                <Text style={styles.sendButtonText}>➔</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.audioButton, isRecording && styles.audioButtonActive]}
                onPress={handleSendAudioNote}
              >
                <Text style={styles.audioButtonText}>🎙️</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 10, 26, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F1426',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '75%',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#1E293B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: MOVY_THEME.colors.brandCyan,
    fontSize: 11,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '700',
  },
  quickRepliesBar: {
    paddingVertical: 12,
    flexGrow: 0,
  },
  quickChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  quickChipText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  messageBubbleMe: {
    backgroundColor: MOVY_THEME.colors.brandBlue,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  messageBubbleDriver: {
    backgroundColor: '#1E293B',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
  },
  messageText: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextMe: {
    color: '#FFF',
  },
  messageTime: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTimeMe: {
    color: '#BAE6FD',
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  audioTextMe: {
    color: '#FFF',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#070A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#1E293B',
    fontSize: 14,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: MOVY_THEME.colors.brandCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#070A1A',
    fontWeight: '900',
    fontSize: 18,
  },
  audioButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  audioButtonActive: {
    backgroundColor: '#EF4444',
  },
  audioButtonText: {
    fontSize: 18,
  },
});
