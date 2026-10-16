import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IUseConfirmationAccountAppPartnerProps} from './types';
import {AppsPartnersProps} from '../SelectAppPartners/types';
import {SchemaForm} from './schema';
import {useState} from 'react';
import apiMain from '../../api/apiMain';
import themeClient from '../../styles/theme';
import themeDriver from '../../../driver/src/styles/theme';
import loginTheme from '../../styles/loginTheme';
import {useNavigation} from '@react-navigation/native';
import {useConfigAppPartner} from '../../../context/ConfigAppPartner/useConfigAppPartner';
import {translate} from '../../locales';

type SchemaFormProps = yup.InferType<typeof SchemaForm>;

export const useConfirmationAccountAppPartner = ({
  setVisible,
  showToast,
}: IUseConfirmationAccountAppPartnerProps) => {
  const navigation = useNavigation();
  const {handleCheckAppPartnerSelected} = useConfigAppPartner();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<SchemaFormProps>({
    resolver: yupResolver(SchemaForm),
  });

  const [isLoadingState, setIsLoadingState] = useState<boolean>(false);

  const handleCloseModal = () => {
    setVisible(false);
  };

  const handleConfirmAppPartner = async (
    dataInfo: AppsPartnersProps,
    email?: string,
  ) => {
    const responseAppPartnerChoosedString = await AsyncStorage.getItem(
      '@mobilitypro:theme_app_partner_selected',
    );

    if (responseAppPartnerChoosedString) {
      const responseAppPartnerChoosed = JSON.parse(
        responseAppPartnerChoosedString,
      );
      const originalObject = JSON.stringify(responseAppPartnerChoosed);
      const currentObject = JSON.stringify({
        primary_color: dataInfo.primary_color,
        secondary_color: dataInfo.secondary_color,
        text_color: dataInfo.text_color,
        logo: dataInfo.logo_app,
        key: dataInfo.key,
        name: dataInfo.name_app,
      });

      if (originalObject !== currentObject) {
        await AsyncStorage.multiRemove([
          '@lastServices',
          '@App:lastServices',
          '@App:listServices',
          'orderPrices',
          '@mobilitypro:current_partner_key',
        ]);
      }
    }

    themeClient.images.logo = dataInfo.logo_app;
    themeClient.colors.primary = dataInfo.primary_color;
    themeClient.colors.secondary = dataInfo.text_color;
    themeClient.colors.background_global = dataInfo.secondary_color;

    themeDriver.images.logo = dataInfo.logo_app;
    themeDriver.colors.primary = dataInfo.primary_color;
    themeDriver.colors.secondary = dataInfo.text_color;
    themeDriver.colors.background_global = dataInfo.secondary_color;

    loginTheme.images.logo = dataInfo.logo_app;
    loginTheme.colors.primary = dataInfo.primary_color;
    loginTheme.colors.secondary = dataInfo.text_color;
    loginTheme.colors.background_global = dataInfo.secondary_color;

    const objectThemeAppPartner = {
      id: dataInfo.id,
      primary_color: dataInfo.primary_color,
      secondary_color: dataInfo.secondary_color,
      text_color: dataInfo.text_color,
      logo: dataInfo.logo_app,
      key: dataInfo.key,
      name: dataInfo.name_app,
      phone_support: dataInfo.phone_support ?? null,
    };

    await AsyncStorage.setItem(
      '@mobilitypro:theme_app_partner_selected',
      JSON.stringify(objectThemeAppPartner),
    );

    await AsyncStorage.setItem(
      '@mobilitypro:appPartnerShow',
      JSON.stringify('true'),
    );

    await handleCheckAppPartnerSelected();

    handleCloseModal();

    if (email) {
      navigation.navigate('Login', {appPartnerEmail: email});
    }
  };

  const verifyAccount = async (data: SchemaFormProps) => {
    try {
      setIsLoadingState(true);

      const payload = {
        stdObject: [
          {
            email: data.email,
          },
        ],
      };
      const responseGetAppPartners = await apiMain.post(
        'user/checkaccountapppartner',
        payload,
      );

      if (responseGetAppPartners.status) {
        if (responseGetAppPartners.data.data) {
          await handleConfirmAppPartner(
            responseGetAppPartners.data.data,
            data.email,
          );
          return;
        }

        showToast(
          translate('confirmationAccountAppPartner.text_account_not_found'),
          'warning',
        );
      }
    } catch (error) {
      console.error(error);
      showToast(
        translate('confirmationAccountAppPartner.text_error_loading_account'),
        'danger',
      );
    } finally {
      setIsLoadingState(false);
    }
  };

  const onSubmit = handleSubmit(verifyAccount);

  return {
    handleCloseModal,
    control,
    errors,
    onSubmit,
    isLoadingState,
  };
};
