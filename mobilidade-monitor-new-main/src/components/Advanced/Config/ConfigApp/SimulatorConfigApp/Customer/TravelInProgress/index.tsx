import {
  Container,
  ButtonIcon,
  Column1,
  ContentCardTravelInProgress,
  ContentDriver,
  ContentMessage,
  HeaderCardTravelInProgress,
  ContentAvatar,
  ButtonsMessage,
  ContentIconMessage,
  InputMessage,
  ContentInputMessage,
  ContentButtonsMessage,
  ScoreAvatar,
} from "./styles";

import { IoAddSharp } from "react-icons/io5";
import { BsShieldShaded } from "react-icons/bs";
import { BiCurrentLocation } from "react-icons/bi";
import { FiUserCheck } from "react-icons/fi";
import {
  AiFillMessage,
  AiOutlineShareAlt,
  AiOutlineClose,
  AiFillStar,
} from "react-icons/ai";

import pathImageMap from "../../../../../../../assets/map-simulator-trip-progress.jpeg";

import { ScreenColorsSimulatorsProps } from "../../../../../../../pages/Advanced/Configs/ConfigApp/types";

import { useColorInverse } from "../../../../../../../utils/Helpers";

import pathIconClient from "../../../../../../../assets/icon-client-account.png";

export const TravelInProgress = ({
  colorPrimary,
  colorSecondary,
  colorTextPrimary,
}: ScreenColorsSimulatorsProps) => {
  return (
    <Container>
      <img className="map-image" src={pathImageMap} alt="" />

      <Column1>
        <ButtonIcon
          backgroundColorElement={colorPrimary}
          colorElement={colorPrimary && useColorInverse(colorPrimary)}
        >
          <BsShieldShaded />
        </ButtonIcon>
        <ButtonIcon
          backgroundColorElement={colorPrimary}
          colorElement={colorPrimary && useColorInverse(colorPrimary)}
        >
          <BiCurrentLocation />
        </ButtonIcon>
      </Column1>
      <ContentCardTravelInProgress backgroundColorElement={colorSecondary}>
        <HeaderCardTravelInProgress colorElement={colorTextPrimary}>
          <div>Seu motorista vai chegar em breve</div>
          <div>
            <div>
              <span>2</span>
              <span>min</span>
            </div>
          </div>
        </HeaderCardTravelInProgress>
        <ContentDriver colorElement={colorTextPrimary}>
          <div>
            <ContentAvatar>
              <div>
                <img src={pathIconClient} alt="icon-client" />
                <ScoreAvatar backgroundColorElement={colorSecondary}>
                  <span>5,0</span>
                  <AiFillStar />
                </ScoreAvatar>
              </div>
              <div>
                <FiUserCheck />
                <span>Motorista</span>
              </div>
            </ContentAvatar>
          </div>
          <div>
            <h3>CEL-1111</h3>
            <p>Celtar Celtar - Celta</p>
          </div>
        </ContentDriver>
        <ContentMessage>
          <div>
            <ContentInputMessage>
              <InputMessage
                backgroundColorElement={colorPrimary}
                colorElement={colorPrimary && useColorInverse(colorPrimary)}
                placeholder="Nova mensagem"
              />
              <ContentIconMessage>
                <AiFillMessage />
              </ContentIconMessage>
            </ContentInputMessage>
          </div>
          <ContentButtonsMessage>
            <ButtonsMessage
              backgroundColorElement={colorPrimary}
              colorElement={colorPrimary && useColorInverse(colorPrimary)}
            >
              <IoAddSharp />
            </ButtonsMessage>

            <ButtonsMessage
              backgroundColorElement={colorPrimary}
              colorElement={colorPrimary && useColorInverse(colorPrimary)}
            >
              <AiOutlineShareAlt />
            </ButtonsMessage>

            <ButtonsMessage
              backgroundColorElement={colorPrimary}
              colorElement={colorPrimary && useColorInverse(colorPrimary)}
            >
              <AiOutlineClose />
            </ButtonsMessage>
          </ContentButtonsMessage>
        </ContentMessage>
      </ContentCardTravelInProgress>
    </Container>
  );
};
