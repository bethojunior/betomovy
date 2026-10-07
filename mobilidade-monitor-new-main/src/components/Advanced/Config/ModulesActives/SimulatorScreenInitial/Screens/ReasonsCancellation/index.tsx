import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

import { useState } from "react";

import { ReasonsCancellationsProps } from "../../../../../../../pages/Advanced/Configs/ReasonsForCancellations/types";

import { constants } from "../../../../../../../pages/Advanced/Configs/ModulesActives/constants";

import { useColorInverse } from "../../../../../../../utils/Hook/useColorInverse";

import {
  Container,
  ModalReasons,
  ButtonAction,
  ContentButtonsModal,
  HeaderModal,
  TitleModal,
  ContainerItems,
  ContentItems,
  Item,
} from "./styles";

interface ReasonsCancellationScreenSimulatorProps {
  reasonsCancellationsList: ReasonsCancellationsProps[] | undefined;
  colorPrimary: string | undefined;
  colorSecond: string | undefined;
  colorText: string | undefined;
}

export const ReasonsCancellationScreenSimulator = ({
  reasonsCancellationsList,
  colorPrimary,
  colorText,
}: ReasonsCancellationScreenSimulatorProps) => {
  const [reasonsSelected, setReasonsSelected] =
    useState<ReasonsCancellationsProps | null>(null);

  const colorInverse = useColorInverse(colorPrimary);

  return (
    <Container>
      <ModalReasons>
        <HeaderModal>
          <div
            style={{
              color: colorText ? colorText : constants.colors.secondary,
            }}
          >
            <FaArrowLeft />
          </div>
          <div>
            <TitleModal
              colorText={colorText ? colorText : constants.colors.secondary}
            >
              Cancelar Viagem?
            </TitleModal>
          </div>
          <div>
            <span
              style={{
                color: colorText ? colorText : constants.colors.secondary,
              }}
            >
              Ignorar
            </span>
          </div>
        </HeaderModal>

        <ContainerItems>
          <span
            style={{
              color: colorText ? colorText : constants.colors.secondary,
            }}
          >
            Por qual motivo você deseja cancelar esta viagem?
          </span>

          <ContentItems>
            {reasonsCancellationsList?.map((value) => {
              return (
                <Item
                  onClick={() => setReasonsSelected(value)}
                  selected={
                    value.idCancellationReasons ===
                    reasonsSelected?.idCancellationReasons
                  }
                  backgroundColor={
                    colorPrimary ? colorPrimary : constants.colors.primary
                  }
                  colorText={
                    colorPrimary
                      ? (colorInverse as string)
                      : constants.colors.text
                  }
                >
                  {value.name}
                  <MdOutlineKeyboardArrowRight />
                </Item>
              );
            })}
          </ContentItems>
        </ContainerItems>

        {reasonsSelected && (
          <ContentButtonsModal>
            <ButtonAction
              backgroundColor={
                colorPrimary ? colorPrimary : constants.colors.primary
              }
              colorText={
                colorPrimary ? (colorInverse as string) : constants.colors.text
              }
            >
              Confirmar
            </ButtonAction>
          </ContentButtonsModal>
        )}
      </ModalReasons>
    </Container>
  );
};
