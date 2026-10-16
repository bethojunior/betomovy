import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, ActivityIndicator } from "react-native"
import { useDriverHours } from "../../hooks/useDriverHours";
import {
  AssessmentSection,
  CardInfo,
  ClientDetails,
  ClientRow,
  ConfirmButton,
  Container,
  FixedFooter,
  GroupCard,
  ItemSeparator,
  ItemWrapper,
  NameClient,
  TextButton,
  Title,
  TitleResume
} from "./styles";
import { translate } from "~/client/locales";
import StarRatings from "../../components/StarRatings";
import { CustomerAvatar } from "../../components/CustomerAvatar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IfoodService } from "../../context/Ifood/service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetwork } from "~/context/ConfigGlobal";
import { useUserDriver } from "../../context/userDriver";
import { useTripProvider } from "../../context/Trip";
import { offlineTripQueue } from "~/hooks/useOfflineTripActions";
import { buildAvaliationPayload } from "~/utils/avaliationPayload";
import { useTripStatusProvider } from "../../context/TripStatus";
import { DecisionDriverAction } from "~/client/components/DecisionDriverAction";
import { DeliveryCodeModal } from "../../components/Modal/FinishTrip/CodeIfood";

export const FinishTripAvaliation = () => {
  const allowLeaveRef = useRef(false);
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<any>>();
  const { tripAccepted } = route.params as any;

  const ifoodService = IfoodService();
  const [showCodeModal, setShowCodeModal] = useState(false);
  const { itsNetwork } = useNetwork();
  const { userDriverFind } = useUserDriver();
  const { checkDriverStatusAndHours } = useDriverHours();
  const { sendAvaliations, stateTrip } = useTripProvider((c) => c);

  const setButtonTargetVisibility: any = useTripStatusProvider(
    (context: any) => context.setButtonTargetVisibility,
  );

  const [mapAvaliations, setMapAvaliations] = useState({
    selectedOrigin: 1,
    selectedDestination: 1,
    securityOrigin: 1,
    securityDestination: 1,
  });
  const [loadingAvaliation, setLoadingAvaliation] = useState(false);

  const positionAvaliations = [
    {
      title: translate('finishTrip.map'),
      type: 'Map',
      id: 1,
      text: translate('finishTrip.blockAddressOrigin'),
    },
    {
      type: 'Map',
      id: 2,
      text: translate('finishTrip.blockAddressDestination'),
    },
    {
      title: translate('finishTrip.security'),
      type: 'Security',
      id: 1,
      text: translate('finishTrip.riskAreaOrigin'),
    },
    {
      type: 'Security',
      id: 2,
      text: translate('finishTrip.riskAreaDestination'),
    },
  ];

  const handleReprove = (e: string, type: string, id: number) => {
    // eslint-disable-next-line default-case
    switch (type) {
      case 'Map':
        if (id === 1) {
          return setMapAvaliations({
            ...mapAvaliations,
            selectedOrigin: conditionToReprove(e),
          });
        }
        setMapAvaliations({
          ...mapAvaliations,
          selectedDestination: conditionToReprove(e),
        });
        break;
      case 'Security':
        if (id === 1) {
          return setMapAvaliations({
            ...mapAvaliations,
            securityOrigin: conditionToReprove(e),
          });
        }
        setMapAvaliations({
          ...mapAvaliations,
          securityDestination: conditionToReprove(e),
        });
    }
  };

  const conditionToReprove = (e: string) => {
    if (e === 'reproved') {
      return 2;
    }
    return 1;
  };

  const goToHome = () => {
    allowLeaveRef.current = true;

    navigation.navigate("Home");
  }

  const continueFinalizeProcess = async () => {
    try {
      const payload = buildAvaliationPayload(
        mapAvaliations,
        tripAccepted,
        userDriverFind.userId,
        stateTrip.rating,
      );

      if (!itsNetwork) {
        offlineTripQueue.addSendAvaliation(payload);
        return goToHome();
      }

      const status = await sendAvaliations(payload);
      if (!status) return;

      setButtonTargetVisibility(true);
      return goToHome();
    } catch (err) {
      console.error('[Avaliação] Erro ao enviar avaliação:', err);
      goToHome();
    } finally {
      setLoadingAvaliation(false);
    }
  };

  const sendAvaliable = useCallback(async () => {
    if (tripAccepted?.tripReference) {
      try {
        const resp = await ifoodService.verify(tripAccepted.tripReference);
        if (resp) {
          await AsyncStorage.setItem('deliveryModalVisible', 'true');
          await AsyncStorage.setItem('tripReference', tripAccepted.tripReference);

          setShowCodeModal(true);
          return;
        }
      } catch (error) {
        console.error("Error verifying trip reference:", error);
      }
    }
    continueFinalizeProcess();
  }, [tripAccepted, ifoodService, continueFinalizeProcess]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (allowLeaveRef.current) {
        return;
      }

      e.preventDefault();

      setButtonTargetVisibility(true);
      checkDriverStatusAndHours();
      goToHome();
    });

    return () => unsubscribe();
  }, [navigation]);

  return (
    <>
      <ScrollView style={{ backgroundColor: '#f6f7f9' }}>
        <Container>
          {/* Card do Cliente */}
          <Title>{translate('finishTrip.text_rate')}</Title>
          <CardInfo>
            <ClientRow>
              <CustomerAvatar
                trip={tripAccepted}
                style={{ borderWidth: 3, borderColor: '#f1f5f9' }}
              />

              <ClientDetails>
                <NameClient numberOfLines={1}>
                  {tripAccepted?.customer?.name || ""}
                </NameClient>
                <StarRatings />
              </ClientDetails>
            </ClientRow>
          </CardInfo>

          {/* Seção de Avaliação */}
          <AssessmentSection>
            <Title>{translate('finishTrip.text_map')}</Title>

            <GroupCard>
              {positionAvaliations.map((item, index) => (
                <React.Fragment key={index}>
                  <ItemWrapper>
                    {item.title && (
                      <TitleResume>{item.title.toUpperCase()}</TitleResume>
                    )}
                    <DecisionDriverAction
                      onPressAction={e => handleReprove(e, item.type, item.id)}
                      text={item.text}
                    />
                  </ItemWrapper>
                  {index < positionAvaliations.length - 1 && <ItemSeparator />}
                </React.Fragment>
              ))}
            </GroupCard>
          </AssessmentSection>
        </Container>
      </ScrollView>
      <FixedFooter>
        <ConfirmButton
          activeOpacity={0.8}
          onPress={async () => {
            sendAvaliable();
            setLoadingAvaliation(true);
            setTimeout(async () => {
              await checkDriverStatusAndHours();
            }, 2000);
          }}
          disabled={loadingAvaliation}
        >
          {loadingAvaliation ? (
            <ActivityIndicator size={20} color="#FFF" />
          ) : (
            <TextButton>{translate('finishTrip.title_avaliations')}</TextButton>
          )}
        </ConfirmButton>
      </FixedFooter>
      <DeliveryCodeModal
        visible={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        onCodeValidated={continueFinalizeProcess}
        tripReference={tripAccepted?.tripReference}
      />
    </>
  )
}
