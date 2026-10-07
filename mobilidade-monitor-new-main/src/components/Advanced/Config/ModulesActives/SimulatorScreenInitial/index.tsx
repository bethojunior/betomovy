import { ReactNode } from "react";

import {
  Container,
  ContentMoldureDevice,
  ContentScreen,
  ContentMapSimulator,
  TitleSimulator,
} from "./styles";

import pathMoldurePhone from "../../../../../assets/moldure-phone.png";
import pathMapSimulator from "../../../../../assets/map-simulator-2.jpeg";

import { LoginScreenSimulator } from "./Screens/Login";
import { HomeScreenSimulator } from "./Screens/Home";
import { ReasonsCancellationScreenSimulator } from "./Screens/ReasonsCancellation";
import { CalledDriver } from "./Screens/CalledDriver";

import { ModulesActivesProps } from "../../../../../pages/Advanced/Configs/ModulesActives/types";
import { ReasonsCancellationsProps } from "../../../../../pages/Advanced/Configs/ReasonsForCancellations/types";
import { FieldsCalledDriverProps } from "../../ByCity/Cards/Collapse/types";

type Screens =
  | "login"
  | "home_inital"
  | "reasons_cancellation"
  | "called_driver";

interface SimulatorScreenInitialProps {
  colorPrimary: string | undefined;
  colorSecond: string | undefined;
  colorText: string | undefined;
  modulesActive?: ModulesActivesProps[] | undefined;
  reasonsCancellation?: ReasonsCancellationsProps[] | undefined;
  fieldsCalledDriver?: FieldsCalledDriverProps[] | undefined;
  nameScreen: Screens;
  notShowMoldureMobile?: boolean;
}

const listScreensNotMap: string[] = ["login"];

export const SimulatorScreenInitial = ({
  colorPrimary,
  colorSecond,
  colorText,
  modulesActive,
  nameScreen,
  reasonsCancellation,
  notShowMoldureMobile,
  fieldsCalledDriver,
}: SimulatorScreenInitialProps) => {
  const switchScreens = (screen: Screens) => {
    switch (screen) {
      case "login":
        return {
          element: <LoginScreenSimulator />,
          nameScreen: "Login",
        };
      case "home_inital":
        return {
          element: (
            <HomeScreenSimulator
              colorPrimary={colorPrimary}
              colorSecond={colorSecond}
              colorText={colorText}
              modulesActive={modulesActive}
            />
          ) as ReactNode,
          nameScreen: "Tela inicial - (cliente)",
        };
      case "reasons_cancellation":
        return {
          element: (
            <ReasonsCancellationScreenSimulator
              reasonsCancellationsList={reasonsCancellation}
              colorPrimary={colorPrimary}
              colorSecond={colorSecond}
              colorText={colorText}
            />
          ) as ReactNode,
          nameScreen: "Motivos de cancelamento - (cliente)",
        };

      case "called_driver":
        return {
          element: (
            <CalledDriver
              colorPrimary={undefined}
              fieldsCalledDriver={fieldsCalledDriver}
            />
          ) as ReactNode,
          nameScreen: "Chamado Motorista",
        };

      default:
        return {
          element: (
            <HomeScreenSimulator
              colorPrimary={colorPrimary}
              colorSecond={colorSecond}
              colorText={colorText}
              modulesActive={modulesActive}
            />
          ) as ReactNode,
          nameScreen: "Tela inicial - (cliente)",
        };
    }
  };

  const isShowMap = listScreensNotMap.includes(nameScreen);

  return (
    <Container>
      <TitleSimulator>{switchScreens(nameScreen).nameScreen}</TitleSimulator>
      <ContentMoldureDevice notShowMoldure={!!notShowMoldureMobile}>
        <img src={pathMoldurePhone} alt="moldure device" />

        {!isShowMap && (
          <ContentMapSimulator>
            <img src={pathMapSimulator} alt="moldure device" />
          </ContentMapSimulator>
        )}
      </ContentMoldureDevice>
      <ContentScreen notShowMoldure={!!notShowMoldureMobile}>
        {switchScreens(nameScreen).element}
      </ContentScreen>
    </Container>
  );
};
