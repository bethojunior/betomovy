import { FaRegBell, FaShieldAlt, FaStreetView, FaStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { TbLocation } from "react-icons/tb";

import {
  Container,
  Header,
  NameUser,
  ContentImgUser,
  ImgUser,
  Body,
  ButtonFloat,
  ModalCalledTrip,
  ContentImgClient,
  ContentInformationsClient,
  NameClient,
  QntTrips,
  Rating,
  TypesServices,
  Item,
  Label,
  ContentValueTrip,
  ContentOriginDestiny,
  ButtonSave,
  ContentButtonsFloat,
  ContentBonus,
  HeaderModalTrip,
  Ball,
  Squad,
  ContainerOriginDestiny,
  ContentIconsOriginDestiny,
} from "./styles";

import { constants } from "../../../../../../../pages/Advanced/Configs/ModulesActives/constants";

import pathIconClient from "../../../../../../../assets/avatar2.png";

import { useColorInverse } from "../../../../../../../utils/Hook/useColorInverse";

import { FieldsCalledDriverProps } from "../../../../ByCity/Cards/Collapse/types";

interface CalledDriverProps {
  colorPrimary: string | undefined;
  fieldsCalledDriver: FieldsCalledDriverProps[] | undefined;
}

export const CalledDriver = ({
  colorPrimary,
  fieldsCalledDriver,
}: CalledDriverProps) => {
  const colorInverse = useColorInverse(colorPrimary);

  console.log(fieldsCalledDriver);

  return (
    <Container>
      <Header>
        <NameUser>
          <span>Olá,</span>
          <span>Jhon</span>
        </NameUser>

        <ContentImgUser>
          <ImgUser src={import.meta.env.LOGO_APP} alt="logo aplicação" />
        </ContentImgUser>
      </Header>

      <Body>
        <ContentButtonsFloat>
          <div>
            <ButtonFloat
              backgroundColor={
                colorPrimary ? colorPrimary : constants.colors.primary
              }
              colorIcon={
                colorPrimary ? (colorInverse as string) : constants.colors.text
              }
            >
              <FaRegBell />
            </ButtonFloat>

            <ButtonFloat
              backgroundColor={
                colorPrimary ? colorPrimary : constants.colors.primary
              }
              colorIcon={
                colorPrimary ? (colorInverse as string) : constants.colors.text
              }
            >
              <FaShieldAlt />
            </ButtonFloat>
          </div>

          <div>
            <ButtonFloat
              backgroundColor={
                colorPrimary ? colorPrimary : constants.colors.primary
              }
              colorIcon={
                colorPrimary ? (colorInverse as string) : constants.colors.text
              }
            >
              <FaStreetView />
            </ButtonFloat>

            <ButtonFloat
              backgroundColor={
                colorPrimary ? colorPrimary : constants.colors.primary
              }
              colorIcon={
                colorPrimary ? (colorInverse as string) : constants.colors.text
              }
            >
              <TbLocation />
            </ButtonFloat>
          </div>
        </ContentButtonsFloat>
      </Body>

      <ModalCalledTrip>
        <HeaderModalTrip>
          <div>
            {fieldsCalledDriver && fieldsCalledDriver[3].value && (
              <h3>FAVORITO</h3>
            )}
          </div>

          <button>
            <IoMdClose />
          </button>
        </HeaderModalTrip>
        <ContentInformationsClient>
          <ContentImgClient>
            <img src={pathIconClient} alt="icon-client" />
          </ContentImgClient>

          <div>
            <NameClient>Cliente Teste</NameClient>
            {fieldsCalledDriver && fieldsCalledDriver[10].value && (
              <QntTrips>39 viagens</QntTrips>
            )}

            {fieldsCalledDriver && fieldsCalledDriver[7].value && (
              <Rating>
                <FaStar /> - 5.0
              </Rating>
            )}
          </div>

          {fieldsCalledDriver && fieldsCalledDriver[2].value && (
            <ContentBonus>
              <h3>Bonus</h3>
              <span>R$ 10,00</span>
            </ContentBonus>
          )}
        </ContentInformationsClient>

        <TypesServices>
          <div>
            <Label>Tipo de serviço</Label>
            <Item>CARRO ACESSÍVEL</Item>

            {fieldsCalledDriver && fieldsCalledDriver[5].value && (
              <>
                <Label>Pagamento</Label>
                <Item>Dinheiro</Item>
              </>
            )}
          </div>

          {fieldsCalledDriver && fieldsCalledDriver[0].value && (
            <div>
              <ContentValueTrip>R$ 57,96</ContentValueTrip>
            </div>
          )}
        </TypesServices>

        <ContainerOriginDestiny>
          <ContentIconsOriginDestiny>
            <Ball />
            <Squad />
          </ContentIconsOriginDestiny>
          <ContentOriginDestiny>
            <div>
              {fieldsCalledDriver && fieldsCalledDriver[1].value && (
                <span>
                  Avenida Filomeno Gomes, 821. Centro. Fortaleza -CE, 60010-281,
                  Brasil
                </span>
              )}
              {fieldsCalledDriver && fieldsCalledDriver[8].value && (
                <strong>0.50km</strong>
              )}

              {fieldsCalledDriver && fieldsCalledDriver[6].value && (
                <strong>, 1.9 min</strong>
              )}
            </div>

            {fieldsCalledDriver && fieldsCalledDriver[9].value && (
              <div>
                <span>
                  Av. Sgt. Hermínio Sampaio, 3100 - Pres. Kennedy, Fortaleza -
                  CE, 60355-512
                </span>

                <strong>7km, 15min</strong>
              </div>
            )}

            <div>
              {fieldsCalledDriver && fieldsCalledDriver[4].value && (
                <span>
                  Avenida Leste-Oeste, 5561, Arraial Moura Brasil, Fortaleza -
                  CE, 60010-000, Brasil,
                </span>
              )}
              <strong>3.17km, 6 min</strong>
            </div>
          </ContentOriginDestiny>
        </ContainerOriginDestiny>

        <ButtonSave>Aceitar</ButtonSave>
      </ModalCalledTrip>
    </Container>
  );
};
