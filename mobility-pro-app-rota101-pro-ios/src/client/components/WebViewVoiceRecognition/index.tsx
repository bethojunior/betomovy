import { View } from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';

interface Props {
  text?: string;
  setText: (text: string) => void;
  setStartLoading?: (value: boolean) => void;
  width?: number;
  height?: number;
  sizeIcon?: number;
  automatic?: boolean;
  showModalVoiceRecord?: boolean;
  setShowModalVoiceRecord?: (data: boolean) => void;
  handleOnTheEnd?: () => void;
}

export const WebViewVoiceRecognition = ({
  setText,
  width,
  height,
  showModalVoiceRecord = false,
  setShowModalVoiceRecord,
  handleOnTheEnd,
}: Props) => {
  const startRecording = async () => {
    try {
      const language = (await AsyncStorage.getItem('@language')) || 'pt-BR';
      const formattedLanguage = language.replace('_', '-');

      const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!perm.granted) {
        console.warn('Permissão negada para reconhecimento de fala');
        return;
      }

      await ExpoSpeechRecognitionModule.start({
        lang: formattedLanguage,
        interimResults: false,
        continuous: false,
      });
    } catch (error) {
      console.log('Erro ao iniciar gravação', error);
    }
  };

  const stopRecording = async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
    } catch (error) {
      console.log('Erro ao parar gravação', error);
    }
  };

  useEffect(() => {
    const resultListener = ExpoSpeechRecognitionModule.addListener(
      'result',
      (event: any) => {
        // normalmente: event.results é um array de transcrições
        const transcript = event.results?.[0]?.transcript;
        if (transcript) {
          setText(transcript);
        }
      }
    );

    const errorListener = ExpoSpeechRecognitionModule.addListener(
      'error',
      (event: any) => {
        console.log('Erro no reconhecimento:', event);
        setShowModalVoiceRecord?.(false);
        handleOnTheEnd?.();
      }
    );

    const endListener = ExpoSpeechRecognitionModule.addListener('end', () => {
      console.log('Reconhecimento finalizado');
      handleOnTheEnd?.();
    });

    return () => {
      resultListener.remove();
      errorListener.remove();
      endListener.remove();
    };
  }, []);

  useEffect(() => {
    if (showModalVoiceRecord) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [showModalVoiceRecord]);

  return (
    <View
      style={{
        width: width || 50,
        height: height || 50,
        justifyContent: 'center',
      }}
    />
  );
};
