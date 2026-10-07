// @ts-nocheck

import { useCallback, useEffect, useState } from 'react';
// @ts-ignore
import { Alert } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ButtonBackPage } from '../../components/form/SignIn';
import apiMain from '../../api/apiMain';

import { translate } from '../../locales';
import {
  Container,
  ContainerPhoto,
  Content,
  ContentButton,
  InputPhoto,
} from './styles';
import { InputContainer } from '../../components/InputContainer';
import { Input } from '../../components/Input';
import { schema } from './schema';
import { InputMask } from '../../components/InputMask';
import { Button } from '../../components/Button';
import { InputPassword } from '../../components/InputPassword';
import { useAuth } from '../../../context/auth';
import { FaceDetectorScreen } from '../../components/FaceDetector';
import { If } from '../../components/If';
import { useNavigation } from '@react-navigation/native';
import { Label } from '../../components/InputContainer/styles';
import { PickerIOS } from '@react-native-picker/picker';
import Dropdown from '../../components/DropDown';

export interface FormData {
  name: string;
  document: string;
  date: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

interface RequireField {
  compelField: true;
  description: string;
  field: string;
  id: number;
  required: boolean;
  userTypeId: number;
}

interface CityProps {
  estado: string;
  shortName: any | null;
  id: number;
  statusId: string;
  nome: string;
}

export default function DataUserSignUp({ route }) {
  const { numberPhone } = route.params;
  const navigation = useNavigation();
  const { deviceToken, getRequireField, generalSettings } = useAuth();
  const [loading, setLoading] = useState(false);
  const [requireFields, setRequireFields] = useState<RequireField[]>([]);
  const [photo, setPhoto] = useState(null);
  const [required, setRequired] = useState({
    profileImage: false,
  });
  const [cities, setCities] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [citySelect, setCitySelect] = useState({});

  const mapCityForIDAndName = (banks: any) => {
    const citiesMap = cities.map((city: CityProps) => {
      return {
        id: city?.id,
        name: city?.nome,
      };
    });
    return citiesMap;
  };

  const getCities = useCallback(async () => {
    try {
      const { data } = await apiMain.get('city/getactives');

      if (!data.status) {
        return;
      }
      setCities(data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getCities();
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const verifyData = (form, date) => {
    const itemPhoto = requireFields.find(item => item.field === 'profileImage');

    if (itemPhoto) {
      const filename = photo.uri?.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      const formData = new FormData();
      formData.append('photo', {
        uri: photo.uri,
        filename: 'profile',
        type,
      });
      formData.append(
        'stdObject',
        JSON.stringify({
          name: form.name,
          document: form.document,
          email: form.email,
          phone: form.phone,
          dateOfBirth: date,
          nickname: form.name?.split(' ')[0],
          registered_in: 'mobilidade',
          password: form.password,
        }),
      );
      return formData;
    } else {
      const object = {
        name: form.name,
        email: form.email,
        document: form.document,
        dateOfBirth: date,
        nickname: form.name?.split(' ')[0],
        registered_in: 'mobilidade',
        phone: numberPhone ?? form.phone,
        password: form.password,
      };

      return object;
    }
  };

  // eslint-disable-next-line consistent-return
  async function handleNextStep(form: FormData) {
    // setLoading(true);

    const formattedBirthDate = form.date.replace(/\D/g, '');
    const date =
      formattedBirthDate.substring(4, 8) +
      formattedBirthDate.substring(2, 4) +
      formattedBirthDate.substring(0, 2);

    const itemPhoto = requireFields.find(item => item.field === 'profileImage');
    const itemSms = requireFields.find(item => item.field === 'validateSMS');
    if (
      requireFields.length > 0 &&
      itemPhoto.compelField &&
      itemPhoto.required
    ) {
      if (!photo) {
        setLoading(false);
        Alert.alert('Atenção', 'É necessário tirar uma foto para prosseguir', [
          {
            text: 'OK',
            onPress: () => setRequired({ profileImage: true }),
          },

          {
            text: 'Cancelar',
            onPress: () => console.log('Cancel Pressed'),
          },
        ]);
        // return jsx faceDetector
        return;
      }
    }
    let endpoint;
    const object = await verifyData(form, date);

    if (itemPhoto && itemPhoto.required) {
      endpoint = apiMain.post('Customer/RegisterWithPictures', object, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      endpoint = apiMain.post('Customer/Register', {
        stdObject: [object],
      });
    }

    // if (numberPhone) object.phone = form.phone;

    // if (!numberPhone) {
    //   object.password = form.password;
    //   object.phone = form.phone;
    // }

    const { data } = await endpoint;
    setLoading(false);

    if (!data.status) {
      console.log(data);

      return Alert.alert(
        translate('dataUserSignUp.title_alert_attention'),
        data.message,
      );
    }
    if (!numberPhone) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { data } = await apiMain.post('Customer/login', {
        email: form.email,
        password: form.password,
        deviceToken,
      });
      navigation.navigate('CongratulationSignUp', { user: data.data });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { data } = await apiMain.post('Customer/LoginByPhone', {
        phone: numberPhone,
        deviceToken,
      });

      navigation.navigate('CongratulationSignUp', { user: data.data });
    }
  }

  useEffect(() => {
    if (numberPhone) {
      setValue('phone', numberPhone);
    }
  }, [numberPhone, setValue]);

  const listCampsFields = async () => {
    const response = await getRequireField();
    if (!response.status) {
      return;
    }
    setRequireFields(response.data);
  };

  useEffect(() => {
    listCampsFields();
  }, []);

  return (
    <Container>
      <FaceDetectorScreen
        setImage={setPhoto}
        visible={required.profileImage && !loading}
        onClose={() => setRequired({ profileImage: false })}
        sendPhoto={() => setRequired({ profileImage: false })}
      />
      <Spinner visible={loading} />
      <Content>
        <ButtonBackPage onPress={() => navigation.goBack()} text={' '} />
        <ContainerPhoto>
          <InputPhoto
            onPress={() => (!photo ? setRequired({ profileImage: true }) : null)}
            source={
              photo ? { uri: photo.uri } : require('../../assets/images/user.png')
            }
          />
          <Label
            onPress={() =>
              !photo ? setRequired({ profileImage: true }) : setPhoto(null)
            }
          >
            {!photo ? 'Adicionar Foto' : 'Remover Foto'}
          </Label>
        </ContainerPhoto>
        <InputContainer label={translate('dataUserSignUp.text_full_name')}>
          <Input
            name="name"
            control={control}
            error={errors.name && errors.name.message}
            placeholder={translate(
              'dataUserSignUp.text_placeholder_enter_your_full_name',
            )}
          />
        </InputContainer>
        <InputContainer
          label={
            generalSettings.find(item => item?.key === 'tittle_document_name')
              ?.value || translate('dataUserSignUp.text_document')
          }
        >
          <Input
            name="document"
            control={control}
            placeholder={translate('dataUserSignUp.text_placeholder_document')}
            error={errors.document && errors.document.message}
          />
        </InputContainer>

        <InputContainer
          label={translate('dataUserSignUp.text_date_of_birthday')}
        >
          <InputMask
            name="date"
            control={control}
            placeholder={translate(
              'dataUserSignUp.text_placeholder_date_of_birthday',
            )}
            options={{
              format: 'DD/MM/YYYY',
            }}
            type="datetime"
            keyboardType="numeric"
            error={errors.date && errors.date.message}
          />
        </InputContainer>

        <InputContainer label={translate('dataUserSignUp.text_email')}>
          <Input
            name="email"
            control={control}
            error={errors.email && errors.email.message}
            placeholder={translate(
              'dataUserSignUp.text_placeholder_type_your_email',
            )}
            keyboardType="email-address"
          />
        </InputContainer>
        <InputContainer label={'Cidades'}>
          <Dropdown
            options={cities}
            onChange={option => setCitySelect(option)}
            getLabel={option => option.nome}
            label="Selecione uma cidade"
            selected={citySelect}
          />
        </InputContainer>

        {!numberPhone && (
          <>
            <InputContainer label={translate('dataUserSignUp.text_phone')}>
              <Input
                name="phone"
                control={control}
                error={errors.phone && errors.phone.message}
                placeholder={translate(
                  'dataUserSignUp.text_placeholder_enter_your_phone_number',
                )}
                keyboardType="phone-pad"
              />
            </InputContainer>

            <InputContainer label={translate('login.label_password')}>
              <InputPassword
                name="password"
                control={control}
                placeholder={translate('login.text_placeholder_password')}
                error={errors.password && errors.password.message}
              />
            </InputContainer>

            <InputContainer
              label={translate('dataUserSignUp.text_confirmation_password')}
            >
              <InputPassword
                name="password_confirmation"
                control={control}
                placeholder={translate(
                  'dataUserSignUp.text_placeholder_confirm_your_password',
                )}
                error={
                  errors.password_confirmation &&
                  errors.password_confirmation.message
                }
              />
            </InputContainer>
          </>
        )}

        <ContentButton>
          <Button
            title={translate('dataUserSignUp.text_next')}
            onPress={handleSubmit(handleNextStep)}
          />
        </ContentButton>
      </Content>
    </Container>
  );
}
