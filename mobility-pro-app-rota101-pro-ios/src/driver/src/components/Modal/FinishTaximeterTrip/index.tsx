import {
  ConfirmButton,
  Info,
  Modall,
  Container,
  TextButton,
  Title,
  TitleResume,
  GroupDetails
} from "./styles";
import { translate } from "../../../../../client/locales";
import Helper from "../../../../../client/utils/Helper";
import { useAuth } from "../../../../../context/auth";
import Animated from "react-native-reanimated";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { If } from "../../../../../client/components/If";
import { TaximeterDetails } from "./types";
import LottieView from 'lottie-react-native';
import { View } from "react-native";
import { AnimatedSource } from "../../../../../client/pages/AppApresentation/constants";

const FinishTaximeterTrip = ({
  tripAccepted,
  finishTaximeterTrip,
  animatedStyles,
  screenDimensions,
}: any) => {
  const { cityConfig } = useAuth();
  const [taximeterData, setTaximeterData] = useState<TaximeterDetails>()

  const getTaximeterDetails = async () => {
    const data = await AsyncStorage.getItem("taximetersDetails");
    if (data) {
      const details = JSON.parse(data);
      if (details?.tripReference === tripAccepted?.tripReference) {
        setTaximeterData({
          km: Number((details.km).toFixed(2)),
          minutes: Number((details.minutes).toFixed(0))
        })
      }
    }
  }

  useEffect(() => {
    getTaximeterDetails()
  }, [])

  return (
    <Animated.View style={[animatedStyles, { height: screenDimensions }]}>
      <Modall>
        <View style={{
          height: 150,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <LottieView
            autoPlay
            style={{
              width: '100%',
            }}
            source={AnimatedSource.TAXIMETER.uri}
          />
        </View>
        <Title>{translate('finishTrip.title_resume')}</Title>

        <Container>
          <GroupDetails>
            <TitleResume>{translate('myTravels.call_type')}</TitleResume>
            <Info>{tripAccepted?.tripPaymentForm}</Info>
          </GroupDetails>
          <GroupDetails>
            <TitleResume>{translate('finishTrip.text_value')}</TitleResume>
            <Info>
              {cityConfig?.typeMoney} {Helper.maskMoney(Number(tripAccepted?.price || 0))}
            </Info>
          </GroupDetails>
        </Container>
        <If condition={taximeterData}>
          <Container>
            <GroupDetails>
              <TitleResume>Km</TitleResume>
              <Info>{taximeterData?.km}</Info>
            </GroupDetails>
            <GroupDetails>
              <TitleResume>{(translate('pageRoutes.text_min'))}</TitleResume>
              <Info>
                {taximeterData?.minutes}
              </Info>
            </GroupDetails>
          </Container>
        </If>
        <ConfirmButton activeOpacity={0.8} onPress={finishTaximeterTrip}>
          <TextButton>{translate("welcomeSpeedmob.text_button_finalize")}</TextButton>
        </ConfirmButton>
      </Modall>
    </Animated.View >
  )
}

export default FinishTaximeterTrip;