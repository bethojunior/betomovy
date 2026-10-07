import { IoIosNotificationsOutline } from "react-icons/io";
import { BsShieldShaded } from "react-icons/bs";
import { LiaMapSolid } from "react-icons/lia";
import { IoNavigateOutline } from "react-icons/io5";
import { FaStreetView } from "react-icons/fa";
import { BiCurrentLocation } from "react-icons/bi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiFillEyeInvisible, AiOutlineClose, AiFillStar } from "react-icons/ai";

import pathImageMapa from "../../../../../../../assets/mapa-simulator.jpeg";

import {
  Container,
  ButtonIcon,
  Column1,
  Column2,
  ContentAvatar,
  ContentBalance,
  CardTrip,
  HeaderCardTrip,
  ContentClient,
  ContentPrices,
  CardPrice,
  ContentAddresses,
  Address,
  DistanceAddress,
  ButtonAccept,
  ContentButtonAccept,
  Ball,
  Squad,
} from "./styles";

import { useState } from "react";

import { ScreenColorsSimulatorsProps } from "../../../../../../../pages/Advanced/Configs/ConfigApp/types";

import { useColorInverse } from "../../../../../../../utils/Helpers";

import pathIconDriver from "../../../../../../../assets/icon-driver-account.png";

import pathIconClient from "../../../../../../../assets/icon-client-account.png";

export const RacerTrip = ({
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
          top: "0.2rem",
          left: "1rem",
          cursor: "pointer",
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

      <CardTrip backgroundColorElement={colorSecondary}>
        <HeaderCardTrip colorElement={colorPrimary}>
          <h3>FAVORITO</h3>
          <button>
            <AiOutlineClose />
          </button>
        </HeaderCardTrip>
        <ContentClient colorElement={colorTextPrimary}>
          <div>
            <ContentAvatar>
              <img src={pathIconClient} alt="icon-client" />
            </ContentAvatar>
          </div>
          <div>
            <span>Vin Diesel</span>
            <span>
              <HiOutlineLocationMarker /> 39 Viagens
            </span>
            <span>
              <AiFillStar /> 5.0 - 39 Viagens
            </span>
          </div>
        </ContentClient>
        <ContentPrices colorElement={colorTextPrimary}>
          <div>
            <div>
              <span>Tipo de serviço</span>
              <h3>CARRO ACESSÍVEL</h3>
            </div>
            <div>
              <span>Pagamento</span>
              <h3>Dinheiro</h3>
            </div>
          </div>
          <div>
            <CardPrice
              backgroundColorElement={colorPrimary}
              colorElement={colorPrimary && useColorInverse(colorPrimary)}
            >
              R$ 57,96
            </CardPrice>
          </div>
        </ContentPrices>
        <ContentAddresses colorElement={colorTextPrimary}>
          <Ball backgroundColorElement={colorPrimary} />
          <Squad backgroundColorElement={colorPrimary} />
          <div>
            <Address>
              Avenida Filomeno Gomes, 821, Centro, Fortaleza - CE 60010-281,
              Brasil
            </Address>
            <DistanceAddress>0.50km, 1.9 min</DistanceAddress>
          </div>
          <div>
            <Address>
              Avenida Leste-Oeste, 5561, Arraial Moura Brasil, Fortaleza - CE,
              60010-000, Brasil
            </Address>
            <DistanceAddress>3.17km, 6 min</DistanceAddress>
          </div>
        </ContentAddresses>
        <ContentButtonAccept>
          <ButtonAccept
            backgroundColorElement={colorPrimary}
            colorElement={colorPrimary && useColorInverse(colorPrimary)}
          >
            Aceitar
          </ButtonAccept>
        </ContentButtonAccept>
      </CardTrip>
    </Container>
  );
};
