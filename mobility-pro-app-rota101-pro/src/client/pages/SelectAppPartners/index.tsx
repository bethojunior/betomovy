import { FlatList } from "react-native";
import { useEffect, useState } from "react";
import {
  Container,
  TextSelectAppPartner,
  CardAppPartner,
  TitleAppPartner,
  IconAppPartner,
  ContentBtn,
  ButtonAcceptAppPartners,
  BtnText,
  ContainerAppPartner,
  ContentButtonConfirmAccount,
  ButtonConfirmAccount
} from "./styles";
import { ActivityIndicator } from "react-native";
import themeClient from '../../styles/theme';
import themeDriver from '../../../driver/src/styles/theme';
import loginTheme from "../../styles/loginTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useConfigAppPartner } from "../../../context/ConfigAppPartner/useConfigAppPartner";
import ConfirmationAccountAppPartner from "../ConfirmationAccountAppPartner";
import { AppsPartnersProps } from "./types";
import { translate } from "../../locales";
import { buildApp } from "../../../constantBuild/config";
import apiMain from "../../api/apiMain";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp, ParamListBase } from '@react-navigation/native';

export const SelectAppPartners = () => {
  const [appPartnersSelected, setAppPartnersSelected] = useState<AppsPartnersProps | null>(null);
  const [visibleConfirmAccount, setVisibleConfirmAccount] = useState<boolean>(false);
  const [loadingListAppPartner, setLoadingListAppPartner] = useState<boolean>(false);

  const [appsPartners, setAppsPartners] = useState<AppsPartnersProps[]>([]);

  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const { TOKEN_HEADER } = buildApp();

  const { handleCheckAppPartnerSelected, appPartnerSelected } = useConfigAppPartner();

  const handeVerifyAndResetTravelOptions = async (data) => {
    const responseAppPartnerChoosedString = await AsyncStorage.getItem("@mobilitypro:theme_app_partner_selected");

    if (responseAppPartnerChoosedString) {
      const responseAppPartnerChoosed = JSON.parse(responseAppPartnerChoosedString);

      const originalObject = JSON.stringify(responseAppPartnerChoosed);
      const currentObject = JSON.stringify(data);

      if (originalObject === currentObject) {
        return;
      }

      await AsyncStorage.multiRemove([
        '@lastServices',
        '@App:lastServices',
        '@App:listServices',
        'orderPrices'
      ]);
    }
  };

  const getAppsPartners = async () => {
    try {
      setLoadingListAppPartner(true);
      const responseAppsPartners = await apiMain.get('config/getapppartner', {
        headers: {
          token: TOKEN_HEADER,
        },
      });

      if (responseAppsPartners.status) {
        setAppsPartners(responseAppsPartners.data.data.response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingListAppPartner(false);
    }
  };

  const handleConfirmAppPartner = async () => {
    themeClient.images.logo = appPartnersSelected.logo_app;
    themeClient.colors.primary = appPartnersSelected.primary_color;
    themeClient.colors.secondary = appPartnersSelected.text_color;
    themeClient.colors.background_global = appPartnersSelected.secondary_color;

    themeDriver.images.logo = appPartnersSelected.logo_app;
    themeDriver.colors.primary = appPartnersSelected.primary_color;
    themeDriver.colors.secondary = appPartnersSelected.text_color;
    themeDriver.colors.background_global = appPartnersSelected.secondary_color;

    loginTheme.images.logo = appPartnersSelected.logo_app;
    loginTheme.colors.primary = appPartnersSelected.primary_color;
    loginTheme.colors.secondary = appPartnersSelected.text_color;
    loginTheme.colors.background_global = appPartnersSelected.secondary_color;

    const objectThemeAppPartner = {
      id: appPartnersSelected.id,
      primary_color: appPartnersSelected.primary_color,
      secondary_color: appPartnersSelected.secondary_color,
      text_color: appPartnersSelected.text_color,
      logo: appPartnersSelected.logo_app,
      key: appPartnersSelected.key,
      name: appPartnersSelected.name_app,
      phone_support: appPartnersSelected?.phone_support
    }

    await handeVerifyAndResetTravelOptions(objectThemeAppPartner);

    await AsyncStorage.setItem("@mobilitypro:theme_app_partner_selected", JSON.stringify(objectThemeAppPartner));
    handleCloseModalAppPartners();
  }

  const handleSelectApp = (appPartner: AppsPartnersProps) => {
    setAppPartnersSelected(appPartner);
  }

  const handleCloseModalAppPartners = async () => {
    await AsyncStorage.setItem("@mobilitypro:appPartnerShow", JSON.stringify("true"));
    handleCheckAppPartnerSelected();
    navigation.navigate('SignIn', { replace: true });
  }

  useEffect(() => {
    getAppsPartners();
  }, []);

  useEffect(() => {
    if (appsPartners && appsPartners?.length > 0 && appPartnerSelected) {
      const appPartnerFinded = appsPartners.find((data) => data.id === Number(appPartnerSelected?.id));
      setAppPartnersSelected(appPartnerFinded);
    }
  }, [appsPartners, appPartnerSelected]);

  return (
    <>
      {visibleConfirmAccount ? (
        <ConfirmationAccountAppPartner
          visible={visibleConfirmAccount}
          setVisible={setVisibleConfirmAccount}
        />
      ) : null}
      <Container>
        <TextSelectAppPartner>
          {translate("modal_confirm_account_app_partner.title_app_partners")}
        </TextSelectAppPartner>

        {loadingListAppPartner ? (
          <ActivityIndicator size={30} color={themeClient.colors.primary} />
        ) : (
          <>
            <ContainerAppPartner>
              <FlatList
                style={{
                  paddingBottom: 20
                }}
                data={appsPartners}
                renderItem={({ item }) => (
                  <>
                    <CardAppPartner
                      isSelected={appPartnersSelected?.id === item?.id}
                      onPress={() => handleSelectApp(item)} key={String(item.id)}
                    >
                      <IconAppPartner source={{ uri: item.logo_app }} />
                      <TitleAppPartner>{item.name_app}</TitleAppPartner>
                    </CardAppPartner>
                  </>
                )}
                numColumns={3}
              />
            </ContainerAppPartner>

            <ContentButtonConfirmAccount>
              <ButtonConfirmAccount onPress={() => setVisibleConfirmAccount(true)}>
                <BtnText>
                  {translate("modal_confirm_account_app_partner.text_have_account")}
                </BtnText>
              </ButtonConfirmAccount>
            </ContentButtonConfirmAccount>

            <ContentBtn>
              <ButtonAcceptAppPartners
                onPress={handleConfirmAppPartner}
                isDisabled={appPartnersSelected === null}
                disabled={appPartnersSelected === null}
                style={{ flex: 1 }}
              >
                <BtnText>
                  {translate("modal_confirm_account_app_partner.text_button_confirm")}
                </BtnText>
              </ButtonAcceptAppPartners>
            </ContentBtn>
          </>
        )}
      </Container>
    </>
  )
}
