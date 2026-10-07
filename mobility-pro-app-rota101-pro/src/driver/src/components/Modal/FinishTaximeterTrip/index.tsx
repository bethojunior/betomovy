import {
  ConfirmButton,
  Info,
  Modall,
  Container,
  TextButton,
  Title,
  TitleResume,
  GroupDetails,
  AnimationContainer
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
import { AnimatedSource } from "../../../../../client/pages/AppApresentation/constants";
import { useTripProvider } from "../../../context/Trip";
import { getTripPaymentFormDisplay } from "../../../utils/tripUtils";

const FinishTaximeterTrip = ({
  finishTaximeterTrip,
  animatedStyles,
  screenDimensions,
}: any) => {
  const { cityConfig } = useAuth();
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );

  const [taximeterData, setTaximeterData] = useState<TaximeterDetails>()
  const [tripCurrent, setTripCurrent] = useState<any>({})
  const getTaximeterDetails = async () => {
    const data = await AsyncStorage.getItem("taximetersDetails");
    if (data) {
      const details = JSON.parse(data);
      if (details?.tripReference === tripAccepted?.tripReference) {
        setTaximeterData({
          km: Number((details.km).toFixed(2)),
          minutes: Number((details.minutes).toFixed(0)),
          ...details,
        })
      }
    }
  }

  useEffect(() => {
    getTaximeterDetails()
  }, [])

  useEffect(() => {
    if (tripAccepted?.status) {
      setTripCurrent(tripAccepted)
    }
  }, [tripAccepted])

  return (
    <Animated.View style={[animatedStyles, { height: screenDimensions }]}>
      <Modall>
        <AnimationContainer>
          <LottieView
            autoPlay
            style={{ width: 120, height: 150 }}
            resizeMode="contain"
            source={AnimatedSource.TAXIMETER.uri}
          />
        </AnimationContainer>

        <Title>{translate('finishTrip.title_resume')}</Title>

        <Container>
          <GroupDetails>
            <TitleResume>{translate('myTravels.call_type')}</TitleResume>
            <Info>{getTripPaymentFormDisplay(tripCurrent?.tripPaymentForm)}</Info>
          </GroupDetails>
          <GroupDetails>
            <TitleResume>{translate('finishTrip.text_value')}</TitleResume>
            <Info>
              {cityConfig?.typeMoney} {Helper.maskMoney(Number(taximeterData?.price || 0))}
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
