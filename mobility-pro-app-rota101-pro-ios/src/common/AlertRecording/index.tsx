import {View, Image} from 'react-native';
import {
  AlertContent,
  BallRec,
  RecContent,
  TextAlert,
  TextRec,
  TitleAlert,
} from './styles';
import Megaphone from '../../../assets/megaphone.png';
import {translate} from '../../client/locales';
import {speak} from 'expo-speech';
import {useEffect} from 'react';

export const AlertRecording = () => {
  const speakMessage = (title, message: string) => {
    try {
      speak(`${title}${message}`, {
        language: 'pt-BR',
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    speakMessage(
      translate('alertRecording.title'),
      translate('alertRecording.text'),
    );
  }, []);

  return (
    <AlertContent>
      <View style={{width: '25%'}}>
        <Image source={Megaphone} style={{width: 70, height: 70}} />
      </View>
      <View style={{width: '60%', paddingRight: 10}}>
        <TitleAlert>{translate('alertRecording.title')}</TitleAlert>
        <TextAlert>{translate('alertRecording.text')}</TextAlert>
      </View>
      <View style={{width: '12%'}}>
        <RecContent>
          <BallRec />
          <TextRec>REC</TextRec>
        </RecContent>
      </View>
    </AlertContent>
  );
};
