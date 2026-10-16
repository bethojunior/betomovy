import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/auth';
import apiMain from '../../api/apiMain';
import theme from '../../styles/theme';
import { translate } from '../../locales';
import TripMessage from '../../components/TripMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SharedTripsChat() {
    const styles = createStyles(theme);
    const navigation: any = useNavigation();
    const route: any = useRoute();
    const { user } = useAuth();

    // Obter tripReference dos params
    const tripReference = (route.params?.tripReference || '').toString().trim();

    interface LocalMessage {
        id: string;
        message: string;
        userId: string;
        timestamp: number;
        status: 'sending' | 'sent' | 'error';
    }

    const [messages, setMessages] = useState<LocalMessage[]>([]);
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);
    const messagesRef = useRef<LocalMessage[]>([]);

    // Chave para armazenar mensagens no AsyncStorage
    const getStorageKey = (ref: string) => `sharedTripsMessages_${ref}`;

    // Carregar mensagens salvas quando o tripReference mudar
    useEffect(() => {
        if (tripReference && tripReference.trim() !== '') {
            loadSavedMessages(tripReference);
        } else {
            // Limpar mensagens se não houver tripReference
            setMessages([]);
            messagesRef.current = [];
        }
    }, [tripReference]);

    // Salvar mensagens sempre que houver mudança
    useEffect(() => {
        if (tripReference && tripReference.trim() !== '' && messages.length > 0) {
            saveMessages(tripReference);
        }
    }, [messages, tripReference]);

    // Carregar mensagens ao focar na tela
    useFocusEffect(
        React.useCallback(() => {
            if (tripReference && tripReference.trim() !== '') {
                loadSavedMessages(tripReference);
            }
        }, [tripReference])
    );

    const loadSavedMessages = async (ref: string) => {
        if (!ref || ref.trim() === '') return;

        try {
            const storageKey = getStorageKey(ref);
            const savedMessages = await AsyncStorage.getItem(storageKey);
            if (savedMessages) {
                const parsedMessages: LocalMessage[] = JSON.parse(savedMessages);
                messagesRef.current = parsedMessages;
                setMessages(parsedMessages);

                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: false });
                }, 100);
            } else {
                messagesRef.current = [];
                setMessages([]);
            }
        } catch (error) {
            console.error('Erro ao carregar mensagens salvas:', error);
            messagesRef.current = [];
            setMessages([]);
        }
    };

    const saveMessages = async (ref: string) => {
        if (!ref || ref.trim() === '') return;

        try {
            const storageKey = getStorageKey(ref);
            await AsyncStorage.setItem(storageKey, JSON.stringify(messagesRef.current));
        } catch (error) {
            console.error('Erro ao salvar mensagens:', error);
        }
    };

    const sendMessageToServer = async (messageText: string, messageId: string) => {
        try {
            await apiMain.post('ChatTrip/SendMessage', {
                stdObject: [
                    {
                        tripReference: String(tripReference),
                        message: String(messageText),
                        userId: user?.idUser?.toString() || '',
                    },
                ],
            });

            const updatedMessages: LocalMessage[] = messagesRef.current.map(msg =>
                msg.id === messageId ? { ...msg, status: 'sent' as const } : msg
            );
            messagesRef.current = updatedMessages;
            setMessages(updatedMessages);
            return true;
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            const updatedMessages: LocalMessage[] = messagesRef.current.map(msg =>
                msg.id === messageId ? { ...msg, status: 'error' as const } : msg
            );
            messagesRef.current = updatedMessages;
            setMessages(updatedMessages);
            return false;
        }
    };

    const handleRetryMessage = async (messageId: string) => {
        const msg = messagesRef.current.find(m => m.id === messageId);
        if (!msg) return;

        const updatedMessages: LocalMessage[] = messagesRef.current.map(m =>
            m.id === messageId ? { ...m, status: 'sending' as const } : m
        );
        messagesRef.current = updatedMessages;
        setMessages(updatedMessages);

        await sendMessageToServer(msg.message, messageId);
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !tripReference || tripReference.trim() === '') return;

        const messageText = message.trim();
        const userId = user?.idUser?.toString() || '';
        const messageId = `msg_${Date.now()}_${Math.random()}`;
        const timestamp = Date.now() / 1000;

        // Adicionar mensagem imediatamente ao chat com status "enviando"
        const newMessage: LocalMessage = {
            id: messageId,
            message: messageText,
            userId: userId,
            timestamp: timestamp,
            status: 'sending',
        };

        const updatedMessages = [...messagesRef.current, newMessage];
        messagesRef.current = updatedMessages;
        setMessages(updatedMessages);
        setMessage('');

        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        setSending(true);
        await sendMessageToServer(messageText, messageId);
        setSending(false);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            {/* NavBar */}
            <View style={styles.navBar}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={theme.colors.primary}
                    />
                </TouchableOpacity>
                <Text style={styles.navBarTitle}>{translate('sharedTrips.chat_title')}</Text>
                <View style={styles.navBarRight} />
            </View>

            {/* Messages Content */}
            {messages.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="chatbubbles-outline"
                        size={48}
                        color={theme.colors.grayLight}
                    />
                    <Text style={styles.emptyText}>{translate('sharedTrips.chat_empty')}</Text>
                    <Text style={styles.emptySubtext}>
                        Suas mensagens serão enviadas para o motorista
                    </Text>
                </View>
            ) : (
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    onContentSizeChange={() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                    }}
                >
                    {messages.map((msg) => {
                        const isMyMessage = Number(msg.userId) === Number(user?.idUser);

                        return (
                            <View key={msg.id} style={styles.messageWrapper}>
                                <TripMessage
                                    message={msg.message}
                                    preview={null}
                                    timeSendInSeconds={msg.timestamp}
                                    isAudio={false}
                                    reiceved={!isMyMessage}
                                    data={{
                                        message: msg.message,
                                        userId: msg.userId,
                                        date: { seconds: msg.timestamp },
                                        isAudio: false,
                                        id: msg.id,
                                    }}
                                    speakUnicMessage={() => { }}
                                />
                                {isMyMessage && (
                                    <View style={styles.messageStatus}>
                                        {msg.status === 'sending' && (
                                            <ActivityIndicator
                                                size="small"
                                                color={theme.colors.grayLight}
                                                style={styles.statusIndicator}
                                            />
                                        )}
                                        {msg.status === 'error' && (
                                            <TouchableOpacity
                                                onPress={() => handleRetryMessage(msg.id)}
                                                style={styles.retryButton}
                                            >
                                                <Ionicons
                                                    name="refresh"
                                                    size={16}
                                                    color="#ff4444"
                                                />
                                            </TouchableOpacity>
                                        )}
                                        {msg.status === 'sent' && (
                                            <Ionicons
                                                name="checkmark"
                                                size={16}
                                                color={theme.colors.primary}
                                            />
                                        )}
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </ScrollView>
            )}

            {/* Footer - Input e Botão de Enviar */}
            <View style={styles.footer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua mensagem..."
                        placeholderTextColor={theme.colors.grayLight}
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        maxLength={500}
                    />
                </View>
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (!message.trim() || sending) && styles.sendButtonDisabled,
                    ]}
                    onPress={handleSendMessage}
                    disabled={!message.trim() || sending}
                    activeOpacity={0.7}
                >
                    {sending ? (
                        <ActivityIndicator size="small" color={theme.colors.primaryText} />
                    ) : (
                        <Ionicons name="send" size={20} color={theme.colors.primaryText} />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background_global,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: theme.colors.background_global,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingTop: Platform.OS === 'ios' ? 50 : 15,
    },
    backButton: {
        padding: 5,
    },
    navBarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.secondary,
        flex: 1,
        textAlign: 'center',
    },
    navBarRight: {
        width: 34,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.secondary,
        marginTop: 15,
    },
    emptySubtext: {
        fontSize: 14,
        color: theme.colors.grayLight,
        marginTop: 5,
        textAlign: 'center',
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 15,
        paddingBottom: 20,
    },
    messageWrapper: {
        marginBottom: 4,
        position: 'relative',
    },
    messageStatus: {
        position: 'absolute',
        right: 10,
        bottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIndicator: {
        marginRight: 5,
    },
    retryButton: {
        padding: 4,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: theme.colors.background_global,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    inputContainer: {
        flex: 1,
        marginRight: 10,
        backgroundColor: theme.colors.background_white || '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxHeight: 100,
    },
    input: {
        fontSize: 14,
        color: theme.colors.secondary,
        padding: 0,
        margin: 0,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: theme.colors.grayLight,
        opacity: 0.5,
    },
});

