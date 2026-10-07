import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { ReactNode, useEffect, useState } from "react";

import { Container, Buttons, ContentMoldure } from "./styles";
import pathMoldurePhone from "../../../../../assets/moldure-phone.png";

import { ConfigApp } from "./Driver/ConfigApp";
import { CallAnswered } from "./Driver/CallAnswered";
import { RacerTrip } from "./Driver/RacerTrip";

import { ChatClient } from "./Customer/ChatClient";
import { SelectTrip } from "./Customer/SelectTrip";
import { TravelInProgress } from "./Customer/TravelInProgress";

import { ScreenColorsSimulatorsProps } from "../../../../../pages/Advanced/Configs/ConfigApp/types";

import { ConfigAppsProps } from "../../../../../pages/Advanced/Configs/ConfigApp/types";

interface SimulatorConfigAppProps extends ScreenColorsSimulatorsProps {
  type: "driver" | "client";
  configSelected: ConfigAppsProps | null;
  idTypeConfig: number | null;
}

export const SimulatorConfigApp = ({
  type,
  colorPrimary,
  colorSecondary,
  colorTextPrimary,
  configSelected,
  idTypeConfig,
}: SimulatorConfigAppProps) => {
  const [indexScreen, setIndexScreen] = useState<number>(0);
  const [screenRendered, setScreenRendered] = useState<ReactNode | null>(null);

  const handleDecreases = () => {
    if (indexScreen > 0) {
      setIndexScreen(indexScreen - 1);
    }
  };

  const handleIncreases = () => {
    if (indexScreen < 2) {
      setIndexScreen(indexScreen + 1);
    }
  };

  useEffect(() => {
    const switchScreenDriver = () => {
      switch (indexScreen) {
        case 0:
          return setScreenRendered(
            <RacerTrip
              colorPrimary={colorPrimary}
              colorSecondary={colorSecondary}
              colorTextPrimary={colorTextPrimary}
            />
          );
        case 1:
          return setScreenRendered(
            <CallAnswered
              colorPrimary={colorPrimary}
              colorSecondary={colorSecondary}
              colorTextPrimary={colorTextPrimary}
            />
          );
        case 2:
          return setScreenRendered(
            <ConfigApp
              colorPrimary={colorPrimary}
              colorSecondary={colorSecondary}
              colorTextPrimary={colorTextPrimary}
            />
          );
      }
    };

    const switchScreenCustomer = () => {
      switch (indexScreen) {
        case 0:
          return setScreenRendered(
            <SelectTrip
              colorPrimary={colorPrimary}
              colorSecondary={colorSecondary}
              colorTextPrimary={colorTextPrimary}
            />
          );
        case 1:
          return setScreenRendered(
            <TravelInProgress
              colorPrimary={colorPrimary}
              colorSecondary={colorSecondary}
              colorTextPrimary={colorTextPrimary}
            />
          );
        case 2:
          return setScreenRendered(
            <ChatClient
              colorPrimary={colorPrimary}
              colorSecondary={colorSecondary}
              colorTextPrimary={colorTextPrimary}
            />
          );
      }
    };

    if (configSelected) {
      type === "client" ? switchScreenCustomer() : switchScreenDriver();
    } else {
      idTypeConfig === 2 ? switchScreenDriver() : switchScreenCustomer();
    }
  }, [
    indexScreen,
    configSelected,
    colorPrimary,
    colorSecondary,
    colorTextPrimary,
    idTypeConfig,
  ]);

  return (
    <Container>
      <Buttons onClick={handleDecreases}>
        <IoMdArrowDropleft />
      </Buttons>
      <ContentMoldure>
        <img src={pathMoldurePhone} alt="simulator-app" />
        {screenRendered}
      </ContentMoldure>
      <Buttons onClick={handleIncreases}>
        <IoMdArrowDropright />
      </Buttons>
    </Container>
  );
};
