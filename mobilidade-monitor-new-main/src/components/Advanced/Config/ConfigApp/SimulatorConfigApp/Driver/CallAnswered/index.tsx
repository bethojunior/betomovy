import {
  Container,
  ButtonIcon,
  Column1,
  Column2,
  ContentAvatar,
  ContentBalance,
  CardCallAnswer,
  Address,
  Ball,
  ContentAddresses,
  ContentClient,
  ContentFinancial,
  ContentMessageAndClose,
  DistanceAddress,
  Squad,
  ContentCardCallAnswer,
  ButtonAccept,
  ContentButtonAccept,
  ButtonMinimizeCard,
  ContentButtonMinimizeCard,
  ContentIconButton,
} from "./styles";

import { IoIosNotificationsOutline } from "react-icons/io";
import { BsShieldShaded } from "react-icons/bs";
import { LiaMapSolid } from "react-icons/lia";
import { IoNavigateOutline } from "react-icons/io5";
import { FaStreetView } from "react-icons/fa";
import { BiCurrentLocation } from "react-icons/bi";
import { MdArrowDropDown, MdKeyboardDoubleArrowRight } from "react-icons/md";
import {
  AiFillEyeInvisible,
  AiOutlineClose,
  AiOutlineMessage,
} from "react-icons/ai";

import pathImageMapa from "../../../../../../../assets/mapa-simulator.jpeg";

import { useState } from "react";

import { ScreenColorsSimulatorsProps } from "../../../../../../../pages/Advanced/Configs/ConfigApp/types";

import { useColorInverse } from "../../../../../../../utils/Helpers";

import pathIconDriver from "../../../../../../../assets/icon-driver-account.png";

import pathIconClient from "../../../../../../../assets/icon-client-account.png";

export const CallAnswered = ({
  colorPrimary,
  colorSecondary,
  colorTextPrimary,
}: ScreenColorsSimulatorsProps) => {
  const [showBalance, setShowBalance] = useState<boolean>(false);

  const handleShowBalance = () => {
    showBalance ? setShowBalance(false) : setShowBalance(true);
  };

  return (
    <Container>
      <img className="map-image" src={pathImageMapa} alt="" />
      <ContentAvatar
        colorElement={colorPrimary && useColorInverse(colorPrimary)}
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
        }}
      >
        <img src={pathIconDriver} alt="icon-driver" />
      </ContentAvatar>
      <ContentBalance
        onClick={handleShowBalance}
        backgroundColorElement={colorPrimary}
        colorElement={colorPrimary && useColorInverse(colorPrimary)}
      >
        {showBalance ? (
          <span
            style={{
              fontSize: "16px",
            }}
          >
            0,00
          </span>
        ) : (
          <AiFillEyeInvisible />
        )}
      </ContentBalance>
      <Column1>
        <ButtonIcon
          backgroundColorElement="#ffffff"
          colorElement={colorPrimary}
        >
          <IoIosNotificationsOutline />
        </ButtonIcon>
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
        <ButtonIcon
          backgroundColorElement={colorPrimary}
          colorElement={colorPrimary && useColorInverse(colorPrimary)}
        >
          <LiaMapSolid />
        </ButtonIcon>
      </Column1>
      <Column2>
        <ButtonIcon
          backgroundColorElement={colorPrimary}
          colorElement={colorPrimary && useColorInverse(colorPrimary)}
        >
          <FaStreetView />
        </ButtonIcon>
        <ButtonIcon
          backgroundColorElement={colorPrimary}
          colorElement={colorPrimary && useColorInverse(colorPrimary)}
        >
          <IoNavigateOutline />
        </ButtonIcon>
      </Column2>
      <ContentCardCallAnswer>
        <CardCallAnswer backgroundColorElement={colorSecondary}>
          <ContentButtonMinimizeCard>
            <ButtonMinimizeCard
              backgroundColorElement={colorPrimary}
              colorElement={colorPrimary && useColorInverse(colorPrimary)}
            >
              <MdArrowDropDown />
            </ButtonMinimizeCard>
          </ContentButtonMinimizeCard>
          <ContentClient>
            <img src={pathIconClient} alt="icon-client" />
            <span>Cliente</span>
          </ContentClient>
          <ContentMessageAndClose backgroundColorElement={colorPrimary}>
            <div>
              <AiOutlineMessage />
            </div>
            <div>
              <AiOutlineClose />
            </div>
          </ContentMessageAndClose>
          <ContentFinancial colorElement={colorTextPrimary}>
            <div>
              <span>Pagamento</span>
              <h3>Dinheiro</h3>
            </div>
            <div>
              <span>Valor</span>
              <h3>R$ 1,00</h3>
            </div>
          </ContentFinancial>
          <ContentAddresses colorElement={colorTextPrimary}>
            <Ball backgroundColorElement={colorPrimary} />
            <Squad backgroundColorElement={colorPrimary} />
            <div>
              <Address>Avenida Filomeno Gomes, 821, Centro, Fo...</Address>
              <DistanceAddress>0.50km, 1.9 min</DistanceAddress>
            </div>
            <div>
              <Address>Avenida Leste-Oeste, 5561, Arraial Moura...</Address>
              <DistanceAddress>3.17km, 6 min</DistanceAddress>
            </div>
          </ContentAddresses>
          <ContentButtonAccept>
            <ButtonAccept
              backgroundColorElement={colorPrimary}
              colorElement={colorPrimary && useColorInverse(colorPrimary)}
            >
              <ContentIconButton>
                <MdKeyboardDoubleArrowRight />
              </ContentIconButton>
              <span>Sinalizar chegada</span>
            </ButtonAccept>
          </ContentButtonAccept>
        </CardCallAnswer>
      </ContentCardCallAnswer>
    </Container>
  );
};
