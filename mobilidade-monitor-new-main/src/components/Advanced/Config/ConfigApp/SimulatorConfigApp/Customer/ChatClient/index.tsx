import {
  Container,
  CardChat,
  ContentInputChat,
  HeaderChat,
  InputChat,
  ObsMessage,
  ContentIconBack,
  TitleHeader,
  ButtonIconDefault,
  ContentButtonIconDefault,
  BodyChat,
  ContentMessage,
  HeaderCardChat,
  TextTime,
} from "./styles";

import { Switch } from "antd";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsFillTelephoneFill, BsFillVolumeUpFill } from "react-icons/bs";
import { BiMicrophone } from "react-icons/bi";

import { ScreenColorsSimulatorsProps } from "../../../../../../../pages/Advanced/Configs/ConfigApp/types";

import { useColorInverse } from "../../../../../../../utils/Helpers";

export const ChatClient = ({
  colorPrimary,
  colorSecondary,
  colorTextPrimary,
}: ScreenColorsSimulatorsProps) => {
  return (
    <Container backgroundElement={colorSecondary} colorSwitch={colorPrimary}>
      <HeaderChat backgroundElement={colorSecondary}>
        <div>
          <ContentIconBack colorElement={colorPrimary}>
            <AiOutlineArrowLeft />
          </ContentIconBack>
          <TitleHeader colorElement={colorPrimary}>Motorista</TitleHeader>
        </div>
        <ContentButtonIconDefault>
          <ButtonIconDefault
            backgroundElement={colorPrimary}
            colorElement={colorPrimary && useColorInverse(colorPrimary)}
            widthElement="40"
            heightElement="40"
            fontsizeElement="16"
          >
            <BsFillTelephoneFill />
          </ButtonIconDefault>
        </ContentButtonIconDefault>
      </HeaderChat>
      <BodyChat>
        <ObsMessage colorElement={colorTextPrimary}>
          Ler automaticamente todas as mensagens <Switch size="small" />
        </ObsMessage>

        <CardChat
          backgroundElement={
            colorTextPrimary && useColorInverse(colorTextPrimary)
          }
        >
          <HeaderCardChat>
            <TextTime>11:22:23</TextTime>
            <ContentButtonIconDefault>
              <ButtonIconDefault
                backgroundElement={colorPrimary}
                colorElement={colorPrimary && useColorInverse(colorPrimary)}
                widthElement="30"
                heightElement="30"
                fontsizeElement="16"
              >
                <BsFillVolumeUpFill />
              </ButtonIconDefault>
            </ContentButtonIconDefault>
          </HeaderCardChat>
          <ContentMessage colorElement={colorTextPrimary}>
            Por favor, espera pelo amor de Deus!!!
          </ContentMessage>
        </CardChat>
        <ContentInputChat>
          <InputChat placeholder="Digite algo" />
          <ContentButtonIconDefault
            style={{
              position: "absolute",
              right: 0,
              top: -1,
            }}
          >
            <ButtonIconDefault
              backgroundElement={colorPrimary}
              colorElement={colorPrimary && useColorInverse(colorPrimary)}
              widthElement="40"
              heightElement="40"
              fontsizeElement="20"
            >
              <BiMicrophone />
            </ButtonIconDefault>
          </ContentButtonIconDefault>
        </ContentInputChat>
      </BodyChat>
    </Container>
  );
};
