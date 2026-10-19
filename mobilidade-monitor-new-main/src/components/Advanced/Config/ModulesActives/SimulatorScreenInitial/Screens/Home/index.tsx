import {
  Container,
  Header,
  NameUser,
  ContentImgUser,
  ImgUser,
  Body,
  ButtonLocalization,
  ModalSearchTrip,
  HeaderModalSearchTrip,
  IconNotifications,
  ContentInputSearch,
  InputSearch,
  ButtonMicPhone,
  ContainerModules,
} from "./styles";

import { IoMdLocate, IoIosNotifications } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";

import { CardModule } from "../../Components/CardModule";

import { constants } from "../../../../../../../pages/Advanced/Configs/ModulesActives/constants";
import { ModulesActivesProps } from "../../../../../../../pages/Advanced/Configs/ModulesActives/types";
import logoMovy from "../../../../../../../assets/logo-movy-transparent.png";

import { useColorInverse } from "../../../../../../../utils/Hook/useColorInverse";

interface HomeScreenSimulatorProps {
  colorPrimary: string | undefined;
  colorSecond: string | undefined;
  colorText: string | undefined;
  modulesActive: ModulesActivesProps[] | undefined;
}

export const HomeScreenSimulator = ({
  colorPrimary,
  modulesActive,
}: HomeScreenSimulatorProps) => {
  const colorInverse = useColorInverse(colorPrimary);

  return (
    <Container>
      <Header>
        <NameUser>
          <span>Olá,</span>
          <span>Jhon</span>
        </NameUser>
        <ContentImgUser>
          <ImgUser
            src={logoMovy}
            alt="logo movy"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = logoMovy;
            }}
          />
        </ContentImgUser>
      </Header>
      <Body>
        <ButtonLocalization
          backgroundColor={
            colorPrimary ? colorPrimary : constants.colors.primary
          }
          colorIcon={
            colorPrimary ? (colorInverse as string) : constants.colors.text
          }
        >
          <IoMdLocate />
        </ButtonLocalization>
      </Body>
      <ModalSearchTrip>
        <HeaderModalSearchTrip>
          <h4
            style={{
              color: constants.colors.secondary,
            }}
          >
            Vamos encontrar uma corrida?
          </h4>
          <IconNotifications>
            <IoIosNotifications />
          </IconNotifications>
        </HeaderModalSearchTrip>
        <ContentInputSearch>
          <InputSearch
            placeholder="Para onde vamos?"
            colorBorder={colorPrimary ? colorPrimary : constants.colors.primary}
          />
          <ButtonMicPhone
            colorIcon={colorPrimary ? colorPrimary : constants.colors.primary}
          >
            <FaMicrophone />
          </ButtonMicPhone>
        </ContentInputSearch>
        <ContainerModules>
          {modulesActive &&
            modulesActive
              .filter((data) => data.isActive === 1)
              .map((value) => {
                const name = value.name || (value as any).moduleName || `Módulo #${value.id}`;
                return (
                  <CardModule
                    key={value.id}
                    nameModule={name}
                    primaryColor={
                      colorPrimary ? colorPrimary : constants.colors.primary
                    }
                    textColor={
                      colorPrimary
                        ? (colorInverse as string)
                        : constants.colors.text
                    }
                    iconModule={value.logo}
                  />
                );
              })}
        </ContainerModules>
      </ModalSearchTrip>
    </Container>
  );
};
