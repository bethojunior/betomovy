import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { Collapse, Button } from "antd";

import {
  Container,
  ContentCardAnimation,
  ContainerCardsAnimations,
  ContainerAnimations,
  ContentMoldurePhone,
  ContentAnimationsDevice,
  ContainerButton,
  ContentButton,
  ContainerCards,
  ContentLayoutDevice,
} from "./styles";

import pathMoldurePhone from "../../../../assets/moldure-phone.png";
import pathLayoutDelivery from "../../../../assets/screen-animation-delivery.jpeg";
import pathLayoutInDelivery from "../../../../assets/screen-animation-in-delivery.jpeg";
import pathLayoutTaximeter from "../../../../assets/screen-animation-taximeter.jpeg";

import {
  ObjectSendAnimationProps,
  AnimationsProps,
  ResponseAnimationsProps,
  DatasAnimationsProps,
} from "./types";
import api from "../../../../services/api";

import Preload from "../../../Utils/Preload";
import swal from "sweetalert";
import { AxiosError } from "axios";
import * as Animation from "../../../../assets/animations/animation_services.json";
import * as ApresentationAnimation from "../../../../assets/animations/apresentation-animation.json";
import * as AnimationDelivery from "../../../../assets/animations/animation_delivery.json";
import * as AnimationPet from "../../../../assets/animations/animation_pet.json";
import * as AnimationTaximeter from "../../../../assets/animations/taximeter.json";
import * as AnimationCallDelivery from "../../../../assets/animations/animation_call_delivery.json";
import * as AnimationFood from "../../../../assets/animations/animation_food.json";
import * as Delivery from "../../../../assets/animations/delivery-1.json";
import * as Delivery2 from "../../../../assets/animations/delivery-2.json";
import * as Delivery3 from "../../../../assets/animations/delivery-3.json";
import * as Mobility2 from "../../../../assets/animations/mobility-2.json";
import * as Pet from "../../../../assets/animations/pet-1.json";
import * as Pet2 from "../../../../assets/animations/pet-2.json";
import * as AnimationSplashDriver from "../../../../assets/animations/animationSplashDriver.json";

const AnimatedSource = {
  animations: [
    {
      id: "1",
      uri: Animation,
    },
    {
      id: "2",
      uri: ApresentationAnimation,
    },
    {
      id: "3",
      uri: AnimationDelivery,
    },
    {
      id: "4",
      uri: AnimationPet,
    },
    {
      id: "6",
      uri: AnimationTaximeter,
    },
    {
      id: "7",
      uri: AnimationCallDelivery,
    },
    {
      id: "8",
      uri: AnimationFood,
    },
    {
      id: "9",
      uri: Delivery,
    },
    {
      id: "10",
      uri: Delivery2,
    },
    {
      id: "11",
      uri: Delivery3,
    },
    {
      id: "15",
      uri: Mobility2,
    },
    {
      id: "16",
      uri: Pet,
    },
    {
      id: "17",
      uri: Pet2,
    },
    {
      id: "18",
      uri: AnimationSplashDriver,
    },
  ],
};

const screens_mobile = [
  {
    title: "Tela inicial",
    screen: "apresentation_app",
  },
  {
    title: "Tela inicial motorista",
    screen: "apresentation_driver",
  },
  {
    title: "Tela de finalização de corrida (taximetro)",
    screen: "finalization_taximeter",
  },
  {
    title: "Tela de nova entrega (delivery)",
    screen: "new_delivery_modal",
  },
  {
    title: "Tela de entrega atual (delivery)",
    screen: "delivery_active",
  },
];

export const ConfigLayout = () => {
  const [idAnimationsSelected, setIdAnimationsSelected] = useState<
    string | null
  >(null);
  const [animationSelected, setAnimationSelected] =
    useState<AnimationsProps | null>(null);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [animationsSended, setAnimationsSended] = useState<
    ObjectSendAnimationProps[]
  >([]);

  const [listAnimations, setListAnimations] = useState<
    ResponseAnimationsProps[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBtnSend, setLoadingBtnSend] = useState<boolean>(false);

  const getAnimations = async () => {
    try {
      setLoading(true);
      const responseAnimations = await api.get("appAnimation");

      if (responseAnimations.status) {
        setListAnimations(responseAnimations.data.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;

      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAnimations = async () => {
    try {
      setLoadingBtnSend(true);
      const responseUpdateAnimations = await api.put("appAnimation", {
        screens: dataAnimations,
      });

      if (responseUpdateAnimations.status) {
        swal({
          title: "Animações atualizadas com sucesso!",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      const responseError = error as AxiosError;

      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoadingBtnSend(false);
    }
  };

  const saveAnimation = () => {
    const objectSended = {
      screen: screens_mobile[currentStep].screen,
      id: animationSelected?.id,
    };

    setAnimationsSended((oldValue) => [...oldValue, objectSended as any]);
  };

  const deleteAnimation = () => {
    setAnimationsSended(animationsSended.slice(0, -1));
  };

  const handleNextStep = () => {
    if (currentStep < screens_mobile.length) {
      saveAnimation();
    }

    if (currentStep < screens_mobile.length - 1) {
      setCurrentStep(currentStep + 1);
      setIdAnimationsSelected(null);
      setAnimationSelected(null);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      deleteAnimation();
    }
  };

  const handleSelectAnimation = (
    idAnimation: string,
    datasAnimation: AnimationsProps,
    isSelected: DatasAnimationsProps | undefined
  ) => {
    if (!isSelected) {
      setIdAnimationsSelected(idAnimation);
      setAnimationSelected(datasAnimation);
    }
  };

  const switchShowLayout = (nameScreen: string) => {
    switch (nameScreen) {
      case "finalization_taximeter":
        return {
          status: true,
          pathImg: pathLayoutTaximeter,
        };
      case "new_delivery_modal":
        return {
          status: true,
          pathImg: pathLayoutDelivery,
        };
      case "delivery_active":
        return {
          status: true,
          pathImg: pathLayoutInDelivery,
        };
      case "apresentation_app":
        return {
          status: false,
          pathImg: undefined,
        };
      case "apresentation_driver":
        return {
          status: false,
          pathImg: undefined,
        };
      default:
        return {
          status: true,
          pathImg: undefined,
        };
    }
  };

  useEffect(() => {
    getAnimations();
  }, []);

  const dataAnimations = animationsSended.map((value) => {
    if (listAnimations.length > 0) {
      const isAnimationExists = listAnimations?.find(
        (data) => data.id_app === Number(value.id)
      );
      if (isAnimationExists) {
        return {
          id_app: isAnimationExists.id_app,
          type: isAnimationExists.type,
          screen: value.screen,
          module_id: isAnimationExists.module_id,
          active: isAnimationExists.active,
        };
      }
    }
    return null;
  }).filter(Boolean);

  return (
    <Container>
      <Preload visible={loading} />
      <Collapse>
        <Collapse.Panel header="Animações" key={1}>
          <ContainerAnimations>
            <ContainerCards>
              <ContainerCardsAnimations>
                {AnimatedSource.animations.map((value) => {
                  const animatedSelected = dataAnimations.find(
                    (data) => data?.id_app === Number(value.id)
                  ) as DatasAnimationsProps | undefined;

                  return (
                    <ContentCardAnimation
                      selected={idAnimationsSelected === value.id}
                      selectedPrev={animatedSelected ? true : false}
                      key={value.id}
                      onClick={() =>
                        handleSelectAnimation(value.id, value, animatedSelected)
                      }
                    >
                      <Lottie
                        loop
                        animationData={{...value.uri}}
                        style={{
                          width: 200,
                        }}
                      />
                    </ContentCardAnimation>
                  );
                })}
              </ContainerCardsAnimations>

              <ContainerButton>
                {currentStep > 0 && (
                  <ContentButton>
                    <Button
                      style={{
                        width: "100%",
                      }}
                      onClick={handleBackStep}
                    >
                      VOLTAR
                    </Button>
                  </ContentButton>
                )}
                <ContentButton>
                  {dataAnimations.length < 5 ? (
                    <Button
                      style={{
                        width: "100%",
                      }}
                      type="primary"
                      onClick={handleNextStep}
                      disabled={!animationSelected}
                    >
                      PRÓXIMO
                    </Button>
                  ) : (
                    <Button
                      style={{
                        width: "100%",
                      }}
                      type="primary"
                      onClick={handleUpdateAnimations}
                      loading={loadingBtnSend}
                    >
                      ENVIAR
                    </Button>
                  )}
                </ContentButton>
              </ContainerButton>
            </ContainerCards>
            <ContentMoldurePhone>
              <Button type="default">
                {screens_mobile[currentStep].title}
              </Button>
              <img src={pathMoldurePhone} alt="moldure-phone" />

              {switchShowLayout(screens_mobile[currentStep].screen).status &&
                screens_mobile[currentStep].screen ===
                  "finalization_taximeter" && (
                  <ContentLayoutDevice>
                    <img
                      src={
                        switchShowLayout(screens_mobile[currentStep].screen)
                          .pathImg
                      }
                      alt="moldure-layout-device"
                    />

                    {idAnimationsSelected && (
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          top: "22%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Lottie
                          loop
                          animationData={{
                            ...AnimatedSource.animations.find(
                              (item) => item.id === idAnimationsSelected
                            )?.uri
                          }}
                          style={{
                            width: 90,
                            height: 90,
                          }}
                        />
                      </div>
                    )}
                  </ContentLayoutDevice>
                )}

              {switchShowLayout(screens_mobile[currentStep].screen).status &&
                screens_mobile[currentStep].screen === "new_delivery_modal" && (
                  <ContentLayoutDevice>
                    <img
                      src={
                        switchShowLayout(screens_mobile[currentStep].screen)
                          .pathImg
                      }
                      alt="moldure-layout-device"
                    />

                    {idAnimationsSelected && (
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          top: "0%",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Lottie
                          loop
                          animationData={{
                            ...AnimatedSource.animations.find(
                              (item) => item.id === idAnimationsSelected
                            )?.uri
                          }}
                          style={{
                            width: 79,
                            height: 79,
                          }}
                        />
                      </div>
                    )}
                  </ContentLayoutDevice>
                )}

              {switchShowLayout(screens_mobile[currentStep].screen).status &&
                screens_mobile[currentStep].screen === "delivery_active" && (
                  <ContentLayoutDevice>
                    <img
                      src={
                        switchShowLayout(screens_mobile[currentStep].screen)
                          .pathImg
                      }
                      alt="moldure-layout-device"
                    />

                    {idAnimationsSelected && (
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          top: "14.7%",
                          left: "8%",
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Lottie
                          loop
                          animationData={{
                            ...AnimatedSource.animations.find(
                              (item) => item.id === idAnimationsSelected
                            )?.uri
                          }}
                          style={{
                            width: 50,
                            height: 50,
                          }}
                        />
                      </div>
                    )}
                  </ContentLayoutDevice>
                )}

              {idAnimationsSelected &&
                switchShowLayout(screens_mobile[currentStep].screen).status ===
                  false &&
                screens_mobile[currentStep].screen === "apresentation_app" && (
                  <>
                    <ContentAnimationsDevice>
                      <Lottie
                        loop
                        animationData={{
                          ...AnimatedSource.animations.find(
                            (item) => item.id === idAnimationsSelected
                          )?.uri
                        }}
                        style={{
                          width: 150,
                          height: 150,
                        }}
                      />
                    </ContentAnimationsDevice>
                  </>
                )}

              {idAnimationsSelected &&
                switchShowLayout(screens_mobile[currentStep].screen).status ===
                  false &&
                screens_mobile[currentStep].screen ===
                  "apresentation_driver" && (
                  <ContentAnimationsDevice>
                    <Lottie
                      loop
                      animationData={{
                        ...AnimatedSource.animations.find(
                          (item) => item.id === idAnimationsSelected
                        )?.uri
                      }}
                      style={{
                        width: 150,
                        height: 150,
                      }}
                    />
                  </ContentAnimationsDevice>
                )}
            </ContentMoldurePhone>
          </ContainerAnimations>
        </Collapse.Panel>
      </Collapse>
    </Container>
  );
};
