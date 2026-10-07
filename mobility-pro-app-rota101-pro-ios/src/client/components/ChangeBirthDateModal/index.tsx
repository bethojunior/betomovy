import {useState, FC, useEffect} from 'react';
import {Alert, Modal, ToastAndroid} from 'react-native';
import {
  Content,
  ModalContent,
  ContentButton,
  Button,
  Input,
  TextError,
  SimpleText,
} from './styles';
import Preload from '../Preload';
import apiMain from '../../api/apiMain';
import {translate} from '../../locales';
import {useAuth} from '../../../context/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {customToast} from '../../../utils/FlashMessage';
import Helper from '../../utils/Helper';

type Props = {
  visible: boolean;
  setVisible(boolean: boolean): () => void;
  currentDateBirth: string;
};

const ChangeBirthDateModal: FC<Props> = ({
  visible,
  setVisible,
  currentDateBirth,
}) => {
  const [dateBirthDate, setDateBirthDate] = useState('');
  const [error, setError] = useState(false);
  const [textError, setTextError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBr, setIsBr] = useState<boolean>(false);

  const {userData, setUserData} = useAuth();

  const getLanguageApp = async () => {
    try {
      const responseLanguage = await AsyncStorage.getItem('@language');
      if (responseLanguage === 'pt_BR') {
        setIsBr(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setDateBirthDate(currentDateBirth);
  }, [currentDateBirth]);

  useEffect(() => {
    getLanguageApp();
  }, []);

  const updateDateBirth = () => {
    if (dateBirthDate === '') {
      setTextError(translate('changeBirthDate.text_empty'));
      return setError(true);
    }

    setError(false);
    setLoading(true);
    apiMain
      .post('Customer/EditProfile', {
        dateOfBirth: isBr
          ? Helper.formatDateApiDefault(dateBirthDate)
          : Helper.removeBarDate(dateBirthDate),
      })
      .then(result => {
        setLoading(false);

        if (!result.data.status) {
          return Alert.alert(
            translate('changeBirthDate.title_status_error'),
            translate('changeBirthDate.text_status_error'),
          );
        }

        userData.dateOfBirth = dateBirthDate;
        setUserData(userData);
        setVisible(false);
        return customToast(
          translate('changeBirthDate.text_status_success'),
          'warning',
        );
      });
    return '';
  };

  useEffect(() => {
    setDateBirthDate(
      isBr
        ? Helper.formatDateBr(dateBirthDate)
        : Helper.formatDateDefault(dateBirthDate),
    );
  }, [isBr]);

  return (
    <>
      <Preload visible={loading} />
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        <Content>
          <ModalContent style={{padding: 20}}>
            {error && <TextError>{textError}</TextError>}
            <SimpleText>
              {translate('changeBirthDate.text_birth_date')}
            </SimpleText>
            <Input
              type="datetime"
              options={{
                format: isBr ? 'DD/MM/YYYY' : 'YYYY/MM/DD',
              }}
              value={dateBirthDate}
              onChangeText={(text: string) => setDateBirthDate(text)}
              placeholder={isBr ? 'DD/MM/YYYY' : 'YYYY/MM/DD'}
            />
            <ContentButton>
              <Button
                onPress={() => {
                  setVisible(false);
                  setError(false);
                }}
              >
                <SimpleText>{translate('buttonModal.cancel')}</SimpleText>
              </Button>
              <Button
                onPress={() => {
                  updateDateBirth();
                }}
              >
                <SimpleText>{translate('buttonModal.confirm')}</SimpleText>
              </Button>
            </ContentButton>
          </ModalContent>
        </Content>
      </Modal>
    </>
  );
};

export default ChangeBirthDateModal;
