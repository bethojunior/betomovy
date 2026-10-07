import {
  Container,
  ButtonIcon,
  CardSelectTravel,
  ContentAddress,
  HeaderCardSelectTravel,
  ContentOptionsTravels,
  OptionsTravels,
  SelectTravel,
  ContentControls,
  ButtonControl,
  ButtonConfirmTravel,
  ContentKm,
} from "./styles";
import { BiCurrentLocation } from "react-icons/bi";
import { AiOutlineClose, AiOutlineQrcode } from "react-icons/ai";
import { IoIosArrowForward, IoIosArrowDown, IoMdTime } from "react-icons/io";
import { BsFillRocketTakeoffFill } from "react-icons/bs";

import pathImageMapa from "../../../../../../../assets/map-simulator-trip.jpeg";
import pathIconWoman from "../../../../../../../assets/icon-travel-woman.png";
import pathIconTaxi from "../../../../../../../assets/icon-travel-taxi.png";
import pathIconParticular from "../../../../../../../assets/icon-travel-particular.png";

import { ScreenColorsSimulatorsProps } from "../../../../../../../pages/Advanced/Configs/ConfigApp/types";

import { useColorInverse } from "../../../../../../../utils/Helpers";

export const SelectTrip = ({
  colorPrimary,
  colorSecondary,
  colorTextPrimary,
}: ScreenColorsSimulatorsProps) => {
  return (
    <Container>
      <img className="map-image" src={pathImageMapa} alt="" />

      <ContentKm
        backgroundColorElement={colorPrimary}
        colorElement={colorPrimary && useColorInverse(colorPrimary)}
      >
        1.2 km
      </ContentKm>

      <ButtonIcon
        backgroundColorElement={colorPrimary}
        colorElement={colorPrimary && useColorInverse(colorPrimary)}
        style={{
          position: "absolute",
          left: 15,
          top: 40,
        }}
      >
        <BiCurrentLocation />
      </ButtonIcon>

      <ButtonIcon
        style={{
          position: "absolute",
          right: 15,
          top: 10,
        }}
        backgroundColorElement="#ffffff"
        colorElement={colorPrimary}
      >
        <AiOutlineClose />
      </ButtonIcon>

      <ContentAddress backgroundColorElement={colorSecondary}>
        <div
          style={{
            backgroundColor: colorPrimary,
            color: colorPrimary && useColorInverse(colorPrimary),
          }}
        >
          <span>5</span>
          <span>min</span>
        </div>
        <div
          style={{
            color: colorTextPrimary,
          }}
        >
          Senai AUA, Fortaleza, Ceará 60035, Brazil
        </div>
        <div
          style={{
            color: colorTextPrimary,
          }}
        >
          <IoIosArrowForward />
        </div>
      </ContentAddress>

      <CardSelectTravel backgroundColorElement={colorSecondary}>
        <HeaderCardSelectTravel colorElement={colorTextPrimary}>
          Texto de teste para testar a quebra de texto com emoji de testes
        </HeaderCardSelectTravel>
        <ContentOptionsTravels colorElement={colorTextPrimary}>
          <OptionsTravels>
            <div>
              <img src={pathIconParticular} alt="icon-particular" />
              <span>Particular</span>
            </div>
            <div>R$ 8,50</div>
          </OptionsTravels>

          <OptionsTravels>
            <div>
              <img src={pathIconTaxi} alt="icon-taxi" />
              <span>Taxi</span>
            </div>
            <div>R$ 8,50</div>
          </OptionsTravels>

          <OptionsTravels>
            <div>
              <img src={pathIconWoman} alt="icon-woman" />
              <span>Mulher</span>
            </div>
            <div>R$ 8,50</div>
          </OptionsTravels>
        </ContentOptionsTravels>
        <SelectTravel colorElement={colorTextPrimary}>
          <span>R$</span>
          <span>Sem pagamento</span>
          <div>
            <IoIosArrowDown />
          </div>
        </SelectTravel>
        <ContentControls>
          <ButtonControl
            colorElement={colorPrimary}
            backgroundColorElement={colorSecondary}
          >
            <div>
              <AiOutlineQrcode />
            </div>
            <span>Maçaneta</span>
          </ButtonControl>

          <ButtonControl
            colorElement={colorPrimary}
            backgroundColorElement={colorSecondary}
          >
            <div>
              <IoMdTime />
            </div>
            <span>Agendar</span>
          </ButtonControl>

          <ButtonControl
            colorElement={colorPrimary}
            backgroundColorElement={colorSecondary}
          >
            <div>
              <BsFillRocketTakeoffFill />
            </div>
            <span>Turbo</span>
          </ButtonControl>
          <ButtonConfirmTravel
            backgroundColorElement={colorPrimary}
            colorElement={colorPrimary && useColorInverse(colorPrimary)}
          >
            Confirmar
          </ButtonConfirmTravel>
        </ContentControls>
      </CardSelectTravel>
    </Container>
  );
};
